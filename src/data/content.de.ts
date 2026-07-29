import type { LocaleContent, ProductText } from "./content.i18n";

// German content overrides. English lives in catalog.ts; the localize* helpers
// in content.i18n.ts merge these in for locale "de". Structural fields (slug,
// code, colours, img, originSlugs, forms, certs, coords) are never translated.

export const PRODUCTS_DE: Record<string, ProductText> = {
  "matcha": {
    "tagline": "Steingemahlener Grüntee, schattengezogen am Ursprung.",
    "description": "Lebendiger Single-Origin-Matcha in Ceremonial-, Premium- und Culinary-Graden. Schattengezogen und steingemahlen, jede Charge laborgeprüft, von der Probe bis zum ganzen Container.",
    "intro": "Matcha ist steingemahlener Grüntee, der vor der Ernte wochenlang beschattet wird, um sein tiefes Umami und die leuchtende Farbe aufzubauen. Wir liefern Single-Origin-Matcha aus Japan und China in Ceremonial-, Premium- und Culinary-Graden — schattengezogen, steingemahlen und in jeder Charge laborgeprüft, von der Probe bis zum ganzen Container über unseren Hongkong-Hub.",
    "applications": [
      "Lattes & Matcha-Bars",
      "RTD & abgefüllte Getränke",
      "Backwaren & Patisserie",
      "Eis & Desserts",
      "Nahrungsergänzung & Kapseln",
      "Private Label"
    ],
    "specs": [
      {
        "label": "Aussehen",
        "value": "Feines grünes Pulver"
      },
      {
        "label": "Quelle",
        "value": "Schattengezogener Grüntee (Camellia sinensis)"
      },
      {
        "label": "Grade",
        "value": "Ceremonial · Premium · Culinary"
      },
      {
        "label": "Ursprung",
        "value": "Japan · China"
      },
      {
        "label": "Verpackung",
        "value": "1 kg Folie → 25 kg / ganzer Container"
      },
      {
        "label": "Dokumentation",
        "value": "COA + Verification Record™ pro Charge"
      }
    ],
    "gradeNotes": [
      { "grade": "Ceremonial", "use": "Pur mit Wasser aufgeschlagen — leuchtend grün, natürlich süß, feiner Geschmack. Für Premium-Lattes, Matcha-Bars und puren Ausschank." },
      { "grade": "Premium", "use": "Das Allround-Arbeitstier — ausgewogene Farbe und Geschmack für Cafés, RTD-Getränke und den täglichen Menüeinsatz im großen Maßstab." },
      { "grade": "Culinary", "use": "Behält Farbe und Körper auch neben anderen Zutaten — für Backwaren, Eis, Desserts und Nahrungsergänzung." },
    ]
  },
  "hojicha": {
    "tagline": "Gerösteter Grüntee — koffeinarm, tiefes Aroma.",
    "description": "Über Holzkohle gerösteter japanischer Grüntee mit warmem, röstigem Profil. Passt natürlich zu Lattes, Backwaren und RTD-Anwendungen.",
    "intro": "Hojicha ist japanischer Grüntee, der über Holzkohle geröstet wird, was das Koffein mildert und ein warmes, röstiges Aroma hervorbringt. Wir liefern Hojicha-Pulver, gemahlen für gleichmäßige Farbe und gleichmäßigen Geschmack — ideal für Lattes, Backwaren und RTD — bezogen aus Japan und Ostchina und pro Charge über unseren Hongkong-Hub dokumentiert.",
    "applications": [
      "Lattes & Hojicha-Bars",
      "RTD & abgefüllte Getränke",
      "Backwaren & Patisserie",
      "Eis & Desserts",
      "Schokolade & Confiserie",
      "Private Label"
    ],
    "specs": [
      {
        "label": "Aussehen",
        "value": "Warmbraunes Pulver"
      },
      {
        "label": "Quelle",
        "value": "Gerösteter Grüntee (Camellia sinensis)"
      },
      {
        "label": "Grade",
        "value": "Bio · Konventionell"
      },
      {
        "label": "Ursprung",
        "value": "Japan · Ostchina"
      },
      {
        "label": "Koffein",
        "value": "Von Natur aus niedrig"
      },
      {
        "label": "Dokumentation",
        "value": "COA + Verification Record™ pro Charge"
      }
    ]
  },
  "ube": {
    "tagline": "Purpur-Yam-Pulver — Farbe und Geschmack von den Philippinen.",
    "description": "Von Natur aus leuchtend violettes Purpur-Yam-Pulver für Getränke, Backwaren und Confiserie. Klare Farbe, gleichmäßige Partikelgröße, skalierbare Versorgung.",
    "intro": "Ube ist die leuchtend violette Purpur-Yam-Knolle, die von philippinischen Küchen auf Speisekarten weltweit gewandert ist. Unser Ube-Pulver wird aus reifen Purpur-Yams (Dioscorea alata) gemahlen — für eine klare, natürlich violette Farbe und eine sanfte, vanilleartige Süße, ganz ohne künstliche Farbstoffe. Wir beziehen es direkt auf den Philippinen, mit einer China-Route für Skalierung, und prüfen und dokumentieren jede Charge, bevor sie über unseren Hongkong-Hub versendet wird.",
    "applications": [
      "Lattes & RTD-Getränke",
      "Backwaren & Viennoiserie",
      "Eis & Gelato",
      "Confiserie & Füllungen",
      "Käsekuchen & Desserts",
      "Pancakes & Waffeln"
    ],
    "specs": [
      {
        "label": "Aussehen",
        "value": "Feines violettes Pulver"
      },
      {
        "label": "Quelle",
        "value": "Purpur-Yam (Dioscorea alata)"
      },
      {
        "label": "Ursprung",
        "value": "Philippinen · China"
      },
      {
        "label": "Koffein",
        "value": "Koffeinfrei"
      },
      {
        "label": "Verpackung",
        "value": "1 kg Folie → 25 kg / ganzer Container"
      },
      {
        "label": "Dokumentation",
        "value": "COA + Verification Record™ pro Charge"
      }
    ]
  },
  "lions-mane": {
    "tagline": "Funktioneller Pilz für die Nutraceutical-Formulierung.",
    "description": "Fruchtkörper-Lion's-Mane für Supplement- und Functional-Food-Marken. Auf Wirkstoffe und Kontaminanten geprüft, pro Charge dokumentiert.",
    "intro": "Lion's Mane (Hericium erinaceus) ist der funktionelle Pilz, nach dem Nutraceutical-Marken namentlich fragen. Wir liefern Fruchtkörper-Pulver — nicht Myzel-auf-Getreide — sodass Formulierer von einem sauberen, dokumentierten Material ausgehen, geprüft auf Wirkstoffe und Kontaminanten. Bezogen aus China, Charge für Charge geprüft und über unseren Hongkong-Hub geleitet, in Bio- und konventioneller Qualität.",
    "applications": [
      "Kapseln & Tabletten",
      "Functional Coffee & Lattes",
      "Nootropische Blends",
      "Pulver & Stickpacks",
      "Gummies",
      "Functional Foods"
    ],
    "specs": [
      {
        "label": "Aussehen",
        "value": "Cremeweißes bis bräunliches Pulver"
      },
      {
        "label": "Quelle",
        "value": "Fruchtkörper (Hericium erinaceus)"
      },
      {
        "label": "Ursprung",
        "value": "China"
      },
      {
        "label": "Grade",
        "value": "Bio · Konventionell"
      },
      {
        "label": "Extrakt",
        "value": "Pulver oder Extraktverhältnisse auf Anfrage"
      },
      {
        "label": "Dokumentation",
        "value": "COA + Verification Record™ pro Charge"
      }
    ]
  },
  "hibiscus": {
    "tagline": "Herbe, rubinrote Pflanze für Tees und Getränke.",
    "description": "Tiefrote Hibiskus für Aufgüsse, RTD und Blends. In Menge bezogen, geprüft und dokumentiert.",
    "intro": "Hibiskus (Hibiscus sabdariffa) bringt eine tiefe Rubinfarbe und eine helle, cranberryartige Säure, die sich durch Getränke wie Backwaren zieht. Wir beziehen sonnengereifte Kelche — vor allem aus Ägypten, mit einer Ostchina-Route für Volumen — und mahlen sie zu einem gleichmäßigen Pulver, pro Charge geprüft und dokumentiert, bevor es über Hongkong geleitet wird.",
    "applications": [
      "Tees & Aufgüsse",
      "RTD & funktionelle Getränke",
      "Natürliche rote Farbe",
      "Backwaren & Confiserie",
      "Sirupe & Cordials",
      "Joghurt & Desserts"
    ],
    "specs": [
      {
        "label": "Aussehen",
        "value": "Tiefrotes Pulver"
      },
      {
        "label": "Quelle",
        "value": "Hibiscus-sabdariffa-Kelch"
      },
      {
        "label": "Ursprung",
        "value": "Ägypten · Ostchina"
      },
      {
        "label": "Koffein",
        "value": "Koffeinfrei"
      },
      {
        "label": "Verpackung",
        "value": "1 kg Folie → 25 kg / ganzer Container"
      },
      {
        "label": "Dokumentation",
        "value": "COA + Verification Record™ pro Charge"
      }
    ]
  },
  "jasmine-tea-powder": {
    "tagline": "Jasminbedufteter Grüntee, fein gemahlen.",
    "description": "Grünteepulver, geschichtet mit echter Jasminblüte — florales Aroma, weicher Abgang. Für Lattes, RTD, Backwaren und Blends. In Menge bezogen, pro Charge geprüft und dokumentiert.",
    "intro": "Jasmin-Teepulver ist Grüntee, der mit echter Jasminblüte geschichtet und dann fein gemahlen wird — für ein florales Aroma und einen klaren, weichen Abgang. Wir beziehen ihn aus Ostchina und Fujian — Chinas klassischer Jasmin-Region — und prüfen und dokumentieren jede Charge, bevor sie über unseren Hongkong-Hub versendet wird.",
    "applications": [
      "Lattes & Tea-Bars",
      "RTD & abgefüllte Getränke",
      "Backwaren & Patisserie",
      "Eis & Desserts",
      "Cocktails & Mocktails",
      "Private Label"
    ],
    "specs": [
      {
        "label": "Aussehen",
        "value": "Feines grünes Pulver"
      },
      {
        "label": "Quelle",
        "value": "Jasminbedufteter Grüntee"
      },
      {
        "label": "Grade",
        "value": "Bio · Konventionell"
      },
      {
        "label": "Ursprung",
        "value": "Ostchina · Fujian"
      },
      {
        "label": "Verpackung",
        "value": "1 kg Folie → 25 kg / ganzer Container"
      },
      {
        "label": "Dokumentation",
        "value": "COA + Verification Record™ pro Charge"
      }
    ]
  },
  "oolong-tea-powder": {
    "tagline": "Halbfermentierter Tee, geröstet und fein gemahlen.",
    "description": "Ganzblatt-Oolong, fein gemahlen — röstig, floral und komplex. Halbfermentiert in Chinas klassischem Oolong-Land. Für Spezialitäten-Lattes, RTD und Dessert-Anwendungen.",
    "intro": "Oolong ist halbfermentierter Tee — zwischen Grün und Schwarz — mit einer röstigen, floralen Komplexität. Wir mahlen Ganzblatt-Oolong aus Chinas klassischem Oolong-Land zu einem feinen Pulver für Spezialitäten-Lattes, RTD und Dessert-Arbeit, pro Charge geprüft und dokumentiert über unseren Hongkong-Hub.",
    "applications": [
      "Spezialitäten-Lattes",
      "RTD & abgefüllte Getränke",
      "Backwaren & Patisserie",
      "Eis & Desserts",
      "Cocktails & Mocktails",
      "Private Label"
    ],
    "specs": [
      {
        "label": "Aussehen",
        "value": "Bernsteinbraunes Pulver"
      },
      {
        "label": "Quelle",
        "value": "Halbfermentierter Ganzblatt-Tee"
      },
      {
        "label": "Grade",
        "value": "Bio · Konventionell"
      },
      {
        "label": "Ursprung",
        "value": "Ostchina · Fujian"
      },
      {
        "label": "Verpackung",
        "value": "1 kg Folie → 25 kg / ganzer Container"
      },
      {
        "label": "Dokumentation",
        "value": "COA + Verification Record™ pro Charge"
      }
    ]
  },
  "earl-grey-tea-powder": {
    "tagline": "Schwarztee mit natürlichem Bergamotte, fein gemahlen.",
    "description": "Schwarzteepulver mit natürlichem Bergamotteöl — kräftig, zitrushell und aromatisch. Eine markante Basis für Lattes, Backwaren und Getränkeinnovation. Pro Charge bezogen und dokumentiert.",
    "intro": "Earl Grey ist Schwarztee mit natürlicher Bergamotte — kräftig, zitrushell und sofort erkennbar. Wir mahlen ihn zu einem feinen Pulver, das sein Aroma durch Lattes, Backwaren und Getränkeinnovation trägt, bezogen aus Ostchina und Fujian und pro Charge über unseren Hongkong-Hub dokumentiert.",
    "applications": [
      "Lattes & Tea-Bars",
      "RTD & abgefüllte Getränke",
      "Backwaren & Patisserie",
      "Eis & Desserts",
      "Cocktails & Mocktails",
      "Private Label"
    ],
    "specs": [
      {
        "label": "Aussehen",
        "value": "Feines dunkles Pulver"
      },
      {
        "label": "Quelle",
        "value": "Schwarztee mit natürlicher Bergamotte"
      },
      {
        "label": "Grade",
        "value": "Konventionell"
      },
      {
        "label": "Ursprung",
        "value": "Ostchina · Fujian"
      },
      {
        "label": "Verpackung",
        "value": "1 kg Folie → 25 kg / ganzer Container"
      },
      {
        "label": "Dokumentation",
        "value": "COA + Verification Record™ pro Charge"
      }
    ]
  }
};

