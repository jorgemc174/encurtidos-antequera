-- Inicializa en home_json las claves visibles del rediseño (2026-11-25)
-- conservando cualquier personalización previa ya guardada en Supabase.
begin;

update public.home_json
set data = jsonb_build_object(
  'es', jsonb_build_object(
    'tituloPortada', 'Tapas, aceitunas y cañas',
    'entradaPortada', 'En el Mercado del Puerto (Las Palmas), en Gáldar y en Telde.',
    'novedadTituloV2', 'Antequera en Gastro Ingenio',
    'novedadTextoV2', 'Nuestra barra en el Mercado Gastronómico Navideño de Ingenio: montaditos, perritos, minihamburguesas, banderillas y aceitunas.',
    'novedadLugar', 'Ingenio, Gran Canaria',
    'productosTitulo', 'Aceitunas, encurtidos y tapas',
    'dondeTitulo', 'Dónde estamos',
    'equipoTitulo', 'El equipo',
    'equipoPie', 'El equipo de Antequera Encurtidos en Gastro Ingenio.',
    'contactoTitulo', 'Contacto',
    'trabajaTitulo', 'Trabaja con nosotros',
    'trabajaTexto', 'Envíanos tu currículum por correo.',
    'enviarCV', 'Enviar currículum',
    'cartaCompleta', 'Carta completa de cada puesto:',
    'verCartas', 'Cartas',
    'verCarta', 'Ver carta',
    'comoLlegar', 'Cómo llegar',
    'horarioSemana', 'Horario de la semana',
    'horarioPorConfirmar', 'Horario por confirmar',
    'abiertoHasta', 'Abierto hasta las {h}',
    'cerradoAbreA', 'Cerrado. Abre hoy a las {h}',
    'cerradoAhora', 'Cerrado ahora',
    'ayudaToque', 'Toca una tapa para ver su foto. La carta cambia según el puesto.',
    'ayudaRaton', 'Pasa el ratón por una tapa para ver su foto. La carta cambia según el puesto.'
  ) || coalesce(data->'es', '{}'::jsonb),
  'en', jsonb_build_object(
    'tituloPortada', 'Tapas, olives and draught beer',
    'entradaPortada', 'At the Mercado del Puerto in Las Palmas, in Gáldar and in Telde.',
    'novedadTituloV2', 'Antequera at Gastro Ingenio',
    'novedadTextoV2', 'Our bar at the Ingenio Christmas food market: montaditos, hot dogs, mini burgers, pickle skewers and olives.',
    'novedadLugar', 'Ingenio, Gran Canaria',
    'productosTitulo', 'Olives, pickles and tapas',
    'dondeTitulo', 'Where to find us',
    'equipoTitulo', 'The team',
    'equipoPie', 'The Antequera Encurtidos team at Gastro Ingenio.',
    'contactoTitulo', 'Contact',
    'trabajaTitulo', 'Work with us',
    'trabajaTexto', 'Email us your CV.',
    'enviarCV', 'Send CV',
    'cartaCompleta', 'Full menu for each location:',
    'verCartas', 'Menus',
    'verCarta', 'View menu',
    'comoLlegar', 'Directions',
    'horarioSemana', 'Weekly opening hours',
    'horarioPorConfirmar', 'Opening hours to be confirmed',
    'abiertoHasta', 'Open until {h}',
    'cerradoAbreA', 'Closed. Opens today at {h}',
    'cerradoAhora', 'Closed now',
    'ayudaToque', 'Tap a dish to see its photo. Menus vary by location.',
    'ayudaRaton', 'Hover over a dish to see its photo. Menus vary by location.'
  ) || coalesce(data->'en', '{}'::jsonb)
),
updated_at = now()
where section = 'textos';

update public.home_json
set data = (
  select jsonb_agg(
    case
      when elem ? 'lugar' then elem
      when ord = 1 then elem || '{"lugar":{"es":"Dentro del Mercado del Puerto.","en":"Inside the Mercado del Puerto."}}'::jsonb
      else elem || '{"lugar":{"es":"","en":""}}'::jsonb
    end
    order by ord
  )
  from jsonb_array_elements(data) with ordinality as t(elem, ord)
),
updated_at = now()
where section = 'puestos' and jsonb_typeof(data) = 'array';

update public.home_json
set data = (
  select jsonb_agg(
    case
      when elem->'nombre'->>'es' = 'Tapas tradicionales' and jsonb_array_length(elem->'items') = 1
        and elem->'items'->0->>'imagenKey' = 'tortilla'
        then jsonb_set(jsonb_set(elem, '{nombre}', '{"es":"Tortilla","en":"Spanish omelette"}'::jsonb), '{items,0,nombre}', '{"es":"Tortilla","en":"Spanish omelette"}'::jsonb)
      when elem->'nombre'->>'es' = 'Especialidades de la casa' and jsonb_array_length(elem->'items') = 1
        and elem->'items'->0->>'imagenKey' = 'pollo-kentucky'
        then jsonb_set(jsonb_set(elem, '{nombre}', '{"es":"Pollo Kentucky","en":"Kentucky chicken"}'::jsonb), '{items,0,nombre}', '{"es":"Pollo Kentucky","en":"Kentucky chicken"}'::jsonb)
      when elem->'nombre'->>'es' = 'Raciones para compartir' and jsonb_array_length(elem->'items') = 1
        and elem->'items'->0->>'imagenKey' = 'papas-bravas'
        then jsonb_set(jsonb_set(elem, '{nombre}', '{"es":"Papas bravas","en":"Patatas bravas"}'::jsonb), '{items,0,nombre}', '{"es":"Papas bravas","en":"Patatas bravas"}'::jsonb)
      else elem
    end
    order by ord
  )
  from jsonb_array_elements(data) with ordinality as t(elem, ord)
),
updated_at = now()
where section = 'productos' and jsonb_typeof(data) = 'array';

commit;
