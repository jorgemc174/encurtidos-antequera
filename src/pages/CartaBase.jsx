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
        } catch (err) { reject(err); }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function sbUpsert(table, data, conflict) {
  try { const { supabase: s } = await import("../lib/supabase"); await s.from(table).upsert(data, { onConflict: conflict }); } catch (e) {}
}

async function sbSelect(table, select, filter) {
  try {
    const { supabase: s } = await import("../lib/supabase");
    const q = s.from(table).select(select);
    if (filter) q.eq(filter.field, filter.value);
    const { data, error } = await q;
    return { data, error };
  } catch (e) { return { data: null, error: e }; }
}

async function sbDelete(table, field, value) {
  try { const { supabase: s } = await import("../lib/supabase"); await s.from(table).delete().eq(field, value); } catch (e) {}
}

function getItemsArray(data, catIdx, subIdx, grpIdx) {
  if (grpIdx != null) return data[catIdx].subcategorias[subIdx].grupos[grpIdx].items;
  if (subIdx != null) return data[catIdx].subcategorias[subIdx].items;
  return data[catIdx].items;
}

function getItem(data, catIdx, subIdx, grpIdx, itemIdx) {
  return getItemsArray(data, catIdx, subIdx, grpIdx)[itemIdx];
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

  const [isAdmin] = useState(() => localStorage.getItem("encurtidos_admin") === "true");
  const [adminEditMode, setAdminEditMode] = useState(false);
  const menuStorageKey = `encurtidos_menu_${titulo.es}`;
  const [menuData, setMenuData] = useState(() => {
    const saved = localStorage.getItem(menuStorageKey);
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return JSON.parse(JSON.stringify(categorias));
  });
  const [editingKey, setEditingKey] = useState(null);
  const [editNombreES, setEditNombreES] = useState("");
  const [editNombreEN, setEditNombreEN] = useState("");
  const [editPrecio, setEditPrecio] = useState("");

  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);
  useEffect(() => {
    localStorage.setItem(menuStorageKey, JSON.stringify(menuData));
    sbUpsert("menu_json", { location: titulo.es, data: menuData, updated_at: new Date().toISOString() }, "location");
  }, [menuData, menuStorageKey, titulo.es]);
  useEffect(() => {
    (async () => {
      const { data, error } = await sbSelect("menu_json", "data", { field: "location", value: titulo.es });
      if (!error && data?.[0]?.data) {
        setMenuData(data[0].data);
        localStorage.setItem(menuStorageKey, JSON.stringify(data[0].data));
      }
    })();
  }, [titulo.es, menuStorageKey]);
  useEffect(() => {
    (async () => {
      const { data, error } = await sbSelect("destacados", "item_key");
      if (!error && data) {
        const keys = data.map((r) => r.item_key);
        localStorage.setItem("encurtidos_destacados_items", JSON.stringify(keys));
      }
    })();
  }, []);



  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") { setSelectedImage(null); setEditingKey(null); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const menuDataConId = useMemo(() => {
    return menuData.map((categoria, index) => ({
      ...categoria,
      id: `categoria-${index}`,
      subcategorias: categoria.subcategorias
        ? categoria.subcategorias.map((subcategoria, subIndex) => ({ ...subcategoria, id: `categoria-${index}-sub-${subIndex}` }))
        : undefined,
    }));
  }, [menuData]);

  useEffect(() => {
    if (!menuDataConId.length) return;
    const initialOpenState = {};
    const initialSubOpenState = {};
    menuDataConId.forEach((categoria, index) => {
      initialOpenState[categoria.id] = index === 0;
      if (categoria.subcategoriasPlegables && categoria.subcategorias) {
        categoria.subcategorias.forEach((subcategoria) => { initialSubOpenState[subcategoria.id] = false; });
      }
    });
    setOpenSections(initialOpenState);
    setOpenSubsections(initialSubOpenState);
  }, [menuDataConId]);

  useEffect(() => {
    if (!menuDataConId.length) return;
    const elementsToObserve = [];
    menuDataConId.forEach((categoria) => {
      if (categoria.subcategorias?.length) {
        categoria.subcategorias.forEach((subcategoria) => { elementsToObserve.push({ id: subcategoria.id, label: subcategoria.nombre }); });
      } else {
        elementsToObserve.push({ id: categoria.id, label: categoria.nombre });
      }
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
          if (found) setActiveLabel(found.label[lang]);
        }
      },
      { root: null, rootMargin: "-90px 0px -70% 0px", threshold: 0 }
    );
    elementsToObserve.forEach((element) => {
      const el = document.getElementById(element.id);
      if (el) observer.observe(el);
    });
    if (!activeLabel && elementsToObserve.length > 0) setActiveLabel(elementsToObserve[0].label[lang]);
    return () => observer.disconnect();
  }, [menuDataConId, lang, activeLabel]);

  const toggleSection = (id) => setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleSubsection = (id) => setOpenSubsections((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    supabase.from("fotos_carta").select("item_key, photo_data").then(({ data, error }) => {
      if (error || !data) return;
      const photos = {};
      data.forEach(({ item_key, photo_data }) => { photos[item_key] = photo_data; });
      setSupabasePhotos(photos);
    });
  }, []);

  const openUploadMenu = (itemKey) => setUploadMenu(itemKey);
  const handleMenuOption = (type) => {
    pendingKeyRef.current = uploadMenu;
    setUploadMenu(null);
    if (type === "camera") cameraInputRef.current?.click();
    else fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !pendingKeyRef.current) return;
    const itemKey = pendingKeyRef.current;
    const normalized = normalizeKey(itemKey);
    e.target.value = "";
    let dataUrl;
    try { dataUrl = await compressToDataUrl(file); } catch (err) { alert(`Error al procesar la imagen: ${err.message}`); return; }
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
      setSupabasePhotos((prev) => { const next = { ...prev }; delete next[normalized]; return next; });
      alert(`No se pudo guardar la foto.\n\nError: ${err.message}`);
    } finally { setUploading(null); }
  };

  const mkKey = (catIdx, subIdx, grpIdx, itemIdx, field) => `${catIdx}|${subIdx ?? ""}|${grpIdx ?? ""}|${itemIdx}|${field}`;

  const startEdit = (catIdx, subIdx, grpIdx, itemIdx, field) => {
    const item = getItem(menuData, catIdx, subIdx, grpIdx, itemIdx);
    if (field === "nombre") { setEditNombreES(item.nombre.es || ""); setEditNombreEN(item.nombre.en || ""); }
    else setEditPrecio(item.precio || "");
    setEditingKey(mkKey(catIdx, subIdx, grpIdx, itemIdx, field));
  };

  const saveEdit = () => {
    if (!editingKey) return;
    const parts = editingKey.split("|");
    setMenuData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const target = getItem(copy, parseInt(parts[0]), parts[1] === "" ? null : parseInt(parts[1]), parts[2] === "" ? null : parseInt(parts[2]), parseInt(parts[3]));
      if (parts[4] === "nombre") target.nombre = { es: editNombreES, en: editNombreEN };
      else target.precio = editPrecio;
      return copy;
    });
    setEditingKey(null);
  };

  const handleDeleteItem = (catIdx, subIdx, grpIdx, itemIdx) => {
    if (!confirm(lang === "es" ? "¿Eliminar este producto?" : "Delete this product?")) return;
    setMenuData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      getItemsArray(copy, catIdx, subIdx, grpIdx).splice(itemIdx, 1);
      return copy;
    });
  };

  const handleAddItem = (catIdx, subIdx, grpIdx) => {
    const newItem = { nombre: { es: "Nuevo producto", en: "New product" }, precio: "0,00 €" };
    setMenuData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      getItemsArray(copy, catIdx, subIdx, grpIdx).push(JSON.parse(JSON.stringify(newItem)));
      return copy;
    });
  };

  const destacadoKey = (item) => `${titulo.es}::${normalizeKey(item.nombre.es)}`;
  const getDestacados = () => {
    const saved = localStorage.getItem("encurtidos_destacados_items");
    return saved ? JSON.parse(saved) : [];
  };
  const toggleDestacado = (item) => {
    const key = destacadoKey(item);
    const current = getDestacados();
    const isFeat = current.includes(key);
    const next = isFeat ? current.filter((k) => k !== key) : [...current, key];
    localStorage.setItem("encurtidos_destacados_items", JSON.stringify(next));
    if (isFeat) sbDelete("destacados", "item_key", key);
    else sbUpsert("destacados", { item_key: key, updated_at: new Date().toISOString() }, "item_key");
    setMenuData((prev) => [...prev]);
  };

  const renderItems = (items, catIdx, subIdx, grpIdx, noImages) => (
    <div className="space-y-4">
      {items.map((item, i) => {
        const itemKey = item.nombre.es;
        const normalized = normalizeKey(itemKey);
        const staticImage = item.imagen || (item.imagenKey ? imagenesProductos[item.imagenKey] : null);
        const imagen = supabasePhotos[normalized] || staticImage;
        const isUploading = uploading === normalized;
        const isEditingName = editingKey === mkKey(catIdx, subIdx, grpIdx, i, "nombre");
        const isEditingPrice = editingKey === mkKey(catIdx, subIdx, grpIdx, i, "precio");
        const esDestacado = getDestacados().includes(destacadoKey(item));

        return (
          <div key={i} className={`flex items-center justify-between gap-4 border-b pb-3 ${esDestacado ? "border-[#D4A843]/40" : "border-[#B78B5A]/10"}`}>
            <div className="flex items-center gap-4 min-w-0 flex-1">
              {isAdmin && (
                <button onClick={() => toggleDestacado(item)}
                  className={`shrink-0 p-1 rounded transition ${esDestacado ? "text-[#D4A843]" : "text-gray-300 hover:text-[#D4A843]"}`}
                  title={esDestacado ? (lang === "es" ? "Quitar destacado" : "Unfeature") : (lang === "es" ? "Destacar" : "Feature")}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill={esDestacado ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              )}
              {!noImages && (
                <div className="relative w-16 h-16 rounded-xl bg-[#F7F3EA] shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-[#4E3B2A]/40 text-center">
                  {imagen ? (
                    <>
                      <button type="button" onClick={() => editMode ? openUploadMenu(itemKey) : setSelectedImage({ src: imagen, alt: item.nombre[lang] })}
                        className="w-full h-full block">
                        <img src={imagen} alt={item.nombre[lang]} className="w-full h-full object-cover" />
                      </button>
                      {esDestacado && !editMode && (
                        <span className="absolute top-0 left-0 bg-[#D4A843]/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br-xl leading-tight">
                          ★ {lang === "es" ? "Destacado" : "Featured"}
                        </span>
                      )}
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
                    <button type="button" onClick={() => openUploadMenu(itemKey)}
                      className="w-full h-full flex flex-col items-center justify-center gap-1 hover:bg-[#B78B5A]/10 transition cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#B78B5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[9px] text-[#B78B5A]">Añadir</span>
                    </button>
                  ) : null}
                </div>
              )}
              {noImages && esDestacado && !isEditingName && (
                <span className="text-[10px] text-[#D4A843] font-medium whitespace-nowrap shrink-0">
                  ★ {lang === "es" ? "Destacado" : "Featured"}
                </span>
              )}

              <div className="flex flex-col min-w-0 flex-1">
                {isEditingName ? (
                  <div className="flex flex-col gap-1">
                    <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editNombreES} onChange={(e) => setEditNombreES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingKey(null); }} />
                    <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editNombreEN} onChange={(e) => setEditNombreEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingKey(null); }} />
                    <div className="flex gap-1 mt-1">
                      <button onClick={saveEdit} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                      <button onClick={() => setEditingKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={isAdmin && adminEditMode ? () => startEdit(catIdx, subIdx, grpIdx, i, "nombre") : undefined}
                    className={`text-left break-words ${isAdmin && adminEditMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}>
                    {item.nombre[lang]}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isEditingPrice ? (
                <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm w-28 text-right" value={editPrecio} onChange={(e) => setEditPrecio(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingKey(null); }} onBlur={saveEdit} />
              ) : (
                <button onClick={isAdmin && adminEditMode ? () => startEdit(catIdx, subIdx, grpIdx, i, "precio") : undefined}
                  className={`font-semibold whitespace-nowrap ${isAdmin && adminEditMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}>
                  {item.precio}
                </button>
              )}
              {isAdmin && adminEditMode && !isEditingName && !isEditingPrice && (
                <button onClick={() => handleDeleteItem(catIdx, subIdx, grpIdx, i)}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition" title={lang === "es" ? "Eliminar" : "Delete"}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
      {isAdmin && adminEditMode && (
        <button onClick={() => handleAddItem(catIdx, subIdx, grpIdx)}
          className="w-full py-2 rounded-xl border-2 border-dashed border-[#B78B5A]/40 text-[#B78B5A] font-medium text-sm hover:bg-[#B78B5A]/5 transition">
          + {lang === "es" ? "Añadir producto" : "Add product"}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#4E3B2A]">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link to="/" className="inline-block px-5 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition">
            {lang === "es" ? "Volver" : "Back"}
          </Link>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{titulo[lang]}</h1>
      </div>

      <div className="sticky top-0 z-40 bg-[#F7F3EA]/95 backdrop-blur border-y border-[#B78B5A]/20">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-[#4E3B2A]/50 mb-1">{lang === "es" ? "Sección actual" : "Current section"}</p>
            <p className="text-lg font-semibold text-[#7E9F00] truncate">{activeLabel || titulo[lang]}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setEditMode((v) => !v)} title={editMode ? "Salir de edición" : "Editar fotos"}
              className={`p-2 rounded-xl border transition ${editMode ? "bg-[#B78B5A] border-[#B78B5A] text-white" : "bg-white border-[#B78B5A]/30 text-[#B78B5A]"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            {isAdmin && (
              <button onClick={() => setAdminEditMode((v) => !v)} title={adminEditMode ? "Salir de edición admin" : "Editar productos"}
                className={`p-2 rounded-xl border transition ${adminEditMode ? "bg-[#4E3B2A] border-[#4E3B2A] text-white" : "bg-white border-[#B78B5A]/30 text-[#B78B5A]"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            <button onClick={() => setLang("es")} className={`p-1 rounded-xl border transition ${lang === "es" ? "bg-[#7E9F00] border-[#7E9F00]" : "bg-white border-[#B78B5A]/30"}`}>
              <img src={espanaImg} alt="Español" className="w-8 h-5 object-cover rounded-sm" />
            </button>
            <button onClick={() => setLang("en")} className={`p-1 rounded-xl border transition ${lang === "en" ? "bg-[#7E9F00] border-[#7E9F00]" : "bg-white border-[#B78B5A]/30"}`}>
              <img src={inglaterraImg} alt="English" className="w-8 h-5 object-cover rounded-sm" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture className="hidden" onChange={handleFileChange} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <section className="mb-6">
          <p className="text-sm md:text-base text-[#4E3B2A]/80 mb-3 leading-6 text-center">
            {lang === "es" ? "Todos nuestros platos, pinchos y banderillas pueden contener trazas de:" : "All our dishes, pinchos and skewers may contain traces of:"}
          </p>
          <img src={alergenosImg} alt={lang === "es" ? "Tabla de alérgenos" : "Allergen chart"} className="w-full max-w-3xl mx-auto" />
        </section>

        <div className="grid gap-8">
          {menuDataConId.map((categoria, catIdx) => {
            const isOpen = openSections[categoria.id];
            return (
              <section key={categoria.id} id={!categoria.subcategorias ? categoria.id : undefined} className="scroll-mt-24 bg-white rounded-3xl border border-[#B78B5A]/20 shadow-sm overflow-hidden">
                <button type="button" onClick={() => toggleSection(categoria.id)} className="w-full flex items-center justify-between gap-4 p-6 text-left">
                  <h2 className="text-2xl font-bold text-[#7E9F00]">{categoria.nombre[lang]}</h2>
                  <span className="text-2xl font-semibold text-[#B78B5A] leading-none">{isOpen ? "−" : "+"}</span>
                </button>
                {!isOpen && (
                  <div className="px-6 pb-6">
                    <div className="w-full h-48 rounded-2xl border border-[#B78B5A]/20 bg-[#F7F3EA] overflow-hidden flex items-center justify-center text-sm text-[#4E3B2A]/45">
                      {categoria.imagenSeccion ? <img src={categoria.imagenSeccion} alt={categoria.nombre[lang]} className="w-full h-full object-cover" /> : lang === "es" ? "Imagen de sección" : "Section image"}
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
                              <div key={subIndex} id={subcategoria.id} className="scroll-mt-24 rounded-2xl border border-[#B78B5A]/15 bg-[#FCFAF6] overflow-hidden">
                                <button type="button" onClick={() => toggleSubsection(subcategoria.id)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                                  <h3 className="text-xl md:text-2xl font-bold text-[#7E9F00]">{subcategoria.nombre[lang]}</h3>
                                  <span className="text-2xl font-semibold text-[#B78B5A] leading-none">{isSubOpen ? "−" : "+"}</span>
                                </button>
                                {!isSubOpen && (
                                  <div className="px-5 pb-5">
                                    <div className="w-full h-40 rounded-2xl border border-[#B78B5A]/20 bg-[#F7F3EA] overflow-hidden flex items-center justify-center text-sm text-[#4E3B2A]/45">
                                      {subcategoria.imagenSeccion ? <img src={subcategoria.imagenSeccion} alt={subcategoria.nombre[lang]} className="w-full h-full object-cover" /> : lang === "es" ? "Imagen de subsección" : "Subsection image"}
                                    </div>
                                  </div>
                                )}
                                {isSubOpen && (
                                  <div className="px-5 pb-5">
                                    {subcategoria.grupos ? (
                                      <div className="space-y-8">
                                        {subcategoria.grupos.map((grupo, grupoIndex) => (
                                          <div key={grupoIndex}>
                                            <h4 className="text-lg md:text-xl font-bold text-[#7E9F00] mb-4">{grupo.nombre[lang]}</h4>
                                            {renderItems(grupo.items, catIdx, subIndex, grupoIndex, categoria.noImages)}
                                          </div>
                                        ))}
                                      </div>
                                    ) : renderItems(subcategoria.items, catIdx, subIndex, null, categoria.noImages)}
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
                              <h3 className="text-xl md:text-2xl font-bold text-[#7E9F00] mb-4">{subcategoria.nombre[lang]}</h3>
                              {renderItems(subcategoria.items, catIdx, subIndex, null, categoria.noImages)}
                            </div>
                          ))}
                        </div>
                      )
                    ) : renderItems(categoria.items, catIdx, null, null, categoria.noImages)}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {uploadMenu && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end justify-center p-4" onClick={() => setUploadMenu(null)}>
          <div className="bg-white rounded-3xl w-full max-w-sm pb-2 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <p className="text-center text-sm font-semibold text-[#4E3B2A] py-4 border-b border-[#B78B5A]/15">{lang === "es" ? "Añadir foto" : "Add photo"}</p>
            <button type="button" onClick={() => handleMenuOption("camera")} className="w-full flex items-center gap-4 px-6 py-4 text-[#4E3B2A] font-medium border-b border-[#B78B5A]/15 active:bg-[#F7F3EA]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#B78B5A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {lang === "es" ? "Cámara" : "Camera"}
            </button>
            <button type="button" onClick={() => handleMenuOption("gallery")} className="w-full flex items-center gap-4 px-6 py-4 text-[#4E3B2A] font-medium border-b border-[#B78B5A]/15 active:bg-[#F7F3EA]">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#B78B5A] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {lang === "es" ? "Galería / Archivos" : "Gallery / Files"}
            </button>
            <button type="button" onClick={() => setUploadMenu(null)} className="w-full py-4 text-sm text-[#4E3B2A]/50 active:bg-[#F7F3EA]">{lang === "es" ? "Cancelar" : "Cancel"}</button>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button type="button" onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 text-white text-2xl font-bold hover:bg-white/25 transition">×</button>
          <img src={selectedImage.src} alt={selectedImage.alt} className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
