// Tras `vite build`, crea dist/carta-*/index.html con su propio título y foto
// para que WhatsApp y otras apps (que no ejecutan JavaScript) muestren la carta
// de ese puesto al compartir el enlace, y no la portada.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DOMINIO = "https://encurtidosantequera.com";
const dist = new URL("../dist/", import.meta.url).pathname;
const base = readFileSync(join(dist, "index.html"), "utf8");

const cartas = [
  { ruta: "carta-las-palmas", nombre: "Las Palmas", lugar: "Dentro del Mercado del Puerto" },
  { ruta: "carta-galdar", nombre: "Gáldar" },
  { ruta: "carta-telde", nombre: "Telde" },
];

const cambiar = (html, patron, valor) => {
  if (!patron.test(html)) throw new Error(`No encuentro ${patron} en index.html`);
  return html.replace(patron, valor);
};

for (const carta of cartas) {
  const titulo = `Carta de ${carta.nombre} · Antequera Encurtidos`;
  const descripcion = `${carta.lugar ? `${carta.lugar}. ` : ""}Montaditos, banderillas, raciones y bebidas con sus precios, horario y cómo llegar.`;
  let html = base;
  html = cambiar(html, /<title>[^<]*<\/title>/, `<title>${titulo}</title>`);
  html = cambiar(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${descripcion}" />`);
  html = cambiar(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${titulo}" />`);
  html = cambiar(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${descripcion}" />`);
  html = cambiar(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${DOMINIO}/og-${carta.ruta}.jpg" />\n    <meta property="og:url" content="${DOMINIO}/${carta.ruta}" />`);
  mkdirSync(join(dist, carta.ruta), { recursive: true });
  writeFileSync(join(dist, carta.ruta, "index.html"), html);
  console.log(`og-cartas: ${carta.ruta}/index.html`);
}
