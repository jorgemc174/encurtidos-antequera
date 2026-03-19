import CartaBase from "./CartaBase";

export default function CartaTelde() {
  const categorias = [
    {
      nombre: "Especialidades",
      items: [
        { nombre: "Aceitunas rellenas", precio: "4,20€" },
        { nombre: "Tabla variada", precio: "8,50€" },
      ],
    },
    {
      nombre: "Tapas",
      items: [
        { nombre: "Ensaladilla", precio: "4,80€" },
        { nombre: "Papas arrugadas", precio: "5,50€" },
      ],
    },
  ];

  return <CartaBase titulo="Carta - Telde" categorias={categorias} />;
}