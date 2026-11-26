import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ArrowLeft, ChevronDown, MapPin } from "lucide-react";
import logoImg from "../assets/logo-web.webp";
import logoClaroImg from "../assets/logo-claro.webp";
import { DESTACADOS } from "../data/destacados";
import { imagenesProductos, miniaturaDeImagen } from "../data/imagenesProductos";
import { imagenesSupabase } from "../data/imagenesSupabase";
import { normalizeKey } from "../lib/normalizeKey";
import { getSectionProductImageKeys, resolveSharedProductImage } from "../lib/productImage";
import { ahoraEnCanarias, idiomaGuardado, puestosDatos, rutaLimpia, textoEstadoPuesto } from "../lib/puestos";

const textosEstado = {
  es: { abiertoHasta: "Abierto hasta las {h}", cerradoAbreA: "Cerrado. Abre hoy a las {h}", cerradoAhora: "Cerrado ahora", horarioPorConfirmar: "Horario por confirmar" },
  en: { abiertoHasta: "Open until {h}", cerradoAbreA: "Closed. Opens today at {h}", cerradoAhora: "Closed now", horarioPorConfirmar: "Opening hours to be confirmed" },
};

// Los 14 alérgenos de declaración obligatoria (Reglamento UE 1169/2011).
const ALERGENOS = [
  ["Cereales con gluten", "Cereals containing gluten"], ["Crustáceos", "Crustaceans"], ["Huevos", "Eggs"],
  ["Pescado", "Fish"], ["Cacahuetes", "Peanuts"], ["Soja", "Soybeans"], ["Leche", "Milk"],
  ["Frutos de cáscara", "Nuts"], ["Apio", "Celery"], ["Mostaza", "Mustard"], ["Sésamo", "Sesame"],
  ["Sulfitos", "Sulphites"], ["Altramuces", "Lupin"], ["Moluscos", "Molluscs"],
];

const availableProductImages = { ...imagenesProductos, ...imagenesSupabase };

