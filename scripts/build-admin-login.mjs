import { build } from "esbuild";

await build({
  entryPoints: ["supabase/functions/admin-login/index.ts"],
  outfile: "supabase/deploy/admin-login.ts",
  bundle: true, format: "esm", platform: "neutral", target: "es2022",
  external: ["npm:*"],
  banner: { js: "// GENERADO con npm run build:login. Pegar como index.ts de la función admin-login.\n// No contiene contraseñas ni claves privadas." },
});
