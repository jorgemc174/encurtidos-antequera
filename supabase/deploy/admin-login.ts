// GENERADO con npm run build:login. Pegar como index.ts de la función admin-login.
// No contiene contraseñas ni claves privadas.

// supabase/functions/admin-login/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.104.1";

// supabase/functions/admin-login/handler.ts
function createLoginHandler(settings) {
  return async (request) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    };
    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return reply({ error: "M\xE9todo no permitido." }, 405);
    if (!settings.url || !settings.anonKey || !settings.serviceKey) return reply({ error: "Falta configurar el acceso en Supabase." }, 503);
    try {
      const reader = request.body?.getReader();
      if (!reader) return reply({ error: "Introduce la contrase\xF1a." }, 400);
      const chunks = [];
      let size = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 2048) {
          await reader.cancel();
          return reply({ error: "Petici\xF3n demasiado larga." }, 413);
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      let body;
      try {
        body = JSON.parse(new TextDecoder().decode(bytes));
      } catch {
        return reply({ error: "Petici\xF3n inv\xE1lida." }, 400);
      }
      if (!body || typeof body.password !== "string" || !body.password.length || body.password.length > 128) return reply({ error: "Introduce una contrase\xF1a v\xE1lida." }, 400);
      const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
      const service = settings.createClient(settings.url, settings.serviceKey, options);
      let query = service.from("admin_users").select("user_id");
      if (settings.userId) query = query.eq("user_id", settings.userId);
      const { data: admins, error: readError } = await query.limit(2);
      if (readError || admins?.length !== 1) return reply({ error: "Falta seleccionar la cuenta del acceso compartido en Supabase." }, 503);
      const userId = admins[0].user_id;
      const { data: account, error: accountError } = await service.auth.admin.getUserById(userId);
      if (accountError || !account?.user?.email) return reply({ error: "No se ha podido comprobar el acceso." }, 503);
      const auth = settings.createClient(settings.url, settings.anonKey, options);
      const { data, error } = await auth.auth.signInWithPassword({ email: account.user.email, password: body.password });
      if (error?.status === 429) return reply({ error: "Demasiados intentos. Espera unos minutos antes de volver a entrar." }, 429);
      if (error || !data?.session || data.user?.id !== userId) return reply({ error: "Contrase\xF1a incorrecta o acceso no disponible." }, 401);
      return reply({ access_token: data.session.access_token, refresh_token: data.session.refresh_token });
    } catch {
      return reply({ error: "No se ha podido acceder. Comprueba la conexi\xF3n e int\xE9ntalo de nuevo." }, 503);
    }
  };
}

// supabase/functions/admin-login/index.ts
Deno.serve(createLoginHandler({
  url: Deno.env.get("SUPABASE_URL"),
  anonKey: Deno.env.get("SUPABASE_ANON_KEY"),
  serviceKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  userId: Deno.env.get("ADMIN_LOGIN_USER_ID"),
  createClient
}));