export default function CartaBase({ titulo, categorias }) {
  const menuDataConId = useMemo(() => (
    categorias.map((categoria, index) => {
      const categoryKey = normalizeKey(categoria.nombre.es) || index;
      return {
        ...categoria,
        id: `categoria-${categoryKey}`,
        subcategorias: categoria.subcategorias
          ? categoria.subcategorias.map((subcategoria, subIndex) => ({
              ...subcategoria,
              id: `categoria-${categoryKey}-sub-${normalizeKey(subcategoria.nombre.es) || subIndex}`,
            }))
          : undefined,
      };
    })
  ), [categorias]);

  const [lang, setLang] = useState(idiomaGuardado);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [openSubsections, setOpenSubsections] = useState(() => {
    const initial = {};
    menuDataConId.forEach((categoria) => {
      if (categoria.subcategoriasPlegables && categoria.subcategorias) {
        categoria.subcategorias.forEach((subcategoria) => {
          initial[subcategoria.id] = normalizeKey(subcategoria.nombre.es) === "cervezas";
        });
      }
    });
    return initial;
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [horarioAbierto, setHorarioAbierto] = useState(false);
  const [altoPestanas, setAltoPestanas] = useState(64);

  const location = useLocation();
  const puestoIdx = puestosDatos.findIndex((p) => rutaLimpia(p.rutaCarta) === rutaLimpia(location.pathname));
  const puesto = puestoIdx >= 0 ? puestosDatos[puestoIdx] : null;
  const [ahora, setAhora] = useState(() => ahoraEnCanarias());

  useEffect(() => {
    const timer = window.setInterval(() => setAhora(ahoraEnCanarias()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const estadoPuesto = puesto ? textoEstadoPuesto(puesto, ahora, textosEstado[lang]) : null;

  useEffect(() => {
    try { localStorage.setItem("lang", lang); } catch { /* sin almacenamiento */ }
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { sectionProductImageKeys, duplicatedProductImageKeys } = useMemo(() => {
    const keysBySection = menuDataConId.map((categoria) => getSectionProductImageKeys(categoria));
    const sectionCountByKey = new Map();
    keysBySection.forEach((keys) => {
      keys.forEach((key) => sectionCountByKey.set(key, (sectionCountByKey.get(key) || 0) + 1));
    });
    const duplicatedKeys = new Set(
      [...sectionCountByKey].filter(([, count]) => count > 1).map(([key]) => key)
    );
    return {
      sectionProductImageKeys: keysBySection.map(
        (keys) => new Set([...keys].filter((key) => !duplicatedKeys.has(key)))
      ),
      duplicatedProductImageKeys: duplicatedKeys,
    };
  }, [menuDataConId]);

  useEffect(() => {
    if (!menuDataConId.length) return;
    const elementsToObserve = [];
    menuDataConId.forEach((categoria) => {
      if (categoria.subcategorias?.length) {
        categoria.subcategorias.forEach((subcategoria) => { elementsToObserve.push({ id: subcategoria.id, catId: categoria.id }); });
      }
      elementsToObserve.push({ id: categoria.id, catId: categoria.id });
    });
    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!bestEntry || entry.boundingClientRect.top < bestEntry.boundingClientRect.top) bestEntry = entry;
        }
        if (bestEntry) {
          const found = elementsToObserve.find((el) => el.id === bestEntry.target.id);
          if (found) setActiveCategoryId(found.catId);
        }
      },
      { root: null, rootMargin: "-90px 0px -70% 0px", threshold: 0 }
    );
    elementsToObserve.forEach((element) => {
      const el = document.getElementById(element.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [menuDataConId]);

  const toggleSubsection = (id) => setOpenSubsections((prev) => ({ ...prev, [id]: !prev[id] }));

  const sectionImage = (section, parentSection = null) => {
    const key = parentSection
      ? `subseccion-${normalizeKey(parentSection.nombre.es)}-${normalizeKey(section.nombre.es)}`
      : `seccion-${normalizeKey(section.nombre.es)}`;
    return imagenesSupabase[key] || section.imagenSeccion || null;
  };

  const puestoNombre = (titulo[lang] || "").split(/\s+-\s+/).pop();
  const tituloCarta = lang === "es" ? `Carta de ${puestoNombre}` : `${puestoNombre} menu`;
  useEffect(() => {
    document.title = `${tituloCarta} · Antequera Encurtidos`;
    return () => { document.title = "Antequera Encurtidos"; };
  }, [tituloCarta]);

  const pestanasRef = useRef(null);
  const navRef = useRef(null);
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return undefined;
    const medir = new ResizeObserver(([entrada]) => setAltoPestanas(Math.round(entrada.contentRect.height)));
    medir.observe(nav);
    return () => medir.disconnect();
  }, []);
  useEffect(() => {
    const barra = pestanasRef.current;
    const pestana = barra?.querySelector(`[data-pestana="${activeCategoryId}"]`);
    if (!barra || !pestana) return;
    const destino = pestana.offsetLeft - (barra.clientWidth - pestana.offsetWidth) / 2;
    barra.scrollTo({ left: Math.max(0, destino), behavior: "smooth" });
  }, [activeCategoryId]);

  const renderSectionBanner = (section, parentSection = null) => {
    const imagen = sectionImage(section, parentSection);
    if (!imagen) return null;
    return (
      <div className="relative mb-6 overflow-hidden rounded-md bg-cal">
        <button type="button" onClick={() => setSelectedImage({ src: imagen, alt: section.nombre[lang] })}
          className="block w-full cursor-zoom-in" aria-label={section.nombre[lang]}>
          <img src={imagen} alt={section.nombre[lang]} loading="lazy" decoding="async" className="aspect-[3/1] max-h-72 w-full object-cover md:aspect-[5/2]" />
        </button>
      </div>
    );
  };

  const renderItems = (items, catIdx, noImages) => (
    <ul className={`grid gap-x-10 ${noImages ? "" : "lg:grid-cols-2"}`}>
      {items.map((item) => {
        const itemKey = item.nombre.es;
        const normalized = normalizeKey(itemKey);
        const sectionKey = normalizeKey(menuDataConId[catIdx].nombre.es);
        const scopedImageKey = `producto-${sectionKey}-${normalized}`;
        const hasSameNameInAnotherSection = duplicatedProductImageKeys.has(normalized);
        const staticImage = item.imagen || (item.imagenKey ? availableProductImages[item.imagenKey] : null);
        const legacyImage = hasSameNameInAnotherSection ? null : imagenesSupabase[normalized];
        const imagen = imagenesSupabase[scopedImageKey]
          || legacyImage
          || staticImage
          || resolveSharedProductImage(
            itemKey,
            availableProductImages,
            sectionProductImageKeys[catIdx],
            !hasSameNameInAnotherSection
          );
        const esDestacado = DESTACADOS.has(`${titulo.es}::${normalized}`);

        return (
          <li key={normalized} className={`flex items-center gap-3 border-b border-tinta/10 ${noImages ? "py-2.5" : "py-3"}`}>
            {(noImages ? legacyImage : imagen) && (
              <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-md bg-cal">
                <button type="button" onClick={() => setSelectedImage({ src: noImages ? legacyImage : imagen, alt: item.nombre[lang] })}
                  className="block size-full cursor-zoom-in focus-visible:outline-offset-[-3px]" aria-label={`${lang === "es" ? "Ver foto" : "View photo"}: ${item.nombre[lang]}`}>
                  <img src={miniaturaDeImagen(noImages ? legacyImage : imagen)} alt="" loading="lazy" decoding="async" width="216" height="216" className="size-full object-cover" />
                </button>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="break-words font-medium leading-snug">{item.nombre[lang]}</p>
              {esDestacado && (
                <p className="mt-0.5 text-sm font-semibold text-oliva-hondo">{lang === "es" ? "Te recomendamos" : "We recommend"}</p>
              )}
            </div>
            <span className="cifras shrink-0 whitespace-nowrap font-bold">{item.precio}</span>
          </li>
        );
      })}
    </ul>
  );

  const renderSubcategoriaPlegable = (categoria, catIdx, subcategoria) => {
    const isSubOpen = openSubsections[subcategoria.id];
    const imagen = sectionImage(subcategoria, categoria);
    const panelId = `${subcategoria.id}-panel`;
    return (
      <div key={subcategoria.id} id={subcategoria.id} className="scroll-mt-32 border-b border-tinta/15">
        <button type="button" onClick={() => toggleSubsection(subcategoria.id)} aria-expanded={!!isSubOpen} aria-controls={panelId}
          className="flex min-h-16 w-full items-center justify-between gap-4 py-3 text-left">
          <h3 className="ancho-pared text-2xl font-semibold leading-tight md:text-3xl">{subcategoria.nombre[lang]}</h3>
          <span className="flex items-center gap-3">
            {imagen && !isSubOpen && <img src={imagen} alt="" loading="lazy" decoding="async" className="hidden h-12 w-16 rounded object-cover sm:block" />}
            <ChevronDown className={`size-5 shrink-0 transition-transform duration-300 ${isSubOpen ? "rotate-180" : ""}`} aria-hidden="true" strokeWidth={2} />
          </span>
        </button>
        {isSubOpen && (
          <div id={panelId} className="pb-6">
            {subcategoria.grupos ? (
              <div className="flex flex-col gap-6">
                {subcategoria.grupos.map((grupo) => (
                  <div key={normalizeKey(grupo.nombre.es)}>
                    <h4 className="mb-1 text-lg font-bold text-oliva-hondo">{grupo.nombre[lang]}</h4>
                    {renderItems(grupo.items, catIdx, categoria.noImages)}
                  </div>
                ))}
              </div>
            ) : renderItems(subcategoria.items, catIdx, categoria.noImages)}
          </div>
        )}
      </div>
    );
  };

  const renderSubcategoriaFija = (categoria, catIdx, subcategoria) => (
    <div key={subcategoria.id} id={subcategoria.id} className="scroll-mt-32">
      <h3 className="mb-2 text-xl font-bold text-oliva-hondo md:text-2xl">{subcategoria.nombre[lang]}</h3>
      {renderItems(subcategoria.items, catIdx, categoria.noImages)}
    </div>
  );

  return (
    <div className="min-h-screen bg-pared text-tinta">
      <a href="#carta" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-tinta focus:px-4 focus:py-2 focus:text-pared">
        {lang === "es" ? "Ir a la carta" : "Skip to menu"}
      </a>
      <header className="border-b border-tinta/10">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:h-20 md:px-8">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full py-2 pr-3 text-sm font-semibold text-tinta no-underline hover:text-oliva-hondo">
            <ArrowLeft className="size-5" aria-hidden="true" strokeWidth={2} />{lang === "es" ? "Inicio" : "Home"}
          </Link>
          <Link to="/" aria-label="Antequera Encurtidos" className="absolute left-1/2 hidden -translate-x-1/2 sm:block">
            <img src={logoImg} alt="Antequera Encurtidos" width="900" height="201" className="h-9 w-auto md:h-10" />
          </Link>
          <div role="group" aria-label={lang === "es" ? "Idioma" : "Language"} className="inline-flex rounded-full border border-tinta/15 p-0.5 text-sm font-semibold">
            {["es", "en"].map((codigo) => (
              <button key={codigo} type="button" onClick={() => setLang(codigo)} aria-pressed={lang === codigo}
                aria-label={codigo === "en" ? "EN — English" : "ES — Español"}
                className={`min-w-11 rounded-full px-3 py-1.5 transition-colors ${lang === codigo ? "bg-tinta text-pared" : "text-grafito hover:text-tinta"}`}>
                {codigo.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main id="carta">
        <div className="mx-auto max-w-6xl px-4 pb-2 pt-3 md:px-8 md:pb-6 md:pt-12">
          <h1 className="ancho-titular equilibrado text-[2.1rem] font-extrabold leading-[0.98] tracking-[-0.03em] md:text-7xl">{tituloCarta}</h1>
          {puesto?.lugar?.[lang] && <p className="mt-1 text-base font-semibold md:mt-2 md:text-lg">{puesto.lugar[lang]}</p>}
          {puesto && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0 md:mt-3 md:gap-x-4">
              {estadoPuesto && (
                <p className="flex basis-full items-center gap-2.5 text-sm font-semibold md:text-base">
                  <span className={`size-2.5 rounded-full ${estadoPuesto.abierto ? "bg-oliva" : "border-2 border-grafito/45"}`} aria-hidden="true"></span>
                  {estadoPuesto.texto}
                </p>
              )}
              <a href={puesto.mapa} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-tinta underline decoration-tinta/30 hover:decoration-tinta">
                <MapPin className="size-4" aria-hidden="true" strokeWidth={2} />{lang === "es" ? "Cómo llegar" : "Directions"}
              </a>
              <details className="group open:basis-full" open={horarioAbierto} onToggle={(e) => setHorarioAbierto(e.currentTarget.open)}>
                <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-tinta underline decoration-tinta/30 hover:decoration-tinta">
                  <span className="sm:hidden">{lang === "es" ? "Horario" : "Hours"}</span>
                  <span className="hidden sm:inline">{lang === "es" ? "Horario de la semana" : "Weekly opening hours"}</span>
                </summary>
                <table className="cifras mb-2 w-full max-w-md text-[0.95rem]">
                  <tbody>
                    {(puesto.horario?.[lang] || []).map((franja, dia) => (
                      <tr key={dia} className={`border-b border-tinta/10 ${dia === ahora.dia ? "font-bold" : "text-grafito"}`}>
                        <th scope="row" className="py-1.5 text-left font-[inherit]">{franja.dia}{dia === ahora.dia && <span className="ml-2 rounded-full bg-hoja/40 px-2 py-0.5 text-xs font-semibold text-tinta">{lang === "es" ? "Hoy" : "Today"}</span>}</th>
                        <td className="py-1.5 text-right">{franja.hora}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
              <a href="#alergenos" className="inline-flex min-h-11 items-center text-sm font-semibold text-tinta underline decoration-tinta/30 hover:decoration-tinta">
                <span className="sm:hidden">{lang === "es" ? "Alérgenos" : "Allergens"}</span>
                <span className="hidden sm:inline">{lang === "es" ? "Alérgenos y trazas" : "Allergens and traces"}</span>
              </a>
            </div>
          )}
        </div>

        <nav ref={navRef} aria-label={lang === "es" ? "Secciones de la carta" : "Menu sections"} className="sticky top-0 z-40 border-y border-tinta/10 bg-pared/95 backdrop-blur-sm">
          <div ref={pestanasRef} className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-2.5 md:flex-nowrap md:overflow-x-auto md:px-8 md:py-3 md:[scrollbar-width:none]">
            {menuDataConId.map((categoria) => {
              const activa = activeCategoryId === categoria.id;
              return (
                <a key={categoria.id} href={`#${categoria.id}`} data-pestana={categoria.id} aria-current={activa ? "true" : undefined}
                  className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[0.95rem] font-semibold no-underline transition-colors ${activa ? "bg-tinta text-pared" : "bg-cal text-tinta hover:bg-tinta/10"}`}>
                  {categoria.nombre[lang]}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="mx-auto max-w-6xl px-4 pb-20 md:px-8">
          {menuDataConId.map((categoria, catIdx) => (
            <section key={categoria.id} id={categoria.id} aria-labelledby={`${categoria.id}-titulo`}
              style={{ scrollMarginTop: altoPestanas + 8 }} className="pt-4 md:pt-16">
              <div className="mb-3 flex items-center gap-2 border-b-2 border-tinta pb-2 md:mb-5 md:pb-3">
                <h2 id={`${categoria.id}-titulo`} className="ancho-pared text-4xl font-semibold leading-none tracking-[-0.01em] md:text-6xl">{categoria.nombre[lang]}</h2>
              </div>
              {!categoria.subcategoriasPlegables && renderSectionBanner(categoria)}
              {categoria.subcategorias ? (
                categoria.subcategoriasPlegables ? (
                  <div className="border-t border-tinta/15">
                    {categoria.subcategorias.map((subcategoria) => renderSubcategoriaPlegable(categoria, catIdx, subcategoria))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {categoria.subcategorias.map((subcategoria) => renderSubcategoriaFija(categoria, catIdx, subcategoria))}
                  </div>
                )
              ) : renderItems(categoria.items, catIdx, categoria.noImages)}
            </section>
          ))}

          <section id="alergenos" className="pt-16" style={{ scrollMarginTop: altoPestanas + 8 }} aria-labelledby="alergenos-titulo">
            <h2 id="alergenos-titulo" className="ancho-pared border-b-2 border-tinta pb-3 text-3xl font-semibold md:text-4xl">{lang === "es" ? "Alérgenos" : "Allergens"}</h2>
            <p className="mt-4 max-w-[60ch] text-grafito">
              {lang === "es" ? "Todos nuestros platos, pinchos y banderillas pueden contener trazas de:" : "All our dishes, pinchos and skewers may contain traces of:"}
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4">
              {ALERGENOS.map(([es, en]) => (
                <li key={es} className="border-b border-tinta/10 py-2 font-medium">{lang === "es" ? es : en}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-grafito">{lang === "es" ? "Si tienes alguna alergia, pregunta en la barra antes de pedir." : "If you have an allergy, please ask at the bar before ordering."}</p>
          </section>
        </div>
      </main>

      <footer className="bg-tinta text-pared">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <img src={logoClaroImg} alt="Antequera Encurtidos" width="900" height="201" className="h-9 w-auto" />
          <Link to="/#puestos" className="font-semibold text-pared underline decoration-pared/30 hover:decoration-pared">
            {lang === "es" ? "Horarios y cómo llegar" : "Opening hours and directions"}
          </Link>
        </div>
      </footer>

      <Lightbox open={!!selectedImage} close={() => setSelectedImage(null)}
        slides={selectedImage ? [{ src: selectedImage.src, alt: selectedImage.alt }] : []}
        render={{ buttonPrev: () => null, buttonNext: () => null }} carousel={{ finite: true }}
        labels={{ Close: lang === "es" ? "Cerrar" : "Close" }} />
    </div>
  );
}
