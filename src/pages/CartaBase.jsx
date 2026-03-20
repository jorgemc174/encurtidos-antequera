import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import espanaImg from "../assets/españa.jpg";
import inglaterraImg from "../assets/inglaterra.jpg";

export default function CartaBase({ titulo, categorias }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");
  const [activeLabel, setActiveLabel] = useState("");
  const [openSections, setOpenSections] = useState({});
  const [openSubsections, setOpenSubsections] = useState({});

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const categoriasConId = useMemo(() => {
    return categorias.map((categoria, index) => ({
      ...categoria,
      id: `categoria-${index}`,
      subcategorias: categoria.subcategorias
        ? categoria.subcategorias.map((subcategoria, subIndex) => ({
            ...subcategoria,
            id: `categoria-${index}-sub-${subIndex}`,
          }))
        : undefined,
    }));
  }, [categorias]);

  useEffect(() => {
    if (!categoriasConId.length) return;

    const initialOpenState = {};
    const initialSubOpenState = {};

    categoriasConId.forEach((categoria, index) => {
      initialOpenState[categoria.id] = index === 0;

      if (categoria.subcategoriasPlegables && categoria.subcategorias) {
        categoria.subcategorias.forEach((subcategoria) => {
          initialSubOpenState[subcategoria.id] = false;
        });
      }
    });

    setOpenSections(initialOpenState);
    setOpenSubsections(initialSubOpenState);
  }, [categoriasConId]);

  useEffect(() => {
    if (!categoriasConId.length) return;

    const elementsToObserve = [];

    categoriasConId.forEach((categoria) => {
      if (categoria.subcategorias?.length) {
        categoria.subcategorias.forEach((subcategoria) => {
          elementsToObserve.push({
            id: subcategoria.id,
            label: subcategoria.nombre,
          });
        });
      } else {
        elementsToObserve.push({
          id: categoria.id,
          label: categoria.nombre,
        });
      }
    });

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
          const found = elementsToObserve.find((el) => el.id === bestEntry.target.id);
          if (found) {
            setActiveLabel(found.label[lang]);
          }
        }
      },
      {
        root: null,
        rootMargin: "-90px 0px -70% 0px",
        threshold: 0,
      }
    );

    elementsToObserve.forEach((element) => {
      const el = document.getElementById(element.id);
      if (el) observer.observe(el);
    });

    if (!activeLabel && elementsToObserve.length > 0) {
      setActiveLabel(elementsToObserve[0].label[lang]);
    }

    return () => observer.disconnect();
  }, [categoriasConId, lang, activeLabel]);

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSubsection = (id) => {
    setOpenSubsections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItems = (items) => (
    <div className="space-y-4">
      {items.map((item, i) => (
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

          <span className="font-semibold whitespace-nowrap">{item.precio}</span>
        </div>
      ))}
    </div>
  );

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

        <h1 className="text-4xl md:text-5xl font-bold mb-6">{titulo[lang]}</h1>
      </div>

      <div className="sticky top-0 z-40 bg-[#F7F3EA]/95 backdrop-blur border-y border-[#B78B5A]/20">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-[#4E3B2A]/50 mb-1">
              {lang === "es" ? "Sección actual" : "Current section"}
            </p>
            <p className="text-lg font-semibold text-[#7E9F00] truncate">
              {activeLabel || titulo[lang]}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLang("es")}
              className={`p-1 rounded-xl border transition ${
                lang === "es"
                  ? "bg-[#7E9F00] border-[#7E9F00]"
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
                  ? "bg-[#7E9F00] border-[#7E9F00]"
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
          {categoriasConId.map((categoria) => {
            const isOpen = openSections[categoria.id];

            return (
              <section
                key={categoria.id}
                id={!categoria.subcategorias ? categoria.id : undefined}
                className="scroll-mt-24 bg-white rounded-3xl border border-[#B78B5A]/20 shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(categoria.id)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <h2 className="text-2xl font-bold text-[#7E9F00]">
                    {categoria.nombre[lang]}
                  </h2>

                  <span className="text-2xl font-semibold text-[#B78B5A] leading-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {!isOpen && (
                  <div className="px-6 pb-6">
                    <div className="w-full h-48 rounded-2xl border border-[#B78B5A]/20 bg-[#F7F3EA] overflow-hidden flex items-center justify-center text-sm text-[#4E3B2A]/45">
                      {categoria.imagenSeccion ? (
                        <img
                          src={categoria.imagenSeccion}
                          alt={categoria.nombre[lang]}
                          className="w-full h-full object-cover"
                        />
                      ) : lang === "es" ? (
                        "Imagen de sección"
                      ) : (
                        "Section image"
                      )}
                    </div>
                  </div>
                )}

                {isOpen && (
                  <div className="px-6 pb-6">
                    {categoria.subcategorias ? (
                      categoria.subcategoriasPlegables ? (
                        <div className="space-y-6">
                          {categoria.subcategorias.map((subcategoria, subIndex) => {
                            const isSubOpen = openSubsections[subcategoria.id];

                            return (
                              <div
                                key={subIndex}
                                id={subcategoria.id}
                                className="scroll-mt-24 rounded-2xl border border-[#B78B5A]/15 bg-[#FCFAF6] overflow-hidden"
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleSubsection(subcategoria.id)}
                                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                                >
                                  <h3 className="text-xl md:text-2xl font-bold text-[#7E9F00]">
                                    {subcategoria.nombre[lang]}
                                  </h3>

                                  <span className="text-2xl font-semibold text-[#B78B5A] leading-none">
                                    {isSubOpen ? "−" : "+"}
                                  </span>
                                </button>

                                {!isSubOpen && (
                                  <div className="px-5 pb-5">
                                    <div className="w-full h-40 rounded-2xl border border-[#B78B5A]/20 bg-[#F7F3EA] overflow-hidden flex items-center justify-center text-sm text-[#4E3B2A]/45">
                                      {subcategoria.imagenSeccion ? (
                                        <img
                                          src={subcategoria.imagenSeccion}
                                          alt={subcategoria.nombre[lang]}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : lang === "es" ? (
                                        "Imagen de subsección"
                                      ) : (
                                        "Subsection image"
                                      )}
                                    </div>
                                  </div>
                                )}

                                {isSubOpen && (
                                  <div className="px-5 pb-5">
                                    {subcategoria.grupos ? (
                                      <div className="space-y-8">
                                        {subcategoria.grupos.map((grupo, grupoIndex) => (
                                          <div key={grupoIndex}>
                                            <h4 className="text-lg md:text-xl font-bold text-[#7E9F00] mb-4">
                                              {grupo.nombre[lang]}
                                            </h4>
                                            {renderItems(grupo.items)}
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      renderItems(subcategoria.items)
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {categoria.subcategorias.map((subcategoria, subIndex) => (
                            <div key={subIndex} id={subcategoria.id} className="scroll-mt-24">
                              <h3 className="text-xl md:text-2xl font-bold text-[#7E9F00] mb-4">
                                {subcategoria.nombre[lang]}
                              </h3>
                              {renderItems(subcategoria.items)}
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      renderItems(categoria.items)
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}