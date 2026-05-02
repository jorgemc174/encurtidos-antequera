import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "juani123") {
      localStorage.setItem("encurtidos_admin", "true");
      navigate("/");
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-lg border border-[#B78B5A]/20"
      >
        <h1 className="text-2xl font-bold text-[#4E3B2A] mb-2">
          Acceso administrador
        </h1>
        <p className="text-sm text-[#4E3B2A]/60 mb-6">
          Introduce la contraseña para acceder al panel de administración.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full px-4 py-3 rounded-xl border border-[#B78B5A]/30 bg-[#F7F3EA] text-[#4E3B2A] outline-none focus:border-[#B78B5A] mb-4"
          autoFocus
        />
        {error && (
          <p className="text-red-500 text-sm mb-4">Contraseña incorrecta</p>
        )}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
