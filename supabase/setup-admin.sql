-- Después de crear el usuario en Authentication > Users, sustituye SOLO el
-- correo entre comillas. No se introduce ninguna contraseña en este archivo.
do $$
declare
  admin_email text := 'CAMBIA_ESTO_POR_TU_CORREO';
  admin_id uuid;
begin
  if to_regclass('public.admin_users') is null then
    raise exception 'Primero ejecuta completo el archivo 202609090001_admin_assistant.sql en SQL Editor. Cuando termine correctamente, vuelve a ejecutar este alta de administrador.';
  end if;
  select id into admin_id from auth.users where lower(email) = lower(admin_email);
  if admin_id is null then
    raise exception 'No existe ese usuario. Créalo primero en Authentication > Users y comprueba el correo.';
  end if;
  insert into public.admin_users(user_id) values (admin_id) on conflict (user_id) do nothing;
end $$;
