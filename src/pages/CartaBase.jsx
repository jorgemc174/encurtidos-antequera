import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import espanaImg from "../assets/españa.jpg";
import inglaterraImg from "../assets/inglaterra.jpg";
import alergenosImg from "../assets/alergenos.jpg";
import { imagenesProductos } from "../data/imagenesProductos";
import { supabase, normalizeKey } from "../lib/supabase";

function compressToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Formato de imagen no soportado"));
      img.onload = () => {
        try {
          const MAX = 900;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width > height) { height = Math.round((height / width) * MAX); width = MAX; }
            else { width = Math.round((width / height) * MAX); height = MAX; }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
          if (dataUrl === "data:,") reject(new Error("No se pudo comprimir la imagen"));
          else resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}


export default function CartaBase({ titulo, categorias }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");
  const [activeLabel, setActiveLabel] = useState("");
  const [openSections, setOpenSections] = useState({});
  const [openSubsections, setOpenSubsections] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [supabasePhotos, setSupabasePhotos] = useState({});
  const [uploading, setUploading] = useState(null);
  const [uploadMenu, setUploadMenu] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const pendingKeyRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
          const found = elementsToObserve.find(
            (el) => el.id === bestEntry.target.id
          );
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

  useEffect(() => {
    supabase.from("fotos_carta").select("item_key, photo_data").then(({ data, error }) => {
      if (error || !data) return;
      const photos = {};
      data.forEach(({ item_key, photo_data }) => {
        photos[item_key] = photo_data;
      });
      setSupabasePhotos(photos);
    });
  }, []);

  const openUploadMenu = (itemKey) => {
    setUploadMenu(itemKey);
  };

  const handleMenuOption = (type) => {
    pendingKeyRef.current = uploadMenu;
    setUploadMenu(null);
    if (type === "camera") {
      cameraInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !pendingKeyRef.current) return;
    const itemKey = pendingKeyRef.current;
    const normalized = normalizeKey(itemKey);
    e.target.value = "";

    let dataUrl;
    try {
      dataUrl = await compressToDataUrl(file);
    } catch (err) {
      alert(`Error al procesar la imagen: ${err.message}`);
      return;
    }

    setSupabasePhotos((prev) => ({ ...prev, [normalized]: dataUrl }));
    setUploading(normalized);

    try {
      const { error } = await supabase.from("fotos_carta").upsert(
        { item_key: normalized, photo_data: dataUrl, updated_at: new Date().toISOString() },
        { onConflict: "item_key" }
      );
      if (error) throw error;
    } catch (err) {
      console.error("Error guardando foto:", err);
      setSupabasePhotos((prev) => {
        const next = { ...prev };
        delete next[normalized];
        return next;
      });
      alert(`No se pudo guardar la foto.\n\nError: ${err.message}`);
    } finally {
      setUploading(null);
    }
  };

  const renderItems = (items) => (
    <div className="space-y-4">
      {items.map((item, i) => {
        const itemKey = item.nombre.es;
        const normalized = normalizeKey(itemKey);
        const staticImage =
          item.imagen ||
          (item.imagenKey ? imagenesProductos[item.imagenKey] : null);
        const imagen = supabasePhotos[normalized] || staticImage;
        const isUploading = uploading === normalized;

        return (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-b border-[#B78B5A]/10 pb-3"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-16 h-16 rounded-xl border border-[#B78B5A]/20 bg-[#F7F3EA] shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-[#4E3B2A]/40 text-center">
                {imagen ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        editMode
                          ? openUploadMenu(itemKey)
                          : setSelectedImage({ src: imagen, alt: item.nombre[lang] })
                      }
                      className="w-full h-full block"
                    >
                      <img
                        src={imagen}
                        alt={item.nombre[lang]}
                        className="block w-full h-full object-cover"
                      />
                    </button>
                    {(editMode || isUploading) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                        {isUploading ? (
                          <svg className="w-6 h-6 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </div>
                    )}
                  </>
                ) : editMode ? (
                  <button
                    type="button"
                    onClick={() => openUploadMenu(itemKey)}
                    className="w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-[#B78B5A]/10 transition cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#B78B5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[9px] text-[#B78B5A]">Añadir</span>
                  </button>
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
        );
      })}
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
            <p className="text-lg font-semibold text-[#7E9F00] truncate">
              {activeLabel || titulo[lang]}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEditMode((v) => !v)}
              title={editMode ? "Salir de edición" : "Editar fotos"}
              className={`p-2 rounded-xl border transition ${
                editMode
                  ? "bg-[#B78B5A] border-[#B78B5A] text-white"
                  : "bg-white border-[#B78B5A]/30 text-[#B78B5A]"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <section className="mb-6">
          <p className="text-sm md:text-base text-[#4E3B2A]/80 mb-3 leading-6 text-center">
            {lang === "es"
              ? "Todos nuestros platos, pinchos y banderillas pueden contener trazas de:"
              : "All our dishes, pinchos and skewers may contain traces of:"}
          </p>

          <img
            src={alergenosImg}
            alt={lang === "es" ? "Tabla de alérgenos" : "Allergen chart"}
            className="w-full max-w-3xl mx-auto"
          />
        </section>

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
                          {categoria.subcategorias.map(
                            (subcategoria, subIndex) => {
                              const isSubOpen =
                                openSubsections[subcategoria.id];

                              return (
                                <div
                                  key={subIndex}
                                  id={subcategoria.id}
                                  className="scroll-mt-24 rounded-2xl border border-[#B78B5A]/15 bg-[#FCFAF6] overflow-hidden"
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleSubsection(subcategoria.id)
                                    }
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
                                          {subcategoria.grupos.map(
                                            (grupo, grupoIndex) => (
                                              <div key={grupoIndex}>
                                                <h4 className="text-lg md:text-xl font-bold text-[#7E9F00] mb-4">
                                                  {grupo.nombre[lang]}
                                                </h4>
                                                {renderItems(grupo.items)}
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        renderItems(subcategoria.items)
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {categoria.subcategorias.map(
                            (subcategoria, subIndex) => (
                              <div
                                key={subIndex}
                                id={subcategoria.id}
                                className="scroll-mt-24"
                              >
                                <h3 className="text-xl md:text-2xl font-bold text-[#7E9F00] mb-4">
                                  {subcategoria.nombre[lang]}
                                </h3>
                                {renderItems(subcategoria.items)}
                              </div>
                            )
                          )}
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

      {uploadMenu && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-end justify-center p-4"
          onClick={() => setUploadMenu(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm pb-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-sm font-semibold text-[#4E3B2A] py-4 border-b border-[#B78B5A]/15">
              {lang === "es" ? "Añadir foto" : "Add photo"}
            </p>
            <button
              type="button"
              onClick={() => handleMenuOption("camera")}
              className="w-full flex items-center gap-4 px-6 py-4 text-[#4E3B2A] font-medium border-b border-[#B78B5A]/15 active:bg-[#F7F3EA]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#B78B5A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {lang === "es" ? "Cámara" : "Camera"}
            </button>
            <button
              type="button"
              onClick={() => handleMenuOption("gallery")}
              className="w-full flex items-center gap-4 px-6 py-4 text-[#4E3B2A] font-medium border-b border-[#B78B5A]/15 active:bg-[#F7F3EA]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#B78B5A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {lang === "es" ? "Galería / Archivos" : "Gallery / Files"}
            </button>
            <button
              type="button"
              onClick={() => setUploadMenu(null)}
              className="w-full py-4 text-sm text-[#4E3B2A]/50 active:bg-[#F7F3EA]"
            >
              {lang === "es" ? "Cancelar" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 text-white text-2xl font-bold hover:bg-white/25 transition"
          >
            ×
          </button>

          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}