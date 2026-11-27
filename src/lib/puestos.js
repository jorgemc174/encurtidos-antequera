// Datos y horario de los tres puestos, compartidos por la portada y las cartas.
// La versión publicada vive en Supabase (home_json → puestos); esto es el respaldo.

export const puestosDatos = [
  {
    nombre: { es: "Las Palmas", en: "Las Palmas" },
    descripcion: { es: "Puesto con nuestra selección de aceitunas, encurtidos y tapas tradicionales.", en: "Stand with our selection of olives, pickles and traditional tapas." },
    lugar: { es: "Dentro del Mercado del Puerto.", en: "Inside the Mercado del Puerto." },
    mapa: "https://maps.app.goo.gl/R18Khz2ULXaL5vcc7", rutaCarta: "/carta-las-palmas",
    horario: {
      es: [{ dia: "Lunes", hora: "11:00 - 16:00" }, { dia: "Martes", hora: "11:00 - 24:00" }, { dia: "Miércoles", hora: "11:00 - 24:00" }, { dia: "Jueves", hora: "11:00 - 24:00" }, { dia: "Viernes", hora: "11:00 - 24:00" }, { dia: "Sábado", hora: "11:00 - 24:00" }, { dia: "Domingo", hora: "12:00 - 17:00" }],
      en: [{ dia: "Monday", hora: "11:00 - 16:00" }, { dia: "Tuesday", hora: "11:00 - 24:00" }, { dia: "Wednesday", hora: "11:00 - 24:00" }, { dia: "Thursday", hora: "11:00 - 24:00" }, { dia: "Friday", hora: "11:00 - 24:00" }, { dia: "Saturday", hora: "11:00 - 24:00" }, { dia: "Sunday", hora: "12:00 - 17:00" }],
    },
  },
  {
    nombre: { es: "Gáldar", en: "Gáldar" },
    descripcion: { es: "Un espacio donde disfrutar del sabor de siempre con producto cercano y cuidado.", en: "A place to enjoy traditional flavour with local and carefully selected products." },
    lugar: { es: "", en: "" },
    mapa: "https://maps.app.goo.gl/ACi1i4GrA85HnbZAA", rutaCarta: "/carta-galdar",
    horario: {
      es: [{ dia: "Lunes", hora: "11:00 - 22:00" }, { dia: "Martes", hora: "11:00 - 22:00" }, { dia: "Miércoles", hora: "11:00 - 22:00" }, { dia: "Jueves", hora: "11:00 - 22:00" }, { dia: "Viernes", hora: "12:00 - 24:00" }, { dia: "Sábado", hora: "12:00 - 24:00" }, { dia: "Domingo", hora: "12:00 - 22:00" }],
      en: [{ dia: "Monday", hora: "11:00 - 22:00" }, { dia: "Tuesday", hora: "11:00 - 22:00" }, { dia: "Wednesday", hora: "11:00 - 22:00" }, { dia: "Thursday", hora: "11:00 - 22:00" }, { dia: "Friday", hora: "12:00 - 24:00" }, { dia: "Saturday", hora: "12:00 - 24:00" }, { dia: "Sunday", hora: "12:00 - 22:00" }],
    },
  },
  {
    nombre: { es: "Telde", en: "Telde" },
    descripcion: { es: "Nuestra propuesta con el sabor de siempre, ideal para probar nuestras especialidades.", en: "Our traditional selection, ideal for trying our specialties." },
    lugar: { es: "", en: "" },
    mapa: "https://maps.app.goo.gl/iRxEPQPSHbNWSf5L6", rutaCarta: "/carta-telde",
    horario: {
      es: [{ dia: "Lunes", hora: "11:00 - 01:00" }, { dia: "Martes", hora: "11:00 - 01:00" }, { dia: "Miércoles", hora: "12:00 - 01:00" }, { dia: "Jueves", hora: "12:00 - 02:00" }, { dia: "Viernes", hora: "12:00 - 02:00" }, { dia: "Sábado", hora: "12:00 - 02:00" }, { dia: "Domingo", hora: "11:00 - 01:00" }],
      en: [{ dia: "Monday", hora: "11:00 - 01:00" }, { dia: "Tuesday", hora: "11:00 - 01:00" }, { dia: "Wednesday", hora: "12:00 - 01:00" }, { dia: "Thursday", hora: "12:00 - 02:00" }, { dia: "Friday", hora: "12:00 - 02:00" }, { dia: "Saturday", hora: "12:00 - 02:00" }, { dia: "Sunday", hora: "11:00 - 01:00" }],
    },
  },
];


