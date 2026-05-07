import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import logoImg from "../assets/logo.png";
import lasPalmasImg from "../assets/laspalmas.jpg";
import galdarImg from "../assets/galdar.jpg";
import teldeImg from "../assets/telde.jpg";
import heroImg from "../assets/hero.jpg";
import espanaImg from "../assets/españa.jpg";
import inglaterraImg from "../assets/inglaterra.jpg";
import { imagenesProductos } from "../data/imagenesProductos";
import { translateProductName, translateProductNameOnline } from "../lib/productTranslation";
import { normalizeKey, supabase } from "../lib/supabase";

const textosBase = {
  es: {
    inicio: "Inicio", nosotros: "Nosotros", productos: "Productos", puestos: "Puestos", contacto: "Contacto",
    subtitulo: "Canarias · Tapas · Aceitunas", titulo: "Tapas, aceitunas y sabor tradicional",
    descripcion: "En Encurtidos Antequera llevamos el sabor de siempre a nuestros puestos con una selección de encurtidos, aceitunas y tapas pensadas para disfrutar.",
    verPuestos: "Ver puestos", contactar: "Contactar", quienesSomos: "Quiénes somos",
    quienesTexto: "En Encurtidos Antequera ofrecemos una selección de aceitunas, encurtidos y tapas con sabor tradicional. Apostamos por un producto cercano, sencillo y de calidad, pensado para disfrutar en cualquiera de nuestros puestos.",
    nuestrosProductos: "Nuestros productos",
    productosTexto: "Una propuesta pensada para compartir, picar algo y disfrutar del sabor tradicional.",
    nuestrosPuestos: "Nuestros puestos", puestosTexto: "Puedes encontrarnos en estos tres puntos.",
    verUbicacion: "Ver ubicación", verCarta: "Ver carta",
    contactoTitulo: "Contacto", contactoTexto: "Escríbenos para más información o consultas.",
    telefono: "Teléfono", correo: "Correo", idioma: "Idioma", menu: "Menú", horario: "Horario", hoy: "Hoy",
    empleoTitulo: "Buscamos trabajadores", empleoTexto: "Si te apetece formar parte del equipo, envíanos tu currículum por correo y nos pondremos en contacto contigo.",
    enviarCV: "Enviar currículum",
  },
  en: {
    inicio: "Home", nosotros: "About us", productos: "Products", puestos: "Locations", contacto: "Contact",
    subtitulo: "Canary Islands · Tapas · Olives", titulo: "Tapas, olives and traditional flavour",
    descripcion: "At Encurtidos Antequera we bring traditional flavour to our stands with a selection of pickles, olives and tapas made to enjoy.",
    verPuestos: "View locations", contactar: "Contact", quienesSomos: "About us",
    quienesTexto: "At Encurtidos Antequera we offer a selection of olives, pickles and tapas with a traditional flavour. We focus on close, simple and quality products, made to be enjoyed at any of our stands.",
    nuestrosProductos: "Our products",
    productosTexto: "A selection made for sharing, snacking and enjoying traditional flavour.",
    nuestrosPuestos: "Our locations", puestosTexto: "You can find us at these three locations.",
    verUbicacion: "View location", verCarta: "View menu",
    contactoTitulo: "Contact", contactoTexto: "Write to us for more information or enquiries.",
    telefono: "Phone", correo: "Email", idioma: "Language", menu: "Menu", horario: "Opening hours", hoy: "Today",
    empleoTitulo: "We are hiring", empleoTexto: "If you would like to join the team, send us your CV by email and we will get in touch.",
    enviarCV: "Send CV",
  },
};

const productosBase = [
  { nombre: { es: "Aceitunas variadas", en: "Mixed olives" }, items: [{ nombre: { es: "Aceitunas variadas", en: "Mixed olives" }, imagenKey: "queso-ahumado-arandanos" }] },
  { nombre: { es: "Encurtidos", en: "Pickles" }, items: [{ nombre: { es: "Encurtidos", en: "Pickles" }, imagenKey: "ensalada-cangrejo-picar" }] },
  { nombre: { es: "Banderillas", en: "Skewers" }, items: [{ nombre: { es: "Banderillas", en: "Skewers" }, imagenKey: "atun-anchoas" }] },
  { nombre: { es: "Tapas tradicionales", en: "Traditional tapas" }, items: [{ nombre: { es: "Tapas tradicionales", en: "Traditional tapas" }, imagenKey: "tortilla" }] },
  { nombre: { es: "Especialidades de la casa", en: "House specials" }, items: [{ nombre: { es: "Especialidades de la casa", en: "House specials" }, imagenKey: "pollo-kentucky" }] },
  { nombre: { es: "Raciones para compartir", en: "Sharing portions" }, items: [{ nombre: { es: "Raciones para compartir", en: "Sharing portions" }, imagenKey: "papas-bravas" }] },
];

function compressToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Formato de imagen no soportado"));
      img.onload = () => {
        try {
          const MAX = 1200;
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

function normalizeProductos(data) {
  if (Array.isArray(data)) {
    return data.map((producto, idx) => {
      const nombre = producto?.nombre || { es: `Producto ${idx + 1}`, en: `Product ${idx + 1}` };
      const items = producto?.items?.length
        ? producto.items.map((item) => ({ nombre: item.nombre || nombre, imagenKey: item.imagenKey || null, imagen: item.imagen || null }))
        : [{ nombre, imagenKey: producto?.imagenKey || null, imagen: producto?.imagen || null }];
      return { nombre, items };
    });
  }
  if (data?.es && data?.en) {
    return data.es.map((es, idx) => ({
      nombre: { es, en: data.en[idx] || es },
      items: [{ nombre: { es, en: data.en[idx] || es }, imagenKey: productosBase[idx]?.items?.[0]?.imagenKey || null }],
    }));
  }
  return JSON.parse(JSON.stringify(productosBase));
}

function normalizeTextos(data) {
  return {
    es: { ...textosBase.es, ...(data?.es || {}) },
    en: { ...textosBase.en, ...(data?.en || {}) },
  };
}

const puestosBase = [
  {
    nombre: { es: "Las Palmas", en: "Las Palmas" },
    descripcion: { es: "Puesto con nuestra selección de aceitunas, encurtidos y tapas tradicionales.", en: "Stand with our selection of olives, pickles and traditional tapas." },
    mapa: "https://maps.app.goo.gl/R18Khz2ULXaL5vcc7", rutaCarta: "/carta-las-palmas", imagen: lasPalmasImg,
    horario: {
      es: [{ dia: "Lunes", hora: "11:00 - 16:00" }, { dia: "Martes", hora: "11:00 - 24:00" }, { dia: "Miércoles", hora: "11:00 - 24:00" }, { dia: "Jueves", hora: "11:00 - 24:00" }, { dia: "Viernes", hora: "11:00 - 24:00" }, { dia: "Sábado", hora: "11:00 - 24:00" }, { dia: "Domingo", hora: "11:00 - 17:00" }],
      en: [{ dia: "Monday", hora: "11:00 - 16:00" }, { dia: "Tuesday", hora: "11:00 - 24:00" }, { dia: "Wednesday", hora: "11:00 - 24:00" }, { dia: "Thursday", hora: "11:00 - 24:00" }, { dia: "Friday", hora: "11:00 - 24:00" }, { dia: "Saturday", hora: "11:00 - 24:00" }, { dia: "Sunday", hora: "11:00 - 17:00" }],
    },
  },
  {
    nombre: { es: "Gáldar", en: "Gáldar" },
    descripcion: { es: "Un espacio donde disfrutar del sabor de siempre con producto cercano y cuidado.", en: "A place to enjoy traditional flavour with local and carefully selected products." },
    mapa: "https://maps.app.goo.gl/ACi1i4GrA85HnbZAA", rutaCarta: "/carta-galdar", imagen: galdarImg,
    horario: {
      es: [{ dia: "Lunes", hora: "Cerrado" }, { dia: "Martes", hora: "11:00 - 22:00" }, { dia: "Miércoles", hora: "11:00 - 22:00" }, { dia: "Jueves", hora: "11:00 - 22:00" }, { dia: "Viernes", hora: "12:00 - 24:00" }, { dia: "Sábado", hora: "12:00 - 24:00" }, { dia: "Domingo", hora: "12:00 - 17:00" }],
      en: [{ dia: "Monday", hora: "Closed" }, { dia: "Tuesday", hora: "11:00 - 22:00" }, { dia: "Wednesday", hora: "11:00 - 22:00" }, { dia: "Thursday", hora: "11:00 - 22:00" }, { dia: "Friday", hora: "12:00 - 24:00" }, { dia: "Saturday", hora: "12:00 - 24:00" }, { dia: "Sunday", hora: "12:00 - 17:00" }],
    },
  },
  {
    nombre: { es: "Telde", en: "Telde" },
    descripcion: { es: "Nuestra propuesta con el sabor de siempre, ideal para probar nuestras especialidades.", en: "Our traditional selection, ideal for trying our specialties." },
    mapa: "https://maps.app.goo.gl/iRxEPQPSHbNWSf5L6", rutaCarta: "/carta-telde", imagen: teldeImg,
    horario: {
      es: [{ dia: "Lunes", hora: "10:00 - 23:00" }, { dia: "Martes", hora: "10:00 - 23:00" }, { dia: "Miércoles", hora: "10:00 - 23:00" }, { dia: "Jueves", hora: "10:00 - 23:00" }, { dia: "Viernes", hora: "10:00 - 02:00" }, { dia: "Sábado", hora: "10:00 - 02:00" }, { dia: "Domingo", hora: "12:00 - 22:00" }],
      en: [{ dia: "Monday", hora: "10:00 - 23:00" }, { dia: "Tuesday", hora: "10:00 - 23:00" }, { dia: "Wednesday", hora: "10:00 - 23:00" }, { dia: "Thursday", hora: "10:00 - 23:00" }, { dia: "Friday", hora: "10:00 - 02:00" }, { dia: "Saturday", hora: "10:00 - 02:00" }, { dia: "Sunday", hora: "12:00 - 22:00" }],
    },
  },
];

async function sbUpsert(table, data, conflict) {
  try {
    const { supabase } = await import("../lib/supabase");
    const { error } = await supabase.from(table).upsert(data, { onConflict: conflict });
    return error || null;
  } catch {
    return new Error("No se pudo conectar con Supabase");
  }
}

async function sbFetch(table, select, filter) {
  try {
    const { supabase } = await import("../lib/supabase");
    const query = supabase.from(table).select(select);
    if (filter) query.eq(filter.field, filter.value);
    const { data, error } = await query;
    return { data, error };
  } catch (e) { return { data: null, error: e }; }
}

function EditInputs({ esVal, enVal, setEsVal, setEnVal, onSave, onCancel, autoTranslate = false }) {
  const translationRunRef = useRef(0);
  const handleEsChange = (value) => {
    setEsVal(value);
    if (!autoTranslate) return;
    const run = translationRunRef.current + 1;
    translationRunRef.current = run;
    setEnVal(translateProductName(value));
    translateProductNameOnline(value).then((translated) => {
      if (translationRunRef.current === run) setEnVal(translated);
    });
  };
  const handleEnChange = (value) => {
    setEnVal(value);
  };

  return (
    <div className="flex flex-col gap-1">
      <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={esVal} onChange={(e) => handleEsChange(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel(); }} />
      <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={enVal} onChange={(e) => handleEnChange(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel(); }} />
      <div className="flex gap-1">
        <button onClick={onSave} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
        <button onClick={onCancel} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProductos, setOpenProductos] = useState({});
  const [homePhotos, setHomePhotos] = useState({});
  const [uploadingImage, setUploadingImage] = useState(null);
  const [uploadMenu, setUploadMenu] = useState(null);
  const [remoteReady, setRemoteReady] = useState(false);
  const [syncError, setSyncError] = useState("");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const pendingImageKeyRef = useRef(null);

  const [isAdmin] = useState(() => localStorage.getItem("encurtidos_admin") === "true");
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const [editES, setEditES] = useState("");
  const [editEN, setEditEN] = useState("");

  const [textos, setTextos] = useState(() => {
    const s = localStorage.getItem("encurtidos_home_textos");
    if (s) { try { return normalizeTextos(JSON.parse(s)); } catch { return JSON.parse(JSON.stringify(textosBase)); } }
    return JSON.parse(JSON.stringify(textosBase));
  });
  const [productos, setProductos] = useState(() => {
    const s = localStorage.getItem("encurtidos_home_productos");
    if (s) { try { return normalizeProductos(JSON.parse(s)); } catch { return JSON.parse(JSON.stringify(productosBase)); } }
    return JSON.parse(JSON.stringify(productosBase));
  });
  const [puestos, setPuestos] = useState(() => {
    const s = localStorage.getItem("encurtidos_home_puestos");
    if (s) {
      try {
        const parsed = JSON.parse(s);
        return parsed.map((p, i) => ({ ...puestosBase[i], ...p, imagen: puestosBase[i]?.imagen || p.imagen }));
      } catch {
        return JSON.parse(JSON.stringify(puestosBase));
      }
    }
    return JSON.parse(JSON.stringify(puestosBase));
  });

  useEffect(() => { localStorage.setItem("lang", lang); }, [lang]);

  useEffect(() => {
    localStorage.setItem("encurtidos_home_textos", JSON.stringify(textos));
    if (!remoteReady) return;
    sbUpsert("home_json", { section: "textos", data: textos, updated_at: new Date().toISOString() }, "section")
      .then((error) => setSyncError(error ? "No se han podido guardar los cambios en la web pública. Revisa Supabase o la conexión." : ""));
  }, [textos, remoteReady]);
  useEffect(() => {
    localStorage.setItem("encurtidos_home_productos", JSON.stringify(productos));
    if (!remoteReady) return;
    sbUpsert("home_json", { section: "productos", data: productos, updated_at: new Date().toISOString() }, "section")
      .then((error) => setSyncError(error ? "No se han podido guardar los productos en la web pública. Revisa Supabase o la conexión." : ""));
  }, [productos, remoteReady]);
  useEffect(() => {
    const sinImagenes = puestos.map((puesto) => {
      const rest = { ...puesto };
      delete rest.imagen;
      return rest;
    });
    localStorage.setItem("encurtidos_home_puestos", JSON.stringify(sinImagenes));
    if (!remoteReady) return;
    sbUpsert("home_json", { section: "puestos", data: sinImagenes, updated_at: new Date().toISOString() }, "section")
      .then((error) => setSyncError(error ? "No se han podido guardar los puestos en la web pública. Revisa Supabase o la conexión." : ""));
  }, [puestos, remoteReady]);
  useEffect(() => {
    (async () => {
      const { data, error } = await sbFetch("home_json", "section, data");
      if (error || !data) {
        setRemoteReady(true);
        return;
      }
      data.forEach(({ section, data: d }) => {
        if (section === "textos") {
          const normalized = normalizeTextos(d);
          setTextos(normalized);
          localStorage.setItem("encurtidos_home_textos", JSON.stringify(normalized));
        }
        else if (section === "productos") {
          const normalized = normalizeProductos(d);
          setProductos(normalized);
          localStorage.setItem("encurtidos_home_productos", JSON.stringify(normalized));
        }
        else if (section === "puestos") {
          const conImagenes = d.map((p, i) => ({ ...puestosBase[i], ...p, imagen: puestosBase[i]?.imagen || p.imagen }));
          setPuestos(conImagenes);
          localStorage.setItem("encurtidos_home_puestos", JSON.stringify(d.map((puesto) => {
            const rest = { ...puesto };
            delete rest.imagen;
            return rest;
          })));
        }
      });
      setRemoteReady(true);
    })();
  }, []);

  useEffect(() => {
    supabase.from("fotos_carta").select("item_key, photo_data").then(({ data, error }) => {
      if (error || !data) return;
      const photos = {};
      data.forEach(({ item_key, photo_data }) => {
        if (item_key.startsWith("home-")) photos[item_key] = photo_data;
      });
      setHomePhotos(photos);
    });
  }, []);

  const t = textos[lang];

  const startEdit = (key, esVal, enVal) => { setEditKey(key); setEditES(esVal); setEditEN(enVal); };
  const saveText = (key) => { if (!key) return; setTextos(p => ({ ...p, es: { ...p.es, [key]: editES }, en: { ...p.en, [key]: editEN } })); setEditKey(null); };
  const saveProducto = (idx) => { setProductos(p => p.map((v, i) => i === idx ? { ...v, nombre: { es: editES, en: editEN } } : v)); setEditKey(null); };
  const saveProductoItem = (idx, itemIdx) => {
    setProductos(p => p.map((producto, i) => {
      if (i !== idx) return producto;
      return {
        ...producto,
        items: producto.items.map((item, j) => j === itemIdx ? { ...item, nombre: { es: editES, en: editEN } } : item),
      };
    }));
    setEditKey(null);
  };
  const addProducto = () => {
    setProductos(p => [...p, { nombre: { es: "Nuevo desplegable", en: "New section" }, items: [{ nombre: { es: "Nuevo producto", en: "New product" }, imagenKey: null }] }]);
    setOpenProductos(p => ({ ...p, [productos.length]: true }));
  };
  const addProductoItem = (idx) => {
    setProductos(p => p.map((producto, i) => i === idx ? {
      ...producto,
      items: [...producto.items, { nombre: { es: "Nuevo producto", en: "New product" }, imagenKey: null }],
    } : producto));
    setOpenProductos(p => ({ ...p, [idx]: true }));
  };
  const deleteProducto = (idx) => { if (!confirm("¿Eliminar este desplegable?")) return; setProductos(p => p.filter((_, i) => i !== idx)); };
  const deleteProductoItem = (idx, itemIdx) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setProductos(p => p.map((producto, i) => i === idx ? { ...producto, items: producto.items.filter((_, j) => j !== itemIdx) } : producto));
  };
  const savePuesto = (idx, field) => { setPuestos(p => { const c = JSON.parse(JSON.stringify(p)); c[idx][field] = { es: editES, en: editEN }; return c; }); setEditKey(null); };
  const imageKey = (key) => `home-${normalizeKey(key)}`;
  const getImage = (key, fallback) => homePhotos[imageKey(key)] || fallback;
  const openImageUpload = (key) => isAdmin && editMode && setUploadMenu(key);
  const handleMenuOption = (type) => {
    pendingImageKeyRef.current = uploadMenu;
    setUploadMenu(null);
    if (type === "camera") cameraInputRef.current?.click();
    else fileInputRef.current?.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    const key = pendingImageKeyRef.current;
    if (!file || !key) return;
    e.target.value = "";
    const normalized = imageKey(key);
    let dataUrl;
    try { dataUrl = await compressToDataUrl(file); } catch (err) { alert(`Error al procesar la imagen: ${err.message}`); return; }
    setHomePhotos((prev) => ({ ...prev, [normalized]: dataUrl }));
    setUploadingImage(normalized);
    try {
      const { error } = await supabase.from("fotos_carta").upsert(
        { item_key: normalized, photo_data: dataUrl, updated_at: new Date().toISOString() },
        { onConflict: "item_key" }
      );
      if (error) throw error;
    } catch (err) {
      alert(`No se pudo guardar la foto.\n\nError: ${err.message}`);
    } finally {
      setUploadingImage(null);
      pendingImageKeyRef.current = null;
    }
  };

  const tEdit = (key) => editKey === key ? (
    <EditInputs esVal={editES} enVal={editEN} setEsVal={setEditES} setEnVal={setEditEN} onSave={() => saveText(key)} onCancel={() => setEditKey(null)} />
  ) : null;

  const editBtn = (key, esVal, enVal) => editMode ? { onClick: () => startEdit(key, esVal, enVal), className: "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" } : {};

  const closeMenu = () => setMenuOpen(false);

  const todayIndex = useMemo(() => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#4E3B2A]">
      <header className="sticky top-0 z-50 bg-[#D9C3A3]/98 backdrop-blur border-b border-[#B78B5A]/25 shadow-sm">
        <nav className="max-w-6xl mx-auto px-4 md:px-6 h-24 md:h-28 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logoImg} alt="Logo Encurtidos Antequera" className="h-14 md:h-20 w-auto object-contain" />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-6 font-medium items-center">
              <a href="#inicio" className="hover:text-[#7A5530] transition">{t.inicio}</a>
              <a href="#nosotros" className="hover:text-[#7A5530] transition">{t.nosotros}</a>
              <a href="#productos" className="hover:text-[#7A5530] transition">{t.productos}</a>
              <a href="#puestos" className="hover:text-[#7A5530] transition">{t.puestos}</a>
              <a href="#contacto" className="hover:text-[#7A5530] transition">{t.contacto}</a>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button onClick={() => { setEditMode((v) => !v); setEditKey(null); }} title={editMode ? "Salir de edición" : "Editar página"}
                  className={`p-2 rounded-xl border transition ${editMode ? "bg-[#4E3B2A] border-[#4E3B2A] text-white" : "bg-white border-[#B78B5A]/30 text-[#B78B5A]"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              <button onClick={() => setLang("es")} className={`p-1 rounded-xl border transition ${lang === "es" ? "bg-[#7E9f00] border-[#7E9f00]" : "bg-white border-[#B78B5A]/30"}`}>
                <img src={espanaImg} alt="Español" className="w-8 h-5 object-cover rounded-sm" />
              </button>
              <button onClick={() => setLang("en")} className={`p-1 rounded-xl border transition ${lang === "en" ? "bg-[#7E9f00] border-[#7E9f00]" : "bg-white border-[#B78B5A]/30"}`}>
                <img src={inglaterraImg} alt="English" className="w-8 h-5 object-cover rounded-sm" />
              </button>
            </div>
          </div>
          <button onClick={() => setMenuOpen(true)} className="md:hidden flex items-center justify-center w-12 h-12 rounded-2xl border border-[#7A5530]/15 bg-[#7E9f00] shadow-sm hover:opacity-90 transition" aria-label="Abrir menú">
            <div className="flex flex-col justify-center gap-1.5">
              <span className="block w-5 h-0.5 bg-white rounded"></span>
              <span className="block w-5 h-0.5 bg-white rounded"></span>
              <span className="block w-5 h-0.5 bg-white rounded"></span>
            </div>
          </button>
        </nav>
      </header>
      {isAdmin && editMode && syncError && (
        <div className="sticky top-24 md:top-28 z-40 bg-[#B85C38] text-white px-4 py-3 text-sm font-medium text-center">
          {syncError}
        </div>
      )}

      <div className={`md:hidden fixed inset-0 z-[60] ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMenuOpen(false)}></div>
        <aside className={`absolute top-0 right-0 h-full w-[82%] max-w-sm bg-[#EFE7DA] border-l border-[#B78B5A] shadow-2xl transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#B78B5A]/20">
            <span className="text-lg font-bold text-[#4E3B2A]">{t.menu}</span>
            <button onClick={() => setMenuOpen(false)} className="p-2 rounded-xl border border-[#B78B5A]/30 bg-white" aria-label="Cerrar menú">✕</button>
          </div>
          <div className="px-6 py-5 flex flex-col gap-5 font-medium">
            <a href="#inicio" onClick={closeMenu} className="hover:text-[#7A5530] transition">{t.inicio}</a>
            <a href="#nosotros" onClick={closeMenu} className="hover:text-[#7A5530] transition">{t.nosotros}</a>
            <a href="#productos" onClick={closeMenu} className="hover:text-[#7A5530] transition">{t.productos}</a>
            <a href="#puestos" onClick={closeMenu} className="hover:text-[#7A5530] transition">{t.puestos}</a>
            <a href="#contacto" onClick={closeMenu} className="hover:text-[#7A5530] transition">{t.contacto}</a>
            <div className="pt-4 border-t border-[#B78B5A]/20">
              {isAdmin && (
                <div className="mb-4">
                  <button onClick={() => { setEditMode((v) => !v); setEditKey(null); setMenuOpen(false); }}
                    className={`w-full py-2 rounded-xl border transition text-sm ${editMode ? "bg-[#4E3B2A] border-[#4E3B2A] text-white" : "bg-white border-[#B78B5A]/30 text-[#B78B5A]"}`}>
                    {editMode ? "Salir de edición" : "Editar página"}
                  </button>
                </div>
              )}
              <p className="text-sm mb-3 text-[#4E3B2A]/70">{t.idioma}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setLang("es")} className={`p-1 rounded-xl border transition ${lang === "es" ? "bg-[#7E9f00] border-[#7E9f00]" : "bg-white border-[#B78B5A]/30"}`}>
                  <img src={espanaImg} alt="Español" className="w-8 h-5 object-cover rounded-sm" />
                </button>
                <button onClick={() => setLang("en")} className={`p-1 rounded-xl border transition ${lang === "en" ? "bg-[#7E9f00] border-[#7E9f00]" : "bg-white border-[#B78B5A]/30"}`}>
                  <img src={inglaterraImg} alt="English" className="w-8 h-5 object-cover rounded-sm" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section id="inicio" className="scroll-mt-20 px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            {tEdit("subtitulo") || <p {...editBtn("subtitulo", textos.es.subtitulo, textos.en.subtitulo)} className="uppercase tracking-[0.25em] text-sm text-[#A8C66C] mb-4 font-semibold">{t.subtitulo}</p>}
            {tEdit("titulo") || <h2 {...editBtn("titulo", textos.es.titulo, textos.en.titulo)} className="text-4xl md:text-6xl font-bold leading-tight mb-6">{t.titulo}</h2>}
            {tEdit("descripcion") || <p {...editBtn("descripcion", textos.es.descripcion, textos.en.descripcion)} className="text-lg text-[#4E3B2A]/75 mb-8 max-w-xl">{t.descripcion}</p>}
            <div className="flex flex-wrap gap-4">
              <a href="#puestos" className="px-6 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition">{t.verPuestos}</a>
              <a href="#contacto" className="px-6 py-3 rounded-2xl border border-[#B78B5A] text-[#4E3B2A] font-semibold hover:bg-[#B78B5A] hover:text-white transition">{t.contactar}</a>
            </div>
          </div>
          <div className="relative">
            <img src={getImage("hero", heroImg)} alt="Encurtidos Antequera" className="w-full h-[420px] rounded-3xl object-cover shadow-lg" />
            {isAdmin && editMode && (
              <button type="button" onClick={() => openImageUpload("hero")} className="absolute inset-0 rounded-3xl bg-black/35 text-white font-semibold flex items-center justify-center opacity-0 hover:opacity-100 transition">
                Cambiar foto
              </button>
            )}
          </div>
        </div>
      </section>

      <section id="nosotros" className="scroll-mt-20 px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          {tEdit("quienesSomos") || <h3 {...editBtn("quienesSomos", textos.es.quienesSomos, textos.en.quienesSomos)} className="text-4xl font-bold mb-6">{t.quienesSomos}</h3>}
          {tEdit("quienesTexto") || <p {...editBtn("quienesTexto", textos.es.quienesTexto, textos.en.quienesTexto)} className="text-lg text-[#4E3B2A]/75 leading-8">{t.quienesTexto}</p>}
        </div>
      </section>

      <section id="productos" className="scroll-mt-20 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {tEdit("nuestrosProductos") || <h3 {...editBtn("nuestrosProductos", textos.es.nuestrosProductos, textos.en.nuestrosProductos)} className="text-4xl font-bold mb-4">{t.nuestrosProductos}</h3>}
          {tEdit("productosTexto") || <p {...editBtn("productosTexto", textos.es.productosTexto, textos.en.productosTexto)} className="text-[#4E3B2A]/70 mb-10">{t.productosTexto}</p>}
          <div className="grid md:grid-cols-2 gap-6">
            {productos.map((producto, idx) => {
              const isOpen = openProductos[idx] ?? false;
              return (
              <div key={idx} className="bg-white rounded-3xl shadow-sm border border-[#B78B5A]/20 overflow-hidden relative">
                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    {editKey === `prod-${idx}` ? (
                      <EditInputs esVal={editES} enVal={editEN} setEsVal={setEditES} setEnVal={setEditEN} onSave={() => saveProducto(idx)} onCancel={() => setEditKey(null)} autoTranslate />
                    ) : (
                      <h4 onClick={editMode ? () => startEdit(`prod-${idx}`, producto.nombre.es, producto.nombre.en) : undefined} className={`text-lg md:text-xl font-bold text-[#7E9f00] ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded inline-block" : ""}`}>{producto.nombre[lang]}</h4>
                    )}
                  </div>
                  <button type="button" onClick={() => setOpenProductos((prev) => ({ ...prev, [idx]: !isOpen }))} className="w-10 h-10 rounded-xl border border-[#B78B5A]/20 text-2xl font-semibold text-[#B78B5A] leading-none hover:bg-[#F7F3EA] transition" aria-label={isOpen ? "Cerrar producto" : "Abrir producto"}>
                    {isOpen ? "-" : "+"}
                  </button>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {producto.items.map((item, itemIdx) => {
                        const fallbackImg = item.imagen || (item.imagenKey ? imagenesProductos[item.imagenKey] : null);
                        const itemImg = getImage(`producto-${idx}-${itemIdx}`, itemIdx === 0 ? getImage(`producto-${idx}`, fallbackImg) : fallbackImg);
                        const isUploading = uploadingImage === imageKey(`producto-${idx}-${itemIdx}`);
                        return (
                          <div key={itemIdx} className="relative h-64 md:h-72 rounded-2xl overflow-hidden bg-[#F7F3EA] border border-[#B78B5A]/15 flex items-center justify-center">
                            {itemImg ? (
                              <img src={itemImg} alt={item.nombre[lang]} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm text-[#4E3B2A]/45">Foto del producto</span>
                            )}
                            <div className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              {editKey === `prod-${idx}-item-${itemIdx}` ? (
                                <div className="bg-white/95 rounded-2xl p-2">
                                  <EditInputs esVal={editES} enVal={editEN} setEsVal={setEditES} setEnVal={setEditEN} onSave={() => saveProductoItem(idx, itemIdx)} onCancel={() => setEditKey(null)} autoTranslate />
                                </div>
                              ) : (
                                <p onClick={editMode ? () => startEdit(`prod-${idx}-item-${itemIdx}`, item.nombre.es, item.nombre.en) : undefined} className={`inline-block rounded-full bg-white/92 px-4 py-2 text-sm md:text-base font-semibold text-[#4E3B2A] shadow-sm ${editMode ? "cursor-text hover:bg-white" : ""}`}>{item.nombre[lang]}</p>
                              )}
                            </div>
                            {((isAdmin && editMode) || isUploading) && (
                              <button type="button" onClick={() => openImageUpload(`producto-${idx}-${itemIdx}`)} className="absolute top-2 left-2 rounded-xl bg-black/55 px-3 py-2 text-xs text-white font-semibold hover:bg-black/70 transition">
                                {isUploading ? "Guardando..." : "Cambiar foto"}
                              </button>
                            )}
                            {editMode && editKey !== `prod-${idx}-item-${itemIdx}` && (
                              <button onClick={() => deleteProductoItem(idx, itemIdx)} className="absolute top-2 right-2 p-1.5 text-red-500 bg-white/90 hover:text-red-700 hover:bg-red-50 rounded-xl transition" title="Eliminar producto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {editMode && (
                        <button onClick={() => addProductoItem(idx)} className="h-64 md:h-72 rounded-2xl border-2 border-dashed border-[#B78B5A]/40 text-[#B78B5A] font-medium text-sm hover:bg-[#B78B5A]/5 transition flex items-center justify-center">
                          + Añadir producto dentro
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {editMode && editKey !== `prod-${idx}` && (
                  <button onClick={() => deleteProducto(idx)} className="absolute top-2 right-14 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              );
            })}
            {editMode && (
              <button onClick={addProducto} className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#B78B5A]/40 text-[#B78B5A] font-medium text-sm hover:bg-[#B78B5A]/5 transition flex items-center justify-center min-h-[88px]">
                + Añadir producto
              </button>
            )}
          </div>
        </div>
      </section>

      <section id="puestos" className="scroll-mt-20 px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          {tEdit("nuestrosPuestos") || <h3 {...editBtn("nuestrosPuestos", textos.es.nuestrosPuestos, textos.en.nuestrosPuestos)} className="text-4xl font-bold mb-4">{t.nuestrosPuestos}</h3>}
          {tEdit("puestosTexto") || <p {...editBtn("puestosTexto", textos.es.puestosTexto, textos.en.puestosTexto)} className="text-[#4E3B2A]/70 mb-10">{t.puestosTexto}</p>}
          <div className="grid md:grid-cols-3 gap-6">
            {puestos.map((puesto, idx) => {
              const hoy = puesto.horario[lang][todayIndex];
              return (
                <div key={idx} className="rounded-3xl overflow-hidden bg-[#F7F3EA] border border-[#B78B5A]/20 shadow-sm">
                  <div className="relative h-56">
                    <img src={getImage(`puesto-${idx}`, puesto.imagen)} alt={puesto.nombre[lang]} className="w-full h-full object-cover" />
                    {isAdmin && editMode && (
                      <button type="button" onClick={() => openImageUpload(`puesto-${idx}`)} className="absolute inset-0 bg-black/35 text-white font-semibold flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        Cambiar foto
                      </button>
                    )}
                  </div>
                  <div className="p-6">
                    {editKey === `puesto-${idx}-nombre` ? (
                      <EditInputs esVal={editES} enVal={editEN} setEsVal={setEditES} setEnVal={setEditEN} onSave={() => savePuesto(idx, "nombre")} onCancel={() => setEditKey(null)} />
                    ) : (
                      <h4 onClick={editMode ? () => startEdit(`puesto-${idx}-nombre`, puesto.nombre.es, puesto.nombre.en) : undefined} className={`text-2xl font-bold mb-3 text-[#7E9f00] ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded inline-block" : ""}`}>{puesto.nombre[lang]}</h4>
                    )}
                    {editKey === `puesto-${idx}-descripcion` ? (
                      <EditInputs esVal={editES} enVal={editEN} setEsVal={setEditES} setEnVal={setEditEN} onSave={() => savePuesto(idx, "descripcion")} onCancel={() => setEditKey(null)} />
                    ) : (
                      <p onClick={editMode ? () => startEdit(`puesto-${idx}-descripcion`, puesto.descripcion.es, puesto.descripcion.en) : undefined} className={`text-[#4E3B2A]/75 mb-4 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}>{puesto.descripcion[lang]}</p>
                    )}
                    <div className="mb-5">
                      <p className="text-sm font-bold text-[#7E9f00] mb-1">{t.horario}</p>
                      <div className="flex justify-between gap-4 text-sm text-[#4E3B2A]/80">
                        <span className="font-medium">{t.hoy}: {hoy.dia}</span>
                        <span className={`text-right ${hoy.hora === "Cerrado" || hoy.hora === "Closed" ? "text-[#B85C38] font-semibold" : ""}`}>{hoy.hora}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <a href={puesto.mapa} target="_blank" rel="noreferrer" className="inline-block px-5 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition">{t.verUbicacion}</a>
                      <Link to={puesto.rutaCarta} className="inline-block px-5 py-3 rounded-2xl bg-[#7E9f00] text-white font-semibold hover:opacity-90 transition">{t.verCarta}</Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contacto" className="scroll-mt-20 px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          {tEdit("contactoTitulo") || <h3 {...editBtn("contactoTitulo", textos.es.contactoTitulo, textos.en.contactoTitulo)} className="text-4xl font-bold mb-4">{t.contactoTitulo}</h3>}
          {tEdit("contactoTexto") || <p {...editBtn("contactoTexto", textos.es.contactoTexto, textos.en.contactoTexto)} className="text-[#4E3B2A]/70 mb-8">{t.contactoTexto}</p>}
          <div className="mb-10 rounded-3xl bg-[#F7F3EA] border border-[#B78B5A]/25 shadow-sm text-left overflow-hidden">
            <div className="h-1.5 bg-[#B78B5A]"></div>
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="max-w-xl">
                  <p className="text-sm font-semibold text-[#B78B5A] mb-3">{lang === "es" ? "Trabaja con nosotros" : "Work with us"}</p>
                  {tEdit("empleoTitulo") || <h4 {...editBtn("empleoTitulo", textos.es.empleoTitulo, textos.en.empleoTitulo)} className="text-2xl md:text-3xl font-bold text-[#4E3B2A] mb-3">{t.empleoTitulo}</h4>}
                  {tEdit("empleoTexto") || <p {...editBtn("empleoTexto", textos.es.empleoTexto, textos.en.empleoTexto)} className="text-[#4E3B2A]/72 leading-7">{t.empleoTexto}</p>}
                </div>
                <div className="md:text-right md:pt-2">
                  <a href="mailto:encurtidos@antequeracanarias.com?subject=Curr%C3%ADculum%20Encurtidos%20Antequera" className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition shadow-sm">{t.enviarCV}</a>
                  <p className="mt-3 text-sm text-[#4E3B2A]/60 break-all">encurtidos@antequeracanarias.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <a href="tel:617883822" className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#B78B5A]/20 block hover:opacity-90 transition">{t.telefono}: 617 883 822</a>
            <a href="mailto:encurtidos@antequeracanarias.com" className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#B78B5A]/20 block hover:opacity-90 transition">{t.correo}: encurtidos@antequeracanarias.com</a>
          </div>
        </div>
      </section>

      {isAdmin && (
        <>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
        </>
      )}

      {isAdmin && uploadMenu && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end justify-center p-4" onClick={() => setUploadMenu(null)}>
          <div className="bg-white rounded-3xl w-full max-w-sm pb-2 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <p className="text-center text-sm font-semibold text-[#4E3B2A] py-4 border-b border-[#B78B5A]/15">{lang === "es" ? "Cambiar foto" : "Change photo"}</p>
            <button type="button" onClick={() => handleMenuOption("camera")} className="w-full flex items-center gap-4 px-6 py-4 text-[#4E3B2A] font-medium border-b border-[#B78B5A]/15 active:bg-[#F7F3EA]">
              Cámara
            </button>
            <button type="button" onClick={() => handleMenuOption("gallery")} className="w-full flex items-center gap-4 px-6 py-4 text-[#4E3B2A] font-medium border-b border-[#B78B5A]/15 active:bg-[#F7F3EA]">
              Galería / Archivos
            </button>
            <button type="button" onClick={() => setUploadMenu(null)} className="w-full py-4 text-sm text-[#4E3B2A]/50 active:bg-[#F7F3EA]">{lang === "es" ? "Cancelar" : "Cancel"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
