import CartaBase from "./CartaBase";

export default function CartaLasPalmas() {
  const categorias = [
    {
      nombre: "Aceitunas",
      items: [
        { nombre: "Aceitunas aliñadas", precio: "3,50€" },
        { nombre: "Aceitunas partidas", precio: "3,80€" },
      ],
    },
    {
      nombre: "Tapas",
      items: [
        { nombre: "Ensaladilla", precio: "4,80€" },
        { nombre: "Tabla variada", precio: "8,50€" },
      ],
    },
  ];

  return <CartaBase titulo="Carta - Las Palmas" categorias={categorias} />;
}