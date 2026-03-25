import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import logoImg from "../assets/logo.png";
import lasPalmasImg from "../assets/laspalmas.jpg";
import galdarImg from "../assets/galdar.jpg";
import teldeImg from "../assets/telde.jpg";
import heroImg from "../assets/hero.jpg";
import espanaImg from "../assets/españa.jpg";
import inglaterraImg from "../assets/inglaterra.jpg";

export default function Home() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "es");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const textos = {
    es: {
      inicio: "Inicio",
      nosotros: "Nosotros",
      productos: "Productos",
      puestos: "Puestos",
      contacto: "Contacto",
      subtitulo: "Canarias · Tapas · Aceitunas",
      titulo: "Tapas, aceitunas y sabor tradicional",
      descripcion:
        "En Encurtidos Antequera llevamos el sabor de siempre a nuestros puestos con una selección de encurtidos, aceitunas y tapas pensadas para disfrutar.",
      verPuestos: "Ver puestos",
      contactar: "Contactar",
      quienesSomos: "Quiénes somos",
      quienesTexto:
        "En Encurtidos Antequera ofrecemos una selección de aceitunas, encurtidos y tapas con sabor tradicional. Apostamos por un producto cercano, sencillo y de calidad, pensado para disfrutar en cualquiera de nuestros puestos.",
      nuestrosProductos: "Nuestros productos",
      productosTexto:
        "Una propuesta pensada para compartir, picar algo y disfrutar del sabor tradicional.",
      nuestrosPuestos: "Nuestros puestos",
      puestosTexto: "Puedes encontrarnos en estos tres puntos.",
      verUbicacion: "Ver ubicación",
      verCarta: "Ver carta",
      contactoTitulo: "Contacto",
      contactoTexto: "Escríbenos para más información o consultas.",
      telefono: "Teléfono",
      correo: "Correo",
      idioma: "Idioma",
      menu: "Menú",
      horario: "Horario",
      hoy: "Hoy",
    },
    en: {
      inicio: "Home",
      nosotros: "About us",
      productos: "Products",
      puestos: "Locations",
      contacto: "Contact",
      subtitulo: "Canary Islands · Tapas · Olives",
      titulo: "Tapas, olives and traditional flavour",
      descripcion:
        "At Encurtidos Antequera we bring traditional flavour to our stands with a selection of pickles, olives and tapas made to enjoy.",
      verPuestos: "View locations",
      contactar: "Contact",
      quienesSomos: "About us",
      quienesTexto:
        "At Encurtidos Antequera we offer a selection of olives, pickles and tapas with a traditional flavour. We focus on close, simple and quality products, made to be enjoyed at any of our stands.",
      nuestrosProductos: "Our products",
      productosTexto:
        "A selection made for sharing, snacking and enjoying traditional flavour.",
      nuestrosPuestos: "Our locations",
      puestosTexto: "You can find us at these three locations.",
      verUbicacion: "View location",
      verCarta: "View menu",
      contactoTitulo: "Contact",
      contactoTexto: "Write to us for more information or enquiries.",
      telefono: "Phone",
      correo: "Email",
      idioma: "Language",
      menu: "Menu",
      horario: "Opening hours",
      hoy: "Today",
    },
  };

  const t = textos[lang];

  const productos = {
    es: [
      "Aceitunas variadas",
      "Encurtidos",
      "Banderillas",
      "Tapas tradicionales",
      "Especialidades de la casa",
      "Raciones para compartir",
    ],
    en: [
      "Mixed olives",
      "Pickles",
      "Skewers",
      "Traditional tapas",
      "House specials",
      "Sharing portions",
    ],
  };

  const puestos = [
    {
      nombre: { es: "Las Palmas", en: "Las Palmas" },
      descripcion: {
        es: "Puesto con nuestra selección de aceitunas, encurtidos y tapas tradicionales.",
        en: "Stand with our selection of olives, pickles and traditional tapas.",
      },
      mapa: "https://maps.app.goo.gl/R18Khz2ULXaL5vcc7",
      rutaCarta: "/carta-las-palmas",
      imagen: lasPalmasImg,
      horario: {
        es: [
          { dia: "Lunes", hora: "11:00 - 16:00" },
          { dia: "Martes", hora: "11:00 - 24:00" },
          { dia: "Miércoles", hora: "11:00 - 24:00" },
          { dia: "Jueves", hora: "11:00 - 24:00" },
          { dia: "Viernes", hora: "11:00 - 24:00" },
          { dia: "Sábado", hora: "11:00 - 24:00" },
          { dia: "Domingo", hora: "11:00 - 17:00" },
        ],
        en: [
          { dia: "Monday", hora: "11:00 - 16:00" },
          { dia: "Tuesday", hora: "11:00 - 24:00" },
          { dia: "Wednesday", hora: "11:00 - 24:00" },
          { dia: "Thursday", hora: "11:00 - 24:00" },
          { dia: "Friday", hora: "11:00 - 24:00" },
          { dia: "Saturday", hora: "11:00 - 24:00" },
          { dia: "Sunday", hora: "11:00 - 17:00" },
        ],
      },
    },
    {
      nombre: { es: "Gáldar", en: "Gáldar" },
      descripcion: {
        es: "Un espacio donde disfrutar del sabor de siempre con producto cercano y cuidado.",
        en: "A place to enjoy traditional flavour with local and carefully selected products.",
      },
      mapa: "https://maps.app.goo.gl/ACi1i4GrA85HnbZAA",
      rutaCarta: "/carta-galdar",
      imagen: galdarImg,
      horario: {
        es: [
          { dia: "Lunes", hora: "Cerrado" },
          { dia: "Martes", hora: "11:00 - 22:00" },
          { dia: "Miércoles", hora: "11:00 - 22:00" },
          { dia: "Jueves", hora: "11:00 - 22:00" },
          { dia: "Viernes", hora: "12:00 - 24:00" },
          { dia: "Sábado", hora: "12:00 - 24:00" },
          { dia: "Domingo", hora: "12:00 - 17:00" },
        ],
        en: [
          { dia: "Monday", hora: "Closed" },
          { dia: "Tuesday", hora: "11:00 - 22:00" },
          { dia: "Wednesday", hora: "11:00 - 22:00" },
          { dia: "Thursday", hora: "11:00 - 22:00" },
          { dia: "Friday", hora: "12:00 - 24:00" },
          { dia: "Saturday", hora: "12:00 - 24:00" },
          { dia: "Sunday", hora: "12:00 - 17:00" },
        ],
      },
    },
    {
      nombre: { es: "Telde", en: "Telde" },
      descripcion: {
        es: "Nuestra propuesta con el sabor de siempre, ideal para probar nuestras especialidades.",
        en: "Our traditional selection, ideal for trying our specialties.",
      },
      mapa: "https://maps.app.goo.gl/iRxEPQPSHbNWSf5L6",
      rutaCarta: "/carta-telde",
      imagen: teldeImg,
      horario: {
        es: [
          { dia: "Lunes", hora: "10:00 - 23:00" },
          { dia: "Martes", hora: "10:00 - 23:00" },
          { dia: "Miércoles", hora: "10:00 - 23:00" },
          { dia: "Jueves", hora: "10:00 - 23:00" },
          { dia: "Viernes", hora: "10:00 - 02:00" },
          { dia: "Sábado", hora: "10:00 - 02:00" },
          { dia: "Domingo", hora: "12:00 - 22:00" },
        ],
        en: [
          { dia: "Monday", hora: "10:00 - 23:00" },
          { dia: "Tuesday", hora: "10:00 - 23:00" },
          { dia: "Wednesday", hora: "10:00 - 23:00" },
          { dia: "Thursday", hora: "10:00 - 23:00" },
          { dia: "Friday", hora: "10:00 - 02:00" },
          { dia: "Saturday", hora: "10:00 - 02:00" },
          { dia: "Sunday", hora: "12:00 - 22:00" },
        ],
      },
    },
  ];

  const closeMenu = () => setMenuOpen(false);

  const todayIndex = useMemo(() => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 6 : jsDay - 1;
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#4E3B2A]">
      <header className="sticky top-0 z-50 bg-[#D9C3A3]/98 backdrop-blur border-b border-[#B78B5A]/25 shadow-sm">
        <nav className="max-w-6xl mx-auto px-4 md:px-6 h-24 md:h-28 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={logoImg}
              alt="Logo Encurtidos Antequera"
              className="h-14 md:h-20 w-auto object-contain"
            />
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-6 font-medium items-center">
              <a href="#inicio" className="hover:text-[#7A5530] transition">
                {t.inicio}
              </a>
              <a href="#nosotros" className="hover:text-[#7A5530] transition">
                {t.nosotros}
              </a>
              <a href="#productos" className="hover:text-[#7A5530] transition">
                {t.productos}
              </a>
              <a href="#puestos" className="hover:text-[#7A5530] transition">
                {t.puestos}
              </a>
              <a href="#contacto" className="hover:text-[#7A5530] transition">
                {t.contacto}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang("es")}
                className={`p-1 rounded-xl border transition ${
                  lang === "es"
                    ? "bg-[#7E9f00] border-[#7E9f00]"
                    : "bg-white border-[#B78B5A]/30"
                }`}
              >
                <img
                  src={espanaImg}
                  alt="Español"
                  className="w-8 h-5 object-cover rounded-sm"
                />
              </button>

              <button
                onClick={() => setLang("en")}
                className={`p-1 rounded-xl border transition ${
                  lang === "en"
                    ? "bg-[#7E9f00] border-[#7E9f00]"
                    : "bg-white border-[#B78B5A]/30"
                }`}
              >
                <img
                  src={inglaterraImg}
                  alt="English"
                  className="w-8 h-5 object-cover rounded-sm"
                />
              </button>
            </div>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex items-center justify-center w-12 h-12 rounded-2xl border border-[#7A5530]/15 bg-[#7E9f00] shadow-sm hover:opacity-90 transition"
            aria-label="Abrir menú"
          >
            <div className="flex flex-col justify-center gap-1.5">
              <span className="block w-5 h-0.5 bg-white rounded"></span>
              <span className="block w-5 h-0.5 bg-white rounded"></span>
              <span className="block w-5 h-0.5 bg-white rounded"></span>
            </div>
          </button>
        </nav>
      </header>

      <div
        className={`md:hidden fixed inset-0 z-[60] ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        ></div>

        <aside
          className={`absolute top-0 right-0 h-full w-[82%] max-w-sm bg-[#EFE7DA] border-l border-[#B78B5A] shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#B78B5A]/20">
            <span className="text-lg font-bold text-[#4E3B2A]">{t.menu}</span>

            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-xl border border-[#B78B5A]/30 bg-white"
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>

          <div className="px-6 py-5 flex flex-col gap-5 font-medium">
            <a
              href="#inicio"
              onClick={closeMenu}
              className="hover:text-[#7A5530] transition"
            >
              {t.inicio}
            </a>

            <a
              href="#nosotros"
              onClick={closeMenu}
              className="hover:text-[#7A5530] transition"
            >
              {t.nosotros}
            </a>

            <a
              href="#productos"
              onClick={closeMenu}
              className="hover:text-[#7A5530] transition"
            >
              {t.productos}
            </a>

            <a
              href="#puestos"
              onClick={closeMenu}
              className="hover:text-[#7A5530] transition"
            >
              {t.puestos}
            </a>

            <a
              href="#contacto"
              onClick={closeMenu}
              className="hover:text-[#7A5530] transition"
            >
              {t.contacto}
            </a>

            <div className="pt-4 border-t border-[#B78B5A]/20">
              <p className="text-sm mb-3 text-[#4E3B2A]/70">{t.idioma}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLang("es")}
                  className={`p-1 rounded-xl border transition ${
                    lang === "es"
                      ? "bg-[#7E9f00] border-[#7E9f00]"
                      : "bg-white border-[#B78B5A]/30"
                  }`}
                >
                  <img
                    src={espanaImg}
                    alt="Español"
                    className="w-8 h-5 object-cover rounded-sm"
                  />
                </button>

                <button
                  onClick={() => setLang("en")}
                  className={`p-1 rounded-xl border transition ${
                    lang === "en"
                      ? "bg-[#7E9f00] border-[#7E9f00]"
                      : "bg-white border-[#B78B5A]/30"
                  }`}
                >
                  <img
                    src={inglaterraImg}
                    alt="English"
                    className="w-8 h-5 object-cover rounded-sm"
                  />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section id="inicio" className="scroll-mt-20 px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-[0.25em] text-sm text-[#A8C66C] mb-4 font-semibold">
              {t.subtitulo}
            </p>

            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              {t.titulo}
            </h2>

            <p className="text-lg text-[#4E3B2A]/75 mb-8 max-w-xl">
              {t.descripcion}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#puestos"
                className="px-6 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition"
              >
                {t.verPuestos}
              </a>

              <a
                href="#contacto"
                className="px-6 py-3 rounded-2xl border border-[#B78B5A] text-[#4E3B2A] font-semibold hover:bg-[#B78B5A] hover:text-white transition"
              >
                {t.contactar}
              </a>
            </div>
          </div>

          <img
            src={heroImg}
            alt="Encurtidos Antequera"
            className="w-full h-[420px] rounded-3xl object-cover shadow-lg"
          />
        </div>
      </section>

      <section id="nosotros" className="scroll-mt-20 px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">{t.quienesSomos}</h3>
          <p className="text-lg text-[#4E3B2A]/75 leading-8">
            {t.quienesTexto}
          </p>
        </div>
      </section>

      <section id="productos" className="scroll-mt-20 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold mb-4">{t.nuestrosProductos}</h3>
          <p className="text-[#4E3B2A]/70 mb-10">{t.productosTexto}</p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos[lang].map((producto, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-sm border border-[#B78B5A]/20"
              >
                <h4 className="text-xl font-semibold">{producto}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="puestos" className="scroll-mt-20 px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold mb-4">{t.nuestrosPuestos}</h3>
          <p className="text-[#4E3B2A]/70 mb-10">{t.puestosTexto}</p>

          <div className="grid md:grid-cols-3 gap-6">
            {puestos.map((puesto, index) => {
              const hoy = puesto.horario[lang][todayIndex];

              return (
                <div
                  key={index}
                  className="rounded-3xl overflow-hidden bg-[#F7F3EA] border border-[#B78B5A]/20 shadow-sm"
                >
                  <img
                    src={puesto.imagen}
                    alt={puesto.nombre[lang]}
                    className="w-full h-56 object-cover"
                  />

                  <div className="p-6">
                    <h4 className="text-2xl font-bold mb-3 text-[#7E9f00]">
                      {puesto.nombre[lang]}
                    </h4>

                    <p className="text-[#4E3B2A]/75 mb-4">
                      {puesto.descripcion[lang]}
                    </p>

                    <div className="mb-5">
                      <p className="text-sm font-bold text-[#7E9f00] mb-1">
                        {t.horario}
                      </p>

                      <div className="flex justify-between gap-4 text-sm text-[#4E3B2A]/80">
                        <span className="font-medium">
                          {t.hoy}: {hoy.dia}
                        </span>
                        <span
                          className={`text-right ${
                            hoy.hora === "Cerrado" || hoy.hora === "Closed"
                              ? "text-[#B85C38] font-semibold"
                              : ""
                          }`}
                        >
                          {hoy.hora}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <a
                        href={puesto.mapa}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block px-5 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition"
                      >
                        {t.verUbicacion}
                      </a>

                      <Link
                        to={puesto.rutaCarta}
                        className="inline-block px-5 py-3 rounded-2xl bg-[#7E9f00] text-white font-semibold hover:opacity-90 transition"
                      >
                        {t.verCarta}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contacto" className="scroll-mt-20 px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-4">{t.contactoTitulo}</h3>
          <p className="text-[#4E3B2A]/70 mb-8">{t.contactoTexto}</p>

          <div className="grid gap-4">
            <a
              href="tel:617883822"
              className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#B78B5A]/20 block hover:opacity-90 transition"
            >
              {t.telefono}: 617 883 822
            </a>

            <a
              href="mailto:correo@encurtidosantequera.com"
              className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#B78B5A]/20 block hover:opacity-90 transition"
            >
              {t.correo}: correo@encurtidosantequera.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}