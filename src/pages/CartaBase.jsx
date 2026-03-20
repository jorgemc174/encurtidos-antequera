import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import espanaImg from "../assets/españa.jpg";
import inglaterraImg from "../assets/inglaterra.jpg";

export default function CartaBase({ titulo, categorias }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#4E3B2A] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            to="/"
            className="inline-block px-5 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition"
          >
            {lang === "es" ? "Volver" : "Back"}
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang("es")}
              className={`p-1 rounded-xl border transition ${
                lang === "es"
                  ? "bg-[#A8C66C] border-[#A8C66C]"
                  : "bg-white border-[#B78B5A]/30"
              }`}
            >
              <img
                src={espanaImg}
                alt="Español"
                className="w-8 h-5 object-cover rounded-sm"
              />
            </button>

            <button
              onClick={() => setLang("en")}
              className={`p-1 rounded-xl border transition ${
                lang === "en"
                  ? "bg-[#A8C66C] border-[#A8C66C]"
                  : "bg-white border-[#B78B5A]/30"
              }`}
            >
              <img
                src={inglaterraImg}
                alt="English"
                className="w-8 h-5 object-cover rounded-sm"
              />
            </button>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-10">
          {titulo[lang]}
        </h1>

        <div className="grid gap-8">
          {categorias.map((categoria, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 border border-[#B78B5A]/20 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-[#A8C66C] mb-6">
                {categoria.nombre[lang]}
              </h2>

              <div className="space-y-4">
                {categoria.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 border-b border-[#B78B5A]/10 pb-3"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 rounded-xl border border-[#B78B5A]/20 bg-[#F7F3EA] shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-[#4E3B2A]/40 text-center px-1">
                        {item.imagen ? (
                          <img
                            src={item.imagen}
                            alt={item.nombre[lang]}
                            className="w-full h-full object-cover"
                          />
                        ) : lang === "es" ? (
                          "Sin foto"
                        ) : (
                          "No image"
                        )}
                      </div>

                      <span className="break-words">{item.nombre[lang]}</span>
                    </div>

                    <span className="font-semibold whitespace-nowrap">
                      {item.precio}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}