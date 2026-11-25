import { Link } from "react-router-dom";
import { signOutAdmin, useAdmin } from "../lib/useAdmin";
import { useContentDocument } from "../lib/useContentDocument";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Camera, ChevronLeft, ChevronRight, Image as ImageIcon, LogOut, Mail, MapPin, Menu, Pencil, Phone, Plus, Trash2, X } from "lucide-react";
import logoImg from "../assets/logo-web.webp";
import logoClaroImg from "../assets/logo-claro.webp";
import encurtidosVasitos from "../assets/eventos/encurtidos-vasitos.webp";
import lasPalmasImg from "../assets/laspalmas.webp";
import galdarImg from "../assets/galdar.webp";
import teldeImg from "../assets/telde.webp";
import heroImg from "../assets/hero.jpg";
import gastroPuesto from "../assets/eventos/gastro-ingenio-puesto.webp";
import gastroPuestoSm from "../assets/eventos/gastro-ingenio-puesto-sm.webp";
import gastroNoche from "../assets/eventos/gastro-ingenio-noche.webp";
import gastroNocheSm from "../assets/eventos/gastro-ingenio-noche-sm.webp";
import gastroBarra from "../assets/eventos/gastro-ingenio-barra.webp";
import gastroBarraSm from "../assets/eventos/gastro-ingenio-barra-sm.webp";
import gastroVitrina from "../assets/eventos/gastro-ingenio-vitrina.webp";
import gastroVitrinaSm from "../assets/eventos/gastro-ingenio-vitrina-sm.webp";
import gastroEquipo from "../assets/eventos/gastro-ingenio-equipo.webp";
import gastroEquipoSm from "../assets/eventos/gastro-ingenio-equipo-sm.webp";
import gastroCarpa from "../assets/eventos/gastro-ingenio-carpa.webp";
import gastroCarpaSm from "../assets/eventos/gastro-ingenio-carpa-sm.webp";
import gastroAmbiente from "../assets/eventos/gastro-ingenio-ambiente.webp";
import gastroAmbienteSm from "../assets/eventos/gastro-ingenio-ambiente-sm.webp";
import gastroDia from "../assets/eventos/gastro-ingenio-dia.webp";
import gastroDiaSm from "../assets/eventos/gastro-ingenio-dia-sm.webp";
import { imagenesProductos, miniaturaDeImagen } from "../data/imagenesProductos";
import { IMAGENES_SUPABASE_SNAPSHOT_AT, imagenesSupabase } from "../data/imagenesSupabase";
import { getSectionProductImageKeys, resolveSharedProductImage } from "../lib/productImage";
import { translateProductName, translateProductNameOnline } from "../lib/productTranslation";
import { normalizeKey, supabase } from "../lib/supabase";
import { ahoraEnCanarias, idiomaGuardado, puestosDatos, textoEstadoPuesto } from "../lib/puestos";

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
    mercadoPuertoCerrado: "Cerrado hasta el 12 de agosto",
    curriculumTitulo: "¿Quieres formar parte del equipo?",
    curriculumTexto: "Puedes enviarnos tu currículum por correo y lo tendremos en cuenta cuando surjan nuevas oportunidades.",
    enviarCV: "Enviar currículum",
    tituloPortada: "Tapas, aceitunas y cañas",
    entradaPortada: "En el Mercado del Puerto (Las Palmas), en Gáldar y en Telde.",
    productosTitulo: "Aceitunas, encurtidos y tapas", dondeTitulo: "Dónde estamos",
    equipoTitulo: "El equipo", equipoPie: "El equipo de Antequera Encurtidos en Gastro Ingenio.",
    trabajaTitulo: "Trabaja con nosotros", trabajaTexto: "Envíanos tu currículum por correo.",
    horarioSemana: "Horario de la semana", horarioPorConfirmar: "Horario por confirmar",
    ayudaToque: "Toca una tapa para ver su foto. La carta cambia según el puesto.",
    ayudaRaton: "Pasa el ratón por una tapa para ver su foto. La carta cambia según el puesto.",
    cerrarFoto: "Cerrar foto", verCartaDe: "Ver carta de {p}", comoLlegarA: "Cómo llegar a {p}",
    novedadTituloV2: "Antequera en Gastro Ingenio",
    novedadTextoV2: "Nuestra barra en el Mercado Gastronómico Navideño de Ingenio: montaditos, perritos, minihamburguesas, banderillas y aceitunas.",
    descripcionPortada: "En nuestros puestos de Las Palmas, Gáldar y Telde: montaditos, banderillas y raciones para compartir, con la cerveza bien fría. Elige tu puesto, mira su carta y comprueba si está abierto ahora.",
    verCartas: "Cartas", comoLlegar: "Cómo llegar", abrirMenu: "Abrir menú", cerrarMenu: "Cerrar menú", cerrar: "Cerrar",
    saltarPuestos: "Ir a los puestos", cartas: "Cartas", cartaCompleta: "Carta completa de cada puesto:",
    abiertoHasta: "Abierto hasta las {h}", cerradoAbreA: "Cerrado. Abre hoy a las {h}", cerradoAhora: "Cerrado ahora",
    paredAyuda: "Toca una tapa para verla.", elegirPuesto: "Elegir puesto y ver carta", novedades: "Novedades", novedadEtiqueta: "Evento",
    novedadTitulo: "Estamos en Gastro Ingenio",
    novedadTexto: "Hemos llevado nuestras tapas al Mercado Gastronómico Navideño de Ingenio: montaditos, perritos, minihamburguesas, banderillas y nuestras aceitunas de siempre.",
    novedadLugar: "Ingenio, Gran Canaria", ampliarFoto: "Ampliar foto", fotoAnterior: "Foto anterior", fotoSiguiente: "Foto siguiente",
    verMas: "Ver productos", ocultar: "Ocultar productos", sinFoto: "Sin foto", equipoAlt: "El equipo de Antequera Encurtidos", vitrinaAlt: "La vitrina de tapas de Antequera",
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
    mercadoPuertoCerrado: "Closed until 12 August",
    curriculumTitulo: "Would you like to join the team?",
    curriculumTexto: "You can send us your CV by email and we will keep it in mind for future opportunities.",
    enviarCV: "Send CV",
    tituloPortada: "Tapas, olives and draught beer",
    entradaPortada: "At the Mercado del Puerto in Las Palmas, in Gáldar and in Telde.",
    productosTitulo: "Olives, pickles and tapas", dondeTitulo: "Where to find us",
    equipoTitulo: "The team", equipoPie: "The Antequera Encurtidos team at Gastro Ingenio.",
    trabajaTitulo: "Work with us", trabajaTexto: "Email us your CV.",
    horarioSemana: "Weekly opening hours", horarioPorConfirmar: "Opening hours to be confirmed",
    ayudaToque: "Tap a dish to see its photo. Menus vary by location.",
    ayudaRaton: "Hover over a dish to see its photo. Menus vary by location.",
    cerrarFoto: "Close photo", verCartaDe: "View the {p} menu", comoLlegarA: "Directions to {p}",
    novedadTituloV2: "Antequera at Gastro Ingenio",
    novedadTextoV2: "Our bar at the Ingenio Christmas food market: montaditos, hot dogs, mini burgers, pickle skewers and olives.",
    descripcionPortada: "At our stands in Las Palmas, Gáldar and Telde: montaditos, skewers and sharing plates, with an ice-cold beer. Pick your stand, check its menu and see whether it is open right now.",
    verCartas: "Menus", comoLlegar: "Directions", abrirMenu: "Open menu", cerrarMenu: "Close menu", cerrar: "Close",
    saltarPuestos: "Skip to locations", cartas: "Menus", cartaCompleta: "Full menu for each location:",
    abiertoHasta: "Open until {h}", cerradoAbreA: "Closed. Opens today at {h}", cerradoAhora: "Closed now",
    paredAyuda: "Tap a dish to see it.", elegirPuesto: "Choose a stand and see the menu", novedades: "News", novedadEtiqueta: "Event",
    novedadTitulo: "We are at Gastro Ingenio",
    novedadTexto: "We have brought our tapas to the Ingenio Christmas Food Market: montaditos, hot dogs, mini burgers, skewers and our classic olives.",
    novedadLugar: "Ingenio, Gran Canaria", ampliarFoto: "Enlarge photo", fotoAnterior: "Previous photo", fotoSiguiente: "Next photo",
    verMas: "Show products", ocultar: "Hide products", sinFoto: "No photo", equipoAlt: "The Antequera Encurtidos team", vitrinaAlt: "The Antequera tapas display",
  },
};

