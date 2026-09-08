export type Document = { table: "menu_json" | "home_json"; key: string; data: any };
export type Field = { id: string; table: Document["table"]; key: string; path: string[]; label: string; value: string; kind: "price" | "text" };
export const locations = ["Carta - Gáldar", "Carta - Telde", "Carta - Las Palmas"];

// Solo se ofrecen al modelo campos editables existentes; nunca código, rutas,
// URLs, permisos, claves de imágenes ni campos arbitrarios de la base de datos.
export function buildCatalog(documents: Document[]): Field[] {
  const fields: Field[] = [];
  for (const document of documents) {
    const add = (path: string[], label: string, value: unknown, kind: Field["kind"]) => {
      if (typeof value === "string" && value.length <= 6000) {
        fields.push({ id: `f${fields.length}`, table: document.table, key: document.key, path, label, value, kind });
      }
    };
    const visit = (value: any, path: string[], trail: string[]) => {
      if (!value || typeof value !== "object") return;
      if (Array.isArray(value)) {
        value.forEach((child, i) => visit(child, [...path, String(i)], trail));
        return;
      }
      const context = value.nombre?.es ? [...trail, value.nombre.es] : trail;
      const label = [document.key, ...context].join(" · ");
      if (typeof value.precio === "string") add([...path, "precio"], `${label} · Precio`, value.precio, "price");
      for (const field of ["nombre", "descripcion"]) {
        for (const lang of ["es", "en"]) {
          add([...path, field, lang], `${label} · ${field === "nombre" ? "Nombre" : "Descripción"} (${lang})`, value[field]?.[lang], "text");
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
      for (const lang of ["es", "en"]) {
        for (const [key, value] of Object.entries(document.data?.[lang] || {})) {
          add([lang, key], `Página de inicio · ${key} (${lang})`, value, "text");
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
    for (const part of field.path.slice(0, -1)) {
      if (["__proto__", "prototype", "constructor"].includes(part) || !Object.hasOwn(target, part)) throw new Error("Campo no permitido.");
      target = target[part];
    }
    const last = field.path.at(-1)!;
    if (["__proto__", "prototype", "constructor"].includes(last) || !Object.hasOwn(target, last)) throw new Error("Campo no permitido.");
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
