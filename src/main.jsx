import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import CartaLasPalmas from "./pages/CartaLasPalmas";
import CartaGaldar from "./pages/CartaGaldar";
import CartaTelde from "./pages/CartaTelde";
// La parte de administración solo se descarga cuando se abre /admin.
// eslint-disable-next-line react-refresh/only-export-components -- punto de entrada, no hay recarga en caliente aquí
const Admin = lazy(() => import("./pages/Admin"));
// eslint-disable-next-line react-refresh/only-export-components
const AdminAssistant = lazy(() => import("./pages/AdminAssistant"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carta-las-palmas" element={<CartaLasPalmas />} />
        <Route path="/carta-galdar" element={<CartaGaldar />} />
        <Route path="/carta-telde" element={<CartaTelde />} />
        <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
        <Route path="/admin/asistente" element={<Suspense fallback={null}><AdminAssistant /></Suspense>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
