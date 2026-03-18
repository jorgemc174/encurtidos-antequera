import logoImg from "./assets/logo.png";
import lasPalmasImg from "./assets/laspalmas.jpg";
import galdarImg from "./assets/galdar.jpg";
import teldeImg from "./assets/telde.jpg";
import heroImg from "./assets/hero.jpg";

export default function App() {
  

  const carta = {
    aceitunas: [
      { nombre: "Aceitunas aliñadas", precio: "3,50€" },
      { nombre: "Aceitunas partidas", precio: "3,80€" },
      { nombre: "Aceitunas rellenas", precio: "4,20€" },
    ],
    encurtidos: [
      { nombre: "Pepinillos", precio: "3,00€" },
      { nombre: "Cebolletas", precio: "3,20€" },
      { nombre: "Banderillas", precio: "4,50€" },
    ],
    tapas: [
      { nombre: "Papas arrugadas", precio: "5,50€" },
      { nombre: "Ensaladilla", precio: "4,80€" },
      { nombre: "Tabla variada", precio: "8,50€" },
    ],
  };

  const puestos = [
    {
      nombre: "Las Palmas",
      descripcion:
        "Puesto con nuestra selección de aceitunas, encurtidos y tapas tradicionales.",
      mapa: "https://maps.app.goo.gl/R18Khz2ULXaL5vcc7",
      imagen: lasPalmasImg,
    },
    {
      nombre: "Gáldar",
      descripcion:
        "Un espacio donde disfrutar del sabor de siempre con producto cercano y cuidado.",
      mapa: "https://maps.app.goo.gl/ACi1i4GrA85HnbZAA",
      imagen: galdarImg,
    },
    {
      nombre: "Telde",
      descripcion:
        "Nuestra propuesta con el sabor de siempre, ideal para probar nuestras especialidades.",
      mapa: "https://maps.app.goo.gl/iRxEPQPSHbNWSf5L6",
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
            <a href="#carta" className="hover:text-[#7A5530] transition">
              Carta
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
                href="#carta"
                className="px-6 py-3 rounded-2xl bg-[#A8C66C] text-white font-semibold hover:opacity-90 transition"
              >
                Ver carta
              </a>

              <a
                href="#puestos"
                className="px-6 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition"
              >
                Ver puestos
              </a>

              
            </div>
          </div>

          <div>
  <img
    src={heroImg}
    alt="Encurtidos Antequera"
    className="w-full h-[420px] rounded-3xl object-cover shadow-lg"
  />
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


      <section id="carta" className="px-6 py-20 bg-[#EEF5DE]">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold mb-4">Carta</h3>
          <p className="text-[#4E3B2A]/70 mb-10">
            Una selección de aceitunas, encurtidos y tapas para disfrutar del
            sabor tradicional.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#B78B5A]/20">
              <h4 className="text-2xl font-bold mb-4 text-[#A8C66C]">
                Aceitunas
              </h4>
              <div className="space-y-3">
                {carta.aceitunas.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-4 border-b border-[#B78B5A]/10 pb-2"
                  >
                    <span>{item.nombre}</span>
                    <span className="font-semibold">{item.precio}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#B78B5A]/20">
              <h4 className="text-2xl font-bold mb-4 text-[#A8C66C]">
                Encurtidos
              </h4>
              <div className="space-y-3">
                {carta.encurtidos.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-4 border-b border-[#B78B5A]/10 pb-2"
                  >
                    <span>{item.nombre}</span>
                    <span className="font-semibold">{item.precio}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#B78B5A]/20">
              <h4 className="text-2xl font-bold mb-4 text-[#A8C66C]">Tapas</h4>
              <div className="space-y-3">
                {carta.tapas.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between gap-4 border-b border-[#B78B5A]/10 pb-2"
                  >
                    <span>{item.nombre}</span>
                    <span className="font-semibold">{item.precio}</span>
                  </div>
                ))}
              </div>
            </div>
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

                  <a
                    href={puesto.mapa}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-5 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition"
                  >
                    Ver ubicación
                  </a>
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
            <div className="p-4 rounded-2xl bg-[#F7F3EA] border border-[#B78B5A]/20">
              Correo: pendiente
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}