const DIAS_SEMANA = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

// Día (0 = lunes) y minutos desde medianoche en hora de Canarias, sea cual sea
// la zona horaria del móvil de quien visita la web.
export function ahoraEnCanarias(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Atlantic/Canary", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  return { dia: DIAS_SEMANA[get("weekday")] ?? 0, minutos: Number(get("hour")) * 60 + Number(get("minute")) };
}

const pad = (n) => String(n).padStart(2, "0");
const textoMinutos = (m) => (m === 1440 ? "24:00" : `${pad(Math.floor((m % 1440) / 60))}:${pad(m % 60)}`);

// Lee un día del horario. Admite varios tramos («11:00 - 16:00 / 19:00 - 23:00»)
// y «Cerrado». Devuelve null si no se entiende, para no inventar el estado.
export function parseDia(hora) {
  const texto = String(hora || "").trim();
  if (!texto) return null;
  if (/^(cerrado|closed)$/i.test(texto)) return { cerrado: true, tramos: [] };
  // Toda la cadena tiene que ser tramos «HH:MM - HH:MM» separados por «/», «,», «;» o «y».
  const partes = texto.split(/\s*(?:\/|,|;|\by\b|\band\b)\s*/i);
  const tramos = [];
  for (const parte of partes) {
    const m = /^(\d{1,2})[:.h](\d{2})\s*(?:-|–|—|a|to)\s*(\d{1,2})[:.h](\d{2})$/i.exec(parte);
    if (!m) return null;
    const [h1, m1, h2, m2] = m.slice(1).map(Number);
    if (h1 > 23 || h2 > 24 || m1 > 59 || m2 > 59 || (h2 === 24 && m2 !== 0)) return null;
    const inicio = h1 * 60 + m1;
    let fin = h2 * 60 + m2;
    if (fin === inicio) return null; // ¿24 h o error? No se adivina.
    if (fin < inicio) fin += 1440; // cierra pasada la medianoche
    tramos.push({ inicio, fin });
  }
  if (!tramos.length) return null;
  tramos.sort((x, y) => x.inicio - y.inicio);
  for (let i = 1; i < tramos.length; i++) if (tramos[i].inicio < tramos[i - 1].fin) return null; // solapados
  return { cerrado: false, tramos };
}

export function estadoDelPuesto(horario, ahora) {
  if (!Array.isArray(horario) || horario.length !== 7) return { porConfirmar: true };
  const dias = horario.map((d) => parseDia(d?.hora));
  const hoy = dias[ahora.dia];
  const ayer = dias[(ahora.dia + 6) % 7];
  if (!hoy || !ayer) return { porConfirmar: true };
  const deAyer = ayer.tramos.find((t) => t.fin > 1440 && ahora.minutos < t.fin - 1440);
  if (deAyer) return { abierto: true, hasta: textoMinutos(deAyer.fin - 1440) };
  const ahoraMismo = hoy.tramos.find((t) => ahora.minutos >= t.inicio && ahora.minutos < t.fin);
  if (ahoraMismo) return { abierto: true, hasta: textoMinutos(ahoraMismo.fin) };
  const siguiente = hoy.tramos.find((t) => ahora.minutos < t.inicio);
  if (siguiente) return { abierto: false, abre: textoMinutos(siguiente.inicio) };
  return { abierto: false };
}

// Texto del estado para mostrar: «Abierto hasta las 24:00», «Cerrado. Abre hoy a las 11:00»…
export function textoEstadoPuesto(puesto, ahora, textos) {
  const estado = estadoDelPuesto(puesto?.horario?.es, ahora);
  if (estado.porConfirmar) return { abierto: false, porConfirmar: true, texto: textos.horarioPorConfirmar };
  if (estado.abierto) return { abierto: true, texto: String(textos.abiertoHasta || "").replace("{h}", estado.hasta) };
  if (estado.abre) return { abierto: false, texto: String(textos.cerradoAbreA || "").replace("{h}", estado.abre) };
  return { abierto: false, texto: textos.cerradoAhora };
}

// Normaliza la ruta para encontrar el puesto aunque llegue con barra final.
export const rutaLimpia = (ruta) => (String(ruta || "/").replace(/\/+$/, "") || "/");

// Solo se aceptan los dos idiomas de la web; cualquier otro valor guardado vuelve a español.
export function idiomaGuardado() {
  try {
    const guardado = localStorage.getItem("lang");
    return guardado === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}
