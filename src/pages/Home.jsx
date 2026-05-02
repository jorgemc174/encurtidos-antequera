import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import logoImg from "../assets/logo.png";
import lasPalmasImg from "../assets/laspalmas.jpg";
import galdarImg from "../assets/galdar.jpg";
import teldeImg from "../assets/telde.jpg";
import heroImg from "../assets/hero.jpg";
import espanaImg from "../assets/españa.jpg";
import inglaterraImg from "../assets/inglaterra.jpg";

const textosBase = {
  es: {
    inicio: "Inicio",
    nosotros: "Nosotros",
    productos: "Productos",
    puestos: "Puestos",
    contacto: "Contacto",
    subtitulo: "Canarias · Tapas · Aceitunas",
    titulo: "Tapas, aceitunas y sabor tradicional",
    descripcion:
      "En Encurtidos Antequera llevamos el sabor de siempre a nuestros puestos con una selección de encurtidos, aceitunas y tapas pensadas para disfrutar.",
    verPuestos: "Ver puestos",
    contactar: "Contactar",
    quienesSomos: "Quiénes somos",
    quienesTexto:
      "En Encurtidos Antequera ofrecemos una selección de aceitunas, encurtidos y tapas con sabor tradicional. Apostamos por un producto cercano, sencillo y de calidad, pensado para disfrutar en cualquiera de nuestros puestos.",
    nuestrosProductos: "Nuestros productos",
    productosTexto:
      "Una propuesta pensada para compartir, picar algo y disfrutar del sabor tradicional.",
    nuestrosPuestos: "Nuestros puestos",
    puestosTexto: "Puedes encontrarnos en estos tres puntos.",
    verUbicacion: "Ver ubicación",
    verCarta: "Ver carta",
    contactoTitulo: "Contacto",
    contactoTexto: "Escríbenos para más información o consultas.",
    telefono: "Teléfono",
    correo: "Correo",
    idioma: "Idioma",
    menu: "Menú",
    horario: "Horario",
    hoy: "Hoy",
  },
  en: {
    inicio: "Home",
    nosotros: "About us",
    productos: "Products",
    puestos: "Locations",
    contacto: "Contact",
    subtitulo: "Canary Islands · Tapas · Olives",
    titulo: "Tapas, olives and traditional flavour",
    descripcion:
      "At Encurtidos Antequera we bring traditional flavour to our stands with a selection of pickles, olives and tapas made to enjoy.",
    verPuestos: "View locations",
    contactar: "Contact",
    quienesSomos: "About us",
    quienesTexto:
      "At Encurtidos Antequera we offer a selection of olives, pickles and tapas with a traditional flavour. We focus on close, simple and quality products, made to be enjoyed at any of our stands.",
    nuestrosProductos: "Our products",
    productosTexto:
      "A selection made for sharing, snacking and enjoying traditional flavour.",
    nuestrosPuestos: "Our locations",
    puestosTexto: "You can find us at these three locations.",
    verUbicacion: "View location",
    verCarta: "View menu",
    contactoTitulo: "Contact",
    contactoTexto: "Write to us for more information or enquiries.",
    telefono: "Phone",
    correo: "Email",
    idioma: "Language",
    menu: "Menu",
    horario: "Opening hours",
    hoy: "Today",
  },
};

const productosBase = {
  es: [
    "Aceitunas variadas",
    "Encurtidos",
    "Banderillas",
    "Tapas tradicionales",
    "Especialidades de la casa",
    "Raciones para compartir",
  ],
  en: [
    "Mixed olives",
    "Pickles",
    "Skewers",
    "Traditional tapas",
    "House specials",
    "Sharing portions",
  ],
};

