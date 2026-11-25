import albondigas from "../assets/productos/web/albondigas.webp";
import cazon from "../assets/productos/web/cazon.webp";
import polloKentucky from "../assets/productos/web/pollo-kentucky.webp";
import quesoAhumadoArandanos from "../assets/productos/web/queso-ahumado-arandanos.webp";
import quesoCabraCebollaCaramelizada from "../assets/productos/web/queso-de-cabra-cebolla-caramelizada.webp";
import chorizoParrillero from "../assets/productos/web/chorizo-parrillero.webp";
import vueltas from "../assets/productos/web/vueltas.webp";
import cerdoMechado from "../assets/productos/web/cerdo-mechado.webp";
import atunAnchoas from "../assets/productos/web/Atun-anchoas.webp";
import merluza from "../assets/productos/web/merluza.webp";
import tortilla from "../assets/productos/web/Tortilla.webp";
import polloMechado from "../assets/productos/web/pollo-mechado.webp";
import fajita from "../assets/productos/web/fajita.webp";
import gambasGabardina from "../assets/productos/web/gambas-gabardina.webp";
import ensaladaCangrejoPicar from "../assets/productos/web/ensalada-cangrejo-picar.webp";
import hamburguesa from "../assets/productos/web/hamburguesa.webp";
import papasBravas from "../assets/productos/web/papas-bravas.webp";
import alitas from "../assets/productos/web/alitas.webp";
import ensalada from "../assets/productos/web/ensalada.webp";

import albondigasMin from "../assets/productos/min/albondigas.webp";
import cazonMin from "../assets/productos/min/cazon.webp";
import polloKentuckyMin from "../assets/productos/min/pollo-kentucky.webp";
import quesoAhumadoArandanosMin from "../assets/productos/min/queso-ahumado-arandanos.webp";
import quesoCabraCebollaCaramelizadaMin from "../assets/productos/min/queso-de-cabra-cebolla-caramelizada.webp";
import chorizoParrilleroMin from "../assets/productos/min/chorizo-parrillero.webp";
import vueltasMin from "../assets/productos/min/vueltas.webp";
import cerdoMechadoMin from "../assets/productos/min/cerdo-mechado.webp";
import atunAnchoasMin from "../assets/productos/min/Atun-anchoas.webp";
import merluzaMin from "../assets/productos/min/merluza.webp";
import tortillaMin from "../assets/productos/min/Tortilla.webp";
import polloMechadoMin from "../assets/productos/min/pollo-mechado.webp";
import fajitaMin from "../assets/productos/min/fajita.webp";
import gambasGabardinaMin from "../assets/productos/min/gambas-gabardina.webp";
import ensaladaCangrejoPicarMin from "../assets/productos/min/ensalada-cangrejo-picar.webp";
import hamburguesaMin from "../assets/productos/min/hamburguesa.webp";
import papasBravasMin from "../assets/productos/min/papas-bravas.webp";
import alitasMin from "../assets/productos/min/alitas.webp";
import ensaladaMin from "../assets/productos/min/ensalada.webp";

export const imagenesProductos = {
  albondigas,
  cazon,
  "pollo-kentucky": polloKentucky,
  "queso-ahumado-arandanos": quesoAhumadoArandanos,
  "queso-de-cabra-cebolla-caramelizada": quesoCabraCebollaCaramelizada,
  "chorizo-parrillero": chorizoParrillero,
  vueltas,
  "cerdo-mechado": cerdoMechado,
  "atun-anchoas": atunAnchoas,
  merluza,
  tortilla,
  "pollo-mechado": polloMechado,
  fajita,
  "gambas-gabardina": gambasGabardina,
  "ensalada-cangrejo-picar": ensaladaCangrejoPicar,
  hamburguesa,
  "papas-bravas": papasBravas,
  alitas,
  ensalada,
};

const miniaturasPorImagen = new Map([
  [albondigas, albondigasMin],
  [cazon, cazonMin],
  [polloKentucky, polloKentuckyMin],
  [quesoAhumadoArandanos, quesoAhumadoArandanosMin],
  [quesoCabraCebollaCaramelizada, quesoCabraCebollaCaramelizadaMin],
  [chorizoParrillero, chorizoParrilleroMin],
  [vueltas, vueltasMin],
  [cerdoMechado, cerdoMechadoMin],
  [atunAnchoas, atunAnchoasMin],
  [merluza, merluzaMin],
  [tortilla, tortillaMin],
  [polloMechado, polloMechadoMin],
  [fajita, fajitaMin],
  [gambasGabardina, gambasGabardinaMin],
  [ensaladaCangrejoPicar, ensaladaCangrejoPicarMin],
  [hamburguesa, hamburguesaMin],
  [papasBravas, papasBravasMin],
  [alitas, alitasMin],
  [ensalada, ensaladaMin],
]);

export function miniaturaDeImagen(src) {
  if (typeof src !== "string") return src;
  if (miniaturasPorImagen.has(src)) return miniaturasPorImagen.get(src);
  if (src.startsWith("/images/supabase/") && !src.includes("/min/")) {
    return src.replace("/images/supabase/", "/images/supabase/min/");
  }
  return src;
}
