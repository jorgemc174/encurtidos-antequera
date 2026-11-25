import { normalizeKey } from "./normalizeKey";

const IMAGE_ALIASES = {
  "anchoas-y-boquerones": "boquerones-y-anchoas",
  "cazon-en-adobo": "cazon",
  "cazon-en-adobo-y-mojo": "cazon",
  "cazuela-de-albondigas": "albondigas",
  chistorras: "chistorra-papas-y-huevo",
  "chorizo-campus": "chorizo-campo",
  "chorizos-parrillero": "chorizo-parrillero",
  "costillas-barbacoa": "costilla-a-la-barbacoa",
  "cuenco-de-aceituna": "cuenco-de-aceitunas",
  empanadilla: "porcion-de-empanada-gallega",
  "ensalada-crujiente-de-pollo": "ensalada",
  "jamon-iberico": "jamon-serrano",
  "lagrimas-de-pollo": "pollo-kentucky",
  "pollo-con-crema-de-aguacate": "pollo-guacamole",
  "serrano-con-queso": "jamon-serrano",
  "tabla-de-queso-canario": "quesos-variados",
};

const IGNORED_TOKENS = new Set([
  "a", "al", "con", "cuenco", "de", "del", "el", "en", "la", "las",
  "los", "para", "porcion", "su", "tabla", "un", "una", "y",
]);

const RESERVED_PREFIXES = ["home-", "producto-", "seccion-", "subseccion-"];

function singularize(token) {
  if (token.endsWith("ces") && token.length > 5) return `${token.slice(0, -3)}z`;
  if (token.endsWith("es") && token.length > 6) return token.slice(0, -2);
  if (token.endsWith("s") && token.length > 4) return token.slice(0, -1);
  return token;
}

function meaningfulTokens(key) {
  return [...new Set(
    key
      .split("-")
      .filter(Boolean)
      .filter((token) => !IGNORED_TOKENS.has(token))
      .map(singularize)
  )];
}

function similarityScore(sourceTokens, candidateTokens) {
  if (!sourceTokens.length || !candidateTokens.length) return 0;
  const source = new Set(sourceTokens);
  const candidate = new Set(candidateTokens);
  const intersection = [...source].filter((token) => candidate.has(token));
  const unionSize = new Set([...source, ...candidate]).size;

  if (intersection.length === source.size && intersection.length === candidate.size) return 1;

  const smaller = source.size <= candidate.size ? source : candidate;
  const larger = source.size <= candidate.size ? candidate : source;
  const isDistinctiveSubset = [...smaller].every((token) => larger.has(token))
    && [...smaller].every((token) => token.length >= 4);
  if (isDistinctiveSubset) return 0.85;

  return intersection.length / unionSize;
}

export function getSectionProductImageKeys(section) {
  const keys = new Set();

  const visit = (entry) => {
    if (!entry) return;
    if (Array.isArray(entry)) {
      entry.forEach(visit);
      return;
    }

    const children = [entry.items, entry.subcategorias, entry.grupos].filter(Array.isArray);
    if (children.length) {
      children.forEach(visit);
      return;
    }

    if (entry.nombre?.es) keys.add(normalizeKey(entry.nombre.es));
    if (entry.imagenKey) keys.add(normalizeKey(entry.imagenKey));
  };

  visit(section);
  return keys;
}

export function resolveSharedProductImage(name, images, sectionKeys = null, allowExact = true) {
  const normalized = normalizeKey(name);
  if (allowExact && images[normalized]) return images[normalized];

  const alias = IMAGE_ALIASES[normalized];
  if (alias && images[alias] && (!sectionKeys || sectionKeys.has(alias))) return images[alias];

  const sourceTokens = meaningfulTokens(normalized);
  const candidates = Object.keys(images)
    .filter((key) => !RESERVED_PREFIXES.some((prefix) => key.startsWith(prefix)))
    .filter((key) => allowExact || key !== normalized)
    .filter((key) => !sectionKeys || sectionKeys.has(key))
    .map((key) => ({ key, score: similarityScore(sourceTokens, meaningfulTokens(key)) }))
    .filter(({ score }) => score >= 0.72)
    .sort((a, b) => b.score - a.score || a.key.localeCompare(b.key));

  if (!candidates.length) return null;
  if (candidates[1] && candidates[0].score === candidates[1].score) return null;
  return images[candidates[0].key];
}
