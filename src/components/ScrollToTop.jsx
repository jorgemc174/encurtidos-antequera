import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Al cambiar de página sube arriba; si el enlace lleva ancla (/#puestos),
// espera a que exista ese bloque y baja hasta él.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    let intentos = 0;
    let timer;
    const buscar = () => {
      let id = hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* ancla mal formada: se usa tal cual */ }
      const destino = document.getElementById(id);
      if (destino) {
        destino.scrollIntoView({ block: "start" });
        return;
      }
      if (intentos++ < 20) timer = window.setTimeout(buscar, 50);
    };
    buscar();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
