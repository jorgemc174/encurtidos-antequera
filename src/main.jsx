import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import CartaLasPalmas from "./pages/CartaLasPalmas";
import CartaGaldar from "./pages/CartaGaldar";
import CartaTelde from "./pages/CartaTelde";
import Admin from "./pages/Admin";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carta-las-palmas" element={<CartaLasPalmas />} />
        <Route path="/carta-galdar" element={<CartaGaldar />} />
        <Route path="/carta-telde" element={<CartaTelde />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);