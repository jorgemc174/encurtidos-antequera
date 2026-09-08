import { test } from "node:test";
import assert from "node:assert/strict";
import { createLoginHandler } from "../supabase/functions/admin-login/handler.ts";

function fixture({ admins = [{ user_id: "owner" }], credentialsError = null, userId = "owner", selectedId } = {}) {
  const calls = [];
  const handler = createLoginHandler({
    url: "https://example.test", anonKey: "test-public", serviceKey: "test-service", userId: selectedId,
    createClient: (_url, key) => key === "test-service" ? {
      from: () => ({ select: () => {
        const query = { eq: (_column, value) => { calls.push({ selectedId: value }); return query; }, limit: async () => ({ data: admins, error: null }) };
        return query;
      } }),
      auth: { admin: { getUserById: async () => ({ data: { user: { email: "owner@example.test" } }, error: null }) } },
    } : {
      auth: { signInWithPassword: async (credentials) => {
        calls.push(credentials);
        return { data: { user: { id: userId }, session: { access_token: "test-access", refresh_token: "test-refresh" } }, error: credentialsError };
      } },
    },
  });
  return { handler, calls };
}
const request = (body) => new Request("https://example.test/admin-login", { method: "POST", body: JSON.stringify(body) });

test("el navegador solo envía contraseña; el servidor determina la cuenta y devuelve sesión real", async () => {
  const { handler, calls } = fixture();
  const response = await handler(request({ password: "test-password", email: "attacker@example.test" }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(calls, [{ email: "owner@example.test", password: "test-password" }]);
  assert.deepEqual(await response.json(), { access_token: "test-access", refresh_token: "test-refresh" });
});
test("una contraseña incorrecta o una sesión de otra cuenta no conceden acceso", async () => {
  for (const options of [{ credentialsError: { status: 400 } }, { userId: "other-user" }]) {
    const { handler } = fixture(options);
    const response = await handler(request({ password: "wrong-password" }));
    assert.equal(response.status, 401);
    assert.equal((await response.text()).includes("test-access"), false);
  }
});
test("no elige una cuenta arbitraria si no hay administrador o hay varios", async () => {
  for (const admins of [[], [{ user_id: "one" }, { user_id: "two" }]]) {
    const { handler, calls } = fixture({ admins });
    assert.equal((await handler(request({ password: "test-password" }))).status, 503);
    assert.equal(calls.length, 0);
  }
});
test("respeta el límite de Supabase Auth", async () => {
  const { handler } = fixture({ credentialsError: { status: 429 } });
  assert.equal((await handler(request({ password: "test-password" }))).status, 429);
});
test("rechaza cuerpos vacíos, demasiado largos y métodos incorrectos", async () => {
  const { handler, calls } = fixture();
  for (const body of [null, {}, { password: "" }, { password: 123 }, { password: "x".repeat(129) }]) assert.equal((await handler(request(body))).status, 400);
  assert.equal((await handler(request({ password: "x".repeat(3000) }))).status, 413);
  assert.equal((await handler(new Request("https://example.test"))).status, 405);
  assert.equal((await handler(new Request("https://example.test", { method: "OPTIONS" }))).status, 204);
  assert.equal(calls.length, 0);
});