const productosBase = [
  { nombre: { es: "Aceitunas variadas", en: "Mixed olives" }, items: [{ nombre: { es: "Aceitunas variadas", en: "Mixed olives" }, imagenKey: "queso-ahumado-arandanos" }] },
  { nombre: { es: "Encurtidos", en: "Pickles" }, items: [{ nombre: { es: "Encurtidos", en: "Pickles" }, imagenKey: "ensalada-cangrejo-picar" }] },
  { nombre: { es: "Banderillas", en: "Skewers" }, items: [{ nombre: { es: "Banderillas", en: "Skewers" }, imagenKey: "atun-anchoas" }] },
  { nombre: { es: "Tortilla", en: "Spanish omelette" }, items: [{ nombre: { es: "Tortilla", en: "Spanish omelette" }, imagenKey: "tortilla" }] },
  { nombre: { es: "Pollo Kentucky", en: "Kentucky chicken" }, items: [{ nombre: { es: "Pollo Kentucky", en: "Kentucky chicken" }, imagenKey: "pollo-kentucky" }] },
  { nombre: { es: "Papas bravas", en: "Patatas bravas" }, items: [{ nombre: { es: "Papas bravas", en: "Patatas bravas" }, imagenKey: "papas-bravas" }] },
];

const PRODUCTO_ETIQUETA_DIRECTA = {
  "tapas tradicionales|tortilla": { es: "Tortilla", en: "Spanish omelette" },
  "especialidades de la casa|pollo-kentucky": { es: "Pollo Kentucky", en: "Kentucky chicken" },
  "raciones para compartir|papas-bravas": { es: "Papas bravas", en: "Patatas bravas" },
};

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
      let nombre = producto?.nombre || { es: `Producto ${idx + 1}`, en: `Product ${idx + 1}` };
      let items = producto?.items?.length
        ? producto.items.map((item) => ({ nombre: item.nombre || nombre, imagenKey: item.imagenKey || null, imagen: item.imagen || null }))
        : [{ nombre, imagenKey: producto?.imagenKey || null, imagen: producto?.imagen || null }];
      if (items.length === 1) {
        const directa = PRODUCTO_ETIQUETA_DIRECTA[`${String(nombre.es || "").trim().toLowerCase()}|${items[0].imagenKey || ""}`];
        if (directa) {
          nombre = { ...directa };
          items = [{ ...items[0], nombre: { ...directa } }];
        }
      }
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

const puestosBase = puestosDatos.map((puesto, idx) => ({ ...puesto, imagen: [lasPalmasImg, galdarImg, teldeImg][idx] }));

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

// ---------------------------------------------------------------------------
// Rediseño 2026-11: la pared de las tapas, la barra con los tres puestos y las
// novedades. Toda la edición de administrador se conserva.
// ---------------------------------------------------------------------------

// Palabras de la pared: platos reales de las cartas. Las que tienen foto se
// pueden tocar; las bebidas quedan como texto, igual que en la pared del bar.
const paredPalabras = [
  { es: "aceitunas aliñadas", en: "dressed olives", foto: ["cuenco-de-aceituna", "cuenco-de-aceitunas"] },
  { es: "banderillas", en: "pickle skewers", foto: ["atun-anchoas", "piparra-con-anchoa"] },
  { es: "cañas", en: "draught beer" },
  { es: "boquerones", en: "anchovies", foto: ["boquerones", "boquerones-y-anchoas"] },
  { es: "pollo kentucky", en: "kentucky chicken", foto: ["pollo-kentucky"] },
  { es: "papas antequera", en: "antequera potatoes", foto: ["papas-antequera"] },
  { es: "jamón ibérico", en: "iberian ham", foto: ["jamon-iberico"] },
  { es: "vino", en: "wine" },
  { es: "pulpo a la gallega", en: "galician octopus", foto: ["pulpo-a-la-gallega"] },
  { es: "mejillones", en: "mussels", foto: ["mejillones-4-6-piezas", "mejillones-18-25-piezas"] },
  { es: "rabas", en: "fried squid", foto: ["rabas"] },
  { es: "cecina con queso", en: "cured beef with cheese", foto: ["cecina-con-queso"] },
  { es: "sangría", en: "sangria" },
  { es: "chorizo de teror", en: "teror chorizo", foto: ["chorizo-de-teror-queso-y-miel"] },
  { es: "costillas barbacoa", en: "bbq ribs", foto: ["costillas-barbacoa", "costilla-a-la-barbacoa"] },
  { es: "queso de cabra", en: "goat cheese", foto: ["queso-de-cabra-cebolla-caramelizada"] },
  { es: "albóndigas", en: "meatballs", foto: ["cazuela-de-albondigas"] },
  { es: "vermut", en: "vermouth" },
  { es: "gambas a la gabardina", en: "battered prawns", foto: ["gambas-gabardina"] },
  { es: "codillo", en: "pork knuckle", foto: ["codillo-en-su-jugo", "codillo-al-horno"] },
  { es: "cazón en adobo", en: "marinated dogfish", foto: ["cazon-en-adobo", "cazon"] },
  { es: "alcachofa braseada", en: "braised artichoke", foto: ["alcachofa-braseada"] },
  { es: "tomates con ventresca", en: "tomatoes with tuna belly", foto: ["tomates-alinados-con-ventresca"] },
  { es: "perritos", en: "hot dogs", foto: ["perritos"] },
  { es: "mini pizzas", en: "mini pizzas", foto: ["mini-pizzas"] },
  { es: "chistorras", en: "chistorra sausage", foto: ["chistorras"] },
  { es: "salmón con queso", en: "salmon with cheese", foto: ["salmon-con-queso"] },
  { es: "ensalada de cangrejo", en: "crab salad", foto: ["ensalada-cangrejo-picar"] },
];

// «Aceitunas, encurtidos y tapas» en la portada: true = visible. Pendiente de que
// el dueño decida si se queda; los datos siguen en Supabase pase lo que pase.
const MOSTRAR_PRODUCTOS = true;

// En el móvil la pared se corta aquí para llegar antes a los puestos.
const PALABRAS_MOVIL = 17;

// Fotos por defecto que no correspondían al producto (p. ej. «Aceitunas variadas»
// con un montadito de queso). Solo se corrigen si siguen con la foto antigua.
const FOTO_CORREGIDA = {
  "aceitunas-variadas|queso-ahumado-arandanos": "cuenco-de-aceituna",
  "encurtidos|ensalada-cangrejo-picar": "__vasitos",
  "banderillas|atun-anchoas": "piparra-con-anchoa",
};

