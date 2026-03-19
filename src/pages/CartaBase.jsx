import { Link } from "react-router-dom";

export default function CartaBase({ titulo, categorias }) {
  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#4E3B2A] px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-8 px-5 py-3 rounded-2xl bg-[#B78B5A] text-white font-semibold hover:opacity-90 transition"
        >
          Volver
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-10">{titulo}</h1>

        <div className="grid gap-8">
          {categorias.map((categoria, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 border border-[#B78B5A]/20 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-[#A8C66C] mb-4">
                {categoria.nombre}
              </h2>

              <div className="space-y-3">
                {categoria.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between gap-4 border-b border-[#B78B5A]/10 pb-2"
                  >
                    <span>{item.nombre}</span>
                    <span className="font-semibold">{item.precio}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}