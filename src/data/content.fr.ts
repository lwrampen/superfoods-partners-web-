import type { LocaleContent, ProductText } from "./content.i18n";

// French content overrides. English lives in catalog.ts; the localize* helpers
// in content.i18n.ts merge these in for locale "fr". Structural fields (slug,
// code, colours, img, originSlugs, forms, certs, coords) are never translated.

export const PRODUCTS_FR: Record<string, ProductText> = {
  "matcha": {
    "tagline": "Thé vert moulu à la pierre, cultivé à l'ombre en origine.",
    "description": "Matcha vibrant d'origine unique en grades cérémonial, premium et culinaire. Cultivé à l'ombre et moulu à la pierre, chaque lot analysé en laboratoire, de l'échantillon au conteneur complet.",
    "intro": "Le matcha est un thé vert moulu à la pierre, ombré pendant des semaines avant la récolte pour développer son umami profond et sa couleur éclatante. Nous fournissons du matcha d'origine unique du Japon et de Chine en grades cérémonial, premium et culinaire — cultivé à l'ombre, moulu à la pierre et analysé en laboratoire sur chaque lot, de l'échantillon au conteneur complet via notre hub de Hong Kong.",
    "applications": [
      "Lattes et bars à matcha",
      "Boissons RTD et embouteillées",
      "Boulangerie et pâtisserie",
      "Glaces et desserts",
      "Compléments et gélules",
      "Marque de distributeur"
    ],
    "specs": [
      { "label": "Apparence", "value": "Poudre verte fine" },
      { "label": "Source", "value": "Thé vert cultivé à l'ombre (Camellia sinensis)" },
      { "label": "Grade", "value": "Cérémonial · Premium · Culinaire" },
      { "label": "Origine", "value": "Japon · Chine" },
      { "label": "Conditionnement", "value": "Sachet de 1 kg → 25 kg / conteneur complet" },
      { "label": "Documentation", "value": "COA + Verification Record™ par lot" }
    ],
    "gradeNotes": [
      { "grade": "Ceremonial", "use": "Fouetté directement à l'eau — vert vif, naturellement doux, texture fine. Pour lattes premium, bars à matcha et service pur." },
      { "grade": "Premium", "use": "Le pilier du quotidien — couleur et goût équilibrés pour cafés, boissons RTD et usage à la carte à grande échelle." },
      { "grade": "Culinary", "use": "Conçu pour tenir sa couleur et son corps face aux autres ingrédients — pour boulangerie, glaces, desserts et compléments." },
    ]
  },
  "hojicha": {
    "tagline": "Thé vert torréfié — pauvre en caféine, arôme profond.",
    "description": "Thé vert japonais torréfié au charbon de bois, au profil chaud et grillé. S'accorde naturellement aux lattes, à la boulangerie et aux applications RTD.",
    "intro": "Le hojicha est un thé vert japonais torréfié au charbon de bois, ce qui adoucit la caféine et fait ressortir un arôme chaud et grillé. Nous fournissons de la poudre de hojicha, broyée pour une couleur et une saveur homogènes — idéale pour les lattes, la boulangerie et le RTD — sourcée au Japon et en Chine orientale et documentée lot par lot via notre hub de Hong Kong.",
    "applications": [
      "Lattes et bars à hojicha",
      "Boissons RTD et embouteillées",
      "Boulangerie et pâtisserie",
      "Glaces et desserts",
      "Chocolat et confiserie",
      "Marque de distributeur"
    ],
    "specs": [
      { "label": "Apparence", "value": "Poudre brun chaud" },
      { "label": "Source", "value": "Thé vert torréfié (Camellia sinensis)" },
      { "label": "Grade", "value": "Bio · Conventionnel" },
      { "label": "Origine", "value": "Japon · Chine orientale" },
      { "label": "Caféine", "value": "Naturellement faible" },
      { "label": "Documentation", "value": "COA + Verification Record™ par lot" }
    ]
  },
  "ube": {
    "tagline": "Poudre d'igname violette — couleur et saveur des Philippines.",
    "description": "Poudre d'igname violette naturellement intense pour boissons, boulangerie et confiserie. Couleur nette, granulométrie homogène, approvisionnement évolutif.",
    "intro": "L'ube est le tubercule d'igname violette, d'un violet intense, passé des cuisines philippines aux cartes du monde entier. Notre poudre d'ube est broyée à partir d'ignames violettes mûres (Dioscorea alata) — pour une couleur violette nette et naturelle et une douceur subtile, vanillée, sans colorants artificiels. Nous la sourçons directement aux Philippines, avec une route via la Chine pour la montée en échelle, et analysons et documentons chaque lot avant de l'expédier via notre hub de Hong Kong.",
    "applications": [
      "Lattes et boissons RTD",
      "Boulangerie et viennoiserie",
      "Glaces et gelato",
      "Confiserie et fourrages",
      "Cheesecakes et desserts",
      "Pancakes et gaufres"
    ],
    "specs": [
      { "label": "Apparence", "value": "Poudre violette fine" },
      { "label": "Source", "value": "Igname violette (Dioscorea alata)" },
      { "label": "Origine", "value": "Philippines · Chine" },
      { "label": "Caféine", "value": "Sans caféine" },
      { "label": "Conditionnement", "value": "Sachet de 1 kg → 25 kg / conteneur complet" },
      { "label": "Documentation", "value": "COA + Verification Record™ par lot" }
    ]
  },
  "lions-mane": {
    "tagline": "Champignon fonctionnel pour la formulation nutraceutique.",
    "description": "Crinière de lion issue du carpophore pour marques de compléments et d'aliments fonctionnels. Analysée pour les principes actifs et les contaminants, documentée lot par lot.",
    "intro": "La crinière de lion (Hericium erinaceus) est le champignon fonctionnel que les marques nutraceutiques demandent nommément. Nous fournissons de la poudre de carpophore — et non du mycélium sur céréales — afin que les formulateurs partent d'une matière propre et documentée, analysée pour les principes actifs et les contaminants. Sourcée en Chine, analysée lot par lot et acheminée via notre hub de Hong Kong, en qualité bio et conventionnelle.",
    "applications": [
      "Gélules et comprimés",
      "Café fonctionnel et lattes",
      "Mélanges nootropiques",
      "Poudres et sticks",
      "Gommes",
      "Aliments fonctionnels"
    ],
    "specs": [
      { "label": "Apparence", "value": "Poudre blanc crème à brunâtre" },
      { "label": "Source", "value": "Carpophore (Hericium erinaceus)" },
      { "label": "Origine", "value": "Chine" },
      { "label": "Grade", "value": "Bio · Conventionnel" },
      { "label": "Extrait", "value": "Poudre ou ratios d'extrait sur demande" },
      { "label": "Documentation", "value": "COA + Verification Record™ par lot" }
    ]
  },
  "hibiscus": {
    "tagline": "Fleur rubis et acidulée pour thés et boissons.",
    "description": "Hibiscus d'un rouge profond pour infusions, RTD et mélanges. Sourcé en volume, analysé et documenté.",
    "intro": "L'hibiscus (Hibiscus sabdariffa) apporte une couleur rubis profonde et une acidité vive, façon canneberge, qui traverse aussi bien les boissons que la boulangerie. Nous sourçons des calices mûris au soleil — principalement d'Égypte, avec une route via la Chine orientale pour le volume — et les broyons en une poudre homogène, analysée et documentée lot par lot avant d'être acheminée via Hong Kong.",
    "applications": [
      "Thés et infusions",
      "Boissons RTD et fonctionnelles",
      "Colorant rouge naturel",
      "Boulangerie et confiserie",
      "Sirops et cordials",
      "Yaourts et desserts"
    ],
    "specs": [
      { "label": "Apparence", "value": "Poudre rouge profond" },
      { "label": "Source", "value": "Calice d'Hibiscus sabdariffa" },
      { "label": "Origine", "value": "Égypte · Chine orientale" },
      { "label": "Caféine", "value": "Sans caféine" },
      { "label": "Conditionnement", "value": "Sachet de 1 kg → 25 kg / conteneur complet" },
      { "label": "Documentation", "value": "COA + Verification Record™ par lot" }
    ]
  },
  "jasmine-tea-powder": {
    "tagline": "Thé vert parfumé au jasmin, finement moulu.",
    "description": "Poudre de thé vert superposée à de véritables fleurs de jasmin — arôme floral, finale douce. Pour lattes, RTD, boulangerie et mélanges. Sourcée en volume, analysée et documentée lot par lot.",
    "intro": "La poudre de thé au jasmin est un thé vert superposé à de véritables fleurs de jasmin, puis finement moulu — pour un arôme floral et une finale nette et douce. Nous la sourçons en Chine orientale et au Fujian — la région classique du jasmin en Chine — et analysons et documentons chaque lot avant de l'expédier via notre hub de Hong Kong.",
    "applications": [
      "Lattes et bars à thé",
      "Boissons RTD et embouteillées",
      "Boulangerie et pâtisserie",
      "Glaces et desserts",
      "Cocktails et mocktails",
      "Marque de distributeur"
    ],
    "specs": [
      { "label": "Apparence", "value": "Poudre verte fine" },
      { "label": "Source", "value": "Thé vert parfumé au jasmin" },
      { "label": "Grade", "value": "Bio · Conventionnel" },
      { "label": "Origine", "value": "Chine orientale · Fujian" },
      { "label": "Conditionnement", "value": "Sachet de 1 kg → 25 kg / conteneur complet" },
      { "label": "Documentation", "value": "COA + Verification Record™ par lot" }
    ]
  },
  "oolong-tea-powder": {
    "tagline": "Thé semi-fermenté, torréfié et finement moulu.",
    "description": "Oolong en feuilles entières, finement moulu — grillé, floral et complexe. Semi-fermenté au cœur du pays classique de l'oolong en Chine. Pour lattes de spécialité, RTD et applications dessert.",
    "intro": "L'oolong est un thé semi-fermenté — entre le vert et le noir — d'une complexité grillée et florale. Nous broyons de l'oolong en feuilles entières issu du pays classique de l'oolong en Chine en une poudre fine pour lattes de spécialité, RTD et travail de dessert, analysé et documenté lot par lot via notre hub de Hong Kong.",
    "applications": [
      "Lattes de spécialité",
      "Boissons RTD et embouteillées",
      "Boulangerie et pâtisserie",
      "Glaces et desserts",
      "Cocktails et mocktails",
      "Marque de distributeur"
    ],
    "specs": [
      { "label": "Apparence", "value": "Poudre ambrée" },
      { "label": "Source", "value": "Thé en feuilles entières semi-fermenté" },
      { "label": "Grade", "value": "Bio · Conventionnel" },
      { "label": "Origine", "value": "Chine orientale · Fujian" },
      { "label": "Conditionnement", "value": "Sachet de 1 kg → 25 kg / conteneur complet" },
      { "label": "Documentation", "value": "COA + Verification Record™ par lot" }
    ]
  },
  "earl-grey-tea-powder": {
    "tagline": "Thé noir à la bergamote naturelle, finement moulu.",
    "description": "Poudre de thé noir à l'huile de bergamote naturelle — corsé, vif en agrumes et aromatique. Une base distinctive pour lattes, boulangerie et innovation boisson. Sourcé et documenté lot par lot.",
    "intro": "L'Earl Grey est un thé noir à la bergamote naturelle — corsé, vif en agrumes et immédiatement reconnaissable. Nous le broyons en une poudre fine qui porte son arôme dans les lattes, la boulangerie et l'innovation boisson, sourcé en Chine orientale et au Fujian et documenté lot par lot via notre hub de Hong Kong.",
    "applications": [
      "Lattes et bars à thé",
      "Boissons RTD et embouteillées",
      "Boulangerie et pâtisserie",
      "Glaces et desserts",
      "Cocktails et mocktails",
      "Marque de distributeur"
    ],
    "specs": [
      { "label": "Apparence", "value": "Poudre foncée fine" },
      { "label": "Source", "value": "Thé noir à la bergamote naturelle" },
      { "label": "Grade", "value": "Conventionnel" },
      { "label": "Origine", "value": "Chine orientale · Fujian" },
      { "label": "Conditionnement", "value": "Sachet de 1 kg → 25 kg / conteneur complet" },
      { "label": "Documentation", "value": "COA + Verification Record™ par lot" }
    ]
  }
};