export const CATEGORY_DE: Record<string, string> = {
  "Matcha": "Matcha",
  "Hojicha": "Hojicha",
  "Specialty Teas": "Spezialitäten-Tees",
  "Superfoods": "Superfoods"
};
export const ORIGIN_NAME_DE: Record<string, string> = {
  "east-china-cn": "Ostchina",
  "south-china-cn": "Südchina",
  "philippines-ph": "Philippinen",
  "egypt-eg": "Ägypten"
};
export const COUNTRY_DE: Record<string, string> = {
  "Japan": "Japan",
  "China": "China",
  "Philippines": "Philippinen",
  "Egypt": "Ägypten"
};
export const FORM_DE: Record<string, string> = {
  "Organic": "Bio",
  "Conventional": "konventionell"
};
export const ORIGIN_BLURB_DE: Record<string, string> = {
  "uji-jp": "Bei Kyoto — Japans historisches Tee-Kernland; beschattete Gärten, tiefes Umami.",
  "shizuoka-jp": "Japans größte Teeregion; verlässliche Qualität im großen Maßstab.",
  "kagoshima-jp": "Vulkanisches Südjapan; mineralreicher Boden, frühe Ernten.",
  "nara-jp": "Yamato-Teeland bei Nara; sanftes, ausgewogenes Blatt.",
  "gifu-jp": "Berggärten in Zentraljapan; klarer, frischer Charakter.",
  "ibaraki-jp": "Ostjapan; kräftiges, vollmundiges Blatt.",
  "kyoto-jp": "Präfektur Kyoto — die kulturelle Heimat des japanischen Tees.",
  "east-china-cn": "Ostchinas Teegürtel; breite, gleichmäßige Versorgung im Volumen.",
  "south-china-cn": "Südchina; warmes Klima, aromatisches Blatt.",
  "fujian-cn": "Fujian — Chinas klassische Region für Grüntee, Oolong & Jasmin.",
  "china-cn": "Bezogen in ganz China; pro Charge geprüft und dokumentiert.",
  "philippines-ph": "Philippinisches Hochland; lebendige, natürlich süße Ernten.",
  "egypt-eg": "Sonnengereift entlang des Nils; tiefe Farbe, helle Säure."
};
export const ORIGIN_INTRO_DE: Record<string, string> = {
  "china-cn": "Über Tee hinaus ist China einer der weltweit größten und leistungsfähigsten Anbauer funktioneller und spezieller Kulturen — von Lion's Mane und anderen Pilzen bis zu Ube und botanischen Pulvern. Wir arbeiten für diese Linien mit geprüfter chinesischer Versorgung, testen jede Charge auf Pestizidrückstände, Schwermetalle und Mikrobiologie und dokumentieren sie mit einem Verification Record™, bevor sie unseren Hongkong-Hub verlässt. Es ist die Route, zu der wir greifen, wenn ein Programm echte Skalierung braucht, ohne die Rückverfolgbarkeit zu verlieren.",
  "egypt-eg": "Ägyptens vom Nil gespeiste Felder sind die klassische Heimat des Hibiskus (Hibiscus sabdariffa). Lange Sonnenstunden geben den Kelchen ihre tiefe Rubinfarbe und ihre helle, klare Säure. Wir beziehen sonnengereiften ägyptischen Hibiskus, mahlen ihn zu einem gleichmäßigen Pulver und testen jede Charge auf Kontaminanten, bevor wir sie dokumentieren und über Hongkong leiten — sodass die Farbe und Säure, die Sie bemustern, auch die Farbe und Säure sind, die Sie im Volumen erhalten."
};

export const DE: LocaleContent = {
  products: PRODUCTS_DE,
  category: CATEGORY_DE,
  originName: ORIGIN_NAME_DE,
  country: COUNTRY_DE,
  form: FORM_DE,
  blurb: ORIGIN_BLURB_DE,
  intro: ORIGIN_INTRO_DE,
};
