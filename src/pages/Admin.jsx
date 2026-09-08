import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { signOutAdmin, useAdmin } from "../lib/useAdmin";

export default function Admin() {
  const { isAdmin, loading, error: accessError } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  if (isAdmin) return <Navigate to="/admin/asistente" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError(""); setBusy(true);
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (loginError) setError("No hemos podido entrar. Comprueba el correo, la contraseña y la conexión.");
    } catch { setError("No hay conexión. Inténtalo de nuevo."); }
    finally { setBusy(false); }
  };
  return (
    <main className="min-h-screen bg-[#F7F3EA] text-[#4E3B2A] flex items-center justify-center p-5">
      <form onSubmit={submit} className="bg-white rounded-3xl p-6 md:p-9 max-w-md w-full shadow-lg space-y-5">
        <Link to="/" className="underline">Volver a la web</Link>
        <h1 className="text-3xl font-bold">Acceso de los dueños</h1>
        <p>Entra para pedir cambios y revisar tu carta.</p>
        <label className="block text-lg font-semibold">Correo electrónico
          <input required type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full mt-2 p-3 border rounded-xl font-normal" />
        </label>
        <label className="block text-lg font-semibold">Contraseña
          <input required type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full mt-2 p-3 border rounded-xl font-normal" />
        </label>
        <label className="flex items-center gap-3 min-h-11"><input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="w-5 h-5" /> Mostrar contraseña</label>
        {(error || accessError) && <div role="alert" className="bg-red-50 text-red-800 p-4 rounded-xl">{error || accessError}</div>}
        <button disabled={busy || loading} className="w-full p-4 rounded-xl bg-[#4E3B2A] text-white text-lg font-bold disabled:opacity-50">{busy || loading ? "Comprobando acceso…" : "Entrar"}</button>
        {accessError && <button type="button" onClick={signOutAdmin} className="underline py-3">Cerrar sesión y usar otra cuenta</button>}
      </form>
    </main>
  );
}
