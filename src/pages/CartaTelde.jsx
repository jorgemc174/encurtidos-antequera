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
          imagenKey: "queso-de-cabra-cebolla-caramelizada",
        },
        {
          nombre: {
            es: "Queso ahumado con arándano",
            en: "Smoked cheese with blueberry",
          },
          precio: "2,50 € - 3,50 €",
          imagenKey: "queso-ahumado-arandanos",
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
          imagenKey: "tortilla",
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
          imagenKey: "albondigas",
        },
        {
          nombre: {
            es: "Cazón en adobo y mojo",
            en: "Marinated dogfish with mojo",
          },
          precio: "2,50 € - 3,50 €",
          imagenKey: "cazon",
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
          imagenKey: "merluza",
        },
        {
          nombre: {
            es: "Atún, pimiento y anchoa",
            en: "Tuna, pepper and anchovy",
          },
          precio: "2,50 € - 3,50 €",
          imagenKey: "atun-anchoas",
        },
        {
          nombre: { es: "Chatka y gambas", en: "Crab stick and prawns" },
          precio: "2,50 € - 3,50 €",
        },
        {
          nombre: { es: "Pollo Kentucky", en: "Kentucky chicken" },
          precio: "2,50 € - 3,50 €",
          imagenKey: "pollo-kentucky",
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
          imagenKey: "ensalada-cangrejo",
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
          imagenKey: "pollo-kentucky",
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
          imagenKey: "albondigas",
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
  {
          nombre: { es: "Bebidas", en: "Drinks" },
          subcategoriasPlegables: true,
          subcategorias: [
            {
              nombre: { es: "Refrescos", en: "Soft drinks" },
              items: [
                { nombre: { es: "Coca Cola", en: "Coca-Cola" }, precio: "2,10 €" },
                {
                  nombre: { es: "Fanta naranja", en: "Orange Fanta" },
                  precio: "2,10 €",
                },
                {
                  nombre: { es: "Fanta limón", en: "Lemon Fanta" },
                  precio: "2,10 €",
                },
                { nombre: { es: "Nestea", en: "Nestea" }, precio: "2,20 €" },
                { nombre: { es: "Zumo bote", en: "Juice can" }, precio: "1,70 €" },
                {
                  nombre: {
                    es: "Tónica normal (Schweppes, Nordic M.)",
                    en: "Regular tonic (Schweppes, Nordic M.)",
                  },
                  precio: "2,10 €",
                },
                {
                  nombre: {
                    es: "Tónica especial (Royal Bliss)",
                    en: "Special tonic (Royal Bliss)",
                  },
                  precio: "2,10 €",
                },
                {
                  nombre: { es: "Tónica premium", en: "Premium tonic" },
                  precio: "2,90 €",
                },
                {
                  nombre: { es: "Agua con gas", en: "Sparkling water" },
                  precio: "1,30 €",
                },
                {
                  nombre: { es: "Agua sin gas", en: "Still water" },
                  precio: "1,30 €",
                },
                {
                  nombre: { es: "Bebida energética", en: "Energy drink" },
                  precio: "2,80 €",
                },
                {
                  nombre: { es: "Clipper fresa", en: "Strawberry Clipper" },
                  precio: "2,10 €",
                },
                { nombre: { es: "Aquarius", en: "Aquarius" }, precio: "2,20 €" },
                { nombre: { es: "Appletiser", en: "Appletiser" }, precio: "2,20 €" },
              ],
            },
            {
              nombre: { es: "Cervezas", en: "Beers" },
              items: [
                { nombre: { es: "Jarra", en: "Large beer" }, precio: "3,50 €" },
                { nombre: { es: "Caña", en: "Draft beer" }, precio: "1,90 €" },
                {
                  nombre: { es: "Copa de cerveza", en: "Glass of beer" },
                  precio: "2,30 €",
                },
                {
                  nombre: { es: "Alhambra 1925", en: "Alhambra 1925" },
                  precio: "2,70 €",
                },
                {
                  nombre: { es: "Alhambra roja", en: "Alhambra red" },
                  precio: "3,00 €",
                },
                {
                  nombre: {
                    es: "Alhambra sin alcohol",
                    en: "Alcohol-free Alhambra",
                  },
                  precio: "2,20 €",
                },
                {
                  nombre: {
                    es: "Alhambra Radler limón",
                    en: "Alhambra lemon Radler",
                  },
                  precio: "2,50 €",
                },
                {
                  nombre: { es: "Alhambra IPA", en: "Alhambra IPA" },
                  precio: "3,90 €",
                },
                {
                  nombre: { es: "Mahou Radler", en: "Mahou Radler" },
                  precio: "2,50 €",
                },
                {
                  nombre: {
                    es: "Mahou sin gluten",
                    en: "Gluten-free Mahou",
                  },
                  precio: "2,60 €",
                },
                {
                  nombre: { es: "Mahou tostada", en: "Mahou toasted" },
                  precio: "2,60 €",
                },
                {
                  nombre: { es: "Mahou maestra", en: "Mahou Maestra" },
                  precio: "2,90 €",
                },
                {
                  nombre: { es: "Dorada especial", en: "Dorada special" },
                  precio: "2,50 €",
                },
                {
                  nombre: {
                    es: "Dorada sin alcohol",
                    en: "Alcohol-free Dorada",
                  },
                  precio: "2,10 €",
                },
                {
                  nombre: {
                    es: "Dorada sin alcohol limón",
                    en: "Alcohol-free Dorada lemon",
                  },
                  precio: "2,20 €",
                },
                {
                  nombre: { es: "Tropical limón", en: "Tropical lemon" },
                  precio: "2,30 €",
                },
                {
                  nombre: {
                    es: "San Miguel limón 0.0",
                    en: "San Miguel lemon 0.0",
                  },
                  precio: "2,60 €",
                },
              ],
            },
            {
              nombre: { es: "Vinos", en: "Wines" },
              grupos: [
                {
                  nombre: { es: "Vino blanco", en: "White wine" },
                  items: [
                    {
                      nombre: { es: "Copa afrutado", en: "Fruity white wine glass" },
                      precio: "3,50 €",
                    },
                    {
                      nombre: {
                        es: "Copa Verdejo Castillo de Aza D.O. Rueda",
                        en: "Glass of Verdejo Castillo de Aza D.O. Rueda",
                      },
                      precio: "3,20 €",
                    },
                    {
                      nombre: {
                        es: "Copa semi Jaume Serra D.O. Penedès",
                        en: "Glass of semi-sweet Jaume Serra D.O. Penedès",
                      },
                      precio: "3,20 €",
                    },
                    {
                      nombre: {
                        es: "Copa manzanilla fino",
                        en: "Glass of fino manzanilla",
                      },
                      precio: "2,90 €",
                    },
                    {
                      nombre: {
                        es: "Botella afrutado",
                        en: "Bottle of fruity white wine",
                      },
                      precio: "16,00 €",
                    },
                    {
                      nombre: {
                        es: "Botella Verdejo Castillo de Aza D.O. Rueda",
                        en: "Bottle of Verdejo Castillo de Aza D.O. Rueda",
                      },
                      precio: "13,80 €",
                    },
                    {
                      nombre: {
                        es: "Botella semi Jaume Serra D.O. Penedès",
                        en: "Bottle of semi-sweet Jaume Serra D.O. Penedès",
                      },
                      precio: "13,80 €",
                    },
                    {
                      nombre: { es: "Botella Albariño", en: "Bottle of Albariño" },
                      precio: "13,80 €",
                    },
                  ],
                },
                {
                  nombre: { es: "Vino rosado", en: "Rosé wine" },
                  items: [
                    {
                      nombre: {
                        es: "Copa rosado de mi pueblo",
                        en: "Glass of house rosé",
                      },
                      precio: "2,90 €",
                    },
                    {
                      nombre: {
                        es: "Botella rosado de mi pueblo",
                        en: "Bottle of house rosé",
                      },
                      precio: "13,50 €",
                    },
                  ],
                },
                {
                  nombre: { es: "Vino tinto", en: "Red wine" },
                  items: [
                    {
                      nombre: { es: "Copa de Rioja", en: "Glass of Rioja" },
                      precio: "3,50 €",
                    },
                    {
                      nombre: {
                        es: "Copa Figuero 4 D.O. Ribera del Duero Roble",
                        en: "Glass of Figuero 4 D.O. Ribera del Duero Roble",
                      },
                      precio: "3,50 €",
                    },
                    {
                      nombre: {
                        es: "Copa Pagos de Valcerracín Ribera del Duero Roble",
                        en: "Glass of Pagos de Valcerracín Ribera del Duero Roble",
                      },
                      precio: "3,50 €",
                    },
                    {
                      nombre: { es: "Copa tinto de verano", en: "Summer red wine" },
                      precio: "4,40 €",
                    },
                    {
                      nombre: {
                        es: "Botella Figuero 4 D.O. Ribera del Duero Roble",
                        en: "Bottle of Figuero 4 D.O. Ribera del Duero Roble",
                      },
                      precio: "17,00 €",
                    },
                    {
                      nombre: {
                        es: "Botella Pagos de Valcerracín Ribera del Duero Roble",
                        en: "Bottle of Pagos de Valcerracín Ribera del Duero Roble",
                      },
                      precio: "16,00 €",
                    },
                    {
                      nombre: {
                        es: "Botella Viña Paceta Crianza D.O. Rioja",
                        en: "Bottle of Viña Paceta Crianza D.O. Rioja",
                      },
                      precio: "16,00 €",
                    },
                  ],
                },
              ],
            },
            {
              nombre: { es: "Varios", en: "Others" },
              items: [
                {
                  nombre: { es: "Jarra sangría", en: "Pitcher of sangria" },
                  precio: "9,90 €",
                },
                { nombre: { es: "Cava", en: "Cava" }, precio: "3,50 €" },
                {
                  nombre: {
                    es: "Copa vermouth Izaguirre reserva",
                    en: "Glass of Izaguirre reserve vermouth",
                  },
                  precio: "3,40 €",
                },
                {
                  nombre: { es: "Smirnoff Ice", en: "Smirnoff Ice" },
                  precio: "2,50 €",
                },
                { nombre: { es: "Smirnoff", en: "Smirnoff" }, precio: "4,00 €" },
                {
                  nombre: { es: "Moskovskaya", en: "Moskovskaya" },
                  precio: "4,00 €",
                },
              ],
            },
            {
              nombre: { es: "Ron", en: "Rum" },
              items: [
                {
                  nombre: { es: "Matusalen añejo", en: "Matusalen añejo" },
                  precio: "4,10 €",
                },
                {
                  nombre: { es: "Matusalen 15 años", en: "Matusalen 15 years" },
                  precio: "5,50 €",
                },
                {
                  nombre: { es: "Barceló añejo", en: "Barceló añejo" },
                  precio: "2,80 €",
                },
                {
                  nombre: { es: "Carta Oro", en: "Carta Oro" },
                  precio: "2,80 €",
                },
                {
                  nombre: { es: "Carta Blanca", en: "Carta Blanca" },
                  precio: "2,80 €",
                },
                {
                  nombre: { es: "Telde", en: "Telde" },
                  precio: "2,80 €",
                },
                {
                  nombre: { es: "Cacique 500", en: "Cacique 500" },
                  precio: "5,95 €",
                },
                {
                  nombre: { es: "Cacique añejo", en: "Cacique añejo" },
                  precio: "4,95 €",
                },
                {
                  nombre: { es: "Santa Teresa", en: "Santa Teresa" },
                  precio: "4,05 €",
                },
                {
                  nombre: {
                    es: "Havana Club 3 años",
                    en: "Havana Club 3 years",
                  },
                  precio: "3,90 €",
                },
                {
                  nombre: {
                    es: "Havana Club 7 años",
                    en: "Havana Club 7 years",
                  },
                  precio: "4,05 €",
                },
                {
                  nombre: { es: "La Aldea", en: "La Aldea" },
                  precio: "2,85 €",
                },
                {
                  nombre: { es: "Zacapa", en: "Zacapa" },
                  precio: "9,70 €",
                },
                {
                  nombre: {
                    es: "Chupito ron Zacapa",
                    en: "Zacapa rum shot",
                  },
                  precio: "4,20 €",
                },
                {
                  nombre: { es: "Chupito ron", en: "Rum shot" },
                  precio: "1,80 €",
                },
              ],
            },
            {
              nombre: { es: "Ginebras", en: "Gins" },
              items: [
                {
                  nombre: { es: "Master Mille", en: "Master Mille" },
                  precio: "5,00 €",
                },
                {
                  nombre: { es: "Roco Gin", en: "Roco Gin" },
                  precio: "7,00 €",
                },
                {
                  nombre: { es: "Nordés", en: "Nordés" },
                  precio: "5,00 €",
                },
                {
                  nombre: { es: "Gold", en: "Gold" },
                  precio: "7,00 €",
                },
                {
                  nombre: { es: "Bombay", en: "Bombay" },
                  precio: "5,00 €",
                },
                {
                  nombre: { es: "Gordon's London", en: "Gordon's London" },
                  precio: "4,00 €",
                },
                {
                  nombre: { es: "Gordon's Pink", en: "Gordon's Pink" },
                  precio: "4,00 €",
                },
                {
                  nombre: { es: "Sheridan's", en: "Sheridan's" },
                  precio: "4,95 €",
                },
                {
                  nombre: { es: "Macaronesia", en: "Macaronesia" },
                  precio: "5,00 €",
                },
                {
                  nombre: {
                    es: "Macaronesia Brownie",
                    en: "Macaronesia Brownie",
                  },
                  precio: "5,70 €",
                },
                {
                  nombre: { es: "Beefeater", en: "Beefeater" },
                  precio: "4,00 €",
                },
                {
                  nombre: { es: "Puerto de Indias", en: "Puerto de Indias" },
                  precio: "5,00 €",
                },
                {
                  nombre: { es: "Tanqueray Ten", en: "Tanqueray Ten" },
                  precio: "5,00 €",
                },
                {
                  nombre: { es: "Tanqueray Sevilla", en: "Tanqueray Sevilla" },
                  precio: "5,00 €",
                },
                {
                  nombre: { es: "Tanqueray", en: "Tanqueray" },
                  precio: "6,30 €",
                },
                {
                  nombre: { es: "Tanqueray 0.0", en: "Tanqueray 0.0" },
                  precio: "5,00 €",
                },
                {
                  nombre: { es: "Chupito ginebra", en: "Gin shot" },
                  precio: "2,00 €",
                },
              ],
            },
            {
              nombre: { es: "Whisky", en: "Whisky" },
              items: [
                { nombre: { es: "J&B", en: "J&B" }, precio: "2,80 €" },
                {
                  nombre: { es: "Ballantines", en: "Ballantines" },
                  precio: "3,30 €",
                },
                {
                  nombre: { es: "Jack Daniels", en: "Jack Daniels" },
                  precio: "5,45 €",
                },
                {
                  nombre: { es: "John Haig", en: "John Haig" },
                  precio: "2,80 €",
                },
                {
                  nombre: { es: "100 Pipers", en: "100 Pipers" },
                  precio: "2,80 €",
                },
                {
                  nombre: {
                    es: "Johnnie Walker etiqueta roja",
                    en: "Johnnie Walker Red Label",
                  },
                  precio: "2,80 €",
                },
                {
                  nombre: {
                    es: "Johnnie Walker etiqueta negra",
                    en: "Johnnie Walker Black Label",
                  },
                  precio: "5,60 €",
                },
                {
                  nombre: { es: "Cardhu", en: "Cardhu" },
                  precio: "6,60 €",
                },
                {
                  nombre: {
                    es: "Chupito whisky normal",
                    en: "Regular whisky shot",
                  },
                  precio: "1,90 €",
                },
                {
                  nombre: {
                    es: "Chupito Johnnie Walker",
                    en: "Johnnie Walker shot",
                  },
                  precio: "1,90 €",
                },
                {
                  nombre: {
                    es: "Chupito Johnnie Walker etiqueta negra",
                    en: "Johnnie Walker Black Label shot",
                  },
                  precio: "2,90 €",
                },
              ],
            },
            {
              nombre: { es: "Licores", en: "Liqueurs" },
              items: [
                {
                  nombre: { es: "Frangelico", en: "Frangelico" },
                  precio: "4,45 €",
                },
                {
                  nombre: { es: "Baileys", en: "Baileys" },
                  precio: "4,45 €",
                },
                {
                  nombre: { es: "Amaretto", en: "Amaretto" },
                  precio: "4,45 €",
                },
                {
                  nombre: { es: "Mojito", en: "Mojito" },
                  precio: "5,95 €",
                },
                {
                  nombre: { es: "Mojito de frutas", en: "Fruit mojito" },
                  precio: "6,95 €",
                },
                {
                  nombre: { es: "Licor", en: "Liqueur" },
                  precio: "4,40 €",
                },
                {
                  nombre: { es: "D.J. Reposado", en: "D.J. Reposado" },
                  precio: "5,20 €",
                },
                {
                  nombre: { es: "Chupito licor", en: "Liqueur shot" },
                  precio: "2,00 €",
                },
              ],
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