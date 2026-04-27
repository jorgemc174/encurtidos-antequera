import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://gmzbcvhoslquumxkojso.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtemJjdmhvc2xxdXVteGtvanNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTY5NTksImV4cCI6MjA4ODI5Mjk1OX0.8wxzCzm6CAHLGngw47OdVAZytm9CzFe_COLCw3eSVs4"
);

export const BUCKET = "fotos-carta";

export function normalizeKey(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
