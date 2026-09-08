import { readFile } from "node:fs/promises";

// Diagnóstico de solo lectura con la conexión PÚBLICA que usa la web.
const source = await readFile(new URL("../src/lib/supabase.js", import.meta.url), "utf8");
const url = source.match(/https:\/\/[a-z0-9]+\.supabase\.co/)?.[0];
const key = source.match(/"(eyJ[^"\s]+)"/)?.[1];
if (!url || !key) throw new Error("No se ha encontrado la conexión pública del proyecto.");
const headers = { apikey: key, Authorization: `Bearer ${key}` };
for (const [name, path] of [
  ["Cartas guardadas", "/rest/v1/menu_json?select=location"],
  ["Secciones de inicio", "/rest/v1/home_json?select=section"],
]) {
  const response = await fetch(url + path, { headers, signal: AbortSignal.timeout(15000) });
  const data = await response.json();
  console.log(name, response.status, response.ok ? data : "No disponible");
}
const permissions = await fetch(`${url}/rest/v1/rpc/is_content_admin`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: "{}", signal: AbortSignal.timeout(15000) });
console.log("Configuración de administradores", permissions.status === 200 ? "Instalada" : `Pendiente / HTTP ${permissions.status}`);
const assistant = await fetch(`${url}/functions/v1/admin-assistant`, { method: "OPTIONS", headers, signal: AbortSignal.timeout(15000) });
console.log("Función del asistente", assistant.status === 204 ? "Publicada (falta probar con sesión admin)" : `Pendiente / HTTP ${assistant.status}`);
