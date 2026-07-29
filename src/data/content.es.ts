import type { LocaleContent, ProductText } from "./content.i18n";

// Spanish content overrides. English lives in catalog.ts; the localize* helpers
// in content.i18n.ts merge these in for locale "es". Structural fields (slug,
// code, colours, img, originSlugs, forms, certs, coords) are never translated.

export const PRODUCTS_ES: Record<string, ProductText> = {
  "matcha": {
    "tagline": "Té verde molido en piedra, cultivado a la sombra en origen.",
    "description": "Matcha vibrante de origen único en grados ceremonial, premium y culinario. Cultivado a la sombra y molido en piedra, cada lote analizado en laboratorio, desde la muestra hasta el contenedor completo.",
    "intro": "El matcha es té verde molido en piedra, sombreado durante semanas antes de la cosecha para desarrollar su profundo umami y su color intenso. Suministramos matcha de origen único de Japón y China en grados ceremonial, premium y culinario — cultivado a la sombra, molido en piedra y analizado en laboratorio en cada lote, desde la muestra hasta el contenedor completo a través de nuestro hub de Hong Kong.",
    "applications": [
      "Lattes y barras de matcha",
      "Bebidas RTD y embotelladas",
      "Panadería y pastelería",
      "Helados y postres",
      "Suplementos y cápsulas",
      "Marca blanca"
    ],
    "specs": [
      { "label": "Apariencia", "value": "Polvo verde fino" },
      { "label": "Fuente", "value": "Té verde cultivado a la sombra (Camellia sinensis)" },
      { "label": "Grado", "value": "Ceremonial · Premium · Culinario" },
      { "label": "Origen", "value": "Japón · China" },
      { "label": "Presentación", "value": "Bolsa de 1 kg → 25 kg / contenedor completo" },
      { "label": "Documentación", "value": "COA + Verification Record™ por lote" }
    ],
    "gradeNotes": [
      { "grade": "Ceremonial", "use": "Batido directamente con agua — verde vivo, naturalmente dulce, textura fina. Para lattes premium, barras de matcha y servicio directo." },
      { "grade": "Premium", "use": "El caballo de batalla diario — color y sabor equilibrados para cafeterías, bebidas RTD y uso en carta a escala." },
      { "grade": "Culinary", "use": "Diseñado para mantener color y cuerpo junto a otros ingredientes — para bollería, helados, postres y suplementos." },
    ]
  },
  "hojicha": {
    "tagline": "Té verde tostado — bajo en cafeína, aroma profundo.",
    "description": "Té verde japonés tostado sobre carbón con un perfil cálido y tostado. Combina de forma natural con lattes, panadería y aplicaciones RTD.",
    "intro": "El hojicha es té verde japonés tostado sobre carbón, lo que suaviza la cafeína y aporta un aroma cálido y tostado. Suministramos polvo de hojicha, molido para lograr un color y un sabor homogéneos — ideal para lattes, panadería y RTD — procedente de Japón y China oriental y documentado lote a lote a través de nuestro hub de Hong Kong.",
    "applications": [
      "Lattes y barras de hojicha",
      "Bebidas RTD y embotelladas",
      "Panadería y pastelería",
      "Helados y postres",
      "Chocolate y confitería",
      "Marca blanca"
    ],
    "specs": [
      { "label": "Apariencia", "value": "Polvo marrón cálido" },
      { "label": "Fuente", "value": "Té verde tostado (Camellia sinensis)" },
      { "label": "Grado", "value": "Orgánico · Convencional" },
      { "label": "Origen", "value": "Japón · China oriental" },
      { "label": "Cafeína", "value": "Naturalmente baja" },
      { "label": "Documentación", "value": "COA + Verification Record™ por lote" }
    ]
  },
  "ube": {
    "tagline": "Polvo de ñame morado — color y sabor de Filipinas.",
    "description": "Polvo de ñame morado naturalmente intenso para bebidas, panadería y confitería. Color limpio, tamaño de partícula homogéneo, suministro escalable.",
    "intro": "El ube es el tubérculo de ñame morado, de un violeta intenso, que pasó de las cocinas filipinas a las cartas de todo el mundo. Nuestro polvo de ube se muele a partir de ñames morados maduros (Dioscorea alata) — para un color violeta limpio y natural y un dulzor suave, tipo vainilla, sin colorantes artificiales. Lo suministramos directamente en Filipinas, con una ruta por China para escalar, y analizamos y documentamos cada lote antes de enviarlo a través de nuestro hub de Hong Kong.",
    "applications": [
      "Lattes y bebidas RTD",
      "Panadería y viennoiserie",
      "Helados y gelato",
      "Confitería y rellenos",
      "Tartas de queso y postres",
      "Tortitas y gofres"
    ],
    "specs": [
      { "label": "Apariencia", "value": "Polvo violeta fino" },
      { "label": "Fuente", "value": "Ñame morado (Dioscorea alata)" },
      { "label": "Origen", "value": "Filipinas · China" },
      { "label": "Cafeína", "value": "Sin cafeína" },
      { "label": "Presentación", "value": "Bolsa de 1 kg → 25 kg / contenedor completo" },
      { "label": "Documentación", "value": "COA + Verification Record™ por lote" }
    ]
  },
  "lions-mane": {
    "tagline": "Hongo funcional para la formulación nutracéutica.",
    "description": "Melena de león de cuerpo fructífero para marcas de suplementos y alimentos funcionales. Analizado en busca de principios activos y contaminantes, documentado lote a lote.",
    "intro": "La melena de león (Hericium erinaceus) es el hongo funcional que las marcas nutracéuticas piden por su nombre. Suministramos polvo de cuerpo fructífero — no micelio sobre grano — para que los formuladores partan de un material limpio y documentado, analizado en busca de principios activos y contaminantes. Procedente de China, analizado lote a lote y enrutado a través de nuestro hub de Hong Kong, en calidad orgánica y convencional.",
    "applications": [
      "Cápsulas y comprimidos",
      "Café funcional y lattes",
      "Mezclas nootrópicas",
      "Polvos y sticks",
      "Gomitas",
      "Alimentos funcionales"
    ],
    "specs": [
      { "label": "Apariencia", "value": "Polvo de blanco cremoso a pardo" },
      { "label": "Fuente", "value": "Cuerpo fructífero (Hericium erinaceus)" },
      { "label": "Origen", "value": "China" },
      { "label": "Grado", "value": "Orgánico · Convencional" },
      { "label": "Extracto", "value": "Polvo o ratios de extracto a solicitud" },
      { "label": "Documentación", "value": "COA + Verification Record™ por lote" }
    ]
  },
  "hibiscus": {
    "tagline": "Flor rubí y ácida para tés y bebidas.",
    "description": "Hibisco de un rojo intenso para infusiones, RTD y mezclas. Suministrado a volumen, analizado y documentado.",
    "intro": "El hibisco (Hibiscus sabdariffa) aporta un intenso color rubí y una acidez brillante, tipo arándano, que atraviesa tanto bebidas como panadería. Suministramos cálices madurados al sol — sobre todo de Egipto, con una ruta por China oriental para el volumen — y los molemos hasta obtener un polvo homogéneo, analizado y documentado lote a lote antes de enrutarlo a través de Hong Kong.",
    "applications": [
      "Tés e infusiones",
      "Bebidas RTD y funcionales",
      "Color rojo natural",
      "Panadería y confitería",
      "Siropes y cordiales",
      "Yogur y postres"
    ],
    "specs": [
      { "label": "Apariencia", "value": "Polvo rojo intenso" },
      { "label": "Fuente", "value": "Cáliz de Hibiscus sabdariffa" },
      { "label": "Origen", "value": "Egipto · China oriental" },
      { "label": "Cafeína", "value": "Sin cafeína" },
      { "label": "Presentación", "value": "Bolsa de 1 kg → 25 kg / contenedor completo" },
      { "label": "Documentación", "value": "COA + Verification Record™ por lote" }
    ]
  },
  "jasmine-tea-powder": {
    "tagline": "Té verde perfumado con jazmín, finamente molido.",
    "description": "Polvo de té verde estratificado con flor de jazmín auténtica — aroma floral, final suave. Para lattes, RTD, panadería y mezclas. Suministrado a volumen, analizado y documentado lote a lote.",
    "intro": "El polvo de té de jazmín es té verde estratificado con flor de jazmín auténtica y luego finamente molido — para un aroma floral y un final limpio y suave. Lo suministramos de China oriental y Fujian — la región clásica del jazmín en China — y analizamos y documentamos cada lote antes de enviarlo a través de nuestro hub de Hong Kong.",
    "applications": [
      "Lattes y barras de té",
      "Bebidas RTD y embotelladas",
      "Panadería y pastelería",
      "Helados y postres",
      "Cócteles y mocktails",
      "Marca blanca"
    ],
    "specs": [
      { "label": "Apariencia", "value": "Polvo verde fino" },
      { "label": "Fuente", "value": "Té verde perfumado con jazmín" },
      { "label": "Grado", "value": "Orgánico · Convencional" },
      { "label": "Origen", "value": "China oriental · Fujian" },
      { "label": "Presentación", "value": "Bolsa de 1 kg → 25 kg / contenedor completo" },
      { "label": "Documentación", "value": "COA + Verification Record™ por lote" }
    ]
  },
  "oolong-tea-powder": {
    "tagline": "Té semifermentado, tostado y finamente molido.",
    "description": "Oolong de hoja entera, finamente molido — tostado, floral y complejo. Semifermentado en la tierra clásica del oolong de China. Para lattes de especialidad, RTD y aplicaciones de postre.",
    "intro": "El oolong es té semifermentado — entre el verde y el negro — con una complejidad tostada y floral. Molemos oolong de hoja entera de la tierra clásica del oolong de China hasta obtener un polvo fino para lattes de especialidad, RTD y trabajo de postre, analizado y documentado lote a lote a través de nuestro hub de Hong Kong.",
    "applications": [
      "Lattes de especialidad",
      "Bebidas RTD y embotelladas",
      "Panadería y pastelería",
      "Helados y postres",
      "Cócteles y mocktails",
      "Marca blanca"
    ],
    "specs": [
      { "label": "Apariencia", "value": "Polvo ámbar" },
      { "label": "Fuente", "value": "Té de hoja entera semifermentado" },
      { "label": "Grado", "value": "Orgánico · Convencional" },
      { "label": "Origen", "value": "China oriental · Fujian" },
      { "label": "Presentación", "value": "Bolsa de 1 kg → 25 kg / contenedor completo" },
      { "label": "Documentación", "value": "COA + Verification Record™ por lote" }
    ]
  },
  "earl-grey-tea-powder": {
    "tagline": "Té negro con bergamota natural, finamente molido.",
    "description": "Polvo de té negro con aceite de bergamota natural — intenso, cítrico y aromático. Una base distintiva para lattes, panadería e innovación en bebidas. Suministrado y documentado lote a lote.",
    "intro": "El Earl Grey es té negro con bergamota natural — intenso, cítrico e inconfundible al instante. Lo molemos hasta obtener un polvo fino que lleva su aroma a lattes, panadería e innovación en bebidas, procedente de China oriental y Fujian y documentado lote a lote a través de nuestro hub de Hong Kong.",
    "applications": [
      "Lattes y barras de té",
      "Bebidas RTD y embotelladas",
      "Panadería y pastelería",
      "Helados y postres",
      "Cócteles y mocktails",
      "Marca blanca"
    ],
    "specs": [
      { "label": "Apariencia", "value": "Polvo oscuro fino" },
      { "label": "Fuente", "value": "Té negro con bergamota natural" },
      { "label": "Grado", "value": "Convencional" },
      { "label": "Origen", "value": "China oriental · Fujian" },
      { "label": "Presentación", "value": "Bolsa de 1 kg → 25 kg / contenedor completo" },
      { "label": "Documentación", "value": "COA + Verification Record™ por lote" }
    ]
  }
};