const eventoFotos = [
  { key: "evento-1", src: gastroNoche, sm: gastroNocheSm, w: 1200, h: 1600, alt: { es: "La barra del puesto por la noche, llena de tapas", en: "The stand's counter at night, full of tapas" } },
  { key: "evento-2", src: gastroBarra, sm: gastroBarraSm, w: 1600, h: 1200, alt: { es: "Perritos, minihamburguesas y montaditos recién preparados", en: "Freshly made hot dogs, mini burgers and montaditos" } },
  { key: "evento-0", src: gastroPuesto, sm: gastroPuestoSm, w: 1600, h: 900, alt: { es: "El puesto de Antequera Encurtidos en Gastro Ingenio", en: "The Antequera Encurtidos stand at Gastro Ingenio" } },
  { key: "evento-3", src: gastroVitrina, sm: gastroVitrinaSm, w: 900, h: 1600, alt: { es: "La vitrina de pinchos y banderillas", en: "The display case of pinchos and skewers" } },
  { key: "evento-4", src: gastroEquipo, sm: gastroEquipoSm, w: 1600, h: 1200, alt: { es: "El equipo de Antequera en el mercado", en: "The Antequera team at the market" } },
  { key: "evento-7", src: gastroDia, sm: gastroDiaSm, w: 1200, h: 1600, alt: { es: "El puesto a mediodía", en: "The stand at midday" } },
  { key: "evento-5", src: gastroCarpa, sm: gastroCarpaSm, w: 1600, h: 1200, alt: { es: "La carpa del mercado con el escenario de cocina en directo", en: "The market tent with the live cooking stage" } },
  { key: "evento-6", src: gastroAmbiente, sm: gastroAmbienteSm, w: 1200, h: 1600, alt: { es: "Ambiente frente al puesto durante la noche", en: "The crowd in front of the stand at night" } },
];

function LogoAntequera({ className = "", claro = false }) {
  return <img src={claro ? logoClaroImg : logoImg} alt="Antequera Encurtidos" width="900" height="201" className={className} />;
}

