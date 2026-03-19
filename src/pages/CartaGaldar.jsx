import CartaBase from "./CartaBase";

export default function CartaGaldar() {
  const categorias = [
    {
      nombre: "Encurtidos",
      items: [
        { nombre: "Pepinillos", precio: "3,00€" },
        { nombre: "Cebolletas", precio: "3,20€" },
      ],
    },
    {
      nombre: "Tapas",
      items: [
        { nombre: "Papas arrugadas", precio: "5,50€" },
        { nombre: "Banderillas", precio: "4,50€" },
      ],
    },
  ];

  return <CartaBase titulo="Carta - Gáldar" categorias={categorias} />;
}