export const CATEGORY_ES: Record<string, string> = {
  "Matcha": "Matcha",
  "Hojicha": "Hojicha",
  "Specialty Teas": "Tés de especialidad",
  "Superfoods": "Superalimentos"
};
export const ORIGIN_NAME_ES: Record<string, string> = {
  "east-china-cn": "China oriental",
  "south-china-cn": "China meridional",
  "philippines-ph": "Filipinas",
  "egypt-eg": "Egipto"
};
export const COUNTRY_ES: Record<string, string> = {
  "Japan": "Japón",
  "China": "China",
  "Philippines": "Filipinas",
  "Egypt": "Egipto"
};
export const FORM_ES: Record<string, string> = {
  "Organic": "Orgánico",
  "Conventional": "Convencional"
};
export const ORIGIN_BLURB_ES: Record<string, string> = {
  "uji-jp": "Cerca de Kioto — el corazón histórico del té de Japón; jardines sombreados, umami profundo.",
  "shizuoka-jp": "La mayor región de té de Japón; calidad fiable a gran escala.",
  "kagoshima-jp": "Sur volcánico de Japón; suelo rico en minerales, cosechas tempranas.",
  "nara-jp": "Tierra de té de Yamato, cerca de Nara; hoja suave y equilibrada.",
  "gifu-jp": "Jardines de montaña en el centro de Japón; carácter limpio y fresco.",
  "ibaraki-jp": "Este de Japón; hoja intensa y con cuerpo.",
  "kyoto-jp": "Prefectura de Kioto — la cuna cultural del té japonés.",
  "east-china-cn": "El cinturón del té del este de China; suministro amplio y homogéneo a volumen.",
  "south-china-cn": "Sur de China; clima cálido, hoja aromática.",
  "fujian-cn": "Fujian — la región clásica de China para té verde, oolong y jazmín.",
  "china-cn": "Suministrado en toda China; analizado y documentado lote a lote.",
  "philippines-ph": "Tierras altas de Filipinas; cosechas vivas y naturalmente dulces.",
  "egypt-eg": "Madurado al sol a lo largo del Nilo; color profundo, acidez brillante."
};
export const ORIGIN_INTRO_ES: Record<string, string> = {
  "china-cn": "Más allá del té, China es uno de los mayores y más capaces cultivadores de cultivos funcionales y de especialidad del mundo — desde melena de león y otros hongos hasta ube y polvos botánicos. Para estas líneas trabajamos con suministro chino verificado, analizamos cada lote en busca de residuos de pesticidas, metales pesados y microbiología, y lo documentamos con un Verification Record™ antes de que salga de nuestro hub de Hong Kong. Es la ruta a la que recurrimos cuando un programa necesita una escala real sin perder la trazabilidad.",
  "egypt-eg": "Los campos regados por el Nilo de Egipto son la cuna clásica de la flor de hibisco (Hibiscus sabdariffa). Las largas horas de sol dan a los cálices su intenso color rubí y su acidez brillante y clara. Suministramos hibisco egipcio madurado al sol, lo molemos hasta obtener un polvo homogéneo y analizamos cada lote en busca de contaminantes antes de documentarlo y enrutarlo a través de Hong Kong — de modo que el color y la acidez que usted muestrea sean el color y la acidez que recibe a volumen."
};

export const ES: LocaleContent = {
  products: PRODUCTS_ES,
  category: CATEGORY_ES,
  originName: ORIGIN_NAME_ES,
  country: COUNTRY_ES,
  form: FORM_ES,
  blurb: ORIGIN_BLURB_ES,
  intro: ORIGIN_INTRO_ES,
};
