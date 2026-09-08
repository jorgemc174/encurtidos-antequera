-- Ejecutar una sola vez en SQL Editor antes de publicar la nueva web.
-- No borra cartas, fotos ni textos existentes.
begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
grant select on public.admin_users to service_role;
create policy admin_membership_read on public.admin_users for select to authenticated using (user_id = auth.uid());

create or replace function public.is_content_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_content_admin() from public;
grant execute on function public.is_content_admin() to anon, authenticated;

create table if not exists public.ai_change_proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  request text not null,
  summary text not null,
  changes jsonb not null check (jsonb_typeof(changes) = 'array' and jsonb_array_length(changes) between 1 and 100),
  documents jsonb not null check (jsonb_typeof(documents) = 'array' and jsonb_array_length(documents) between 1 and 6),
  status text not null default 'draft' check (status in ('draft', 'applied', 'undone', 'cancelled')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 minutes'),
  applied_at timestamptz,
  undone_at timestamptz
);
alter table public.ai_change_proposals enable row level security;
revoke all on public.ai_change_proposals from anon, authenticated;
grant select on public.ai_change_proposals to authenticated;
grant all on public.ai_change_proposals to service_role;
create policy proposals_read on public.ai_change_proposals for select to authenticated
  using (user_id = auth.uid() and public.is_content_admin());

create table if not exists public.ai_request_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);
create index ai_request_log_created on public.ai_request_log(created_at);
alter table public.ai_request_log enable row level security;
revoke all on public.ai_request_log from anon, authenticated;
grant all on public.ai_request_log to service_role;