export default function Home() {
  const [lang, setLang] = useState(idiomaGuardado);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openProductos, setOpenProductos] = useState({});
  const [homePhotos, setHomePhotos] = useState({});
  const [uploadingImage, setUploadingImage] = useState(null);
  const [uploadMenu, setUploadMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [ahora, setAhora] = useState(() => ahoraEnCanarias());
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [palabraActiva, setPalabraActiva] = useState(null);
  const [platoPos, setPlatoPos] = useState(null);
  const paredRef = useRef(null);
  const palabraRefs = useRef({});
  const tiraRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const pendingImageKeyRef = useRef(null);

  const { isAdmin } = useAdmin();
  const [editMode, setEditMode] = useState(false);
  const [editKey, setEditKey] = useState(null);
  const [editES, setEditES] = useState("");
  const [editEN, setEditEN] = useState("");

  const textsDocument = useContentDocument({
    table: "home_json", documentKey: "textos", storageKey: "encurtidos_home_textos",
    fallback: textosBase, isAdmin, normalize: normalizeTextos,
  });
  const productsDocument = useContentDocument({
    table: "home_json", documentKey: "productos", storageKey: "encurtidos_home_productos",
    fallback: productosBase, isAdmin, normalize: normalizeProductos,
  });
  const standsDocument = useContentDocument({
    table: "home_json", documentKey: "puestos", storageKey: "encurtidos_home_puestos",
    fallback: puestosBase, isAdmin,
    normalize: (rows) => rows.map((p, i) => ({
      ...puestosBase[i], ...p, horario: p.horario || puestosBase[i]?.horario,
      imagen: puestosBase[i]?.imagen || p.imagen,
    })),
    serialize: (rows) => rows.map((puesto) => {
      const copy = { ...puesto };
      delete copy.imagen;
      return copy;
    }),
  });
  const textos = textsDocument.data;
  const setTextos = textsDocument.edit;
  const productos = productsDocument.data;
  const setProductos = productsDocument.edit;
  const puestos = standsDocument.data;
  const setPuestos = standsDocument.edit;
  const documentError = textsDocument.error || productsDocument.error || standsDocument.error;
  const savingContent = textsDocument.saving || productsDocument.saving || standsDocument.saving;

  useEffect(() => {
    try { localStorage.setItem("lang", lang); } catch { /* sin almacenamiento */ }
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setAhora(ahoraEnCanarias()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: metadata, error: metadataError } = await supabase
        .from("fotos_carta")
        .select("item_key, updated_at");
      if (cancelled || metadataError || !metadata) return;

      const changedKeys = metadata
        .filter(({ item_key, updated_at }) => (
          !item_key.startsWith("seccion-")
          && !item_key.startsWith("subseccion-")
          && (!imagenesSupabase[item_key] || !updated_at || Date.parse(updated_at) > IMAGENES_SUPABASE_SNAPSHOT_AT)
        ))
        .map(({ item_key }) => item_key);

      if (!changedKeys.length) {
        setHomePhotos({});
        return;
      }

      const { data, error } = await supabase
        .from("fotos_carta")
        .select("item_key, photo_data")
        .in("item_key", changedKeys);
      if (cancelled || error || !data) return;
      const photos = {};
      data.forEach(({ item_key, photo_data }) => { photos[item_key] = photo_data; });
      setHomePhotos(photos);
    })();
    return () => { cancelled = true; };
  }, []);

  const availableProductImages = useMemo(() => ({
    __vasitos: encurtidosVasitos,
    ...imagenesProductos,
    ...imagenesSupabase,
    ...homePhotos,
  }), [homePhotos]);

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
  const getImage = (key, fallback) => {
    const normalized = imageKey(key);
    return homePhotos[normalized] || imagenesSupabase[normalized] || fallback;
  };
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

  const editBtn = (key, esVal, enVal) => editMode ? { onClick: () => startEdit(key, esVal, enVal), className: "cursor-text outline-2 outline-dashed outline-oliva/50 -outline-offset-2 hover:bg-hoja/20" } : {};
  // Une las clases del texto con las de edición sin que unas pisen a otras.
  const editable = (key, className) => {
    const props = editBtn(key, textos.es[key], textos.en[key]);
    return { ...props, className: `${className} ${props.className || ""}` };
  };

  const handleExitAdmin = () => {
    try { localStorage.removeItem("encurtidos_admin"); } catch { /* sin almacenamiento */ }
    void signOutAdmin();
    setEditMode(false);
    setEditKey(null);
    setMenuOpen(false);
  };

  // ----- La pared ---------------------------------------------------------
  const palabras = useMemo(() => paredPalabras.map((palabra) => {
    const fotoKey = palabra.foto?.find((key) => availableProductImages[key]);
    return { ...palabra, imagen: fotoKey ? availableProductImages[fotoKey] : null };
  }), [availableProductImages]);

  const conRaton = () => window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false;
  const [puedePasarRaton, setPuedePasarRaton] = useState(conRaton);
  useEffect(() => {
    const consulta = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    if (!consulta) return undefined;
    const cambiar = () => setPuedePasarRaton(consulta.matches);
    consulta.addEventListener("change", cambiar);
    return () => consulta.removeEventListener("change", cambiar);
  }, []);

  // Coloca la foto junto a su palabra: debajo si cabe; si no, encima; y si
  // tampoco, debajo ensanchando la pared para que nunca pise la barra negra.
  const mostrarPalabra = useCallback((idx) => {
    const pared = paredRef.current;
    const nodo = palabraRefs.current[idx];
    if (!pared || !nodo) return;
    const anchoPared = pared.clientWidth;
    const ancho = Math.min(anchoPared * (anchoPared < 640 ? 0.62 : 0.3), 340);
    const alto = ancho * 0.75 + 44;
    let left = nodo.offsetLeft + nodo.offsetWidth / 2 - ancho / 2;
    left = Math.max(0, Math.min(left, anchoPared - ancho));
    const altoTexto = pared.firstElementChild?.offsetHeight || pared.clientHeight;
    const abajo = nodo.offsetTop + nodo.offsetHeight + 6;
    const arriba = nodo.offsetTop - alto - 6;
    const top = abajo + alto <= altoTexto || arriba < 0 ? abajo : arriba;
    setPlatoPos({ left, top, ancho, sobra: Math.max(0, top + alto - altoTexto) });
    setPalabraActiva(idx);
  }, []);

  const cerrarPlato = useCallback((devolverFoco = false) => {
    if (devolverFoco && palabraActiva !== null) palabraRefs.current[palabraActiva]?.focus();
    setPalabraActiva(null);
    setPlatoPos(null);
  }, [palabraActiva]);

  useEffect(() => {
    const onResize = () => { if (palabraActiva !== null) mostrarPalabra(palabraActiva); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [palabraActiva, mostrarPalabra]);

  useEffect(() => {
    if (palabraActiva === null) return undefined;
    const alTeclear = (e) => { if (e.key === "Escape") cerrarPlato(true); };
    const alTocarFuera = (e) => { if (!paredRef.current?.contains(e.target)) cerrarPlato(); };
    document.addEventListener("keydown", alTeclear);
    document.addEventListener("pointerdown", alTocarFuera);
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.removeEventListener("pointerdown", alTocarFuera);
    };
  }, [palabraActiva, cerrarPlato]);

  const tocarPalabra = (idx) => {
    if (palabraActiva === idx) { cerrarPlato(); return; }
    mostrarPalabra(idx);
  };

  const fotoPlato = palabraActiva !== null ? palabras[palabraActiva]?.imagen : null;

  // ----- Menú del móvil: <dialog> modal con showModal() --------------------
  const botonMenuRef = useRef(null);
  const cerrarMenuRef = useRef(null);
  const menuDialogRef = useRef(null);
  const devolverFocoMenuRef = useRef(true);
  useEffect(() => {
    const dialog = menuDialogRef.current;
    if (!dialog) return undefined;
    if (menuOpen) {
      devolverFocoMenuRef.current = true;
      if (!dialog.open) dialog.showModal();
      cerrarMenuRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
    return undefined;
  }, [menuOpen]);
  const cerrarMenuYVolver = () => { devolverFocoMenuRef.current = true; setMenuOpen(false); };
  const navegarDesdeMenu = (href) => {
    devolverFocoMenuRef.current = false;
    setMenuOpen(false);
    window.requestAnimationFrame(() => {
      const destino = href?.startsWith("#") ? document.getElementById(href.slice(1)) : null;
      if (!destino) return;
      if (!destino.hasAttribute("tabindex")) destino.setAttribute("tabindex", "-1");
      destino.focus({ preventScroll: true });
      destino.scrollIntoView();
    });
  };

  // ----- Estado y horario de cada puesto ---------------------------------
  const estadoPuesto = (puesto) => textoEstadoPuesto(puesto, ahora, t);
  const [horariosAbiertos, setHorariosAbiertos] = useState({});
  const abrirHorario = (idx) => setHorariosAbiertos((prev) => ({ ...prev, [idx]: true }));
  const conNombre = (plantilla, puesto) => String(plantilla || "").replace("{p}", puesto.nombre[lang]);

  const eventoSlides = eventoFotos.map((foto) => ({
    src: getImage(foto.key, foto.src), width: foto.w, height: foto.h, alt: foto.alt[lang],
  }));

  const moverTira = (dir) => {
    const tira = tiraRef.current;
    if (!tira) return;
    tira.scrollBy({ left: dir * tira.clientWidth * 0.8, behavior: "smooth" });
  };

  const enlacesNav = [
    { href: "#novedades", texto: t.novedades },
    ...(MOSTRAR_PRODUCTOS ? [{ href: "#productos", texto: t.productos }] : []),
    { href: "#donde", texto: t.horario },
    { href: "#nosotros", texto: t.equipoTitulo },
    { href: "#contacto", texto: t.contacto },
  ];

  const selectorIdioma = (
    <div role="group" aria-label={t.idioma} className="inline-flex self-start rounded-full border border-tinta/15 p-0.5 text-sm font-semibold">
      {["es", "en"].map((codigo) => (
        <button key={codigo} type="button" onClick={() => setLang(codigo)} aria-pressed={lang === codigo}
          aria-label={codigo === "en" ? "EN — English" : "ES — Español"}
          className={`min-h-10 min-w-11 rounded-full px-3 transition-colors ${lang === codigo ? "bg-tinta text-pared" : "text-grafito hover:text-tinta"}`}>
          {codigo.toUpperCase()}
        </button>
      ))}
    </div>
  );
  // En el móvil basta con un botón con el otro idioma.
  const otroIdioma = lang === "es" ? "en" : "es";
  const botonIdiomaMovil = (
    <button type="button" onClick={() => setLang(otroIdioma)} lang={otroIdioma}
      aria-label={otroIdioma === "en" ? "EN — English" : "ES — Español"}
      className="inline-flex size-11 items-center justify-center rounded-full border border-tinta/15 text-sm font-semibold sm:hidden">
      {otroIdioma.toUpperCase()}
    </button>
  );

  const botonesAdmin = isAdmin && (
    <>
      <button type="button" onClick={() => { setEditMode((v) => !v); setEditKey(null); }} title={editMode ? "Salir de edición" : "Editar página"}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${editMode ? "border-tinta bg-tinta text-pared" : "border-tinta/15 text-tinta hover:border-tinta"}`}>
        <Pencil className="size-4" aria-hidden="true" strokeWidth={2} />
        <span className="hidden lg:inline">{editMode ? "Salir de edición" : "Editar"}</span>
      </button>
      <button type="button" onClick={handleExitAdmin} title="Salir de admin"
        className="inline-flex items-center rounded-full border border-banderilla/30 p-2 text-banderilla transition-colors hover:bg-banderilla hover:text-pared">
        <LogOut className="size-4" aria-hidden="true" strokeWidth={2} />
      </button>
    </>
  );

  const puntoEstado = (estado, sobreNegro = false) => (
    <span aria-hidden="true" className={`size-2.5 shrink-0 rounded-full ${estado.abierto
      ? (sobreNegro ? "bg-hoja" : "bg-oliva")
      : (sobreNegro ? "border-2 border-pared/55" : "border-2 border-grafito/45")}`}></span>
  );

  const heroSrc = getImage("hero", heroImg);
  const heroEsEstatica = typeof heroSrc === "string" && heroSrc.endsWith("/images/supabase/home-hero.jpg");
  const webpEstatica = (src) => (typeof src === "string" && src.startsWith("/images/supabase/home-") && src.endsWith(".jpg")
    ? src.replace(/\.jpg$/, ".webp")
    : src);

  return (
    <div className="min-h-screen bg-pared text-tinta">
      <a href="#puestos" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-tinta focus:px-4 focus:py-2 focus:text-pared">
        {t.saltarPuestos}
      </a>

      <header className={`sticky top-0 z-50 bg-pared/95 backdrop-blur-sm transition-shadow duration-300 ${scrolled ? "shadow-[0_6px_20px_-12px_rgba(0,0,0,0.35)]" : ""}`}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:h-20 md:px-8" aria-label={t.menu}>
          <a href="#inicio" className="shrink-0" aria-label={t.inicio}>
            <LogoAntequera className="h-9 w-auto md:h-11" />
          </a>
          <div className="hidden items-center gap-7 text-[0.95rem] font-medium lg:flex">
            {enlacesNav.map((enlace) => (
              <a key={enlace.href} href={enlace.href} className="text-grafito no-underline transition-colors hover:text-tinta hover:underline">{enlace.texto}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">{botonesAdmin}</div>
            <div className="hidden sm:block">{selectorIdioma}</div>
            {botonIdiomaMovil}
            <a href="#puestos" className="inline-flex min-h-11 items-center rounded-full bg-oliva-hondo px-4 text-sm font-semibold text-pared no-underline transition-colors hover:bg-tinta md:px-5">{t.verCartas}</a>
            <button ref={botonMenuRef} type="button" onClick={() => setMenuOpen(true)} className="inline-flex size-11 items-center justify-center rounded-full border border-tinta/15 lg:hidden" aria-label={t.abrirMenu} aria-expanded={menuOpen} aria-controls="menu-movil">
              <Menu className="size-5" aria-hidden="true" strokeWidth={2} />
            </button>
          </div>
        </nav>
        {isAdmin && (
          <div className="border-t border-tinta/10 bg-cal">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2 md:px-8">
              <Link to="/admin/asistente" className="rounded-full bg-tinta px-4 py-2 text-sm font-semibold text-pared no-underline">Pedir cambios con el asistente</Link>
              <div className="flex items-center gap-2 md:hidden">{botonesAdmin}</div>
              {(documentError || savingContent) && (
                <p className={`text-sm font-semibold ${documentError ? "text-banderilla" : "text-grafito"}`} role="status">{documentError || "Guardando cambios…"}</p>
              )}
            </div>
          </div>
        )}
      </header>

      <dialog ref={menuDialogRef} id="menu-movil" aria-label={t.menu}
        onCancel={(e) => { e.preventDefault(); cerrarMenuYVolver(); }}
        onClose={() => { setMenuOpen(false); if (devolverFocoMenuRef.current) botonMenuRef.current?.focus(); devolverFocoMenuRef.current = true; }}
        onClick={(e) => { if (e.target === menuDialogRef.current) cerrarMenuYVolver(); }}
        onKeyDown={(e) => {
          if (e.key !== "Tab") return;
          const enfocables = [...e.currentTarget.querySelectorAll("a[href], button:not([disabled])")];
          if (!enfocables.length) return;
          const primero = enfocables[0];
          const ultimo = enfocables[enfocables.length - 1];
          if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
          else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
        }}
        className="fixed inset-y-0 left-auto right-0 z-[60] m-0 h-dvh max-h-none w-[86%] max-w-sm border-0 bg-transparent p-0 shadow-2xl backdrop:bg-tinta/50 lg:hidden">
        <div className="flex h-full flex-col bg-pared text-tinta">
          <div className="flex h-16 items-center justify-between border-b border-tinta/10 px-5">
            <LogoAntequera className="h-8 w-auto" />
            <button ref={cerrarMenuRef} type="button" onClick={cerrarMenuYVolver} className="inline-flex size-11 items-center justify-center rounded-full border border-tinta/15" aria-label={t.cerrarMenu}>
              <X className="size-5" aria-hidden="true" strokeWidth={2} />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-6">
            {enlacesNav.map((enlace) => (
              <a key={enlace.href} href={enlace.href} onClick={() => navegarDesdeMenu(enlace.href)} className="ancho-titular border-b border-tinta/10 py-4 text-2xl font-bold text-tinta no-underline">{enlace.texto}</a>
            ))}
            {isAdmin && (
              <div className="mt-6 flex flex-col gap-2">
                <button type="button" onClick={() => { setEditMode((v) => !v); setEditKey(null); cerrarMenuYVolver(); }}
                  className={`w-full rounded-full border py-3 text-sm font-semibold ${editMode ? "border-tinta bg-tinta text-pared" : "border-tinta/20"}`}>
                  {editMode ? "Salir de edición" : "Editar página"}
                </button>
                <button type="button" onClick={handleExitAdmin} className="w-full rounded-full border border-banderilla/30 py-3 text-sm font-semibold text-banderilla">Salir de admin</button>
              </div>
            )}
          </div>
        </div>
      </dialog>

      <main>
        {/* La pared ------------------------------------------------------- */}
        <section id="inicio" className="scroll-mt-24 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 pb-10 pt-7 md:px-8 md:pb-16 md:pt-14">
            {/* Móvil: titular, foto y entradilla. Escritorio: titular a la izquierda y la vitrina al lado. */}
            <div className="grid gap-x-8 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:items-start">
              <div className="lg:col-span-8 lg:row-start-1">
                {tEdit("tituloPortada") || <h1 {...editable("tituloPortada", "ancho-titular equilibrado text-[2.6rem] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[5.25rem]")}>{t.tituloPortada}</h1>}
              </div>
              <figure className="relative m-0 mt-5 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:mt-0">
                <img src={heroEsEstatica ? "/images/supabase/home-hero-800.webp" : heroSrc}
                  srcSet={heroEsEstatica ? "/images/supabase/home-hero-600.webp 600w, /images/supabase/home-hero-800.webp 800w, /images/supabase/home-hero.webp 1200w" : undefined}
                  sizes="(min-width: 1024px) 33vw, 100vw" alt={t.vitrinaAlt} fetchPriority="high" decoding="async" width="1200" height="900"
                  className="aspect-[16/10] w-full rounded-md object-cover lg:aspect-[4/3]" />
                {isAdmin && editMode && (
                  <button type="button" onClick={() => openImageUpload("hero")} className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-tinta/80 px-3 py-1.5 text-xs font-semibold text-pared">
                    <Camera className="size-3.5" aria-hidden="true" strokeWidth={2} />Cambiar foto
                  </button>
                )}
              </figure>
              <div className="lg:col-span-8 lg:row-start-2">
                {tEdit("entradaPortada") || <p {...editable("entradaPortada", "mt-4 max-w-[60ch] text-lg leading-relaxed text-grafito md:mt-5 md:text-xl")}>{t.entradaPortada}</p>}
              </div>
            </div>

            <div className="relative mt-7 md:mt-12">
              <p className="mb-3 text-sm text-grafito">{puedePasarRaton ? t.ayudaRaton : t.ayudaToque}</p>
              <div ref={paredRef} className="relative" style={platoPos?.sobra ? { paddingBottom: platoPos.sobra + 12 } : undefined}
                onMouseLeave={() => { if (puedePasarRaton) cerrarPlato(); }}>
                <p className="ancho-pared text-[1.85rem] font-medium leading-[1.08] tracking-[-0.01em] sm:text-[2.6rem] lg:text-[3.6rem]">
                  {palabras.map((palabra, idx) => {
                    // La última palabra visible en el móvil no lleva coma colgando.
                    const final = idx === palabras.length - 1 ? "" : idx === PALABRAS_MOVIL - 1 ? <span className="hidden sm:inline">, </span> : ", ";
                    const activa = palabraActiva === idx;
                    if (!palabra.imagen) {
                      return (
                        <span key={palabra.es} className={`palabra-entra text-grafito ${idx >= PALABRAS_MOVIL ? "hidden sm:inline" : ""}`} style={{ "--i": idx }}>{palabra[lang]}{final}</span>
                      );
                    }
                    return (
                      <span key={palabra.es} className={`palabra-entra ${idx >= PALABRAS_MOVIL ? "hidden sm:inline" : ""}`} style={{ "--i": idx }}>
                        <button type="button" ref={(nodo) => { palabraRefs.current[idx] = nodo; }}
                          onMouseEnter={() => { if (puedePasarRaton) mostrarPalabra(idx); }}
                          onClick={() => tocarPalabra(idx)} aria-pressed={activa} aria-controls={activa ? "plato-pared" : undefined}
                          className={`cursor-pointer rounded-sm text-left decoration-[0.06em] underline-offset-[0.14em] transition-colors ${activa ? "text-oliva-hondo underline" : "hover:text-oliva-hondo"}`}>
                          {palabra[lang]}
                        </button>{final}
                      </span>
                    );
                  })}
                </p>
                {fotoPlato && platoPos && (
                  <figure id="plato-pared" key={palabraActiva} className="plato-entra absolute z-10 m-0 overflow-hidden rounded-md bg-pared shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)]"
                    style={{ left: platoPos.left, top: platoPos.top, width: platoPos.ancho }}>
                    <img src={platoPos.ancho < 260 ? miniaturaDeImagen(fotoPlato) : fotoPlato} alt={palabras[palabraActiva][lang]} className="aspect-[4/3] w-full object-cover" decoding="async" />
                    <figcaption className="flex items-center justify-between gap-2 py-1 pl-3 pr-1 text-sm font-semibold">
                      {palabras[palabraActiva][lang]}
                      <button type="button" onClick={() => cerrarPlato(true)} className="inline-flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-cal" aria-label={t.cerrarFoto}>
                        <X className="size-4" aria-hidden="true" strokeWidth={2} />
                      </button>
                    </figcaption>
                  </figure>
                )}
              </div>
            </div>
          </div>

          {/* La barra: los tres puestos, abiertos o cerrados ahora mismo. */}
          <div id="puestos" className="scroll-mt-16 bg-tinta text-pared md:scroll-mt-20">
            <div className="mx-auto grid max-w-7xl gap-px bg-pared/15 md:grid-cols-3">
              {puestos.map((puesto, idx) => {
                const estado = estadoPuesto(puesto);
                return (
                  <div key={idx} className="flex flex-col gap-3 bg-tinta px-4 py-5 md:gap-4 md:px-8 md:py-9">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="ancho-titular text-3xl font-bold tracking-[-0.02em] md:text-[2.1rem]">{puesto.nombre[lang]}</h2>
                      <a href={`#horario-${idx}`} onClick={() => abrirHorario(idx)} className="inline-flex min-h-11 items-center text-sm text-pared/75 hover:text-pared"
                        aria-label={`${t.horarioSemana}: ${puesto.nombre[lang]}`}>{t.horario}</a>
                    </div>
                    {estado && (
                      <p className="flex items-center gap-2.5 text-[0.95rem]">
                        {puntoEstado(estado, true)}
                        <span className={estado.abierto ? "text-pared" : "text-pared/80"}>{estado.texto}</span>
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
                      <Link to={puesto.rutaCarta} aria-label={conNombre(t.verCartaDe, puesto)}
                        className="inline-flex min-h-11 items-center rounded-full bg-oliva px-5 font-semibold text-tinta no-underline transition-colors hover:bg-hoja">
                        {t.verCarta}
                      </Link>
                      <a href={puesto.mapa} target="_blank" rel="noreferrer" aria-label={conNombre(t.comoLlegarA, puesto)}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-pared/30 px-5 font-semibold text-pared no-underline transition-colors hover:border-pared">
                        <MapPin className="size-4" aria-hidden="true" strokeWidth={2} />
                        {t.comoLlegar}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Novedades: Gastro Ingenio -------------------------------------- */}
        <section id="novedades" className="scroll-mt-20 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            {tEdit("novedadTituloV2") || <h2 {...editable("novedadTituloV2", "ancho-titular equilibrado max-w-4xl text-4xl font-extrabold leading-[1] tracking-[-0.03em] md:text-6xl")}>{t.novedadTituloV2}</h2>}
            {tEdit("novedadTextoV2") || <p {...editable("novedadTextoV2", "mt-4 max-w-[62ch] text-lg leading-relaxed text-grafito")}>{t.novedadTextoV2}</p>}
            {tEdit("novedadLugar") || <p {...editable("novedadLugar", "mt-2 flex items-center gap-2 font-semibold")}><MapPin className="size-4 text-oliva-hondo" aria-hidden="true" strokeWidth={2} />{t.novedadLugar}</p>}
          </div>

          <div className="relative mt-8 md:mt-10">
            <div ref={tiraRef} className="tira-fotos flex gap-3 overflow-x-auto pb-4 md:gap-4">
              {eventoFotos.map((foto, idx) => {
                const src = getImage(foto.key, foto.sm);
                const vertical = foto.h > foto.w;
                return (
                  <figure key={foto.key} className={`relative m-0 shrink-0 snap-start ${vertical ? "w-[58vw] sm:w-[260px] md:w-[300px]" : "w-[78vw] sm:w-[460px] md:w-[540px]"}`}>
                    <button type="button" onClick={() => setLightboxIndex(idx)} className="group block w-full cursor-zoom-in overflow-hidden rounded-md focus-visible:outline-offset-[-3px]" aria-label={`${t.ampliarFoto}: ${foto.alt[lang]}`}>
                      <img src={src} alt={foto.alt[lang]} loading="lazy" decoding="async" width={foto.w} height={foto.h}
                        className="h-[340px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] md:h-[420px]" />
                    </button>
                    {isAdmin && editMode && (
                      <button type="button" onClick={() => openImageUpload(foto.key)} className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-tinta/80 px-3 py-1.5 text-xs font-semibold text-pared">
                        <Camera className="size-3.5" aria-hidden="true" strokeWidth={2} />Cambiar foto
                      </button>
                    )}
                  </figure>
                );
              })}
            </div>
            <div className="mx-auto hidden max-w-7xl justify-end gap-2 px-8 md:flex">
              <button type="button" onClick={() => moverTira(-1)} className="inline-flex size-11 items-center justify-center rounded-full border border-tinta/15 transition-colors hover:border-tinta" aria-label={t.fotoAnterior}>
                <ChevronLeft className="size-5" aria-hidden="true" strokeWidth={2} />
              </button>
              <button type="button" onClick={() => moverTira(1)} className="inline-flex size-11 items-center justify-center rounded-full border border-tinta/15 transition-colors hover:border-tinta" aria-label={t.fotoSiguiente}>
                <ChevronRight className="size-5" aria-hidden="true" strokeWidth={2} />
              </button>
            </div>
          </div>
          <Lightbox open={!!fotoAmpliada} close={() => setFotoAmpliada(null)} slides={fotoAmpliada ? [fotoAmpliada] : []}
            render={{ buttonPrev: () => null, buttonNext: () => null }} carousel={{ finite: true }} labels={{ Close: t.cerrar }} />
          <Lightbox open={lightboxIndex >= 0} index={Math.max(lightboxIndex, 0)} close={() => setLightboxIndex(-1)} slides={eventoSlides}
            labels={{ Previous: t.fotoAnterior, Next: t.fotoSiguiente, Close: t.cerrar }} />
        </section>

        {/* Productos: lista compacta ------------------------------------- */}
        {(MOSTRAR_PRODUCTOS || editMode) && (
        <section id="productos" className="scroll-mt-20 bg-cal py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            {tEdit("productosTitulo") || <h2 {...editable("productosTitulo", "ancho-titular text-3xl font-extrabold tracking-[-0.03em] md:text-5xl")}>{t.productosTitulo}</h2>}

            <ul className="mt-6 border-t-2 border-tinta md:mt-8">
              {productos.map((producto, idx) => {
                const unico = producto.items.length === 1 && !editMode;
                const isOpen = !unico && (editMode || (openProductos[idx] ?? false));
                const sectionProductImageKeys = getSectionProductImageKeys(producto.items);
                const imagenDe = (item, itemIdx) => {
                  const claveFoto = FOTO_CORREGIDA[`${normalizeKey(item.nombre.es)}|${item.imagenKey}`] || item.imagenKey;
                  const fallbackImg = item.imagen
                    || (claveFoto ? availableProductImages[claveFoto] : null)
                    || resolveSharedProductImage(item.nombre.es, availableProductImages, sectionProductImageKeys);
                  return getImage(`producto-${idx}-${itemIdx}`, itemIdx === 0 ? getImage(`producto-${idx}`, fallbackImg) : fallbackImg);
                };
                const portada = producto.items[0] ? imagenDe(producto.items[0], 0) : null;
                const panelId = `producto-panel-${idx}`;
                return (
                  <li key={idx} className="border-b border-tinta/20">
                    <div className="relative flex items-center gap-4 py-3 md:gap-8">
                      <div className="min-w-0 flex-1">
                        {editKey === `prod-${idx}` ? (
                          <EditInputs esVal={editES} enVal={editEN} setEsVal={setEditES} setEnVal={setEditEN} onSave={() => saveProducto(idx)} onCancel={() => setEditKey(null)} autoTranslate />
                        ) : editMode ? (
                          <h3 onClick={() => startEdit(`prod-${idx}`, producto.nombre.es, producto.nombre.en)} className="ancho-pared cursor-text text-2xl font-semibold outline-2 outline-dashed outline-oliva/50 md:text-4xl">{producto.nombre[lang]}</h3>
                        ) : unico ? (
                          <h3 className="ancho-pared text-2xl font-semibold leading-tight tracking-[-0.01em] md:text-4xl">{producto.nombre[lang]}</h3>
                        ) : (
                          <h3 className="m-0">
                            <button type="button" onClick={() => setOpenProductos((prev) => ({ ...prev, [idx]: !isOpen }))} aria-expanded={isOpen} aria-controls={panelId}
                              className="ancho-pared w-full cursor-pointer text-left text-2xl font-semibold leading-tight tracking-[-0.01em] transition-colors hover:text-oliva-hondo md:text-4xl">
                              {producto.nombre[lang]}
                            </button>
                          </h3>
                        )}
                      </div>
                      {portada && unico && (
                        <button type="button" onClick={() => setFotoAmpliada({ src: portada, alt: producto.items[0].nombre[lang] })} className="shrink-0 cursor-zoom-in overflow-hidden rounded-md focus-visible:outline-offset-[-3px]" aria-label={`${t.ampliarFoto}: ${producto.items[0].nombre[lang]}`}>
                          <img src={miniaturaDeImagen(portada)} alt="" loading="lazy" decoding="async" className="h-16 w-24 object-cover transition-transform duration-500 hover:scale-105 md:h-20 md:w-28" />
                        </button>
                      )}
                      {portada && !unico && !isOpen && (
                        <img src={miniaturaDeImagen(portada)} alt="" loading="lazy" decoding="async" className="hidden h-16 w-24 shrink-0 rounded-md object-cover sm:block md:h-20 md:w-28" />
                      )}
                      {!editMode && !unico && (
                        <button type="button" onClick={() => setOpenProductos((prev) => ({ ...prev, [idx]: !isOpen }))} aria-expanded={isOpen} aria-controls={panelId}
                          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-tinta/20 transition-colors hover:border-tinta" aria-label={isOpen ? t.ocultar : t.verMas}>
                          <Plus className={`size-5 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} aria-hidden="true" strokeWidth={2} />
                        </button>
                      )}
                      {editMode && editKey !== `prod-${idx}` && (
                        <button type="button" onClick={() => deleteProducto(idx)} className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-banderilla hover:bg-banderilla/10" title="Eliminar">
                          <Trash2 className="size-4" aria-hidden="true" strokeWidth={2} />
                        </button>
                      )}
                    </div>
                    {isOpen && (
                      <div id={panelId} className="pb-6">
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                          {producto.items.map((item, itemIdx) => {
                            const itemImg = imagenDe(item, itemIdx);
                            const isUploading = uploadingImage === imageKey(`producto-${idx}-${itemIdx}`);
                            return (
                              <figure key={itemIdx} className="relative m-0">
                                <div className="aspect-[4/3] overflow-hidden rounded-md bg-pared">
                                  {itemImg ? (
                                    <img src={itemImg} alt={item.nombre[lang]} loading="lazy" decoding="async" className="size-full object-cover" />
                                  ) : (
                                    <span className="flex size-full items-center justify-center text-sm text-grafito/60">{t.sinFoto}</span>
                                  )}
                                </div>
                                {editKey === `prod-${idx}-item-${itemIdx}` ? (
                                  <div className="mt-2 rounded-md bg-pared p-2">
                                    <EditInputs esVal={editES} enVal={editEN} setEsVal={setEditES} setEnVal={setEditEN} onSave={() => saveProductoItem(idx, itemIdx)} onCancel={() => setEditKey(null)} autoTranslate />
                                  </div>
                                ) : (
                                  <figcaption onClick={editMode ? () => startEdit(`prod-${idx}-item-${itemIdx}`, item.nombre.es, item.nombre.en) : undefined}
                                    className={`mt-2 font-semibold leading-snug ${editMode ? "cursor-text outline-2 outline-dashed outline-oliva/50" : ""}`}>{item.nombre[lang]}</figcaption>
                                )}
                                {((isAdmin && editMode) || isUploading) && (
                                  <button type="button" onClick={() => openImageUpload(`producto-${idx}-${itemIdx}`)} className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full bg-tinta/80 px-3 py-1.5 text-xs font-semibold text-pared">
                                    <Camera className="size-3.5" aria-hidden="true" strokeWidth={2} />{isUploading ? "Guardando…" : "Cambiar foto"}
                                  </button>
                                )}
                                {editMode && editKey !== `prod-${idx}-item-${itemIdx}` && (
                                  <button type="button" onClick={() => deleteProductoItem(idx, itemIdx)} className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-pared text-banderilla" title="Eliminar producto">
                                    <Trash2 className="size-4" aria-hidden="true" strokeWidth={2} />
                                  </button>
                                )}
                              </figure>
                            );
                          })}
                          {editMode && (
                            <button type="button" onClick={() => addProductoItem(idx)} className="flex aspect-[4/3] items-center justify-center rounded-md border-2 border-dashed border-tinta/25 text-sm font-semibold text-grafito hover:border-tinta">
                              + Añadir producto dentro
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            {editMode && (
              <button type="button" onClick={addProducto} className="mt-6 w-full rounded-md border-2 border-dashed border-tinta/25 py-5 text-sm font-semibold text-grafito hover:border-tinta">
                + Añadir producto
              </button>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <p className="font-semibold">{t.cartaCompleta}</p>
              {puestos.map((puesto, idx) => (
                <Link key={idx} to={puesto.rutaCarta} className="ancho-titular inline-flex min-h-11 items-center text-xl font-bold text-oliva-hondo hover:text-tinta">{puesto.nombre[lang]}</Link>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Dónde estamos: foto, lugar y horario de cada puesto ------------- */}
        <section id="donde" className="scroll-mt-20 py-16 md:py-24" aria-labelledby="donde-titulo">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            {tEdit("dondeTitulo") || <h2 id="donde-titulo" {...editable("dondeTitulo", "ancho-titular text-3xl font-extrabold tracking-[-0.03em] md:text-5xl")}>{t.dondeTitulo}</h2>}

            <div className="mt-8 grid gap-12 md:grid-cols-3 md:gap-8">
              {puestos.map((puesto, idx) => {
                const estado = estadoPuesto(puesto);
                const horario = puesto.horario?.[lang] || [];
                const lugar = puesto.lugar?.[lang] || "";
                return (
                  <article key={idx} id={`puesto-${idx}`} className="scroll-mt-24">
                    <div className="relative">
                      <img src={webpEstatica(getImage(`puesto-${idx}`, puesto.imagen))} alt={puesto.nombre[lang]} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-md object-cover" />
                      {isAdmin && editMode && (
                        <button type="button" onClick={() => openImageUpload(`puesto-${idx}`)} className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-tinta/80 px-3 py-1.5 text-xs font-semibold text-pared">
                          <Camera className="size-3.5" aria-hidden="true" strokeWidth={2} />Cambiar foto
                        </button>
                      )}
                    </div>
                    {editKey === `puesto-${idx}-nombre` ? (
                      <div className="mt-4"><EditInputs esVal={editES} enVal={editEN} setEsVal={setEditES} setEnVal={setEditEN} onSave={() => savePuesto(idx, "nombre")} onCancel={() => setEditKey(null)} /></div>
                    ) : (
                      <h3 onClick={editMode ? () => startEdit(`puesto-${idx}-nombre`, puesto.nombre.es, puesto.nombre.en) : undefined}
                        className={`ancho-titular mt-4 text-2xl font-extrabold tracking-[-0.02em] md:text-3xl ${editMode ? "cursor-text outline-2 outline-dashed outline-oliva/50" : ""}`}>{puesto.nombre[lang]}</h3>
                    )}
                    {editKey === `puesto-${idx}-lugar` ? (
                      <div className="mt-2"><EditInputs esVal={editES} enVal={editEN} setEsVal={setEditES} setEnVal={setEditEN} onSave={() => savePuesto(idx, "lugar")} onCancel={() => setEditKey(null)} /></div>
                    ) : (lugar || editMode) && (
                      <p onClick={editMode ? () => startEdit(`puesto-${idx}-lugar`, puesto.lugar?.es || "", puesto.lugar?.en || "") : undefined}
                        className={`mt-1 font-semibold ${editMode ? "cursor-text text-grafito outline-2 outline-dashed outline-oliva/50" : ""}`}>{lugar || "Añadir referencia del lugar (calle, plaza…)"}</p>
                    )}
                    {estado && (
                      <p className="mt-3 flex items-center gap-2.5">
                        {puntoEstado(estado)}
                        {estado.texto}
                      </p>
                    )}
                    {horario.length > 0 && (
                      <details id={`horario-${idx}`} className="mt-2 scroll-mt-24" open={!!horariosAbiertos[idx]}
                        onToggle={(e) => { const abierto = e.currentTarget.open; setHorariosAbiertos((prev) => ({ ...prev, [idx]: abierto })); }}>
                        <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-semibold text-grafito underline decoration-tinta/30 hover:text-tinta">{t.horarioSemana}</summary>
                        <table className="cifras mb-2 w-full text-[0.95rem]">
                          <caption className="sr-only">{t.horario} {puesto.nombre[lang]}</caption>
                          <tbody>
                            {horario.map((franja, dia) => (
                              <tr key={dia} className={`border-b border-tinta/10 ${dia === ahora.dia ? "font-bold text-tinta" : "text-grafito"}`}>
                                <th scope="row" className="py-1.5 text-left font-[inherit]">
                                  {franja.dia}{dia === ahora.dia && <span className="ml-2 rounded-full bg-hoja/40 px-2 py-0.5 text-xs font-semibold text-tinta">{t.hoy}</span>}
                                </th>
                                <td className="py-1.5 text-right">{franja.hora}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </details>
                    )}
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      <Link to={puesto.rutaCarta} aria-label={conNombre(t.verCartaDe, puesto)} className="inline-flex min-h-11 items-center rounded-full bg-tinta px-5 font-semibold text-pared no-underline transition-colors hover:bg-oliva-hondo">
                        {t.verCarta}
                      </Link>
                      <a href={puesto.mapa} target="_blank" rel="noreferrer" aria-label={conNombre(t.comoLlegarA, puesto)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-tinta/20 px-5 font-semibold text-tinta no-underline transition-colors hover:border-tinta">
                        <MapPin className="size-4" aria-hidden="true" strokeWidth={2} />{t.comoLlegar}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* El equipo: la foto manda; el texto es su pie ------------------ */}
        <section id="nosotros" className="scroll-mt-20 bg-cal py-14 md:py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            {tEdit("equipoTitulo") || <h2 {...editable("equipoTitulo", "ancho-titular text-3xl font-extrabold tracking-[-0.03em] md:text-5xl")}>{t.equipoTitulo}</h2>}
            <figure className="relative m-0 mt-6">
              <img src={getImage("equipo", gastroEquipo)} alt={t.equipoAlt} loading="lazy" decoding="async" className="aspect-[3/2] w-full rounded-md object-cover" />
              {isAdmin && editMode && (
                <button type="button" onClick={() => openImageUpload("equipo")} className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-tinta/80 px-3 py-1.5 text-xs font-semibold text-pared">
                  <Camera className="size-3.5" aria-hidden="true" strokeWidth={2} />Cambiar foto
                </button>
              )}
              {tEdit("equipoPie") || <figcaption {...editable("equipoPie", "mt-3 text-grafito")}>{t.equipoPie}</figcaption>}
            </figure>
          </div>
        </section>
      </main>

      {/* Contacto y pie: la pizarra negra -------------------------------- */}
      <footer id="contacto" className="scroll-mt-20 bg-tinta text-pared">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          {tEdit("contactoTitulo") || <h2 {...editable("contactoTitulo", "ancho-titular text-3xl font-extrabold tracking-[-0.03em] md:text-5xl")}>{t.contactoTitulo}</h2>}
          <ul className="mt-6 flex flex-col gap-1">
            <li><a href="tel:+34619818171" className="cifras ancho-titular inline-flex min-h-11 items-center gap-3 text-2xl font-bold text-pared no-underline hover:text-hoja md:text-4xl"><Phone className="size-5 text-hoja md:size-6" aria-hidden="true" strokeWidth={2} />619 81 81 71</a></li>
            <li><a href="tel:+34617883822" className="cifras ancho-titular inline-flex min-h-11 items-center gap-3 text-2xl font-bold text-pared no-underline hover:text-hoja md:text-4xl"><Phone className="size-5 text-hoja md:size-6" aria-hidden="true" strokeWidth={2} />617 883 822</a></li>
            <li><a href="mailto:encurtidos@antequeracanarias.com" className="mt-1 inline-flex min-h-11 items-center gap-3 break-all text-lg text-pared underline decoration-pared/30 hover:decoration-pared md:text-xl"><Mail className="size-5 shrink-0 text-hoja" aria-hidden="true" strokeWidth={2} />encurtidos@antequeracanarias.com</a></li>
          </ul>

          <div className="mt-14 flex flex-col gap-6 border-t border-pared/15 pt-8 md:flex-row md:items-start md:justify-between">
            <LogoAntequera claro className="h-9 w-auto" />
            <nav aria-label={t.cartas} className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {puestos.map((puesto, idx) => (
                <Link key={idx} to={puesto.rutaCarta} className="inline-flex min-h-11 items-center text-pared/80 hover:text-pared">{conNombre(t.verCartaDe, puesto)}</Link>
              ))}
            </nav>
            <div className="max-w-xs text-sm text-pared/80">
              {tEdit("trabajaTitulo") || <p {...editable("trabajaTitulo", "font-semibold text-pared")}>{t.trabajaTitulo}</p>}
              {tEdit("trabajaTexto") || <p {...editable("trabajaTexto", "")}>{t.trabajaTexto}</p>}
              <a href="mailto:encurtidos@antequeracanarias.com?subject=Curr%C3%ADculum%20Antequera%20Encurtidos" className="inline-flex min-h-11 items-center font-semibold text-pared underline decoration-pared/30 hover:decoration-pared">{t.enviarCV}</a>
            </div>
          </div>
          <p className="mt-8 text-sm text-pared/60">© {new Date().getFullYear()} Antequera Encurtidos</p>
        </div>
      </footer>

      {isAdmin && (
        <>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
        </>
      )}

      {isAdmin && uploadMenu && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-tinta/50 p-4" onClick={() => setUploadMenu(null)}>
          <div className="w-full max-w-sm overflow-hidden rounded-xl bg-pared pb-2" onClick={(e) => e.stopPropagation()}>
            <p className="border-b border-tinta/10 py-4 text-center text-sm font-semibold">{lang === "es" ? "Cambiar foto" : "Change photo"}</p>
            <button type="button" onClick={() => handleMenuOption("camera")} className="flex w-full items-center gap-4 border-b border-tinta/10 px-6 py-4 font-medium active:bg-cal">
              <Camera className="size-5" aria-hidden="true" strokeWidth={2} />Cámara
            </button>
            <button type="button" onClick={() => handleMenuOption("gallery")} className="flex w-full items-center gap-4 border-b border-tinta/10 px-6 py-4 font-medium active:bg-cal">
              <ImageIcon className="size-5" aria-hidden="true" strokeWidth={2} />Galería / Archivos
            </button>
            <button type="button" onClick={() => setUploadMenu(null)} className="w-full py-4 text-sm text-grafito active:bg-cal">{lang === "es" ? "Cancelar" : "Cancel"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
