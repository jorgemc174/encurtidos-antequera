import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full px-4 py-3 pr-12 rounded-xl border border-[#B78B5A]/30 bg-[#F7F3EA] text-[#4E3B2A] outline-none focus:border-[#B78B5A]"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#B78B5A] hover:bg-[#B78B5A]/10 transition"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.584 10.587a2 2 0 102.83 2.826M9.363 5.365A9.761 9.761 0 0112 5c5 0 8.27 4.11 9 6- .354.906-1.314 2.263-2.779 3.446M6.257 6.256C4.585 7.36 3.474 8.916 3 11c.73 1.89 4 6 9 6 1.175 0 2.255-.227 3.22-.618" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7 9.75-7 9.75 7 9.75 7-3.75 7-9.75 7-9.75-7-9.75-7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            )}
          </button>
        </div>
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