create or replace function public.reserve_ai_request(p_user uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(8712301);
  if not exists(select 1 from public.admin_users where user_id = p_user) then
    raise exception 'Acceso denegado';
  end if;
  if (select count(*) from public.ai_request_log where created_at > now() - interval '1 day') >= 100
    or (select count(*) from public.ai_request_log where user_id = p_user and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'Se ha alcanzado el límite de solicitudes. Inténtalo más tarde.';
  end if;
  insert into public.ai_request_log(user_id) values (p_user);
end;
$$;
revoke all on function public.reserve_ai_request(uuid) from public, anon, authenticated;
grant execute on function public.reserve_ai_request(uuid) to service_role;

-- Lectura pública; cartas y textos se escriben únicamente mediante funciones
-- que comparan la versión anterior. Las políticas antiguas no conceden escritura.
do $$
declare t text;
begin
  foreach t in array array['menu_json', 'home_json'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke insert, update, delete, truncate on public.%I from anon, authenticated', t);
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant select on public.%I to service_role', t);
    execute format('create policy assistant_public_read on public.%I for select to anon, authenticated using (true)', t);
  end loop;
  foreach t in array array['fotos_carta', 'destacados'] loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
      execute format('revoke insert, update, delete, truncate on public.%I from anon', t);
      execute format('grant select on public.%I to anon, authenticated', t);
      execute format('grant insert, update, delete on public.%I to authenticated', t);
      execute format('create policy assistant_public_read on public.%I for select to anon, authenticated using (true)', t);
      execute format('create policy assistant_admin_write on public.%I for all to authenticated using (public.is_content_admin()) with check (public.is_content_admin())', t);
      execute format('create policy assistant_insert_guard on public.%I as restrictive for insert to authenticated with check (public.is_content_admin())', t);
      execute format('create policy assistant_update_guard on public.%I as restrictive for update to authenticated using (public.is_content_admin()) with check (public.is_content_admin())', t);
      execute format('create policy assistant_delete_guard on public.%I as restrictive for delete to authenticated using (public.is_content_admin())', t);
    end if;
  end loop;
end $$;

-- Los editores manuales comparten el mismo control de concurrencia.
create or replace function public.save_content_document(p_table text, p_key text, p_before jsonb, p_after jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare current_data jsonb; key_column text;
begin
  if not public.is_content_admin() then raise exception 'Acceso denegado'; end if;
  if p_table not in ('menu_json', 'home_json') then raise exception 'Documento no permitido'; end if;
  if p_after is null or jsonb_typeof(p_after) not in ('array', 'object') then raise exception 'Contenido inválido'; end if;
  key_column := case when p_table = 'menu_json' then 'location' else 'section' end;
  perform pg_advisory_xact_lock(8712302);
  execute format('select data from public.%I where %I = $1 for update', p_table, key_column) into current_data using p_key;
  if current_data is distinct from p_before then
    raise exception 'El contenido ha cambiado en otra ventana. Recarga la página antes de editar.';
  end if;
  execute format('insert into public.%I (%I,data,updated_at) values ($1,$2,now()) on conflict (%I) do update set data=excluded.data, updated_at=excluded.updated_at', p_table, key_column, key_column) using p_key, p_after;
end;
$$;
revoke all on function public.save_content_document(text,text,jsonb,jsonb) from public, anon;
grant execute on function public.save_content_document(text,text,jsonb,jsonb) to authenticated;

-- La confirmación recibe solo el ID, nunca un contenido nuevo del navegador.
-- Publicación y deshacer son atómicos, idempotentes y comprueban la versión
-- completa de cada documento, incluyendo el orden y la identidad de productos.
create or replace function public.apply_ai_proposal(p_id uuid, p_action text)
returns text language plpgsql security definer set search_path = '' as $$
declare proposal public.ai_change_proposals; document jsonb;
  current_data jsonb; expected jsonb; replacement jsonb; key_column text;
begin
  if not public.is_content_admin() then raise exception 'Acceso denegado'; end if;
  if p_action is null or p_action not in ('apply','undo','cancel') then raise exception 'Acción no permitida'; end if;
  perform pg_advisory_xact_lock(8712302);
  select * into proposal from public.ai_change_proposals where id = p_id and user_id = auth.uid() for update;
  if not found then raise exception 'Propuesta no encontrada'; end if;
  if p_action = 'cancel' then
    if proposal.status not in ('draft','cancelled') then raise exception 'Esta propuesta ya se ha publicado. Consulta el historial.'; end if;
    update public.ai_change_proposals set status = 'cancelled' where id = p_id;
    return 'cancelled';
  end if;
  if p_action = 'apply' and proposal.status = 'applied' then return 'applied'; end if;
  if p_action = 'undo' and proposal.status = 'undone' then return 'undone'; end if;
  if p_action = 'apply' and (proposal.status <> 'draft' or proposal.expires_at <= now()) then
    raise exception 'La propuesta ha caducado o ya no está disponible. Prepara otra.';
  end if;
  if p_action = 'undo' and proposal.status <> 'applied' then raise exception 'Este cambio no se puede deshacer'; end if;
  for document in select value from jsonb_array_elements(proposal.documents) loop
    if document->>'table' not in ('menu_json','home_json') then raise exception 'Documento no permitido'; end if;
    key_column := case when document->>'table' = 'menu_json' then 'location' else 'section' end;
    execute format('select data from public.%I where %I = $1 for update', document->>'table', key_column) into current_data using document->>'key';
    expected := case when p_action = 'apply' then document->'before' else document->'after' end;
    replacement := case when p_action = 'apply' then document->'after' else document->'before' end;
    if current_data is null or current_data is distinct from expected then
      raise exception 'Alguien ha cambiado uno de estos datos. No se ha aplicado ningún cambio. Prepara una propuesta nueva.';
    end if;
    execute format('update public.%I set data=$1, updated_at=now() where %I=$2', document->>'table', key_column) using replacement, document->>'key';
  end loop;
  if p_action = 'apply' then
    update public.ai_change_proposals set status='applied', applied_at=now() where id=p_id;
    return 'applied';
  end if;
  update public.ai_change_proposals set status='undone', undone_at=now() where id=p_id;
  return 'undone';
end;
$$;
revoke all on function public.apply_ai_proposal(uuid,text) from public, anon;
grant execute on function public.apply_ai_proposal(uuid,text) to authenticated;
commit;
