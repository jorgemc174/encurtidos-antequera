import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { build } from "esbuild";
import { buildCatalog, prepareProposal } from "../supabase/functions/admin-assistant/catalog.ts";

const menu = [{ nombre: { es: "Cervezas", en: "Beers" }, items: [
  { nombre: { es: "Caña", en: "Draft beer" }, precio: "1,90 €", imagenKey: "beer" },
  { nombre: { es: "Copa", en: "Glass" }, precio: "2,30 €" },
] }];
const documents = ["Gáldar", "Telde", "Las Palmas"].map((place) => ({ table: "menu_json", key: `Carta - ${place}`, data: structuredClone(menu) }));
const fields = buildCatalog(documents);
const price = fields.find((field) => field.key === "Carta - Gáldar" && field.label.includes("Caña") && field.kind === "price");
const prepare = (changes) => prepareProposal(documents, fields, { message: "Revisa los precios", changes });

test("una excepción por puesto solo cambia la caña de Gáldar y no muta los originales", () => {
  const result = prepare([{ field_id: price.id, value: "1.80" }]);
  assert.equal(result.changes.length, 1);
  assert.equal(result.changes[0].after, "1,80 €");
  assert.equal(result.documents.length, 1);
  assert.equal(result.documents[0].after[0].items[0].precio, "1,80 €");
  assert.equal(documents[0].data[0].items[0].precio, "1,90 €");
  assert.equal(fields.some((field) => field.path.includes("imagenKey")), false);
});
test("rechaza importes inválidos, IDs inventados y cambios duplicados", () => {
  for (const value of ["-1", "0", "gratis", "10000", "2,555", "1e2"]) assert.throws(() => prepare([{ field_id: price.id, value }]));
  assert.throws(() => prepare([{ field_id: "__proto__", value: "1" }]));
  assert.throws(() => prepare([{ field_id: price.id, value: "2" }, { field_id: price.id, value: "3" }]));
});
test("una aclaración o un precio ya coincidente no generan escrituras", () => {
  assert.equal(prepare([]).documents.length, 0);
  assert.equal(prepare([{ field_id: price.id, value: "1,90 €" }]).changes.length, 0);
});

test("la caché del menú se invalida cuando cambia la versión de datos", async () => {
  const store = new Map();
  const stub = {
    get length() { return store.size; },
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
    key: (index) => Array.from(store.keys())[index] ?? null,
  };
  const previous = globalThis.localStorage;
  Object.defineProperty(globalThis, "localStorage", { value: stub, configurable: true, writable: true });
  try {
    stub.setItem("encurtidos_menu_Carta - Gáldar", JSON.stringify({ old: true }));
    stub.setItem("encurtidos_content_cache_version", "v1");
    const { CONTENT_CACHE_VERSION, ensureContentCacheVersion } = await import("../src/lib/useContentDocument.js");
    ensureContentCacheVersion();
    assert.equal(stub.getItem("encurtidos_menu_Carta - Gáldar"), null);
    assert.equal(stub.getItem("encurtidos_content_cache_version"), CONTENT_CACHE_VERSION);
  } finally {
    if (previous) Object.defineProperty(globalThis, "localStorage", { value: previous, configurable: true, writable: true });
    else delete globalThis.localStorage;
  }
});
test("el catálogo incluye horarios, lugar y textos visibles nuevos, omitiendo claves obsoletas", () => {
  const puestosLegacy = [
    { nombre: { es: "Las Palmas", en: "Las Palmas" }, descripcion: { es: "Vieja", en: "Old" }, mapa: "https://example.com", horario: { es: [{ dia: "Lunes", hora: "11:00 - 16:00" }] } },
    { nombre: { es: "Gáldar", en: "Gáldar" }, descripcion: { es: "Vieja", en: "Old" }, mapa: "https://example.com", horario: { es: [{ dia: "Lunes", hora: "11:00 - 22:00" }] } },
  ];
  const textosLegacy = {
    es: { titulo: "Antiguo", descripcionPortada: "Viejo folleto", novedadTitulo: "Viejo evento", inicio: "Inicio" },
    en: { titulo: "Old", descripcionPortada: "Old brochure", novedadTitulo: "Old event", inicio: "Home" },
  };
  const docs = [
    { table: "home_json", key: "puestos", data: puestosLegacy },
    { table: "home_json", key: "textos", data: textosLegacy },
  ];
  const catalog = buildCatalog(docs);
  assert.ok(catalog.some((field) => field.label.includes("Lunes")));
  assert.equal(catalog.some((field) => field.path.includes("mapa")), false);
  assert.equal(catalog.some((field) => field.path.includes("descripcion")), false);
  assert.equal(catalog.some((field) => field.path.includes("novedadTitulo") || field.path.includes("descripcionPortada")), false);
  const tituloPortada = catalog.find((field) => field.key === "textos" && field.path[0] === "es" && field.path[1] === "tituloPortada");
  const galdarLugar = catalog.find((field) => field.key === "puestos" && field.path[0] === "1" && field.path[1] === "lugar" && field.path[2] === "es");
  assert.ok(tituloPortada);
  assert.ok(galdarLugar);
  const proposal = prepareProposal(docs, catalog, {
    message: "Actualiza titular y lugar de Gáldar",
    changes: [
      { field_id: tituloPortada.id, value: "Tapas en la barra" },
      { field_id: galdarLugar.id, value: "Plaza de Santiago" },
    ],
  });
  const textosDoc = proposal.documents.find((d) => d.key === "textos");
  const puestosDoc = proposal.documents.find((d) => d.key === "puestos");
  assert.equal(textosDoc.before.es.tituloPortada, undefined);
  assert.equal(textosDoc.after.es.tituloPortada, "Tapas en la barra");
  assert.equal(puestosDoc.before[1].lugar, undefined);
  assert.deepEqual(puestosDoc.after[1].lugar, { es: "Plaza de Santiago", en: "" });
});