const puestosBase = [
  {
    nombre: { es: "Las Palmas", en: "Las Palmas" },
    descripcion: {
      es: "Puesto con nuestra selección de aceitunas, encurtidos y tapas tradicionales.",
      en: "Stand with our selection of olives, pickles and traditional tapas.",
    },
    mapa: "https://maps.app.goo.gl/R18Khz2ULXaL5vcc7",
    rutaCarta: "/carta-las-palmas",
    imagen: lasPalmasImg,
    horario: {
      es: [
        { dia: "Lunes", hora: "11:00 - 16:00" },
        { dia: "Martes", hora: "11:00 - 24:00" },
        { dia: "Miércoles", hora: "11:00 - 24:00" },
        { dia: "Jueves", hora: "11:00 - 24:00" },
        { dia: "Viernes", hora: "11:00 - 24:00" },
        { dia: "Sábado", hora: "11:00 - 24:00" },
        { dia: "Domingo", hora: "11:00 - 17:00" },
      ],
      en: [
        { dia: "Monday", hora: "11:00 - 16:00" },
        { dia: "Tuesday", hora: "11:00 - 24:00" },
        { dia: "Wednesday", hora: "11:00 - 24:00" },
        { dia: "Thursday", hora: "11:00 - 24:00" },
        { dia: "Friday", hora: "11:00 - 24:00" },
        { dia: "Saturday", hora: "11:00 - 24:00" },
        { dia: "Sunday", hora: "11:00 - 17:00" },
      ],
    },
  },
  {
    nombre: { es: "Gáldar", en: "Gáldar" },
    descripcion: {
      es: "Un espacio donde disfrutar del sabor de siempre con producto cercano y cuidado.",
      en: "A place to enjoy traditional flavour with local and carefully selected products.",
    },
    mapa: "https://maps.app.goo.gl/ACi1i4GrA85HnbZAA",
    rutaCarta: "/carta-galdar",
    imagen: galdarImg,
    horario: {
      es: [
        { dia: "Lunes", hora: "Cerrado" },
        { dia: "Martes", hora: "11:00 - 22:00" },
        { dia: "Miércoles", hora: "11:00 - 22:00" },
        { dia: "Jueves", hora: "11:00 - 22:00" },
        { dia: "Viernes", hora: "12:00 - 24:00" },
        { dia: "Sábado", hora: "12:00 - 24:00" },
        { dia: "Domingo", hora: "12:00 - 17:00" },
      ],
      en: [
        { dia: "Monday", hora: "Closed" },
        { dia: "Tuesday", hora: "11:00 - 22:00" },
        { dia: "Wednesday", hora: "11:00 - 22:00" },
        { dia: "Thursday", hora: "11:00 - 22:00" },
        { dia: "Friday", hora: "12:00 - 24:00" },
        { dia: "Saturday", hora: "12:00 - 24:00" },
        { dia: "Sunday", hora: "12:00 - 17:00" },
      ],
    },
  },
  {
    nombre: { es: "Telde", en: "Telde" },
    descripcion: {
      es: "Nuestra propuesta con el sabor de siempre, ideal para probar nuestras especialidades.",
      en: "Our traditional selection, ideal for trying our specialties.",
    },
    mapa: "https://maps.app.goo.gl/iRxEPQPSHbNWSf5L6",
    rutaCarta: "/carta-telde",
    imagen: teldeImg,
    horario: {
      es: [
        { dia: "Lunes", hora: "10:00 - 23:00" },
        { dia: "Martes", hora: "10:00 - 23:00" },
        { dia: "Miércoles", hora: "10:00 - 23:00" },
        { dia: "Jueves", hora: "10:00 - 23:00" },
        { dia: "Viernes", hora: "10:00 - 02:00" },
        { dia: "Sábado", hora: "10:00 - 02:00" },
        { dia: "Domingo", hora: "12:00 - 22:00" },
      ],
      en: [
        { dia: "Monday", hora: "10:00 - 23:00" },
        { dia: "Tuesday", hora: "10:00 - 23:00" },
        { dia: "Wednesday", hora: "10:00 - 23:00" },
        { dia: "Thursday", hora: "10:00 - 23:00" },
        { dia: "Friday", hora: "10:00 - 02:00" },
        { dia: "Saturday", hora: "10:00 - 02:00" },
        { dia: "Sunday", hora: "12:00 - 22:00" },
      ],
    },
  },
];

