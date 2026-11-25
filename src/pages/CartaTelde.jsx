import CartaBase from "./CartaBase";

const categorias = [
  {
    "items": [
      {
        "nombre": {
          "en": "Goat cheese with caramelized onion",
          "es": "Queso cabra con cebolla caramelizada"
        },
        "precio": "3,00 €",
        "imagenKey": "queso-de-cabra-cebolla-caramelizada"
      },
      {
        "nombre": {
          "en": "Smoked cheese with blueberry",
          "es": "Queso ahumado con arándano"
        },
        "precio": "3,00 €",
        "imagenKey": "queso-ahumado-arandanos"
      },
      {
        "nombre": {
          "en": "Teror chorizo, cheese and honey",
          "es": "Chorizo de Teror, queso y miel"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Spanish omelette",
          "es": "Tortilla"
        },
        "precio": "3,00 €",
        "imagenKey": "tortilla"
      },
      {
        "nombre": {
          "en": "Barbecue chicken",
          "es": "Pollo barbacoa"
        },
        "precio": "3,00 €",
        "imagenKey": "pollo-mechado"
      },
      {
        "nombre": {
          "en": "Shredded beef",
          "es": "Ternera mechada"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Burgos black pudding with sun-dried tomato",
          "es": "Morcilla de Burgos con tomate deshidratado"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Meatballs",
          "es": "Albóndigas"
        },
        "precio": "3,00 €",
        "imagenKey": "albondigas"
      },
      {
        "nombre": {
          "en": "Marinated dogfish with mojo",
          "es": "Cazón en adobo y mojo"
        },
        "precio": "3,00 €",
        "imagenKey": "cazon"
      },
      {
        "nombre": {
          "en": "Chicken tenderloin with mustard and honey",
          "es": "Solomillo de pollo de mostaza y miel"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Chistorra sausage, potatoes and egg",
          "es": "Chistorra, papas y huevo"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Pressed ribs",
          "es": "Costilla prensada"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Fried squid strips",
          "es": "Rabas"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Serrano ham with blue cheese and tomato bread",
          "es": "Serrano con queso azul y tumaca"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Ham with leek and cheese",
          "es": "Jamón york con puerro y queso"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Watercress with cheese and honey",
          "es": "Berros con queso y miel"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Chicken with guacamole",
          "es": "Pollo guacamole"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Hake fillet",
          "es": "Filete de merluza"
        },
        "precio": "3,00 €",
        "imagenKey": "merluza"
      },
      {
        "nombre": {
          "en": "Tuna, pepper and anchovy",
          "es": "Atún, pimiento y anchoa"
        },
        "precio": "3,00 €",
        "imagenKey": "atun-anchoas"
      },
      {
        "nombre": {
          "en": "Crab stick and prawns",
          "es": "Chatka y gambas"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Kentucky chicken",
          "es": "Pollo Kentucky"
        },
        "precio": "3,00 €",
        "imagenKey": "pollo-kentucky"
      },
      {
        "nombre": {
          "en": "And always more specials",
          "es": "Siempre alguno más"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Hot dogs",
          "es": "Perritos"
        },
        "precio": "3,00 €"
      },
      {
        "nombre": {
          "en": "Burgers",
          "es": "Hamburguesas"
        },
        "precio": "3,50 €",
        "imagenKey": "hamburguesa"
      },
      {
        "nombre": {
          "en": "Mini pizzas",
          "es": "Mini pizzas"
        },
        "precio": "4,20 €"
      },
      {
        "nombre": {
          "en": "Fajita",
          "es": "Fajita"
        },
        "precio": "3,50 €",
        "imagenKey": "fajita"
      }
    ],
    "nombre": {
      "en": "Mini sandwiches",
      "es": "Montaditos"
    }
  },
  {
    "items": [
      {
        "nombre": {
          "en": "Crispy chicken salad",
          "es": "Ensalada crujiente de pollo"
        },
        "precio": "9,85 €"
      },
      {
        "nombre": {
          "en": "Crab salad",
          "es": "Ensalada de cangrejo"
        },
        "precio": "8,95 €",
        "imagenKey": "ensalada-cangrejo-picar"
      },
      {
        "nombre": {
          "en": "Seasoned tomatoes with tuna belly",
          "es": "Tomates aliñados con ventresca"
        },
        "precio": "11,80 €"
      },
      {
        "nombre": {
          "en": "Canarian cheese board",
          "es": "Tabla de queso canario"
        },
        "precio": "9,80 €"
      },
      {
        "nombre": {
          "en": "Antequera potatoes",
          "es": "Papas Antequera"
        },
        "precio": "6,50 €"
      },
      {
        "nombre": {
          "en": "Country chorizo",
          "es": "Chorizo campo"
        },
        "precio": "8,50 €"
      },
      {
        "nombre": {
          "en": "Galician-style octopus",
          "es": "Pulpo a la gallega"
        },
        "precio": "15,50 €"
      },
      {
        "nombre": {
          "en": "Battered prawns",
          "es": "Gambas a la gabardina"
        },
        "precio": "8,50 €",
        "imagenKey": "gambas-gabardina"
      },
      {
        "nombre": {
          "en": "Marinated anchovies",
          "es": "Boquerones"
        },
        "precio": "8,95 €"
      },
      {
        "nombre": {
          "en": "Iberian ham",
          "es": "Jamón ibérico"
        },
        "precio": "18,90 €"
      },
      {
        "nombre": {
          "en": "Pork knuckle in its own juices",
          "es": "Codillo en su jugo"
        },
        "precio": "19,85 €"
      },
      {
        "nombre": {
          "en": "Barbecue ribs",
          "es": "Costillas barbacoa"
        },
        "precio": "19,85 €"
      },
      {
        "nombre": {
          "en": "Chistorra sausages",
          "es": "Chistorras"
        },
        "precio": "8,50 €"
      },
      {
        "nombre": {
          "en": "Kentucky chicken",
          "es": "Pollo Kentucky"
        },
        "precio": "12,50 €"
      },
      {
        "nombre": {
          "en": "Fried squid strips",
          "es": "Rabas"
        },
        "precio": "9,95 €"
      },
      {
        "nombre": {
          "en": "Marinated anchovies and anchovies",
          "es": "Boquerones y anchoas"
        },
        "precio": "9,95 €"
      },
      {
        "nombre": {
          "en": "Meatball casserole",
          "es": "Cazuela de albóndigas"
        },
        "precio": "15,90 €"
      },
      {
        "nombre": {
          "en": "Mussels 18/25 pieces",
          "es": "Mejillones 18/25 piezas"
        },
        "precio": "15,95 €"
      },
      {
        "nombre": {
          "en": "Mussels 4/6 pieces",
          "es": "Mejillones 4/6 piezas"
        },
        "precio": "4,95 €"
      }
    ],
    "nombre": {
      "en": "To share",
      "es": "Para picar"
    }
  },
  {
    "items": [
      {
        "nombre": {
          "en": "Salmon with cheese",
          "es": "Salmón con queso"
        },
        "precio": "2,20 €"
      },
      {
        "nombre": {
          "en": "Piparra pepper with anchovy",
          "es": "Piparra con anchoa"
        },
        "precio": "2,20 €"
      },
      {
        "nombre": {
          "en": "Stuffed marinated anchovy",
          "es": "Boquerón con relleno"
        },
        "precio": "2,20 €"
      },
      {
        "nombre": {
          "en": "Cured beef with cheese",
          "es": "Cecina con queso"
        },
        "precio": "2,20 €"
      },
      {
        "nombre": {
          "en": "Braised artichoke",
          "es": "Alcachofa braseada"
        },
        "precio": "2,50 €"
      },
      {
        "nombre": {
          "en": "Bowl of olives",
          "es": "Cuenco de aceituna"
        },
        "precio": "1,50 €"
      },
      {
        "nombre": {
          "en": "Bowl of nuts",
          "es": "Cuenco de frutos secos"
        },
        "precio": "1,50 €"
      },
      {
        "nombre": {
          "en": "And always more specials",
          "es": "Siempre alguno más"
        },
        "precio": "Consultar €"
      }
    ],
    "nombre": {
      "en": "Skewers and pinchos",
      "es": "Pinchos y banderillas"
    }
  },
  {
    "nombre": {
      "en": "Drinks",
      "es": "Bebidas"
    },
    "noImages": true,
    "subcategorias": [
      {
        "items": [
          {
            "nombre": {
              "en": "Coca-Cola",
              "es": "Coca Cola"
            },
            "precio": "2,10 €"
          },
          {
            "nombre": {
              "en": "Orange Fanta",
              "es": "Fanta naranja"
            },
            "precio": "2,10 €"
          },
          {
            "nombre": {
              "en": "Lemon Fanta",
              "es": "Fanta limón"
            },
            "precio": "2,10 €"
          },
          {
            "nombre": {
              "en": "Nestea",
              "es": "Nestea"
            },
            "precio": "2,20 €"
          },
          {
            "nombre": {
              "en": "Juice can",
              "es": "Zumo bote"
            },
            "precio": "1,70 €"
          },
          {
            "nombre": {
              "en": "Regular tonic (Schweppes, Nordic M.)",
              "es": "Tónica normal (Schweppes, Nordic M.)"
            },
            "precio": "2,10 €"
          },
          {
            "nombre": {
              "en": "Special tonic (Royal Bliss)",
              "es": "Tónica especial (Royal Bliss)"
            },
            "precio": "2,10 €"
          },
          {
            "nombre": {
              "en": "Premium tonic",
              "es": "Tónica premium"
            },
            "precio": "2,90 €"
          },
          {
            "nombre": {
              "en": "Sparkling water",
              "es": "Agua con gas"
            },
            "precio": "1,30 €"
          },
          {
            "nombre": {
              "en": "Still water",
              "es": "Agua sin gas"
            },
            "precio": "1,30 €"
          },
          {
            "nombre": {
              "en": "Energy drink",
              "es": "Bebida energética"
            },
            "precio": "2,80 €"
          },
          {
            "nombre": {
              "en": "Strawberry Clipper",
              "es": "Clipper fresa"
            },
            "precio": "2,10 €"
          },
          {
            "nombre": {
              "en": "Aquarius",
              "es": "Aquarius"
            },
            "precio": "2,20 €"
          },
          {
            "nombre": {
              "en": "Appletiser",
              "es": "Appletiser"
            },
            "precio": "2,20 €"
          }
        ],
        "nombre": {
          "en": "Soft drinks",
          "es": "Refrescos"
        }
      },
      {
        "items": [
          {
            "nombre": {
              "en": "Large beer",
              "es": "Jarra"
            },
            "precio": "3,70 €"
          },
          {
            "nombre": {
              "en": "Draft beer",
              "es": "Caña"
            },
            "precio": "2,00 €"
          },
          {
            "nombre": {
              "en": "Glass of beer",
              "es": "Copa de cerveza"
            },
            "precio": "2,50 €"
          },
          {
            "nombre": {
              "en": "Alhambra 1925",
              "es": "Alhambra 1925"
            },
            "precio": "2,80 €"
          },
          {
            "nombre": {
              "en": "Alhambra red",
              "es": "Alhambra roja"
            },
            "precio": "3,10 €"
          },
          {
            "nombre": {
              "en": "Alcohol-free Alhambra",
              "es": "Alhambra sin alcohol"
            },
            "precio": "2,30 €"
          },
          {
            "nombre": {
              "en": "Alhambra lemon Radler",
              "es": "Alhambra Radler limón"
            },
            "precio": "2,90 €"
          },
          {
            "nombre": {
              "en": "Alhambra IPA",
              "es": "Alhambra IPA"
            },
            "precio": "4,00 €"
          },
          {
            "nombre": {
              "en": "Mahou Radler",
              "es": "Mahou Radler"
            },
            "precio": "2,90 €"
          },
          {
            "nombre": {
              "en": "Gluten-free Mahou",
              "es": "Mahou sin gluten"
            },
            "precio": "2,70 €"
          },
          {
            "nombre": {
              "en": "Mahou toasted",
              "es": "Mahou tostada"
            },
            "precio": "2,70 €"
          },
          {
            "nombre": {
              "en": "Mahou Maestra",
              "es": "Mahou maestra"
            },
            "precio": "3,00 €"
          },
          {
            "nombre": {
              "en": "Dorada special",
              "es": "Dorada especial"
            },
            "precio": "2,70 €"
          },
          {
            "nombre": {
              "en": "Alcohol-free Dorada",
              "es": "Dorada sin alcohol"
            },
            "precio": "2,20 €"
          },
          {
            "nombre": {
              "en": "Alcohol-free Dorada lemon",
              "es": "Dorada sin alcohol limón"
            },
            "precio": "2,30 €"
          },
          {
            "nombre": {
              "en": "Tropical lemon",
              "es": "Tropical limón"
            },
            "precio": "2,40 €"
          },
          {
            "nombre": {
              "en": "San Miguel lemon 0.0",
              "es": "San Miguel limón 0.0"
            },
            "precio": "2,70 €"
          }
        ],
        "nombre": {
          "en": "Beers",
          "es": "Cervezas"
        }
      },
      {
        "grupos": [
          {
            "items": [
              {
                "nombre": {
                  "en": "Fruity white wine glass",
                  "es": "Copa afrutado"
                },
                "precio": "3,50 €"
              },
              {
                "nombre": {
                  "en": "Glass of Verdejo Castillo de Aza D.O. Rueda",
                  "es": "Copa Verdejo Castillo de Aza D.O. Rueda"
                },
                "precio": "3,20 €"
              },
              {
                "nombre": {
                  "en": "Glass of semi-sweet Jaume Serra D.O. Penedès",
                  "es": "Copa semi Jaume Serra D.O. Penedès"
                },
                "precio": "3,20 €"
              },
              {
                "nombre": {
                  "en": "Glass of fino manzanilla",
                  "es": "Copa manzanilla fino"
                },
                "precio": "3,00 €"
              },
              {
                "nombre": {
                  "en": "Bottle of fruity white wine",
                  "es": "Botella afrutado"
                },
                "precio": "16,00 €"
              },
              {
                "nombre": {
                  "en": "Bottle of Verdejo Castillo de Aza D.O. Rueda",
                  "es": "Botella Verdejo Castillo de Aza D.O. Rueda"
                },
                "precio": "13,80 €"
              },
              {
                "nombre": {
                  "en": "Bottle of semi-sweet Jaume Serra D.O. Penedès",
                  "es": "Botella semi Jaume Serra D.O. Penedès"
                },
                "precio": "13,80 €"
              },
              {
                "nombre": {
                  "en": "Bottle of Albariño",
                  "es": "Botella Albariño"
                },
                "precio": "13,90 €"
              }
            ],
            "nombre": {
              "en": "White wine",
              "es": "Vino blanco"
            }
          },
          {
            "items": [
              {
                "nombre": {
                  "en": "Glass of house rosé",
                  "es": "Copa rosado de mi pueblo"
                },
                "precio": "3,20 €"
              },
              {
                "nombre": {
                  "en": "Bottle of house rosé",
                  "es": "Botella rosado de mi pueblo"
                },
                "precio": "13,50 €"
              }
            ],
            "nombre": {
              "en": "Rosé wine",
              "es": "Vino rosado"
            }
          },
          {
            "items": [
              {
                "nombre": {
                  "en": "Glass of Rioja",
                  "es": "Copa de Rioja"
                },
                "precio": "3,50 €"
              },
              {
                "nombre": {
                  "en": "Glass of Figuero 4 D.O. Ribera del Duero Roble",
                  "es": "Copa Figuero 4 D.O. Ribera del Duero Roble"
                },
                "precio": "3,80 €"
              },
              {
                "nombre": {
                  "en": "Glass of Pagos de Valcerracín Ribera del Duero Roble",
                  "es": "Copa Pagos de Valcerracín Ribera del Duero Roble"
                },
                "precio": "3,50 €"
              },
              {
                "nombre": {
                  "en": "Summer red wine",
                  "es": "Copa tinto de verano"
                },
                "precio": "2,00 €"
              },
              {
                "nombre": {
                  "en": "Bottle of Figuero 4 D.O. Ribera del Duero Roble",
                  "es": "Botella Figuero 4 D.O. Ribera del Duero Roble"
                },
                "precio": "17,00 €"
              },
              {
                "nombre": {
                  "en": "Bottle of Pagos de Valcerracín Ribera del Duero Roble",
                  "es": "Botella Pagos de Valcerracín Ribera del Duero Roble"
                },
                "precio": "16,00 €"
              },
              {
                "nombre": {
                  "en": "Bottle of Viña Paceta Crianza D.O. Rioja",
                  "es": "Botella Viña Paceta Crianza D.O. Rioja"
                },
                "precio": "16,00 €"
              }
            ],
            "nombre": {
              "en": "Red wine",
              "es": "Vino tinto"
            }
          }
        ],
        "nombre": {
          "en": "Wines",
          "es": "Vinos"
        }
      },
      {
        "items": [
          {
            "nombre": {
              "en": "Pitcher of sangria",
              "es": "Jarra sangría"
            },
            "precio": "9,90 €"
          },
          {
            "nombre": {
              "en": "Cava",
              "es": "Cava"
            },
            "precio": "18,00 €"
          },
          {
            "nombre": {
              "en": "Glass of Izaguirre reserve vermouth",
              "es": "Copa vermouth Izaguirre reserva"
            },
            "precio": "3,90 €"
          },
          {
            "nombre": {
              "en": "Smirnoff Ice",
              "es": "Smirnoff Ice"
            },
            "precio": "2,80 €"
          },
          {
            "nombre": {
              "en": "Smirnoff",
              "es": "Smirnoff"
            },
            "precio": "4,00 €"
          },
          {
            "nombre": {
              "en": "Moskovskaya",
              "es": "Moskovskaya"
            },
            "precio": "4,00 €"
          }
        ],
        "nombre": {
          "en": "Others",
          "es": "Varios"
        }
      },
      {
        "items": [
          {
            "nombre": {
              "en": "Matusalen añejo",
              "es": "Matusalen añejo"
            },
            "precio": "4,10 €"
          },
          {
            "nombre": {
              "en": "Matusalen 15 years",
              "es": "Matusalen 15 años"
            },
            "precio": "5,50 €"
          },
          {
            "nombre": {
              "en": "Barceló añejo",
              "es": "Barceló añejo"
            },
            "precio": "4,00 €"
          },
          {
            "nombre": {
              "en": "Carta Oro",
              "es": "Carta Oro"
            },
            "precio": "2,80 €"
          },
          {
            "nombre": {
              "en": "Carta Blanca",
              "es": "Carta Blanca"
            },
            "precio": "2,80 €"
          },
          {
            "nombre": {
              "en": "Telde",
              "es": "Telde"
            },
            "precio": "2,80 €"
          },
          {
            "nombre": {
              "en": "Cacique 500",
              "es": "Cacique 500"
            },
            "precio": "6,00 €"
          },
          {
            "nombre": {
              "en": "Cacique añejo",
              "es": "Cacique añejo"
            },
            "precio": "5,00 €"
          },
          {
            "nombre": {
              "en": "Santa Teresa",
              "es": "Santa Teresa"
            },
            "precio": "4,10 €"
          },
          {
            "nombre": {
              "en": "Havana Club 3 years",
              "es": "Havana Club 3 años"
            },
            "precio": "3,90 €"
          },
          {
            "nombre": {
              "en": "Havana Club 7 years",
              "es": "Havana Club 7 años"
            },
            "precio": "4,10 €"
          },
          {
            "nombre": {
              "en": "La Aldea",
              "es": "La Aldea"
            },
            "precio": "2,90 €"
          },
          {
            "nombre": {
              "en": "Zacapa",
              "es": "Zacapa"
            },
            "precio": "9,70 €"
          },
          {
            "nombre": {
              "en": "Zacapa rum shot",
              "es": "Chupito ron Zacapa"
            },
            "precio": "4,20 €"
          },
          {
            "nombre": {
              "en": "Rum shot",
              "es": "Chupito ron"
            },
            "precio": "1,80 €"
          }
        ],
        "nombre": {
          "en": "Rum",
          "es": "Ron"
        }
      },
      {
        "items": [
          {
            "nombre": {
              "en": "Master Mille",
              "es": "Master Mille"
            },
            "precio": "5,50 €"
          },
          {
            "nombre": {
              "en": "Roco Gin",
              "es": "Roco Gin"
            },
            "precio": "7,00 €"
          },
          {
            "nombre": {
              "en": "Nordés",
              "es": "Nordés"
            },
            "precio": "5,00 €"
          },
          {
            "nombre": {
              "en": "Gold",
              "es": "Gold"
            },
            "precio": "7,00 €"
          },
          {
            "nombre": {
              "en": "Bombay",
              "es": "Bombay"
            },
            "precio": "5,00 €"
          },
          {
            "nombre": {
              "en": "Gordon's London",
              "es": "Gordon's London"
            },
            "precio": "4,00 €"
          },
          {
            "nombre": {
              "en": "Gordon's Pink",
              "es": "Gordon's Pink"
            },
            "precio": "4,00 €"
          },
          {
            "nombre": {
              "en": "Sheridan's",
              "es": "Sheridan's"
            },
            "precio": "5,00 €"
          },
          {
            "nombre": {
              "en": "Macaronesia",
              "es": "Macaronesia"
            },
            "precio": "5,00 €"
          },
          {
            "nombre": {
              "en": "Macaronesia Brownie",
              "es": "Macaronesia Brownie"
            },
            "precio": "5,70 €"
          },
          {
            "nombre": {
              "en": "Beefeater",
              "es": "Beefeater"
            },
            "precio": "4,00 €"
          },
          {
            "nombre": {
              "en": "Puerto de Indias",
              "es": "Puerto de Indias"
            },
            "precio": "5,00 €"
          },
          {
            "nombre": {
              "en": "Tanqueray Ten",
              "es": "Tanqueray Ten"
            },
            "precio": "6,30 €"
          },
          {
            "nombre": {
              "en": "Tanqueray Sevilla",
              "es": "Tanqueray Sevilla"
            },
            "precio": "5,00 €"
          },
          {
            "nombre": {
              "en": "Tanqueray",
              "es": "Tanqueray"
            },
            "precio": "6,30 €"
          },
          {
            "nombre": {
              "en": "Tanqueray 0.0",
              "es": "Tanqueray 0.0"
            },
            "precio": "5,00 €"
          },
          {
            "nombre": {
              "en": "Gin shot",
              "es": "Chupito ginebra"
            },
            "precio": "2,00 €"
          }
        ],
        "nombre": {
          "en": "Gins",
          "es": "Ginebras"
        }
      },
      {
        "items": [
          {
            "nombre": {
              "en": "J&B",
              "es": "J&B"
            },
            "precio": "2,80 €"
          },
          {
            "nombre": {
              "en": "Ballantines",
              "es": "Ballantines"
            },
            "precio": "3,80 €"
          },
          {
            "nombre": {
              "en": "Jack Daniels",
              "es": "Jack Daniels"
            },
            "precio": "6,50 €"
          },
          {
            "nombre": {
              "en": "John Haig",
              "es": "John Haig"
            },
            "precio": "2,80 €"
          },
          {
            "nombre": {
              "en": "100 Pipers",
              "es": "100 Pipers"
            },
            "precio": "2,80 €"
          },
          {
            "nombre": {
              "en": "Johnnie Walker Red Label",
              "es": "Johnnie Walker etiqueta roja"
            },
            "precio": "3,80 €"
          },
          {
            "nombre": {
              "en": "Johnnie Walker Black Label",
              "es": "Johnnie Walker etiqueta negra"
            },
            "precio": "5,60 €"
          },
          {
            "nombre": {
              "en": "Cardhu",
              "es": "Cardhu"
            },
            "precio": "6,60 €"
          },
          {
            "nombre": {
              "en": "Regular whisky shot",
              "es": "Chupito whisky normal"
            },
            "precio": "2,00 €"
          },
          {
            "nombre": {
              "en": "Johnnie Walker shot",
              "es": "Chupito Johnnie Walker"
            },
            "precio": "1,90 €"
          },
          {
            "nombre": {
              "en": "Johnnie Walker Black Label shot",
              "es": "Chupito Johnnie Walker etiqueta negra"
            },
            "precio": "3,50 €"
          }
        ],
        "nombre": {
          "en": "Whisky",
          "es": "Whisky"
        }
      },
      {
        "items": [
          {
            "nombre": {
              "en": "Frangelico",
              "es": "Frangelico"
            },
            "precio": "4,50 €"
          },
          {
            "nombre": {
              "en": "Baileys",
              "es": "Baileys"
            },
            "precio": "4,50 €"
          },
          {
            "nombre": {
              "en": "Amaretto",
              "es": "Amaretto"
            },
            "precio": "4,50 €"
          },
          {
            "nombre": {
              "en": "Mojito",
              "es": "Mojito"
            },
            "precio": "7,00 €"
          },
          {
            "nombre": {
              "en": "Fruit mojito",
              "es": "Mojito de frutas"
            },
            "precio": "7,50 €"
          },
          {
            "nombre": {
              "en": "Liqueur",
              "es": "Licor"
            },
            "precio": "4,55 €"
          },
          {
            "nombre": {
              "en": "D.J. Reposado",
              "es": "D.J. Reposado"
            },
            "precio": "9,00 €"
          },
          {
            "nombre": {
              "en": "Liqueur shot",
              "es": "Chupito licor"
            },
            "precio": "2,00 €"
          }
        ],
        "nombre": {
          "en": "Liqueurs",
          "es": "Licores"
        }
      }
    ],
    "subcategoriasPlegables": true
  }
];

export default function CartaTelde() {
  return (
    <CartaBase
      titulo={{ es: "Carta - Telde", en: "Menu - Telde" }}
      categorias={categorias}
    />
  );
}
