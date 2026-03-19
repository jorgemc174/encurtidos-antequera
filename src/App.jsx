import logoImg from "./assets/logo.png";
import lasPalmasImg from "./assets/laspalmas.jpg";
import galdarImg from "./assets/galdar.jpg";
import teldeImg from "./assets/telde.jpg";


export default function App() {
  const productos = [
    "Aceitunas variadas",
    "Encurtidos",
    "Banderillas",
    "Tapas tradicionales",
    "Especialidades de la casa",
    "Raciones para compartir",
  ];

  const puestos = [
    {
      nombre: "Las Palmas",
      descripcion:
        "Puesto con nuestra selección de aceitunas, encurtidos y tapas tradicionales.",
      mapa: "https://maps.app.goo.gl/R18Khz2ULXaL5vcc7",
      carta: "AQUI_ENLACE_CARTA_LAS_PALMAS",
      imagen: lasPalmasImg,
    },
    {
      nombre: "Gáldar",
      descripcion:
        "Un espacio donde disfrutar del sabor de siempre con producto cercano y cuidado.",
      mapa: "https://maps.app.goo.gl/ACi1i4GrA85HnbZAA",
      carta: "AQUI_ENLACE_CARTA_GALDAR",
      imagen: galdarImg,
    },
    {
      nombre: "Telde",
      descripcion:
        "Nuestra propuesta con el sabor de siempre, ideal para probar nuestras especialidades.",
      mapa: "https://maps.app.goo.gl/iRxEPQPSHbNWSf5L6",
      carta: "AQUI_ENLACE_CARTA_TELDE",
      imagen: teldeImg,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#4E3B2A]">
      <header className="sticky top-0 z-50 bg-[#D9C3A3]/95 backdrop-blur border-b border-[#B78B5A]/30">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Logo Encurtidos Antequera"
              className="h-12 w-auto object-contain"
            />
            <span className="text-2xl font-bold">Encurtidos Antequera</span>
          </div>

          <div className="hidden md:flex gap-6 font-medium">
            <a href="#inicio" className="hover:text-[#7A5530] transition">
              Inicio
            </a>
            <a href="#nosotros" className="hover:text-[#7A5530] transition">
              Nosotros
            </a>
            <a href="#productos" className="hover:text-[#7A5530] transition">
              Productos
            </a>
            <a href="#puestos" className="hover:text-[#7A5530] transition">
              Puestos
            </a>
            <a href="#contacto" className="hover:text-[#7A5530] transition">
              Contacto
            </a>
          </div>
        </nav>
      </header>

      <section id="inicio" className="px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-[0.25em] text-sm text-[#A8C66C] mb-4 font-semibold">
              Canarias · Tapas · Aceitunas
            </p>

            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Tapas, aceitunas y sabor tradicional
            </h2>

            <p className="text-lg text-[#4E3B2A]/75 mb-8 max-w-xl">
              En Encurtidos Antequera llevamos el sabor de siempre a nuestros
              puestos con una selección de encurtidos, aceitunas y tapas pensadas
              para disfrutar.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#puestos"
                className="px-6 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition"
              >
                Ver puestos
              </a>

              <a
                href="#contacto"
                className="px-6 py-3 rounded-2xl border border-[#B78B5A] text-[#4E3B2A] font-semibold hover:bg-[#B78B5A] hover:text-white transition"
              >
                Contactar
              </a>
            </div>
          </div>

          <div>
            <div className="w-full h-[420px] rounded-3xl bg-[#B78B5A]/25 flex items-center justify-center shadow-lg">
              <span className="text-[#4E3B2A]/60 text-lg text-center px-4">
                Aquí irá una foto principal del negocio
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="nosotros" className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Quiénes somos</h3>
          <p className="text-lg text-[#4E3B2A]/75 leading-8">
            En Encurtidos Antequera ofrecemos una selección de aceitunas,
            encurtidos y tapas con sabor tradicional. Apostamos por un producto
            cercano, sencillo y de calidad, pensado para disfrutar en cualquiera
            de nuestros puestos.
          </p>
        </div>
      </section>

      <section id="productos" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold mb-4">Nuestros productos</h3>
          <p className="text-[#4E3B2A]/70 mb-10">
            Una propuesta pensada para compartir, picar algo y disfrutar del
            sabor tradicional.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos.map((producto, index) => (
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

      <section id="puestos" className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold mb-4">Nuestros puestos</h3>
          <p className="text-[#4E3B2A]/70 mb-10">
            Puedes encontrarnos en estos tres puntos.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {puestos.map((puesto, index) => (
              <div
                key={index}
                className="rounded-3xl overflow-hidden bg-[#F7F3EA] border border-[#B78B5A]/20 shadow-sm"
              >
                <img
                  src={puesto.imagen}
                  alt={puesto.nombre}
                  className="w-full h-56 object-cover"
                />

                <div className="p-6">
                  <h4 className="text-2xl font-bold mb-3 text-[#A8C66C]">
                    {puesto.nombre}
                  </h4>

                  <p className="text-[#4E3B2A]/75 mb-5">{puesto.descripcion}</p>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={puesto.mapa}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-5 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition"
                    >
                      Ver ubicación
                    </a>

                    <a
                      href={puesto.carta}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-5 py-3 rounded-2xl bg-[#A8C66C] text-white font-semibold hover:opacity-90 transition"
                    >
                      Ver carta
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="px-6 py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-4">Contacto</h3>
          <p className="text-[#4E3B2A]/70 mb-8">
            Escríbenos para más información o consultas.
          </p>

          <div className="grid gap-4">
            <a
              href="tel:617883822"
              className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#B78B5A]/20 block hover:opacity-90 transition"
            >
              Teléfono: 617 883 822
            </a>

            <a
              href="mailto:correo@encurtidosantequera.com"
              className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#B78B5A]/20 block hover:opacity-90 transition"
            >
              Correo: pendiente
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}