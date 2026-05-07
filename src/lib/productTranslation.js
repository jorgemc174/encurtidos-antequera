export const traduccionesProductos = {
  "aceitunas variadas": "Mixed olives",
  "encurtidos": "Pickles",
  "banderillas": "Skewers",
  "tapas tradicionales": "Traditional tapas",
  "especialidades de la casa": "House specials",
  "raciones para compartir": "Sharing portions",
  "albondigas": "Meatballs",
  "albóndigas": "Meatballs",
  "alitas": "Chicken wings",
  "atun con anchoas": "Tuna with anchovies",
  "atún con anchoas": "Tuna with anchovies",
  "cazon": "Dogfish",
  "cazón": "Dogfish",
  "cerdo mechado": "Pulled pork",
  "chorizo parrillero": "Grilled chorizo",
  "ensalada": "Salad",
  "ensalada de cangrejo": "Crab salad",
  "fajita": "Fajita",
  "gambas gabardina": "Battered prawns",
  "hamburguesa": "Burger",
  "merluza": "Hake",
  "papas bravas": "Patatas bravas",
  "pollo kentucky": "Kentucky chicken",
  "pollo mechado": "Pulled chicken",
  "queso ahumado con arandanos": "Smoked cheese with cranberries",
  "queso ahumado con arándanos": "Smoked cheese with cranberries",
  "queso de cabra con cebolla caramelizada": "Goat cheese with caramelized onion",
  "tortilla": "Spanish omelette",
  "vueltas": "Beef strips",
};

export const palabrasProducto = {
  aceitunas: "olives",
  variadas: "mixed",
  encurtidos: "pickles",
  banderillas: "skewers",
  tapas: "tapas",
  tradicionales: "traditional",
  especialidades: "specialties",
  casa: "house",
  raciones: "portions",
  compartir: "sharing",
  albondigas: "meatballs",
  albóndigas: "meatballs",
  alitas: "wings",
  atun: "tuna",
  atún: "tuna",
  anchoas: "anchovies",
  cazon: "dogfish",
  cazón: "dogfish",
  cerdo: "pork",
  mechado: "pulled",
  chorizo: "chorizo",
  parrillero: "grilled",
  ensalada: "salad",
  cangrejo: "crab",
  fajita: "fajita",
  gambas: "prawns",
  gabardina: "battered",
  hamburguesa: "burger",
  merluza: "hake",
  papas: "potatoes",
  bravas: "bravas",
  pollo: "chicken",
  kentucky: "kentucky",
  queso: "cheese",
  ahumado: "smoked",
  arandanos: "cranberries",
  arándanos: "cranberries",
  cabra: "goat",
  cebolla: "onion",
  caramelizada: "caramelized",
  tortilla: "spanish omelette",
  vueltas: "beef strips",
  con: "with",
  de: "of",
  al: "with",
};

export function translateProductName(esName) {
  const clean = esName.trim().replace(/\s+/g, " ");
  if (!clean) return "";
  const normalized = clean.toLowerCase();
  if (traduccionesProductos[normalized]) return traduccionesProductos[normalized];
  return clean
    .split(/\s+/)
    .map((word) => palabrasProducto[word.toLowerCase()] || word)
    .join(" ")
    .replace(/\b\w/, (letter) => letter.toUpperCase());
}

export async function translateProductNameOnline(esName) {
  const fallback = translateProductName(esName);
  const clean = esName.trim().replace(/\s+/g, " ");
  if (!clean) return "";
  if (traduccionesProductos[clean.toLowerCase()]) return fallback;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(clean)}`;
    const response = await fetch(url);
    if (!response.ok) return fallback;
    const data = await response.json();
    const translated = data?.[0]?.map((part) => part?.[0]).join("").trim();
    return translated || fallback;
  } catch {
    return fallback;
  }
}
