import { build } from "esbuild";

// Archivo único para pegar en el editor de Edge Functions del panel.
await build({
  entryPoints: ["supabase/functions/admin-assistant/index.ts"],
  outfile: "supabase/deploy/admin-assistant.ts",
  bundle: true, format: "esm", platform: "neutral", target: "es2022",
  external: ["npm:*"],
  banner: { js: "// GENERADO con npm run build:assistant. Editar los originales en functions/admin-assistant.\n// No contiene claves privadas. Pegar como index.ts de la función admin-assistant." },
});