function EditableField({
  editKey,
  currentKey,
  valueES,
  valueEN,
  editValES,
  editValEN,
  setEditValES,
  setEditValEN,
  onSave,
  onStart,
  tag: Tag = "span",
  className = "",
  lang,
  single,
  editValue,
  setEditValue,
}) {
  if (currentKey !== editKey) {
    return (
      <Tag
        onClick={() => onStart()}
        className={`${className} cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded`}
      >
        {single ? editValue : valueES}
      </Tag>
    );
  }

  return (
    <div className="flex flex-col gap-1 min-w-0">
      {single ? (
        <input
          className="border border-[#B78B5A] rounded px-2 py-1 text-sm w-full"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") onSave();
            if (e.key === "Escape") setEditValES(null);
          }}
          onBlur={onSave}
        />
      ) : (
        <>
          <input
            className="border border-[#B78B5A] rounded px-2 py-1 text-sm"
            value={editValES}
            onChange={(e) => setEditValES(e.target.value)}
            placeholder="ES"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave();
              if (e.key === "Escape") setEditValES(null);
            }}
          />
          <input
            className="border border-[#B78B5A] rounded px-2 py-1 text-sm"
            value={editValEN}
            onChange={(e) => setEditValEN(e.target.value)}
            placeholder="EN"
            onKeyDown={(e) => {
              if (e.key === "Enter") onSave();
              if (e.key === "Escape") setEditValES(null);
            }}
          />
          <div className="flex gap-1 mt-1">
            <button
              onClick={onSave}
              className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded"
            >
              OK
            </button>
            <button
              onClick={() => setEditValES(null)}
              className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded"
            >
              ×
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");
  const [menuOpen, setMenuOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const [editValES, setEditValES] = useState("");
  const [editValEN, setEditValEN] = useState("");
  const [editVal, setEditVal] = useState("");

  const [textos, setTextos] = useState(() => {
    const saved = localStorage.getItem("encurtidos_home_textos");
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return JSON.parse(JSON.stringify(textosBase));
  });
  const [productos, setProductos] = useState(() => {
    const saved = localStorage.getItem("encurtidos_home_productos");
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return JSON.parse(JSON.stringify(productosBase));
  });
  const [puestos, setPuestos] = useState(() => {
    const saved = localStorage.getItem("encurtidos_home_puestos");
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return JSON.parse(JSON.stringify(puestosBase));
  });

  const [isAdmin] = useState(() => localStorage.getItem("encurtidos_admin") === "true");
  const t = textos[lang];

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("encurtidos_home_textos", JSON.stringify(textos));
  }, [textos]);

  useEffect(() => {
    localStorage.setItem("encurtidos_home_productos", JSON.stringify(productos));
  }, [productos]);

  useEffect(() => {
    localStorage.setItem("encurtidos_home_puestos", JSON.stringify(puestos));
  }, [puestos]);

  const startEditText = (key) => {
    setEditKey(key);
    setEditValES(textos.es[key] || "");
    setEditValEN(textos.en[key] || "");
  };

  const saveText = (key) => {
    if (!key) return;
    setTextos((prev) => ({
      ...prev,
      es: { ...prev.es, [key]: editValES },
      en: { ...prev.en, [key]: editValEN },
    }));
    setEditKey(null);
  };

  const startEditProducto = (index) => {
    setEditKey(`prod-${index}`);
    setEditValES(productos.es[index] || "");
    setEditValEN(productos.en[index] || "");
  };

  const saveProducto = (index) => {
    setProductos((prev) => ({
      es: prev.es.map((v, i) => (i === index ? editValES : v)),
      en: prev.en.map((v, i) => (i === index ? editValEN : v)),
    }));
    setEditKey(null);
  };

  const addProducto = () => {
    setProductos((prev) => ({
      es: [...prev.es, "Nuevo producto"],
      en: [...prev.en, "New product"],
    }));
  };

  const deleteProducto = (index) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setProductos((prev) => ({
      es: prev.es.filter((_, i) => i !== index),
      en: prev.en.filter((_, i) => i !== index),
    }));
  };

  const startEditPuesto = (index, field) => {
    setEditKey(`puesto-${index}-${field}`);
    setEditValES(puestos[index][field].es || "");
    setEditValEN(puestos[index][field].en || "");
  };

  const savePuesto = (index, field) => {
    setPuestos((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[index][field] = { es: editValES, en: editValEN };
      return copy;
    });
    setEditKey(null);
  };

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
            <img
              src={logoImg}
              alt="Logo Encurtidos Antequera"
              className="h-14 md:h-20 w-auto object-contain"
            />
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-6 font-medium items-center">
              <a href="#inicio" className="hover:text-[#7A5530] transition">
                {t.inicio}
              </a>
              <a href="#nosotros" className="hover:text-[#7A5530] transition">
                {t.nosotros}
              </a>
              <a href="#productos" className="hover:text-[#7A5530] transition">
                {t.productos}
              </a>
              <a href="#puestos" className="hover:text-[#7A5530] transition">
                {t.puestos}
              </a>
              <a href="#contacto" className="hover:text-[#7A5530] transition">
                {t.contacto}
              </a>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditMode((v) => !v);
                    setEditKey(null);
                  }}
                  title={editMode ? "Salir de edición" : "Editar página"}
                  className={`p-2 rounded-xl border transition ${
                    editMode
                      ? "bg-[#4E3B2A] border-[#4E3B2A] text-white"
                      : "bg-white border-[#B78B5A]/30 text-[#B78B5A]"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => setLang("es")}
                className={`p-1 rounded-xl border transition ${
                  lang === "es"
                    ? "bg-[#7E9f00] border-[#7E9f00]"
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
                    ? "bg-[#7E9f00] border-[#7E9f00]"
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

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex items-center justify-center w-12 h-12 rounded-2xl border border-[#7A5530]/15 bg-[#7E9f00] shadow-sm hover:opacity-90 transition"
            aria-label="Abrir menú"
          >
            <div className="flex flex-col justify-center gap-1.5">
              <span className="block w-5 h-0.5 bg-white rounded"></span>
              <span className="block w-5 h-0.5 bg-white rounded"></span>
              <span className="block w-5 h-0.5 bg-white rounded"></span>
            </div>
          </button>
        </nav>
      </header>

      <div
        className={`md:hidden fixed inset-0 z-[60] ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        ></div>

        <aside
          className={`absolute top-0 right-0 h-full w-[82%] max-w-sm bg-[#EFE7DA] border-l border-[#B78B5A] shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#B78B5A]/20">
            <span className="text-lg font-bold text-[#4E3B2A]">{t.menu}</span>

            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-xl border border-[#B78B5A]/30 bg-white"
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-5 flex flex-col gap-5 font-medium">
            <a href="#inicio" onClick={closeMenu} className="hover:text-[#7A5530] transition">
              {t.inicio}
            </a>
            <a href="#nosotros" onClick={closeMenu} className="hover:text-[#7A5530] transition">
              {t.nosotros}
            </a>
            <a href="#productos" onClick={closeMenu} className="hover:text-[#7A5530] transition">
              {t.productos}
            </a>
            <a href="#puestos" onClick={closeMenu} className="hover:text-[#7A5530] transition">
              {t.puestos}
            </a>
            <a href="#contacto" onClick={closeMenu} className="hover:text-[#7A5530] transition">
              {t.contacto}
            </a>

            <div className="pt-4 border-t border-[#B78B5A]/20">
              {isAdmin && (
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setEditMode((v) => !v);
                      setEditKey(null);
                      setMenuOpen(false);
                    }}
                    className={`w-full py-2 rounded-xl border transition text-sm ${
                      editMode
                        ? "bg-[#4E3B2A] border-[#4E3B2A] text-white"
                        : "bg-white border-[#B78B5A]/30 text-[#B78B5A]"
                    }`}
                  >
                    {editMode ? "Salir de edición" : "Editar página"}
                  </button>
                </div>
              )}

              <p className="text-sm mb-3 text-[#4E3B2A]/70">{t.idioma}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLang("es")}
                  className={`p-1 rounded-xl border transition ${
                    lang === "es"
                      ? "bg-[#7E9f00] border-[#7E9f00]"
                      : "bg-white border-[#B78B5A]/30"
                  }`}
                >
                  <img src={espanaImg} alt="Español" className="w-8 h-5 object-cover rounded-sm" />
                </button>

                <button
                  onClick={() => setLang("en")}
                  className={`p-1 rounded-xl border transition ${
                    lang === "en"
                      ? "bg-[#7E9f00] border-[#7E9f00]"
                      : "bg-white border-[#B78B5A]/30"
                  }`}
                >
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
            {editKey === "subtitulo" ? (
              <div className="flex flex-col gap-1 mb-4">
                <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveText("subtitulo"); if (e.key === "Escape") setEditKey(null); }} />
                <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveText("subtitulo"); if (e.key === "Escape") setEditKey(null); }} />
                <div className="flex gap-1">
                  <button onClick={() => saveText("subtitulo")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                  <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
                </div>
              </div>
            ) : (
              <p
                onClick={editMode ? () => startEditText("subtitulo") : undefined}
                className={`uppercase tracking-[0.25em] text-sm text-[#A8C66C] mb-4 font-semibold ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}
              >
                {t.subtitulo}
              </p>
            )}

            {editKey === "titulo" ? (
              <div className="flex flex-col gap-1 mb-6">
                <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveText("titulo"); if (e.key === "Escape") setEditKey(null); }} />
                <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveText("titulo"); if (e.key === "Escape") setEditKey(null); }} />
                <div className="flex gap-1">
                  <button onClick={() => saveText("titulo")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                  <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
                </div>
              </div>
            ) : (
              <h2
                onClick={editMode ? () => startEditText("titulo") : undefined}
                className={`text-4xl md:text-6xl font-bold leading-tight mb-6 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}
              >
                {t.titulo}
              </h2>
            )}

            {editKey === "descripcion" ? (
              <div className="flex flex-col gap-1 mb-8">
                <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveText("descripcion"); if (e.key === "Escape") setEditKey(null); }} />
                <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveText("descripcion"); if (e.key === "Escape") setEditKey(null); }} />
                <div className="flex gap-1">
                  <button onClick={() => saveText("descripcion")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                  <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
                </div>
              </div>
            ) : (
              <p
                onClick={editMode ? () => startEditText("descripcion") : undefined}
                className={`text-lg text-[#4E3B2A]/75 mb-8 max-w-xl ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}
              >
                {t.descripcion}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <a href="#puestos" className="px-6 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition">
                {t.verPuestos}
              </a>
              <a href="#contacto" className="px-6 py-3 rounded-2xl border border-[#B78B5A] text-[#4E3B2A] font-semibold hover:bg-[#B78B5A] hover:text-white transition">
                {t.contactar}
              </a>
            </div>
          </div>

          <img src={heroImg} alt="Encurtidos Antequera" className="w-full h-[420px] rounded-3xl object-cover shadow-lg" />
        </div>
      </section>

      <section id="nosotros" className="scroll-mt-20 px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          {editKey === "quienesSomos" ? (
            <div className="flex flex-col gap-1 mb-6 max-w-md mx-auto">
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm text-center" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveText("quienesSomos"); if (e.key === "Escape") setEditKey(null); }} />
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm text-center" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveText("quienesSomos"); if (e.key === "Escape") setEditKey(null); }} />
              <div className="flex gap-1 justify-center">
                <button onClick={() => saveText("quienesSomos")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
              </div>
            </div>
          ) : (
            <h3
              onClick={editMode ? () => startEditText("quienesSomos") : undefined}
              className={`text-4xl font-bold mb-6 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded inline-block" : ""}`}
            >
              {t.quienesSomos}
            </h3>
          )}

          {editKey === "quienesTexto" ? (
            <div className="flex flex-col gap-1 max-w-lg mx-auto">
              <textarea className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" rows={3} autoFocus onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) saveText("quienesTexto"); if (e.key === "Escape") setEditKey(null); }} />
              <textarea className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" rows={3} onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) saveText("quienesTexto"); if (e.key === "Escape") setEditKey(null); }} />
              <div className="flex gap-1 justify-center">
                <button onClick={() => saveText("quienesTexto")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
              </div>
            </div>
          ) : (
            <p
              onClick={editMode ? () => startEditText("quienesTexto") : undefined}
              className={`text-lg text-[#4E3B2A]/75 leading-8 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}
            >
              {t.quienesTexto}
            </p>
          )}
        </div>
      </section>

      <section id="productos" className="scroll-mt-20 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {editKey === "nuestrosProductos" ? (
            <div className="flex flex-col gap-1 mb-4 max-w-md">
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveText("nuestrosProductos"); if (e.key === "Escape") setEditKey(null); }} />
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveText("nuestrosProductos"); if (e.key === "Escape") setEditKey(null); }} />
              <div className="flex gap-1">
                <button onClick={() => saveText("nuestrosProductos")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
              </div>
            </div>
          ) : (
            <h3
              onClick={editMode ? () => startEditText("nuestrosProductos") : undefined}
              className={`text-4xl font-bold mb-4 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded inline-block" : ""}`}
            >
              {t.nuestrosProductos}
            </h3>
          )}

          {editKey === "productosTexto" ? (
            <div className="flex flex-col gap-1 mb-10 max-w-lg">
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveText("productosTexto"); if (e.key === "Escape") setEditKey(null); }} />
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveText("productosTexto"); if (e.key === "Escape") setEditKey(null); }} />
              <div className="flex gap-1">
                <button onClick={() => saveText("productosTexto")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
              </div>
            </div>
          ) : (
            <p
              onClick={editMode ? () => startEditText("productosTexto") : undefined}
              className={`text-[#4E3B2A]/70 mb-10 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}
            >
              {t.productosTexto}
            </p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos[lang].map((producto, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-[#B78B5A]/20 relative">
                {editKey === `prod-${index}` ? (
                  <div className="flex flex-col gap-1">
                    <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveProducto(index); if (e.key === "Escape") setEditKey(null); }} />
                    <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveProducto(index); if (e.key === "Escape") setEditKey(null); }} />
                    <div className="flex gap-1">
                      <button onClick={() => saveProducto(index)} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                      <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
                    </div>
                  </div>
                ) : (
                  <h4
                    onClick={editMode ? () => startEditProducto(index) : undefined}
                    className={`text-xl font-semibold ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}
                  >
                    {producto}
                  </h4>
                )}
                {editMode && editKey !== `prod-${index}` && (
                  <button
                    onClick={() => deleteProducto(index)}
                    className="absolute bottom-2 right-2 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {editMode && (
              <button
                onClick={addProducto}
                className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#B78B5A]/40 text-[#B78B5A] font-medium text-sm hover:bg-[#B78B5A]/5 transition flex items-center justify-center min-h-[88px]"
              >
                + Añadir producto
              </button>
            )}
          </div>
        </div>
      </section>

      <section id="puestos" className="scroll-mt-20 px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          {editKey === "nuestrosPuestos" ? (
            <div className="flex flex-col gap-1 mb-4 max-w-md">
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveText("nuestrosPuestos"); if (e.key === "Escape") setEditKey(null); }} />
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveText("nuestrosPuestos"); if (e.key === "Escape") setEditKey(null); }} />
              <div className="flex gap-1">
                <button onClick={() => saveText("nuestrosPuestos")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
              </div>
            </div>
          ) : (
            <h3
              onClick={editMode ? () => startEditText("nuestrosPuestos") : undefined}
              className={`text-4xl font-bold mb-4 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded inline-block" : ""}`}
            >
              {t.nuestrosPuestos}
            </h3>
          )}

          {editKey === "puestosTexto" ? (
            <div className="flex flex-col gap-1 mb-10 max-w-lg">
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveText("puestosTexto"); if (e.key === "Escape") setEditKey(null); }} />
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveText("puestosTexto"); if (e.key === "Escape") setEditKey(null); }} />
              <div className="flex gap-1">
                <button onClick={() => saveText("puestosTexto")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
              </div>
            </div>
          ) : (
            <p
              onClick={editMode ? () => startEditText("puestosTexto") : undefined}
              className={`text-[#4E3B2A]/70 mb-10 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}
            >
              {t.puestosTexto}
            </p>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {puestos.map((puesto, index) => {
              const hoy = puesto.horario[lang][todayIndex];

              return (
                <div key={index} className="rounded-3xl overflow-hidden bg-[#F7F3EA] border border-[#B78B5A]/20 shadow-sm">
                  <img src={puesto.imagen} alt={puesto.nombre[lang]} className="w-full h-56 object-cover" />

                  <div className="p-6">
                    {editKey === `puesto-${index}-nombre` ? (
                      <div className="flex flex-col gap-1 mb-3">
                        <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") savePuesto(index, "nombre"); if (e.key === "Escape") setEditKey(null); }} />
                        <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") savePuesto(index, "nombre"); if (e.key === "Escape") setEditKey(null); }} />
                        <div className="flex gap-1">
                          <button onClick={() => savePuesto(index, "nombre")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                          <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
                        </div>
                      </div>
                    ) : (
                      <h4
                        onClick={editMode ? () => startEditPuesto(index, "nombre") : undefined}
                        className={`text-2xl font-bold mb-3 text-[#7E9f00] ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded inline-block" : ""}`}
                      >
                        {puesto.nombre[lang]}
                      </h4>
                    )}

                    {editKey === `puesto-${index}-descripcion` ? (
                      <div className="flex flex-col gap-1 mb-4">
                        <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") savePuesto(index, "descripcion"); if (e.key === "Escape") setEditKey(null); }} />
                        <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") savePuesto(index, "descripcion"); if (e.key === "Escape") setEditKey(null); }} />
                        <div className="flex gap-1">
                          <button onClick={() => savePuesto(index, "descripcion")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                          <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
                        </div>
                      </div>
                    ) : (
                      <p
                        onClick={editMode ? () => startEditPuesto(index, "descripcion") : undefined}
                        className={`text-[#4E3B2A]/75 mb-4 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}
                      >
                        {puesto.descripcion[lang]}
                      </p>
                    )}

                    <div className="mb-5">
                      <p className="text-sm font-bold text-[#7E9f00] mb-1">{t.horario}</p>
                      <div className="flex justify-between gap-4 text-sm text-[#4E3B2A]/80">
                        <span className="font-medium">{t.hoy}: {hoy.dia}</span>
                        <span className={`text-right ${hoy.hora === "Cerrado" || hoy.hora === "Closed" ? "text-[#B85C38] font-semibold" : ""}`}>
                          {hoy.hora}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <a href={puesto.mapa} target="_blank" rel="noreferrer" className="inline-block px-5 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition">
                        {t.verUbicacion}
                      </a>
                      <Link to={puesto.rutaCarta} className="inline-block px-5 py-3 rounded-2xl bg-[#7E9f00] text-white font-semibold hover:opacity-90 transition">
                        {t.verCarta}
                      </Link>
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
          {editKey === "contactoTitulo" ? (
            <div className="flex flex-col gap-1 mb-4 max-w-md mx-auto">
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm text-center" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveText("contactoTitulo"); if (e.key === "Escape") setEditKey(null); }} />
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm text-center" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveText("contactoTitulo"); if (e.key === "Escape") setEditKey(null); }} />
              <div className="flex gap-1 justify-center">
                <button onClick={() => saveText("contactoTitulo")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
              </div>
            </div>
          ) : (
            <h3
              onClick={editMode ? () => startEditText("contactoTitulo") : undefined}
              className={`text-4xl font-bold mb-4 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded inline-block" : ""}`}
            >
              {t.contactoTitulo}
            </h3>
          )}

          {editKey === "contactoTexto" ? (
            <div className="flex flex-col gap-1 mb-8 max-w-lg mx-auto">
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm text-center" value={editValES} onChange={(e) => setEditValES(e.target.value)} placeholder="ES" autoFocus onKeyDown={(e) => { if (e.key === "Enter") saveText("contactoTexto"); if (e.key === "Escape") setEditKey(null); }} />
              <input className="border border-[#B78B5A] rounded px-2 py-1 text-sm text-center" value={editValEN} onChange={(e) => setEditValEN(e.target.value)} placeholder="EN" onKeyDown={(e) => { if (e.key === "Enter") saveText("contactoTexto"); if (e.key === "Escape") setEditKey(null); }} />
              <div className="flex gap-1 justify-center">
                <button onClick={() => saveText("contactoTexto")} className="text-xs bg-[#7E9F00] text-white px-2 py-0.5 rounded">OK</button>
                <button onClick={() => setEditKey(null)} className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">×</button>
              </div>
            </div>
          ) : (
            <p
              onClick={editMode ? () => startEditText("contactoTexto") : undefined}
              className={`text-[#4E3B2A]/70 mb-8 ${editMode ? "cursor-text hover:bg-[#B78B5A]/10 px-1 -ml-1 rounded" : ""}`}
            >
              {t.contactoTexto}
            </p>
          )}

          <div className="grid gap-4">
            <a href="tel:617883822" className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#B78B5A]/20 block hover:opacity-90 transition">
              {t.telefono}: 617 883 822
            </a>
            <a href="mailto:correo@encurtidosantequera.com" className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#B78B5A]/20 block hover:opacity-90 transition">
              {t.correo}: correo@encurtidosantequera.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