test("handler del servidor: autenticación, respuestas de IA y guardado exclusivo de borradores", async (t) => {
  const saved = [];
  let allowed = true;
  let limited = false;
  let calls = 0;
  let output = { message: "Revisa la caña de Gáldar", changes: [{ field_id: price.id, value: "1,80" }] };
  const stub = {
    auth: { getUser: async (token) => ({ data: { user: token === "test-user" ? { id: "admin-test" } : null }, error: null }) },
    rpc: async () => ({ error: limited ? new Error("Límite") : null }),
    from: (table) => ({
      select: () => ({
        eq: () => ({ maybeSingle: async () => ({ data: allowed ? { user_id: "admin-test" } : null }) }),
        in: (_column, keys) => Promise.resolve({ data: table === "menu_json" ? documents.filter((doc) => keys.includes(doc.key)).map((doc) => ({ location: doc.key, data: structuredClone(doc.data) })) : [], error: null }),
      }),
      insert: (value) => ({ select: () => ({ single: async () => {
        saved.push(value);
        return { data: { id: "draft-test", summary: value.summary, changes: value.changes, status: "draft" }, error: null };
      } }) }),
    }),
  };
  const originalFetch = globalThis.fetch;
  const originalDeno = globalThis.Deno;
  let handler;
  globalThis.__assistantTestDb = stub;
  globalThis.Deno = { env: { get: (name) => ({ SUPABASE_URL: "https://example.test", SUPABASE_SERVICE_ROLE_KEY: "test-server-key", OPENAI_API_KEY: "test-ai-key" })[name] }, serve: (fn) => { handler = fn; } };
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    assert.equal(JSON.parse(options.body).store, false);
    calls++;
    return Response.json({ status: "completed", output: [{ content: [{ type: "output_text", text: JSON.stringify(output) }] }] });
  };
  try {
    const compiled = await build({ entryPoints: ["supabase/functions/admin-assistant/index.ts"], bundle: true, write: false, format: "esm", platform: "neutral", plugins: [{
      name: "test-only-supabase",
      setup(plugin) {
        plugin.onResolve({ filter: /^npm:/ }, () => ({ path: "test-sdk", namespace: "test-sdk" }));
        plugin.onLoad({ filter: /.*/, namespace: "test-sdk" }, () => ({ contents: "export function createClient() { return globalThis.__assistantTestDb; }", loader: "js" }));
      },
    }] });
    await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`);
    const request = (token = "test-user", body = { prompt: "Pon la caña a 1,80 solo en Gáldar", scope: "all" }) => new Request("https://example.test/assistant", { method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {}, body: JSON.stringify(body) });
    await t.test("rechaza visitantes y cuentas sin permisos antes de llamar a OpenAI", async () => {
      assert.equal((await handler(request(""))).status, 401);
      assert.equal((await handler(request("invalid"))).status, 401);
      allowed = false;
      assert.equal((await handler(request())).status, 403);
      allowed = true;
      assert.equal(calls, 0);
    });
    await t.test("genera un borrador ligado al usuario sin publicar los precios", async () => {
      const response = await handler(request());
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.equal(body.proposal.status, "draft");
      assert.equal(saved.length, 1);
      assert.equal(saved[0].user_id, "admin-test");
      assert.equal(saved[0].documents[0].after[0].items[0].precio, "1,80 €");
      assert.equal(documents[0].data[0].items[0].precio, "1,90 €");
      assert.equal(JSON.stringify(body).includes("test-ai-key"), false);
    });
    await t.test("una aclaración no guarda propuesta", async () => {
      output = { message: "¿Qué cerveza y a qué precio?", changes: [] };
      const body = await (await handler(request())).json();
      assert.equal(body.proposal, null);
      assert.equal(saved.length, 1);
    });
    await t.test("rechaza JSON nulo, ámbito inventado y campos fuera del catálogo", async () => {
      assert.equal((await handler(request("test-user", null))).status, 400);
      assert.equal((await handler(request("test-user", { prompt: "Cambiar todo", scope: "inventado" }))).status, 400);
      output = { message: "Cambio", changes: [{ field_id: "inventado", value: "2" }] };
      assert.equal((await handler(request())).status, 422);
      assert.equal(saved.length, 1);
    });
    await t.test("el límite evita la llamada facturable", async () => {
      limited = true;
      const before = calls;
      assert.equal((await handler(request())).status, 429);
      assert.equal(calls, before);
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalDeno === undefined) delete globalThis.Deno; else globalThis.Deno = originalDeno;
    delete globalThis.__assistantTestDb;
  }
});

test("SQL real: permisos, confirmación, deshacer, caducidad, concurrencia y límites", async (t) => {
  const db = new PGlite();
  const owner = "00000000-0000-4000-8000-000000000001";
  const other = "00000000-0000-4000-8000-000000000002";
  try {
    await db.exec(`
      create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth;
      create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
      grant usage on schema public, auth to anon, authenticated, service_role;
      grant execute on function auth.uid() to anon, authenticated, service_role;
      create table public.menu_json(location text primary key, data jsonb, updated_at timestamptz default now());
      create table public.home_json(section text primary key, data jsonb, updated_at timestamptz default now());
      create table public.fotos_carta(item_key text primary key, data_url text, updated_at timestamptz default now());
      create table public.destacados(item_key text primary key, updated_at timestamptz default now());
      grant all on public.menu_json, public.home_json, public.fotos_carta, public.destacados to anon, authenticated, service_role;
      create policy old_open_policy on public.fotos_carta for all using (true) with check (true);
      insert into auth.users values ('${owner}'), ('${other}');
    `);
    await db.exec(await readFile(new URL("../supabase/migrations/202609090001_admin_assistant.sql", import.meta.url), "utf8"));
    await db.query("insert into public.admin_users(user_id) values ($1)", [owner]);
    for (const doc of documents) await db.query("insert into public.menu_json(location,data) values ($1,$2)", [doc.key, JSON.stringify(doc.data)]);
    const asUser = async (role, user = owner) => {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [user]);
      await db.exec(`set role ${role}`);
    };
    const seed = async (prepared, expired = false) => {
      await db.exec("reset role");
      const result = await db.query("insert into public.ai_change_proposals(user_id,request,summary,changes,documents,expires_at) values ($1,'Petición',$2,$3,$4,now() + $5::interval) returning id", [owner, prepared.summary, JSON.stringify(prepared.changes), JSON.stringify(prepared.documents), expired ? "-1 hour" : "30 minutes"]);
      return result.rows[0].id;
    };
    const currentMenu = async () => (await db.query("select data from public.menu_json where location = 'Carta - Gáldar'")).rows[0].data;
    await t.test("visitantes leen, pero no escriben ni confirman", async () => {
      await asUser("anon", "");
      assert.equal((await db.query("select * from public.menu_json")).rows.length, 3);
      await assert.rejects(db.query("update public.menu_json set data='[]'"), /permission denied/);
      await assert.rejects(db.query("select public.apply_ai_proposal($1,'apply')", [owner]), /permission denied/);
    });
    await t.test("un usuario sin rol no puede elevar permisos ni editar fotos pese a una política antigua abierta", async () => {
      await asUser("authenticated", other);
      assert.equal((await db.query("select public.is_content_admin() as value")).rows[0].value, false);
      await assert.rejects(db.query("insert into public.admin_users values ($1,now())", [other]), /permission denied/);
      await assert.rejects(db.query("insert into public.fotos_carta(item_key) values ('x')"), /row-level security/);
      await assert.rejects(db.query("select public.save_content_document('menu_json','x',null,'[]')"), /Acceso denegado/);
    });
    const prepared = prepare([{ field_id: price.id, value: "1,80" }]);
    await t.test("preparar no modifica la carta; confirmar y repetir solo aplica una vez", async () => {
      const id = await seed(prepared);
      await asUser("authenticated");
      assert.equal((await currentMenu())[0].items[0].precio, "1,90 €");
      await assert.rejects(db.query("update public.menu_json set data='[]'"), /permission denied/);
      await assert.rejects(db.query("update public.ai_change_proposals set changes='[]'"), /permission denied/);
      await db.query("select public.apply_ai_proposal($1,'apply')", [id]);
      await db.query("select public.apply_ai_proposal($1,'apply')", [id]);
      assert.equal((await currentMenu())[0].items[0].precio, "1,80 €");
      await db.query("select public.apply_ai_proposal($1,'undo')", [id]);
      await db.query("select public.apply_ai_proposal($1,'undo')", [id]);
      assert.deepEqual(await currentMenu(), menu);
    });
    await t.test("caducidad y pertenencia se verifican en el servidor", async () => {
      const id = await seed(prepared, true);
      await asUser("authenticated");
      await assert.rejects(db.query("select public.apply_ai_proposal($1,'apply')", [id]), /caducado/);
      await asUser("authenticated", other);
      assert.equal((await db.query("select * from public.ai_change_proposals")).rows.length, 0);
    });
    await t.test("conflictos entre puestos revierten toda la operación y no pierden ediciones manuales", async () => {
      const otherPrice = fields.find((field) => field.key === "Carta - Telde" && field.kind === "price");
      const proposal = prepare([{ field_id: price.id, value: "1,80" }, { field_id: otherPrice.id, value: "2,00" }]);
      const id = await seed(proposal);
      const telde = structuredClone(menu); telde[0].items[0].precio = "2,10 €";
      await asUser("authenticated");
      await db.query("select public.save_content_document('menu_json','Carta - Telde',$1,$2)", [JSON.stringify(menu), JSON.stringify(telde)]);
      await assert.rejects(db.query("select public.apply_ai_proposal($1,'apply')", [id]), /Alguien ha cambiado/);
      assert.deepEqual(await currentMenu(), menu);
      await assert.rejects(db.query("select public.save_content_document('menu_json','Carta - Telde',$1,$2)", [JSON.stringify(menu), JSON.stringify(telde)]), /otra ventana/);
    });
    await t.test("deshacer no sobrescribe una edición posterior", async () => {
      const id = await seed(prepared);
      await asUser("authenticated");
      await db.query("select public.apply_ai_proposal($1,'apply')", [id]);
      const edited = structuredClone(prepared.documents[0].after); edited[0].items[1].precio = "2,60 €";
      await db.query("select public.save_content_document('menu_json','Carta - Gáldar',$1,$2)", [JSON.stringify(prepared.documents[0].after), JSON.stringify(edited)]);
      await assert.rejects(db.query("select public.apply_ai_proposal($1,'undo')", [id]), /Alguien ha cambiado/);
      assert.deepEqual(await currentMenu(), edited);
    });
    await t.test("solo el servidor reserva llamadas y limita el gasto por usuario", async () => {
      await asUser("authenticated");
      await assert.rejects(db.query("select public.reserve_ai_request($1)", [owner]), /permission denied/);
      await asUser("service_role");
      for (let i = 0; i < 20; i++) await db.query("select public.reserve_ai_request($1)", [owner]);
      await assert.rejects(db.query("select public.reserve_ai_request($1)", [owner]), /límite/);
    });
  } finally { await db.close(); }
});
