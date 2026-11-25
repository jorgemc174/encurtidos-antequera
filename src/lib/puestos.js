// Datos y horario de los tres puestos, compartidos por la portada y las cartas.
// La versión publicada vive en Supabase (home_json → puestos); esto es el respaldo.

// El horario habitual vuelve a mostrarse al comenzar el 12 de agosto en Canarias.
export const FIN_CIERRE_MERCADO_DEL_PUERTO = Date.parse("2026-08-11T23:00:00Z");

export const puestosDatos = [
  {
    nombre: { es: "Las Palmas", en: "Las Palmas" },
    descripcion: { es: "Puesto con nuestra selección de aceitunas, encurtidos y tapas tradicionales.", en: "Stand with our selection of olives, pickles and traditional tapas." },
    mapa: "https://maps.app.goo.gl/R18Khz2ULXaL5vcc7", rutaCarta: "/carta-las-palmas",
    horario: {
      es: [{ dia: "Lunes", hora: "11:00 - 16:00" }, { dia: "Martes", hora: "11:00 - 24:00" }, { dia: "Miércoles", hora: "11:00 - 24:00" }, { dia: "Jueves", hora: "11:00 - 24:00" }, { dia: "Viernes", hora: "11:00 - 24:00" }, { dia: "Sábado", hora: "11:00 - 24:00" }, { dia: "Domingo", hora: "12:00 - 17:00" }],
      en: [{ dia: "Monday", hora: "11:00 - 16:00" }, { dia: "Tuesday", hora: "11:00 - 24:00" }, { dia: "Wednesday", hora: "11:00 - 24:00" }, { dia: "Thursday", hora: "11:00 - 24:00" }, { dia: "Friday", hora: "11:00 - 24:00" }, { dia: "Saturday", hora: "11:00 - 24:00" }, { dia: "Sunday", hora: "12:00 - 17:00" }],
    },
  },
  {
    nombre: { es: "Gáldar", en: "Gáldar" },
    descripcion: { es: "Un espacio donde disfrutar del sabor de siempre con producto cercano y cuidado.", en: "A place to enjoy traditional flavour with local and carefully selected products." },
    mapa: "https://maps.app.goo.gl/ACi1i4GrA85HnbZAA", rutaCarta: "/carta-galdar",
    horario: {
      es: [{ dia: "Lunes", hora: "11:00 - 22:00" }, { dia: "Martes", hora: "11:00 - 22:00" }, { dia: "Miércoles", hora: "11:00 - 22:00" }, { dia: "Jueves", hora: "11:00 - 22:00" }, { dia: "Viernes", hora: "12:00 - 24:00" }, { dia: "Sábado", hora: "12:00 - 24:00" }, { dia: "Domingo", hora: "12:00 - 22:00" }],
      en: [{ dia: "Monday", hora: "11:00 - 22:00" }, { dia: "Tuesday", hora: "11:00 - 22:00" }, { dia: "Wednesday", hora: "11:00 - 22:00" }, { dia: "Thursday", hora: "11:00 - 22:00" }, { dia: "Friday", hora: "12:00 - 24:00" }, { dia: "Saturday", hora: "12:00 - 24:00" }, { dia: "Sunday", hora: "12:00 - 22:00" }],
    },
  },
  {
    nombre: { es: "Telde", en: "Telde" },
    descripcion: { es: "Nuestra propuesta con el sabor de siempre, ideal para probar nuestras especialidades.", en: "Our traditional selection, ideal for trying our specialties." },
    mapa: "https://maps.app.goo.gl/iRxEPQPSHbNWSf5L6", rutaCarta: "/carta-telde",
    horario: {
      es: [{ dia: "Lunes", hora: "11:00 - 01:00" }, { dia: "Martes", hora: "11:00 - 01:00" }, { dia: "Miércoles", hora: "12:00 - 02:00" }, { dia: "Jueves", hora: "12:00 - 02:00" }, { dia: "Viernes", hora: "12:00 - 02:00" }, { dia: "Sábado", hora: "12:00 - 02:00" }, { dia: "Domingo", hora: "11:00 - 01:00" }],
      en: [{ dia: "Monday", hora: "11:00 - 01:00" }, { dia: "Tuesday", hora: "11:00 - 01:00" }, { dia: "Wednesday", hora: "12:00 - 02:00" }, { dia: "Thursday", hora: "12:00 - 02:00" }, { dia: "Friday", hora: "12:00 - 02:00" }, { dia: "Saturday", hora: "12:00 - 02:00" }, { dia: "Sunday", hora: "11:00 - 01:00" }],
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

function parseTramo(hora) {
  const m = /(\d{1,2})[:.](\d{2})\s*[-–a]+\s*(\d{1,2})[:.](\d{2})/.exec(hora || "");
  if (!m) return null;
  const inicio = Number(m[1]) * 60 + Number(m[2]);
  let fin = Number(m[3]) * 60 + Number(m[4]);
  if (fin <= inicio) fin += 1440;
  return { inicio, fin, textoInicio: `${m[1].padStart(2, "0")}:${m[2]}`, textoFin: `${m[3].padStart(2, "0")}:${m[4]}` };
}

export function estadoDelPuesto(horario, ahora) {
  if (!Array.isArray(horario) || horario.length < 7) return null;
  const hoy = parseTramo(horario[ahora.dia]?.hora);
  const ayer = parseTramo(horario[(ahora.dia + 6) % 7]?.hora);
  if (ayer && ayer.fin > 1440 && ahora.minutos < ayer.fin - 1440) return { abierto: true, hasta: ayer.textoFin };
  if (hoy && ahora.minutos >= hoy.inicio && ahora.minutos < hoy.fin) return { abierto: true, hasta: hoy.textoFin };
  if (hoy && ahora.minutos < hoy.inicio) return { abierto: false, abre: hoy.textoInicio };
  return { abierto: false };
}

// Texto del estado para mostrar: «Abierto hasta las 24:00», «Cerrado. Abre hoy a las 11:00»…
export function textoEstadoPuesto(puesto, idx, ahora, textos, mercadoCerrado) {
  if (idx === 0 && mercadoCerrado) return { abierto: false, texto: textos.mercadoPuertoCerrado };
  const estado = estadoDelPuesto(puesto?.horario?.es, ahora);
  if (!estado) return null;
  if (estado.abierto) return { abierto: true, texto: String(textos.abiertoHasta || "").replace("{h}", estado.hasta) };
  if (estado.abre) return { abierto: false, texto: String(textos.cerradoAbreA || "").replace("{h}", estado.abre) };
  return { abierto: false, texto: textos.cerradoAhora };
}