export const CATEGORY_FR: Record<string, string> = {
  "Matcha": "Matcha",
  "Hojicha": "Hojicha",
  "Specialty Teas": "Thés de spécialité",
  "Superfoods": "Superaliments"
};
export const ORIGIN_NAME_FR: Record<string, string> = {
  "east-china-cn": "Chine orientale",
  "south-china-cn": "Chine méridionale",
  "philippines-ph": "Philippines",
  "egypt-eg": "Égypte"
};
export const COUNTRY_FR: Record<string, string> = {
  "Japan": "Japon",
  "China": "Chine",
  "Philippines": "Philippines",
  "Egypt": "Égypte"
};
export const FORM_FR: Record<string, string> = {
  "Organic": "Bio",
  "Conventional": "Conventionnel"
};
export const ORIGIN_BLURB_FR: Record<string, string> = {
  "uji-jp": "Près de Kyoto — le berceau historique du thé au Japon ; jardins ombrés, umami profond.",
  "shizuoka-jp": "La plus grande région de thé du Japon ; qualité fiable à grande échelle.",
  "kagoshima-jp": "Sud volcanique du Japon ; sol riche en minéraux, récoltes précoces.",
  "nara-jp": "Terroir de thé de Yamato près de Nara ; feuille douce et équilibrée.",
  "gifu-jp": "Jardins de montagne au centre du Japon ; caractère net et frais.",
  "ibaraki-jp": "Est du Japon ; feuille corsée et pleine.",
  "kyoto-jp": "Préfecture de Kyoto — le foyer culturel du thé japonais.",
  "east-china-cn": "La ceinture de thé de l'est de la Chine ; approvisionnement large et homogène en volume.",
  "south-china-cn": "Sud de la Chine ; climat chaud, feuille aromatique.",
  "fujian-cn": "Fujian — la région classique de Chine pour le thé vert, l'oolong et le jasmin.",
  "china-cn": "Sourcé à travers toute la Chine ; analysé et documenté lot par lot.",
  "philippines-ph": "Hauts plateaux des Philippines ; récoltes vives et naturellement sucrées.",
  "egypt-eg": "Mûri au soleil le long du Nil ; couleur profonde, acidité éclatante."
};
export const ORIGIN_INTRO_FR: Record<string, string> = {
  "china-cn": "Au-delà du thé, la Chine est l'un des plus grands et des plus performants producteurs mondiaux de cultures fonctionnelles et de spécialité — de la crinière de lion et d'autres champignons à l'ube et aux poudres botaniques. Pour ces lignes, nous travaillons avec un approvisionnement chinois vérifié, analysons chaque lot à la recherche de résidus de pesticides, de métaux lourds et de contamination microbiologique, et le documentons avec un Verification Record™ avant qu'il ne quitte notre hub de Hong Kong. C'est la route vers laquelle nous nous tournons lorsqu'un programme a besoin d'une véritable montée en échelle sans perdre la traçabilité.",
  "egypt-eg": "Les champs irrigués par le Nil en Égypte sont le berceau classique de l'hibiscus (Hibiscus sabdariffa). Les longues heures d'ensoleillement donnent aux calices leur couleur rubis profonde et leur acidité vive et nette. Nous sourçons de l'hibiscus égyptien mûri au soleil, le broyons en une poudre homogène et analysons chaque lot à la recherche de contaminants avant de le documenter et de l'acheminer via Hong Kong — de sorte que la couleur et l'acidité que vous échantillonnez soient la couleur et l'acidité que vous recevez en volume."
};

export const FR: LocaleContent = {
  products: PRODUCTS_FR,
  category: CATEGORY_FR,
  originName: ORIGIN_NAME_FR,
  country: COUNTRY_FR,
  form: FORM_FR,
  blurb: ORIGIN_BLURB_FR,
  intro: ORIGIN_INTRO_FR,
};
