import { createClient } from "npm:@supabase/supabase-js@2.104.1";
import { createLoginHandler } from "./handler.ts";

Deno.serve(createLoginHandler({
  url: Deno.env.get("SUPABASE_URL"),
  anonKey: Deno.env.get("SUPABASE_ANON_KEY"),
  serviceKey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  userId: Deno.env.get("ADMIN_LOGIN_USER_ID"),
  createClient,
}));
