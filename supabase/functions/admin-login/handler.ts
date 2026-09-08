type Settings = {
  url?: string; anonKey?: string; serviceKey?: string; userId?: string;
  createClient: (...args: any[]) => any;
};

export function createLoginHandler(settings: Settings) {
  return async (request: Request) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json", "Cache-Control": "no-store",
    };
    const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return reply({ error: "Método no permitido." }, 405);
    if (!settings.url || !settings.anonKey || !settings.serviceKey) return reply({ error: "Falta configurar el acceso en Supabase." }, 503);
    try {
      // No registrar nunca el cuerpo, la contraseña ni los tokens de sesión.
      const reader = request.body?.getReader();
      if (!reader) return reply({ error: "Introduce la contraseña." }, 400);
      const chunks: Uint8Array[] = []; let size = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 2048) { await reader.cancel(); return reply({ error: "Petición demasiado larga." }, 413); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      let body;
      try { body = JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply({ error: "Petición inválida." }, 400); }
      if (!body || typeof body.password !== "string" || !body.password.length || body.password.length > 128) return reply({ error: "Introduce una contraseña válida." }, 400);

      const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
      const service = settings.createClient(settings.url, settings.serviceKey, options);
      let query = service.from("admin_users").select("user_id");
      if (settings.userId) query = query.eq("user_id", settings.userId);
      const { data: admins, error: readError } = await query.limit(2);
      // Nunca escoger arbitrariamente una cuenta si existen varios dueños.
      if (readError || admins?.length !== 1) return reply({ error: "Falta seleccionar la cuenta del acceso compartido en Supabase." }, 503);
      const userId = admins[0].user_id;
      const { data: account, error: accountError } = await service.auth.admin.getUserById(userId);
      if (accountError || !account?.user?.email) return reply({ error: "No se ha podido comprobar el acceso." }, 503);

      // Supabase Auth comprueba el hash de la contraseña y aplica sus límites
      // de autenticación. No se crea ni se cambia una contraseña desde aquí.
      const auth = settings.createClient(settings.url, settings.anonKey, options);
      const { data, error } = await auth.auth.signInWithPassword({ email: account.user.email, password: body.password });
      if (error?.status === 429) return reply({ error: "Demasiados intentos. Espera unos minutos antes de volver a entrar." }, 429);
      if (error || !data?.session || data.user?.id !== userId) return reply({ error: "Contraseña incorrecta o acceso no disponible." }, 401);
      return reply({ access_token: data.session.access_token, refresh_token: data.session.refresh_token });
    } catch {
      return reply({ error: "No se ha podido acceder. Comprueba la conexión e inténtalo de nuevo." }, 503);
    }
  };
}
