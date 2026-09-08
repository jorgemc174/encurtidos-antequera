import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useAdmin() {
  const [state, setState] = useState({ isAdmin: false, loading: true, error: "" });
  useEffect(() => {
    let alive = true;
    let run = 0;
    const check = async () => {
      const current = ++run;
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!alive || current !== run) return;
      if (!session || sessionError) {
        setState({ isAdmin: false, loading: false, error: "" });
        return;
      }
      const { data, error } = await supabase.rpc("is_content_admin");
      if (!alive || current !== run) return;
      setState({ isAdmin: data === true && !error, loading: false, error: error
        ? "No se ha podido comprobar el acceso. Revisa la conexión o la instalación en Supabase."
        : data !== true ? "Esta cuenta todavía no tiene permisos de administrador." : "" });
    };
    void check();
    // Ejecutar fuera del callback de Auth evita bloquear su mutex interno.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { setTimeout(() => { if (alive) void check(); }, 0); });
    return () => { alive = false; run++; subscription.unsubscribe(); };
  }, []);
  return state;
}

export async function signOutAdmin() {
  localStorage.removeItem("encurtidos_admin");
  await supabase.auth.signOut({ scope: "local" });
}
