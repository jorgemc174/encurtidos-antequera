export type Document = { table: "menu_json" | "home_json"; key: string; data: any };
export type Field = {
  id: string;
  table: Document["table"];
  key: string;
  path: string[];
  label: string;
  value: string;
  kind: "price" | "text";
  seeded?: boolean;
};
export const locations = ["Carta - Gáldar", "Carta - Telde", "Carta - Las Palmas"];

const homeTextDefaults: Record<"es" | "en", Record<string, string>> = {
  es: {
    tituloPortada: "Tapas, aceitunas y cañas",
    entradaPortada: "En el Mercado del Puerto (Las Palmas), en Gáldar y en Telde.",
    novedadTituloV2: "Antequera en Gastro Ingenio",
    novedadTextoV2: "Nuestra barra en el Mercado Gastronómico Navideño de Ingenio: montaditos, perritos, minihamburguesas, banderillas y aceitunas.",
    novedadLugar: "Ingenio, Gran Canaria",
    productosTitulo: "Aceitunas, encurtidos y tapas",
    dondeTitulo: "Dónde estamos",
    equipoTitulo: "El equipo",
    equipoPie: "El equipo de Antequera Encurtidos en Gastro Ingenio.",
    contactoTitulo: "Contacto",
    trabajaTitulo: "Trabaja con nosotros",
    trabajaTexto: "Envíanos tu currículum por correo.",
    enviarCV: "Enviar currículum",
    cartaCompleta: "Carta completa de cada puesto:",
    verCartas: "Cartas",
    verCarta: "Ver carta",
    comoLlegar: "Cómo llegar",
    horarioSemana: "Horario de la semana",
    horarioPorConfirmar: "Horario por confirmar",
    abiertoHasta: "Abierto hasta las {h}",
    cerradoAbreA: "Cerrado. Abre hoy a las {h}",
    cerradoAhora: "Cerrado ahora",
    ayudaToque: "Toca una tapa para ver su foto. La carta cambia según el puesto.",
    ayudaRaton: "Pasa el ratón por una tapa para ver su foto. La carta cambia según el puesto.",
    inicio: "Inicio",
    novedades: "Novedades",
    productos: "Productos",
    horario: "Horario",
    contacto: "Contacto",
    hoy: "Hoy",
  },
  en: {
    tituloPortada: "Tapas, olives and draught beer",
    entradaPortada: "At the Mercado del Puerto in Las Palmas, in Gáldar and in Telde.",
    novedadTituloV2: "Antequera at Gastro Ingenio",
    novedadTextoV2: "Our bar at the Ingenio Christmas food market: montaditos, hot dogs, mini burgers, pickle skewers and olives.",
    novedadLugar: "Ingenio, Gran Canaria",
    productosTitulo: "Olives, pickles and tapas",
    dondeTitulo: "Where to find us",
    equipoTitulo: "The team",
    equipoPie: "The Antequera Encurtidos team at Gastro Ingenio.",
    contactoTitulo: "Contact",
    trabajaTitulo: "Work with us",
    trabajaTexto: "Email us your CV.",
    enviarCV: "Send CV",
    cartaCompleta: "Full menu for each location:",
    verCartas: "Menus",
    verCarta: "View menu",
    comoLlegar: "Directions",
    horarioSemana: "Weekly opening hours",
    horarioPorConfirmar: "Opening hours to be confirmed",
    abiertoHasta: "Open until {h}",
    cerradoAbreA: "Closed. Opens today at {h}",
    cerradoAhora: "Closed now",
    ayudaToque: "Tap a dish to see its photo. Menus vary by location.",
    ayudaRaton: "Hover over a dish to see its photo. Menus vary by location.",
    inicio: "Home",
    novedades: "News",
    productos: "Products",
    horario: "Opening hours",
    contacto: "Contact",
    hoy: "Today",
  },
};

const standLugarDefaults: Record<number, { es: string; en: string }> = {
  0: { es: "Dentro del Mercado del Puerto.", en: "Inside the Mercado del Puerto." },
  1: { es: "", en: "" },
  2: { es: "", en: "" },
};

