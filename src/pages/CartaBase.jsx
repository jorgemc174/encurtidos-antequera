import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import espanaImg from "../assets/españa.jpg";
import inglaterraImg from "../assets/inglaterra.jpg";

export default function CartaBase({ titulo, categorias }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const categoriasConId = useMemo(() => {
    return categorias.map((categoria, index) => ({
      ...categoria,
      id: `categoria-${index}`,
    }));
  }, [categorias]);

  useEffect(() => {
    if (!categoriasConId.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry = null;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          if (
            !bestEntry ||
            entry.boundingClientRect.top < bestEntry.boundingClientRect.top
          ) {
            bestEntry = entry;
          }
        }

        if (bestEntry) {
          setActiveSection(bestEntry.target.id);
        }
      },
      {
        root: null,
        rootMargin: "-90px 0px -70% 0px",
        threshold: 0,
      }
    );

    categoriasConId.forEach((categoria) => {
      const el = document.getElementById(categoria.id);
      if (el) observer.observe(el);
    });

    if (!activeSection && categoriasConId.length > 0) {
      setActiveSection(categoriasConId[0].id);
    }

    return () => observer.disconnect();
  }, [categoriasConId]);

  const categoriaActual =
    categoriasConId.find((categoria) => categoria.id === activeSection) ||
    categoriasConId[0];

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#4E3B2A]">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            to="/"
            className="inline-block px-5 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition"
          >
            {lang === "es" ? "Volver" : "Back"}
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {titulo[lang]}
        </h1>
      </div>

      <div className="sticky top-0 z-40 bg-[#F7F3EA]/95 backdrop-blur border-y border-[#B78B5A]/20">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-[#4E3B2A]/50 mb-1">
              {lang === "es" ? "Sección actual" : "Current section"}
            </p>
            <p className="text-lg font-semibold text-[#A8C66C] truncate">
              {categoriaActual?.nombre[lang]}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid gap-8">
          {categoriasConId.map((categoria) => (
            <section
              key={categoria.id}
              id={categoria.id}
              className="scroll-mt-24 bg-white rounded-3xl p-6 border border-[#B78B5A]/20 shadow-sm"
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
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}