import { Link, useLocation } from "react-router-dom";
import { signOutAdmin, useAdmin } from "../lib/useAdmin";
import { useContentDocument } from "../lib/useContentDocument";
import { useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ArrowLeft, Camera, ChevronDown, GripVertical, Image as ImageIcon, LoaderCircle, LogOut, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import logoImg from "../assets/logo-web.webp";
import logoClaroImg from "../assets/logo-claro.webp";
import { imagenesProductos, miniaturaDeImagen } from "../data/imagenesProductos";
import { IMAGENES_SUPABASE_SNAPSHOT_AT, imagenesSupabase } from "../data/imagenesSupabase";
import { getSectionProductImageKeys, resolveSharedProductImage } from "../lib/productImage";
import { translateProductName, translateProductNameOnline } from "../lib/productTranslation";
import { supabase, normalizeKey } from "../lib/supabase";
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

// En la lista se usa la miniatura (~5–11 KB) y la foto completa solo al ampliar.
const miniatura = miniaturaDeImagen;

const fechaCorta = (ms, lang) => new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "long", year: "numeric" }).format(new Date(ms));

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
  try {
    const { supabase: s } = await import("../lib/supabase");
    const { error } = await s.from(table).upsert(data, { onConflict: conflict });
    return error || null;
  } catch {
    return new Error("No se pudo conectar con Supabase");
  }
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
  try {
    const { supabase: s } = await import("../lib/supabase");
    const { error } = await s.from(table).delete().eq(field, value);
    return error || null;
  } catch {
    return new Error("No se pudo conectar con Supabase");
  }
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
  const [lang, setLang] = useState(idiomaGuardado);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [openSubsections, setOpenSubsections] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [destacados, setDestacados] = useState(() => {
    try { return JSON.parse(localStorage.getItem("encurtidos_destacados_items") || "[]"); } catch { return []; }
  });
  const [horarioAbierto, setHorarioAbierto] = useState(false);
  const [altoPestanas, setAltoPestanas] = useState(64);
  const [editMode, setEditMode] = useState(false);
  const [supabasePhotos, setSupabasePhotos] = useState({});
  const [uploading, setUploading] = useState(null);
  const [uploadMenu, setUploadMenu] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const pendingKeyRef = useRef(null);

  const { isAdmin } = useAdmin();
  const [adminEditMode, setAdminEditMode] = useState(false);
  const [syncError, setSyncError] = useState("");
  const menuStorageKey = `encurtidos_menu_${titulo.es}`;
  const menuDocument = useContentDocument({
    table: "menu_json", documentKey: titulo.es, storageKey: menuStorageKey,
    fallback: categorias, isAdmin,
  });
  const menuData = menuDocument.data;
  const location = useLocation();
  const puestosDocument = useContentDocument({
    table: "home_json", documentKey: "puestos", storageKey: "encurtidos_home_puestos",
    fallback: puestosDatos, isAdmin: false,
    normalize: (rows) => rows.map((p, i) => ({ ...puestosDatos[i], ...p, horario: p.horario || puestosDatos[i]?.horario })),
  });
  const puestoIdx = puestosDocument.data.findIndex((p) => rutaLimpia(p.rutaCarta) === rutaLimpia(location.pathname));
  const puesto = puestoIdx >= 0 ? puestosDocument.data[puestoIdx] : null;
  const [ahora, setAhora] = useState(() => ahoraEnCanarias());
  useEffect(() => {
    const timer = window.setInterval(() => setAhora(ahoraEnCanarias()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const estadoPuesto = puesto ? textoEstadoPuesto(puesto, ahora, textosEstado[lang]) : null;
  // Precios: solo se enseñan si vienen de Supabase o de la última copia que llegó
  // de Supabase a este móvil. Los del código pueden estar desfasados.
  const preciosOcultos = !isAdmin && menuDocument.source === "fallback";
  const avisoPrecios = isAdmin ? null
    : menuDocument.source === "fallback" && (menuDocument.failed || menuDocument.ready)
      ? (lang === "es" ? "No hemos podido cargar los precios actuales. Confírmalos en el puesto." : "We couldn't load current prices. Please check at the stand.")
      : menuDocument.source === "cache" && menuDocument.failed && menuDocument.savedAt
        ? (lang === "es" ? `Precios guardados el ${fechaCorta(menuDocument.savedAt, "es")}. Confírmalos en el puesto.` : `Prices saved on ${fechaCorta(menuDocument.savedAt, "en")}. Please check at the stand.`)
        : menuDocument.source === "fallback"
          ? (lang === "es" ? "Cargando precios…" : "Loading prices…")
          : null;
  const setMenuData = menuDocument.edit;
  const [editingKey, setEditingKey] = useState(null);
  const [editNombreES, setEditNombreES] = useState("");
  const [editNombreEN, setEditNombreEN] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const translationRunRef = useRef(0);
  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    try { localStorage.setItem("lang", lang); } catch { /* sin almacenamiento */ }
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    (async () => {
      const { data, error } = await sbSelect("destacados", "item_key");
      if (!error && data) {
        const keys = data.map((r) => r.item_key);
        setDestacados(keys);
        try { localStorage.setItem("encurtidos_destacados_items", JSON.stringify(keys)); } catch { /* sin almacenamiento */ }
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
    return menuData.map((categoria, index) => {
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
    });
  }, [menuData]);

  const availableProductImages = useMemo(() => ({
    ...imagenesProductos,
    ...imagenesSupabase,
    ...supabasePhotos,
  }), [supabasePhotos]);

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
    setOpenSubsections((prev) => {
      const next = {};
      menuDataConId.forEach((categoria) => {
        if (categoria.subcategoriasPlegables && categoria.subcategorias) {
          categoria.subcategorias.forEach((subcategoria) => { next[subcategoria.id] = prev[subcategoria.id] ?? normalizeKey(subcategoria.nombre.es) === "cervezas"; });
        }
      });
      return next;
    });
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

  const reorderEntry = (descriptor, toIndex) => {
    if (!descriptor || descriptor.index === toIndex || toIndex < 0 || toIndex >= descriptor.total) return;
    setMenuData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let entries;
      if (descriptor.type === "category") entries = copy;
      else if (descriptor.type === "subcategory") entries = copy[descriptor.catIdx]?.subcategorias;
      else if (descriptor.type === "group") entries = copy[descriptor.catIdx]?.subcategorias?.[descriptor.subIdx]?.grupos;
      else if (descriptor.type === "item") entries = getItemsArray(copy, descriptor.catIdx, descriptor.subIdx, descriptor.grpIdx);
      if (!entries?.[descriptor.index] || !entries[toIndex]) return prev;
      const [moved] = entries.splice(descriptor.index, 1);
      entries.splice(toIndex, 0, moved);
      return copy;
    });
  };

  const startDrag = (event, descriptor) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    setEditingKey(null);
    const next = { ...descriptor };
    dragRef.current = next;
    setDragging(next);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    const current = dragRef.current;
    if (!current) return;
    event.preventDefault();
    const edge = 72;
    if (event.clientY < edge) window.scrollBy(0, -14);
    else if (event.clientY > window.innerHeight - edge) window.scrollBy(0, 14);

    let target = document.elementFromPoint(event.clientX, event.clientY);
    while (target && target.dataset?.reorderContainer !== current.container) target = target.parentElement;
    if (!target || target.dataset.reorderContainer !== current.container) return;
    const toIndex = Number(target.dataset.reorderIndex);
    if (!Number.isInteger(toIndex) || toIndex === current.index) return;
    reorderEntry(current, toIndex);
    const next = { ...current, index: toIndex };
    dragRef.current = next;
    setDragging(next);
  };

  const finishDrag = (event) => {
    if (!dragRef.current) return;
    event?.preventDefault();
    dragRef.current = null;
    setDragging(null);
  };

  const dragHandle = (descriptor, label) => {
    const active = dragging?.type === descriptor.type
      && dragging?.container === descriptor.container
      && dragging?.index === descriptor.index;
    return (
      <button
        type="button"
        className={`shrink-0 touch-none select-none rounded-md p-2 cursor-grab active:cursor-grabbing transition ${active ? "bg-tinta text-pared scale-105" : "text-grafito hover:bg-tinta/10"}`}
        aria-label={label}
        title={label}
        onClick={(event) => { event.preventDefault(); event.stopPropagation(); }}
        onPointerDown={(event) => startDrag(event, descriptor)}
        onPointerMove={moveDrag}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onKeyDown={(event) => {
          const offset = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
          if (!offset) return;
          event.preventDefault();
          event.stopPropagation();
          reorderEntry(descriptor, descriptor.index + offset);
        }}
      >
        <GripVertical className="size-5" aria-hidden="true" strokeWidth={2} />
      </button>
    );
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: metadata, error: metadataError } = await supabase
        .from("fotos_carta")
        .select("item_key, updated_at");
      if (cancelled || metadataError || !metadata) return;

      const changedKeys = metadata
        .filter(({ item_key, updated_at }) => (
          !item_key.startsWith("home-")
          && (!imagenesSupabase[item_key] || !updated_at || Date.parse(updated_at) > IMAGENES_SUPABASE_SNAPSHOT_AT)
        ))
        .map(({ item_key }) => item_key);

      if (!changedKeys.length) {
        setSupabasePhotos({});
        return;
      }

      const { data, error } = await supabase
        .from("fotos_carta")
        .select("item_key, photo_data")
        .in("item_key", changedKeys);
      if (cancelled || error || !data) return;
      const photos = {};
      data.forEach(({ item_key, photo_data }) => { photos[item_key] = photo_data; });
      setSupabasePhotos(photos);
    })();
    return () => { cancelled = true; };
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

  const handleEditNombreESChange = (value) => {
    setEditNombreES(value);
    const run = translationRunRef.current + 1;
    translationRunRef.current = run;
    setEditNombreEN(translateProductName(value));
    translateProductNameOnline(value).then((translated) => {
      if (translationRunRef.current === run) setEditNombreEN(translated);
    });
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
  const getDestacados = () => destacados;
  const toggleDestacado = async (item) => {
    const key = destacadoKey(item);
    const current = getDestacados();
    const isFeat = current.includes(key);
    const next = isFeat ? current.filter((k) => k !== key) : [...current, key];
    setDestacados(next);
    try { localStorage.setItem("encurtidos_destacados_items", JSON.stringify(next)); } catch { /* sin almacenamiento */ }
    const error = isFeat
      ? await sbDelete("destacados", "item_key", key)
      : await sbUpsert("destacados", { item_key: key, updated_at: new Date().toISOString() }, "item_key");
    setSyncError(error ? "No se ha podido guardar el destacado en la base de datos. Revisa Supabase o la conexión." : "");
    setMenuData((prev) => [...prev]);
  };

  const handleExitAdmin = () => {
    try { localStorage.removeItem("encurtidos_admin"); } catch { /* sin almacenamiento */ }
    void signOutAdmin();
    setEditMode(false);
    setAdminEditMode(false);
  };

  const sectionPhotoKey = (section, parentSection = null) => (
    parentSection
      ? `subseccion-${normalizeKey(parentSection.nombre.es)}-${normalizeKey(section.nombre.es)}`
      : `seccion-${normalizeKey(section.nombre.es)}`
  );
  const sectionImage = (section, parentSection = null) => {
    const key = sectionPhotoKey(section, parentSection);
    return { key, imagen: supabasePhotos[key] || imagenesSupabase[key] || section.imagenSeccion || null };
  };

  const puestoNombre = (titulo[lang] || "").split(/\s+-\s+/).pop();
  const tituloCarta = lang === "es" ? `Carta de ${puestoNombre}` : `${puestoNombre} menu`;
  const adminEditing = isAdmin && adminEditMode;
  useEffect(() => {
    document.title = `${tituloCarta} · Antequera Encurtidos`;
    return () => { document.title = "Antequera Encurtidos"; };
  }, [tituloCarta]);
  const textoEditable = "cursor-text rounded-sm outline-2 outline-dashed outline-oliva/50 hover:bg-hoja/20";

  // Pestañas: lleva la pestaña activa a la vista sin mover la página.
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
    const { key, imagen } = sectionImage(section, parentSection);
    const isUploading = uploading === key;
    if (!imagen && !editMode) return null;
    return (
      <div className="relative mb-6 overflow-hidden rounded-md bg-cal">
        {imagen ? (
          <button type="button" onClick={() => editMode ? openUploadMenu(key) : setSelectedImage({ src: imagen, alt: section.nombre[lang] })}
            className="block w-full cursor-zoom-in" aria-label={editMode ? (lang === "es" ? "Cambiar imagen de sección" : "Change section image") : section.nombre[lang]}>
            <img src={imagen} alt={section.nombre[lang]} loading="lazy" decoding="async" className="aspect-[3/1] max-h-72 w-full object-cover md:aspect-[5/2]" />
          </button>
        ) : (
          <button type="button" onClick={() => openUploadMenu(key)} className="flex aspect-[3/1] max-h-72 w-full flex-col md:aspect-[5/2] items-center justify-center gap-2 text-sm font-semibold text-grafito hover:bg-tinta/5">
            <Camera className="size-6" aria-hidden="true" strokeWidth={2} />{lang === "es" ? "Añadir imagen" : "Add image"}
          </button>
        )}
        {(editMode && imagen) || isUploading ? (
          <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-tinta/80 px-3 py-1.5 text-xs font-semibold text-pared">
            {isUploading ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : <Camera className="size-3.5" aria-hidden="true" strokeWidth={2} />}
            {isUploading ? (lang === "es" ? "Guardando…" : "Saving…") : (lang === "es" ? "Cambiar imagen" : "Change image")}
          </span>
        ) : null}
      </div>
    );
  };

  const renderItems = (items, catIdx, subIdx, grpIdx, noImages) => (
    <div>
      <ul className={`grid gap-x-10 ${noImages ? "" : "lg:grid-cols-2"}`}>
        {items.map((item, i) => {
          const itemKey = item.nombre.es;
          const normalized = normalizeKey(itemKey);
          const sectionKey = normalizeKey(menuDataConId[catIdx].nombre.es);
          const scopedImageKey = `producto-${sectionKey}-${normalized}`;
          const hasSameNameInAnotherSection = duplicatedProductImageKeys.has(normalized);
          const staticImage = item.imagen || (item.imagenKey ? availableProductImages[item.imagenKey] : null);
          const legacyImage = hasSameNameInAnotherSection
            ? null
            : supabasePhotos[normalized] || imagenesSupabase[normalized];
          const imagen = supabasePhotos[scopedImageKey]
            || imagenesSupabase[scopedImageKey]
            || legacyImage
            || staticImage
            || resolveSharedProductImage(
              itemKey,
              availableProductImages,
              sectionProductImageKeys[catIdx],
              !hasSameNameInAnotherSection
            );
          const isUploading = uploading === scopedImageKey;
          const isEditingName = editingKey === mkKey(catIdx, subIdx, grpIdx, i, "nombre");
          const isEditingPrice = editingKey === mkKey(catIdx, subIdx, grpIdx, i, "precio");
          const esDestacado = getDestacados().includes(destacadoKey(item));
          const reorderContainer = `items-${catIdx}-${subIdx ?? "root"}-${grpIdx ?? "root"}`;
          const isDraggingItem = dragging?.type === "item"
            && dragging?.container === reorderContainer
            && dragging?.index === i;

          return (
            <li
              key={normalized}
              data-reorder-container={reorderContainer}
              data-reorder-index={i}
              className={`flex items-center gap-3 border-b border-tinta/10 ${noImages ? "py-2.5" : "py-3"} transition ${isDraggingItem ? "bg-hoja/20 opacity-60" : ""}`}
            >
              {adminEditing && dragHandle({
                type: "item", container: reorderContainer, index: i, total: items.length, catIdx, subIdx, grpIdx,
              }, lang === "es" ? "Arrastrar producto" : "Drag product")}
              {isAdmin && (
                <button type="button" onClick={() => toggleDestacado(item)}
                  className={`shrink-0 rounded p-1 transition ${esDestacado ? "text-oliva-hondo" : "text-grafito/35 hover:text-oliva-hondo"}`}
                  title={esDestacado ? (lang === "es" ? "Quitar recomendado" : "Remove recommendation") : (lang === "es" ? "Recomendar" : "Recommend")}>
                  <Star className="size-4" fill={esDestacado ? "currentColor" : "none"} aria-hidden="true" strokeWidth={2} />
                </button>
              )}
              {!noImages && (imagen || editMode || isUploading) && (
                <div className="relative size-[4.5rem] shrink-0 overflow-hidden rounded-md bg-cal">
                  {imagen ? (
                    <button type="button" onClick={() => editMode ? openUploadMenu(scopedImageKey) : setSelectedImage({ src: imagen, alt: item.nombre[lang] })}
                      className="block size-full cursor-zoom-in focus-visible:outline-offset-[-3px]" aria-label={editMode ? (lang === "es" ? "Cambiar foto" : "Change photo") : `${lang === "es" ? "Ver foto" : "View photo"}: ${item.nombre[lang]}`}>
                      <img src={miniatura(imagen)} alt="" loading="lazy" decoding="async" width="216" height="216" className="size-full object-cover" />
                    </button>
                  ) : editMode ? (
                    <button type="button" onClick={() => openUploadMenu(scopedImageKey)} className="flex size-full flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold text-grafito hover:bg-tinta/5">
                      <Camera className="size-5" aria-hidden="true" strokeWidth={2} />{lang === "es" ? "Añadir" : "Add"}
                    </button>
                  ) : null}
                  {(editMode && imagen) || isUploading ? (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-tinta/45 text-pared">
                      {isUploading ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Camera className="size-5" aria-hidden="true" strokeWidth={2} />}
                    </span>
                  ) : null}
                </div>
              )}

              <div className="min-w-0 flex-1">
                {isEditingName ? (
                  <div className="flex flex-col gap-1">
                    <input className="rounded border border-tinta/30 px-2 py-1 text-sm" value={editNombreES} onChange={(e) => handleEditNombreESChange(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingKey(null); }} />
                    <input className="rounded border border-tinta/30 px-2 py-1 text-sm" value={editNombreEN} onChange={(e) => setEditNombreEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingKey(null); }} />
                    <div className="mt-1 flex gap-1">
                      <button type="button" onClick={saveEdit} className="rounded bg-oliva-hondo px-2 py-0.5 text-xs font-semibold text-pared">OK</button>
                      <button type="button" onClick={() => setEditingKey(null)} className="rounded bg-cal px-2 py-0.5 text-xs">×</button>
                    </div>
                  </div>
                ) : adminEditing ? (
                  <button type="button" onClick={() => startEdit(catIdx, subIdx, grpIdx, i, "nombre")} className={`break-words text-left font-medium leading-snug ${textoEditable}`}>
                    {item.nombre[lang]}
                  </button>
                ) : (
                  <p className="break-words font-medium leading-snug">{item.nombre[lang]}</p>
                )}
                {esDestacado && !isEditingName && (
                  <p className="mt-0.5 text-sm font-semibold text-oliva-hondo">{lang === "es" ? "Te recomendamos" : "We recommend"}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {isEditingPrice ? (
                  <input className="w-28 rounded border border-tinta/30 px-2 py-1 text-right text-sm" value={editPrecio} onChange={(e) => setEditPrecio(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingKey(null); }} onBlur={saveEdit} />
                ) : adminEditing ? (
                  <button type="button" onClick={() => startEdit(catIdx, subIdx, grpIdx, i, "precio")} className={`cifras whitespace-nowrap font-bold ${textoEditable}`}>{item.precio}</button>
                ) : (
                  !preciosOcultos && <span className="cifras whitespace-nowrap font-bold">{item.precio}</span>
                )}
                {adminEditing && !isEditingName && !isEditingPrice && (
                  <button type="button" onClick={() => handleDeleteItem(catIdx, subIdx, grpIdx, i)}
                    className="rounded-full p-1.5 text-banderilla transition hover:bg-banderilla/10" title={lang === "es" ? "Eliminar" : "Delete"}>
                    <Trash2 className="size-4" aria-hidden="true" strokeWidth={2} />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {adminEditing && (
        <button type="button" onClick={() => handleAddItem(catIdx, subIdx, grpIdx)}
          className="mt-3 w-full rounded-md border-2 border-dashed border-tinta/25 py-2.5 text-sm font-semibold text-grafito transition hover:border-tinta">
          + {lang === "es" ? "Añadir producto" : "Add product"}
        </button>
      )}
    </div>
  );

  const renderSubcategoriaPlegable = (categoria, catIdx, subcategoria, subIndex) => {
    const isSubOpen = openSubsections[subcategoria.id];
    const subcategoryContainer = `subcategories-${categoria.id}`;
    const isDraggingSubcategory = dragging?.type === "subcategory"
      && dragging?.container === subcategoryContainer
      && dragging?.index === subIndex;
    const { imagen } = sectionImage(subcategoria, categoria);
    const panelId = `${subcategoria.id}-panel`;
    return (
      <div key={subcategoria.id} id={subcategoria.id} data-reorder-container={subcategoryContainer} data-reorder-index={subIndex}
        className={`scroll-mt-32 border-b border-tinta/15 transition ${isDraggingSubcategory ? "bg-hoja/20 opacity-60" : ""}`}>
        <div className="flex items-center gap-2">
          {adminEditing && dragHandle({
            type: "subcategory", container: subcategoryContainer, index: subIndex, total: categoria.subcategorias.length, catIdx,
          }, lang === "es" ? "Arrastrar subsección" : "Drag subsection")}
          <button type="button" onClick={() => toggleSubsection(subcategoria.id)} aria-expanded={!!isSubOpen} aria-controls={panelId}
            className="flex min-h-16 flex-1 items-center justify-between gap-4 py-3 text-left">
            <h3 className="ancho-pared text-2xl font-semibold leading-tight md:text-3xl">{subcategoria.nombre[lang]}</h3>
            <span className="flex items-center gap-3">
              {imagen && !isSubOpen && <img src={imagen} alt="" loading="lazy" decoding="async" className="hidden h-12 w-16 rounded object-cover sm:block" />}
              <ChevronDown className={`size-5 shrink-0 transition-transform duration-300 ${isSubOpen ? "rotate-180" : ""}`} aria-hidden="true" strokeWidth={2} />
            </span>
          </button>
        </div>
        {isSubOpen && (
          <div id={panelId} className="pb-6">
            {editMode && renderSectionBanner(subcategoria, categoria)}
            {subcategoria.grupos ? (
              <div className="flex flex-col gap-6">
                {subcategoria.grupos.map((grupo, grupoIndex) => {
                  const groupContainer = `groups-${catIdx}-${subIndex}`;
                  const isDraggingGroup = dragging?.type === "group"
                    && dragging?.container === groupContainer
                    && dragging?.index === grupoIndex;
                  return (
                    <div key={normalizeKey(grupo.nombre.es)} data-reorder-container={groupContainer} data-reorder-index={grupoIndex}
                      className={`transition ${isDraggingGroup ? "bg-hoja/20 opacity-60" : ""}`}>
                      <div className="mb-1 flex items-center gap-2">
                        {adminEditing && dragHandle({
                          type: "group", container: groupContainer, index: grupoIndex, total: subcategoria.grupos.length, catIdx, subIdx: subIndex,
                        }, lang === "es" ? "Arrastrar grupo" : "Drag group")}
                        <h4 className="text-lg font-bold text-oliva-hondo">{grupo.nombre[lang]}</h4>
                      </div>
                      {renderItems(grupo.items, catIdx, subIndex, grupoIndex, categoria.noImages)}
                    </div>
                  );
                })}
              </div>
            ) : renderItems(subcategoria.items, catIdx, subIndex, null, categoria.noImages)}
          </div>
        )}
      </div>
    );
  };

  const renderSubcategoriaFija = (categoria, catIdx, subcategoria, subIndex) => {
    const subcategoryContainer = `subcategories-${categoria.id}`;
    const isDraggingSubcategory = dragging?.type === "subcategory"
      && dragging?.container === subcategoryContainer
      && dragging?.index === subIndex;
    return (
      <div key={subcategoria.id} id={subcategoria.id} data-reorder-container={subcategoryContainer} data-reorder-index={subIndex}
        className={`scroll-mt-32 transition ${isDraggingSubcategory ? "bg-hoja/20 opacity-60" : ""}`}>
        <div className="mb-2 flex items-center gap-2">
          {adminEditing && dragHandle({
            type: "subcategory", container: subcategoryContainer, index: subIndex, total: categoria.subcategorias.length, catIdx,
          }, lang === "es" ? "Arrastrar subsección" : "Drag subsection")}
          <h3 className="text-xl font-bold text-oliva-hondo md:text-2xl">{subcategoria.nombre[lang]}</h3>
        </div>
        {renderItems(subcategoria.items, catIdx, subIndex, null, categoria.noImages)}
      </div>
    );
  };

  const botonesAdmin = isAdmin && (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => setEditMode((v) => !v)} title={editMode ? "Salir de edición de fotos" : "Editar fotos"}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${editMode ? "border-tinta bg-tinta text-pared" : "border-tinta/15 hover:border-tinta"}`}>
        <Camera className="size-4" aria-hidden="true" strokeWidth={2} /><span className="hidden md:inline">Fotos</span>
      </button>
      <button type="button" onClick={() => setAdminEditMode((v) => !v)} title={adminEditMode ? "Salir de edición de productos" : "Editar productos"}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${adminEditMode ? "border-tinta bg-tinta text-pared" : "border-tinta/15 hover:border-tinta"}`}>
        <Pencil className="size-4" aria-hidden="true" strokeWidth={2} /><span className="hidden md:inline">Productos</span>
      </button>
      <button type="button" onClick={handleExitAdmin} title="Salir de admin"
        className="inline-flex items-center rounded-full border border-banderilla/30 p-2 text-banderilla transition-colors hover:bg-banderilla hover:text-pared">
        <LogOut className="size-4" aria-hidden="true" strokeWidth={2} />
      </button>
    </div>
  );

  const selectorIdioma = (
    <div role="group" aria-label={lang === "es" ? "Idioma" : "Language"} className="inline-flex rounded-full border border-tinta/15 p-0.5 text-sm font-semibold">
      {["es", "en"].map((codigo) => (
        <button key={codigo} type="button" onClick={() => setLang(codigo)} aria-pressed={lang === codigo}
          aria-label={codigo === "en" ? "EN — English" : "ES — Español"}
          className={`min-w-11 rounded-full px-3 py-1.5 transition-colors ${lang === codigo ? "bg-tinta text-pared" : "text-grafito hover:text-tinta"}`}>
          {codigo.toUpperCase()}
        </button>
      ))}
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
          <div className="flex items-center gap-2">
            <div className="hidden md:block">{botonesAdmin}</div>
            {selectorIdioma}
          </div>
        </div>
        {isAdmin && (
          <div className="border-t border-tinta/10 bg-cal">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2 md:px-8">
              <Link to="/admin/asistente" className="rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-pared no-underline">Pedir cambios con el asistente</Link>
              <div className="md:hidden">{botonesAdmin}</div>
              {(syncError || menuDocument.error || menuDocument.saving) && (
                <p className={`text-sm font-semibold ${syncError || menuDocument.error ? "text-banderilla" : "text-grafito"}`} role="status">
                  {syncError || menuDocument.error || "Guardando cambios…"}
                </p>
              )}
            </div>
          </div>
        )}
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
        {avisoPrecios && <p role="status" className="mt-3 rounded-md border border-tinta/20 bg-cal px-4 py-3 text-sm font-semibold">{avisoPrecios}</p>}
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
        {adminEditing && (
          <p className="mt-6 rounded-md border border-tinta/15 bg-cal px-4 py-3 text-sm font-medium text-grafito">
            {lang === "es"
              ? "Mantén pulsado el tirador y arrastra para cambiar el orden. También puedes enfocarlo y usar las flechas ↑ y ↓."
              : "Hold the handle and drag to reorder. You can also focus it and use the ↑ and ↓ arrow keys."}
          </p>
        )}

        {menuDataConId.map((categoria, catIdx) => {
          const isDraggingCategory = dragging?.type === "category" && dragging?.index === catIdx;
          return (
            <section key={categoria.id} id={categoria.id} data-reorder-container="categories" data-reorder-index={catIdx}
              aria-labelledby={`${categoria.id}-titulo`} style={{ scrollMarginTop: altoPestanas + 8 }}
              className={`pt-4 transition md:pt-16 ${isDraggingCategory ? "opacity-60" : ""}`}>
              <div className="mb-3 flex items-center gap-2 border-b-2 border-tinta pb-2 md:mb-5 md:pb-3">
                {adminEditing && dragHandle({
                  type: "category", container: "categories", index: catIdx, total: menuDataConId.length,
                }, lang === "es" ? "Arrastrar sección" : "Drag section")}
                <h2 id={`${categoria.id}-titulo`} className="ancho-pared text-4xl font-semibold leading-none tracking-[-0.01em] md:text-6xl">{categoria.nombre[lang]}</h2>
              </div>
              {!categoria.subcategoriasPlegables && renderSectionBanner(categoria)}
              {categoria.subcategorias ? (
                categoria.subcategoriasPlegables ? (
                  <div className="border-t border-tinta/15">
                    {categoria.subcategorias.map((subcategoria, subIndex) => renderSubcategoriaPlegable(categoria, catIdx, subcategoria, subIndex))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    {categoria.subcategorias.map((subcategoria, subIndex) => renderSubcategoriaFija(categoria, catIdx, subcategoria, subIndex))}
                  </div>
                )
              ) : renderItems(categoria.items, catIdx, null, null, categoria.noImages)}
            </section>
          );
        })}

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

      {isAdmin && (
        <>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture className="hidden" onChange={handleFileChange} />
        </>
      )}

      {uploadMenu && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-tinta/50 p-4" onClick={() => setUploadMenu(null)}>
          <div className="w-full max-w-sm overflow-hidden rounded-xl bg-pared pb-2" onClick={(e) => e.stopPropagation()}>
            <p className="border-b border-tinta/10 py-4 text-center text-sm font-semibold">{lang === "es" ? "Añadir o cambiar foto" : "Add or change photo"}</p>
            <button type="button" onClick={() => handleMenuOption("camera")} className="flex w-full items-center gap-4 border-b border-tinta/10 px-6 py-4 font-medium active:bg-cal">
              <Camera className="size-5" aria-hidden="true" strokeWidth={2} />{lang === "es" ? "Cámara" : "Camera"}
            </button>
            <button type="button" onClick={() => handleMenuOption("gallery")} className="flex w-full items-center gap-4 border-b border-tinta/10 px-6 py-4 font-medium active:bg-cal">
              <ImageIcon className="size-5" aria-hidden="true" strokeWidth={2} />{lang === "es" ? "Galería / Archivos" : "Gallery / Files"}
            </button>
            <button type="button" onClick={() => setUploadMenu(null)} className="w-full py-4 text-sm text-grafito active:bg-cal">{lang === "es" ? "Cancelar" : "Cancel"}</button>
          </div>
        </div>
      )}

      <Lightbox open={!!selectedImage} close={() => setSelectedImage(null)}
        slides={selectedImage ? [{ src: selectedImage.src, alt: selectedImage.alt }] : []}
        render={{ buttonPrev: () => null, buttonNext: () => null }} carousel={{ finite: true }}
        labels={{ Close: lang === "es" ? "Cerrar" : "Close" }} />
    </div>
  );
}