// Solo se ofrecen al modelo campos editables visibles; nunca código, rutas,
// URLs, permisos, claves de imágenes ni claves obsoletas de versiones previas.
export function buildCatalog(documents: Document[]): Field[] {
  const fields: Field[] = [];
  for (const document of documents) {
    const add = (path: string[], label: string, value: unknown, kind: Field["kind"], seeded = false) => {
      if (typeof value === "string" && value.length <= 6000) {
        fields.push({ id: `f${fields.length}`, table: document.table, key: document.key, path, label, value, kind, ...(seeded ? { seeded: true } : {}) });
      }
    };
    const isPuestos = document.table === "home_json" && document.key === "puestos";
    const visit = (value: any, path: string[], trail: string[]) => {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value)) {
        value.forEach((child, i) => visit(child, [...path, String(i)], trail));
        return;
      }
      const context = value.nombre?.es ? [...trail, value.nombre.es] : trail;
      const label = [document.key, ...context].join(" · ");
      if (typeof value.precio === "string") add([...path, "precio"], `${label} · Precio`, value.precio, "price");
      const textFields = isPuestos && path.length === 1 ? ["nombre", "lugar"] : ["nombre", "descripcion", "lugar"];
      for (const field of textFields) {
        const nombreCampo = field === "nombre" ? "Nombre" : field === "lugar" ? "Lugar" : "Descripción";
        for (const lang of ["es", "en"] as const) {
          const existing = value[field]?.[lang];
          if (typeof existing === "string") {
            add([...path, field, lang], `${label} · ${nombreCampo} (${lang})`, existing, "text");
          } else if (isPuestos && path.length === 1 && field === "lugar") {
            const idx = Number(path[0]);
            const fallback = standLugarDefaults[idx]?.[lang] ?? "";
            add([...path, field, lang], `${label} · ${nombreCampo} (${lang})`, fallback, "text", true);
          }
        }
      }
      if (typeof value.hora === "string") add([...path, "hora"], `${label} · ${value.dia || "Horario"}`, value.hora, "text");
      for (const field of ["items", "subcategorias", "grupos", "horario"]) {
        if (field === "horario" && value.horario) {
          for (const lang of ["es", "en"]) visit(value.horario[lang], [...path, field, lang], [...context, `Horario (${lang})`]);
        } else visit(value[field], [...path, field], context);
      }
    };
    if (document.table === "home_json" && document.key === "textos") {
      for (const lang of ["es", "en"] as const) {
        const current = document.data?.[lang] || {};
        for (const [key, fallback] of Object.entries(homeTextDefaults[lang])) {
          const existing = current[key];
          if (typeof existing === "string") add([lang, key], `Página de inicio · ${key} (${lang})`, existing, "text");
          else add([lang, key], `Página de inicio · ${key} (${lang})`, fallback, "text", true);
        }
      }
    } else visit(document.data, [], []);
  }
  return fields;
}

export function prepareProposal(documents: Document[], fields: Field[], output: any) {
  if (!output || typeof output.message !== "string" || output.message.length > 2000 || !Array.isArray(output.changes) || output.changes.length > 100) {
    throw new Error("La propuesta no tiene un formato válido. Prueba con una petición más concreta.");
  }
  const byId = new Map(fields.map((field) => [field.id, field]));
  const used = new Set<string>();
  const modified = new Map<string, { table: Document["table"]; key: string; before: any; after: any }>();
  const changes = output.changes.map((entry: any) => {
    const field = byId.get(entry?.field_id);
    if (!field || used.has(field.id) || typeof entry.value !== "string") throw new Error("La propuesta contiene un campo desconocido o repetido.");
    used.add(field.id);
    let value = entry.value.trim();
    if (!value || value.length > 6000 || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)) throw new Error("La propuesta contiene un texto inválido.");
    if (field.kind === "price") {
      if (!/^\d{1,4}(?:[.,]\d{1,2})?\s*€?$/.test(value)) throw new Error("Uno de los precios no es válido.");
      const number = Number(value.replace("€", "").trim().replace(",", "."));
      if (!Number.isFinite(number) || number <= 0 || number > 9999) throw new Error("El precio debe estar entre 0,01 y 9.999 euros.");
      value = `${number.toFixed(2).replace(".", ",")} €`;
    }
    if (value === field.value) return null;
    const documentId = `${field.table}:${field.key}`;
    if (!modified.has(documentId)) {
      const source = documents.find((document) => document.table === field.table && document.key === field.key);
      if (!source) throw new Error("No se ha encontrado el documento.");
      modified.set(documentId, { table: source.table, key: source.key, before: source.data, after: structuredClone(source.data) });
    }
    let target = modified.get(documentId)!.after;
    for (let i = 0; i < field.path.length - 1; i++) {
      const part = field.path[i];
      if (["__proto__", "prototype", "constructor"].includes(part)) throw new Error("Campo no permitido.");
      if (!Object.hasOwn(target, part)) {
        if (!field.seeded) throw new Error("Campo no permitido.");
        if (field.table === "home_json" && field.key === "puestos" && part === "lugar") {
          const idx = Number(field.path[0]);
          target[part] = { ...(standLugarDefaults[idx] || { es: "", en: "" }) };
        } else {
          target[part] = {};
        }
      }
      target = target[part];
    }
    const last = field.path.at(-1)!;
    if (["__proto__", "prototype", "constructor"].includes(last)) throw new Error("Campo no permitido.");
    if (!field.seeded && !Object.hasOwn(target, last)) throw new Error("Campo no permitido.");
    target[last] = value;
    return { table: field.table, key: field.key, path: field.path, label: field.label, before: field.value, after: value };
  }).filter(Boolean);
  return { summary: output.message, changes, documents: [...modified.values()] };
}

export const outputSchema = {
  type: "object", additionalProperties: false, required: ["message", "changes"],
  properties: {
    message: { type: "string" },
    changes: { type: "array", items: {
      type: "object", additionalProperties: false, required: ["field_id", "value"],
      properties: { field_id: { type: "string" }, value: { type: "string" } },
    } },
  },
};
