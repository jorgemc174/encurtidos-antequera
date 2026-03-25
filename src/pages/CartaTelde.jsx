import CartaBase from "./CartaBase";

export default function CartaTelde() {
  const categorias = [
    {
      nombre: { es: "Montaditos", en: "Mini sandwiches" },
      items: [
        {
          nombre: {
            es: "Queso cabra con cebolla caramelizada",
            en: "Goat cheese with caramelized onion",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: {
            es: "Queso ahumado con arándano",
            en: "Smoked cheese with blueberry",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: {
            es: "Chorizo de Teror, queso y miel",
            en: "Teror chorizo, cheese and honey",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Tortilla", en: "Spanish omelette" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Pollo barbacoa", en: "Barbecue chicken" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Ternera mechada", en: "Shredded beef" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: {
            es: "Morcilla de Burgos con tomate deshidratado",
            en: "Burgos black pudding with sun-dried tomato",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Albóndigas", en: "Meatballs" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: {
            es: "Cazón en adobo y mojo",
            en: "Marinated dogfish with mojo",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: {
            es: "Solomillo de pollo de mostaza y miel",
            en: "Chicken tenderloin with mustard and honey",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: {
            es: "Chistorra, papas y huevo",
            en: "Chistorra sausage, potatoes and egg",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Costilla prensada", en: "Pressed ribs" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Rabas", en: "Fried squid strips" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: {
            es: "Serrano con queso azul y tumaca",
            en: "Serrano ham with blue cheese and tomato bread",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: {
            es: "Jamón york con puerro y queso",
            en: "Ham with leek and cheese",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: {
            es: "Berros con queso y miel",
            en: "Watercress with cheese and honey",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Pollo guacamole", en: "Chicken with guacamole" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Filete de merluza", en: "Hake fillet" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: {
            es: "Atún, pimiento y anchoa",
            en: "Tuna, pepper and anchovy",
          },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Chatka y gambas", en: "Crab stick and prawns" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Pollo Kentucky", en: "Kentucky chicken" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Siempre alguno más", en: "And always more specials" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Perritos", en: "Hot dogs" },
          precio: "3,00 €",
        },
        {
          nombre: { es: "Hamburguesas", en: "Burgers" },
          precio: "3,50 €",
        },
        {
          nombre: { es: "Mini pizzas", en: "Mini pizzas" },
          precio: "4,20 €",
        },
        {
          nombre: { es: "Fajita", en: "Fajita" },
          precio: "3,50 €",
        },
      ],
    },
    {
      nombre: { es: "Para picar", en: "To share" },
      items: [
        {
          nombre: {
            es: "Ensalada crujiente de pollo",
            en: "Crispy chicken salad",
          },
          precio: "9,85 €",
        },
        {
          nombre: { es: "Ensalada de cangrejo", en: "Crab salad" },
          precio: "8,95 €",
        },
        {
          nombre: {
            es: "Tomates aliñados con ventresca",
            en: "Seasoned tomatoes with tuna belly",
          },
          precio: "11,80 €",
        },
        {
          nombre: {
            es: "Tabla de queso canario",
            en: "Canarian cheese board",
          },
          precio: "9,80 €",
        },
        {
          nombre: { es: "Papas Antequera", en: "Antequera potatoes" },
          precio: "6,50 €",
        },
        {
          nombre: { es: "Chorizo campo", en: "Country chorizo" },
          precio: "8,50 €",
        },
        {
          nombre: { es: "Pulpo a la gallega", en: "Galician-style octopus" },
          precio: "15,50 €",
        },
        {
          nombre: { es: "Gambas a la gabardina", en: "Battered prawns" },
          precio: "8,50 €",
        },
        {
          nombre: { es: "Boquerones", en: "Marinated anchovies" },
          precio: "8,95 €",
        },
        {
          nombre: { es: "Jamón ibérico", en: "Iberian ham" },
          precio: "16,95 €",
        },
        {
          nombre: { es: "Codillo en su jugo", en: "Pork knuckle in its own juices" },
          precio: "19,85 €",
        },
        {
          nombre: { es: "Costillas barbacoa", en: "Barbecue ribs" },
          precio: "19,85 €",
        },
        {
          nombre: { es: "Chistorras", en: "Chistorra sausages" },
          precio: "8,50 €",
        },
        {
          nombre: { es: "Pollo Kentucky", en: "Kentucky chicken" },
          precio: "12,50 €",
        },
        {
          nombre: { es: "Rabas", en: "Fried squid strips" },
          precio: "9,95 €",
        },
        {
          nombre: {
            es: "Boquerones y anchoas",
            en: "Marinated anchovies and anchovies",
          },
          precio: "8,95 €",
        },
        {
          nombre: { es: "Cazuela de albóndigas", en: "Meatball casserole" },
          precio: "15,90 €",
        },
        {
          nombre: { es: "Mejillones 18/25 piezas", en: "Mussels 18/25 pieces" },
          precio: "15,95 €",
        },
        {
          nombre: { es: "Mejillones 4/6 piezas", en: "Mussels 4/6 pieces" },
          precio: "4,95 €",
        },
      ],
    },
    {
      nombre: { es: "Pinchos y banderillas", en: "Skewers and pinchos" },
      items: [
        {
          nombre: { es: "Salmón con queso", en: "Salmon with cheese" },
          precio: "2,20 €",
        },
        {
          nombre: { es: "Piparra con anchoa", en: "Piparra pepper with anchovy" },
          precio: "2,20 €",
        },
        {
          nombre: {
            es: "Boquerón con relleno",
            en: "Stuffed marinated anchovy",
          },
          precio: "2,20 €",
        },
        {
          nombre: { es: "Cecina con queso", en: "Cured beef with cheese" },
          precio: "2,20 €",
        },
        {
          nombre: { es: "Alcachofa braseada", en: "Braised artichoke" },
          precio: "2,50 €",
        },
        {
          nombre: { es: "Cuenco de aceituna", en: "Bowl of olives" },
          precio: "1,50 €",
        },
        {
          nombre: { es: "Cuenco de frutos secos", en: "Bowl of nuts" },
          precio: "1,50 €",
        },
        {
          nombre: { es: "Siempre alguno más", en: "And always more specials" },
          precio: "Consultar",
        },
      ],
    },
  ];

  return (
    <CartaBase
      titulo={{ es: "Carta - Telde", en: "Menu - Telde" }}
      categorias={categorias}
    />
  );
}