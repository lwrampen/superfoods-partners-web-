import type { LocaleContent, ProductText } from "./content.i18n";

// Polish content overrides. English lives in catalog.ts; the localize* helpers
// in content.i18n.ts merge these in for locale "pl". Structural fields (slug,
// code, colours, img, originSlugs, forms, certs, coords) are never translated.

export const PRODUCTS_PL: Record<string, ProductText> = {
  "matcha": {
    "tagline": "Zielona herbata mielona na kamieniu, uprawiana w cieniu u źródła.",
    "description": "Intensywna matcha jednego pochodzenia w klasach ceremonialnej, premium i kulinarnej. Uprawiana w cieniu i mielona na kamieniu, każda partia badana laboratoryjnie — od próbki po pełny kontener.",
    "intro": "Matcha to zielona herbata mielona na kamieniu, cieniowana przez tygodnie przed zbiorem, aby rozwinąć głębokie umami i żywy kolor. Dostarczamy matchę jednego pochodzenia z Japonii i Chin w klasach ceremonialnej, premium i kulinarnej — uprawianą w cieniu, mieloną na kamieniu i badaną laboratoryjnie w każdej partii, od próbki po pełny kontener, przez nasz hub w Hongkongu.",
    "applications": [
      "Latte i bary matcha",
      "Napoje RTD i butelkowane",
      "Wypieki i cukiernictwo",
      "Lody i desery",
      "Suplementy i kapsułki",
      "Private label"
    ],
    "specs": [
      { "label": "Wygląd", "value": "Drobny zielony proszek" },
      { "label": "Źródło", "value": "Zielona herbata uprawiana w cieniu (Camellia sinensis)" },
      { "label": "Klasa", "value": "Ceremonialna · Premium · Kulinarna" },
      { "label": "Pochodzenie", "value": "Japonia · Chiny" },
      { "label": "Opakowanie", "value": "Saszetka 1 kg → 25 kg / pełny kontener" },
      { "label": "Dokumentacja", "value": "COA + Verification Record™ na partię" }
    ]
  },
  "hojicha": {
    "tagline": "Prażona zielona herbata — mało kofeiny, głęboki aromat.",
    "description": "Japońska zielona herbata prażona na węglu drzewnym, o ciepłym, tostowym profilu. Naturalnie pasuje do latte, wypieków i zastosowań RTD.",
    "intro": "Hojicha to japońska zielona herbata prażona na węglu drzewnym, co łagodzi kofeinę i wydobywa ciepły, tostowy aromat. Dostarczamy proszek hojicha, zmielony dla jednorodnego koloru i smaku — idealny do latte, wypieków i RTD — pozyskiwany w Japonii i wschodnich Chinach oraz dokumentowany partia po partii przez nasz hub w Hongkongu.",
    "applications": [
      "Latte i bary hojicha",
      "Napoje RTD i butelkowane",
      "Wypieki i cukiernictwo",
      "Lody i desery",
      "Czekolada i wyroby cukiernicze",
      "Private label"
    ],
    "specs": [
      { "label": "Wygląd", "value": "Ciepły brązowy proszek" },
      { "label": "Źródło", "value": "Prażona zielona herbata (Camellia sinensis)" },
      { "label": "Klasa", "value": "Organiczna · Konwencjonalna" },
      { "label": "Pochodzenie", "value": "Japonia · Wschodnie Chiny" },
      { "label": "Kofeina", "value": "Naturalnie niska" },
      { "label": "Dokumentacja", "value": "COA + Verification Record™ na partię" }
    ]
  },
  "ube": {
    "tagline": "Proszek z fioletowego pochrzynu — kolor i smak Filipin.",
    "description": "Naturalnie intensywny proszek z fioletowego pochrzynu do napojów, wypieków i wyrobów cukierniczych. Czysty kolor, jednorodna granulacja, skalowalne dostawy.",
    "intro": "Ube to bulwa fioletowego pochrzynu o intensywnie fioletowej barwie, która z filipińskich kuchni trafiła do menu na całym świecie. Nasz proszek ube mielony jest z dojrzałych fioletowych pochrzynów (Dioscorea alata) — dla czystego, naturalnie fioletowego koloru i subtelnej, waniliowej słodyczy, bez sztucznych barwników. Pozyskujemy go bezpośrednio na Filipinach, z trasą przez Chiny dla zwiększenia skali, i badamy oraz dokumentujemy każdą partię przed wysyłką przez nasz hub w Hongkongu.",
    "applications": [
      "Latte i napoje RTD",
      "Wypieki i wyroby drożdżowe",
      "Lody i gelato",
      "Wyroby cukiernicze i nadzienia",
      "Serniki i desery",
      "Naleśniki i gofry"
    ],
    "specs": [
      { "label": "Wygląd", "value": "Drobny fioletowy proszek" },
      { "label": "Źródło", "value": "Fioletowy pochrzyn (Dioscorea alata)" },
      { "label": "Pochodzenie", "value": "Filipiny · Chiny" },
      { "label": "Kofeina", "value": "Bez kofeiny" },
      { "label": "Opakowanie", "value": "Saszetka 1 kg → 25 kg / pełny kontener" },
      { "label": "Dokumentacja", "value": "COA + Verification Record™ na partię" }
    ]
  },
  "lions-mane": {
    "tagline": "Grzyb funkcjonalny do receptur nutraceutycznych.",
    "description": "Soplówka jeżowata z owocnika dla marek suplementów i żywności funkcjonalnej. Badana pod kątem substancji aktywnych i zanieczyszczeń, dokumentowana partiami.",
    "intro": "Soplówka jeżowata (Hericium erinaceus) to grzyb funkcjonalny, o który marki nutraceutyczne pytają z nazwy. Dostarczamy proszek z owocnika — a nie grzybnię na zbożu — dzięki czemu formulatorzy startują od czystego, udokumentowanego materiału, badanego pod kątem substancji aktywnych i zanieczyszczeń. Pozyskiwana w Chinach, badana partia po partii i przeprowadzana przez nasz hub w Hongkongu, w klasie organicznej i konwencjonalnej.",
    "applications": [
      "Kapsułki i tabletki",
      "Kawa funkcjonalna i latte",
      "Mieszanki nootropowe",
      "Proszki i saszetki",
      "Żelki",
      "Żywność funkcjonalna"
    ],
    "specs": [
      { "label": "Wygląd", "value": "Proszek od kremowobiałego do brązowawego" },
      { "label": "Źródło", "value": "Owocnik (Hericium erinaceus)" },
      { "label": "Pochodzenie", "value": "Chiny" },
      { "label": "Klasa", "value": "Organiczna · Konwencjonalna" },
      { "label": "Ekstrakt", "value": "Proszek lub proporcje ekstraktu na życzenie" },
      { "label": "Dokumentacja", "value": "COA + Verification Record™ na partię" }
    ]
  },
  "hibiscus": {
    "tagline": "Rubinowy, kwaskowy kwiat do herbat i napojów.",
    "description": "Głęboko czerwony hibiskus do naparów, RTD i mieszanek. Pozyskiwany hurtowo, badany i dokumentowany.",
    "intro": "Hibiskus (Hibiscus sabdariffa) wnosi głęboki, rubinowy kolor i żywą, żurawinową kwaskowość, która sprawdza się zarówno w napojach, jak i w wypiekach. Pozyskujemy dojrzewające w słońcu kielichy — głównie z Egiptu, z trasą przez wschodnie Chiny dla wolumenu — i mielemy je na jednorodny proszek, badany i dokumentowany partia po partii przed przeprowadzeniem przez Hongkong.",
    "applications": [
      "Herbaty i napary",
      "Napoje RTD i funkcjonalne",
      "Naturalny czerwony barwnik",
      "Wypieki i wyroby cukiernicze",
      "Syropy i cordiale",
      "Jogurty i desery"
    ],
    "specs": [
      { "label": "Wygląd", "value": "Głęboko czerwony proszek" },
      { "label": "Źródło", "value": "Kielich Hibiscus sabdariffa" },
      { "label": "Pochodzenie", "value": "Egipt · Wschodnie Chiny" },
      { "label": "Kofeina", "value": "Bez kofeiny" },
      { "label": "Opakowanie", "value": "Saszetka 1 kg → 25 kg / pełny kontener" },
      { "label": "Dokumentacja", "value": "COA + Verification Record™ na partię" }
    ]
  },
  "jasmine-tea-powder": {
    "tagline": "Zielona herbata aromatyzowana jaśminem, drobno mielona.",
    "description": "Proszek z zielonej herbaty przekładanej prawdziwymi kwiatami jaśminu — kwiatowy aromat, łagodne wykończenie. Do latte, RTD, wypieków i mieszanek. Pozyskiwany hurtowo, badany i dokumentowany partia po partii.",
    "intro": "Proszek herbaty jaśminowej to zielona herbata przekładana prawdziwymi kwiatami jaśminu, a następnie drobno mielona — dla kwiatowego aromatu i czystego, łagodnego wykończenia. Pozyskujemy go we wschodnich Chinach i w Fujianie — klasycznym regionie jaśminu w Chinach — i badamy oraz dokumentujemy każdą partię przed wysyłką przez nasz hub w Hongkongu.",
    "applications": [
      "Latte i bary herbaciane",
      "Napoje RTD i butelkowane",
      "Wypieki i cukiernictwo",
      "Lody i desery",
      "Koktajle i mocktaile",
      "Private label"
    ],
    "specs": [
      { "label": "Wygląd", "value": "Drobny zielony proszek" },
      { "label": "Źródło", "value": "Zielona herbata aromatyzowana jaśminem" },
      { "label": "Klasa", "value": "Organiczna · Konwencjonalna" },
      { "label": "Pochodzenie", "value": "Wschodnie Chiny · Fujian" },
      { "label": "Opakowanie", "value": "Saszetka 1 kg → 25 kg / pełny kontener" },
      { "label": "Dokumentacja", "value": "COA + Verification Record™ na partię" }
    ]
  },
  "oolong-tea-powder": {
    "tagline": "Herbata półfermentowana, prażona i drobno mielona.",
    "description": "Oolong z całych liści, drobno mielony — tostowy, kwiatowy i złożony. Półfermentowany w sercu klasycznego regionu oolongu w Chinach. Do latte specialty, RTD i zastosowań deserowych.",
    "intro": "Oolong to herbata półfermentowana — pomiędzy zieloną a czarną — o tostowej, kwiatowej złożoności. Mielemy oolong z całych liści z klasycznego regionu oolongu w Chinach na drobny proszek do latte specialty, RTD i wyrobów deserowych, badany i dokumentowany partia po partii przez nasz hub w Hongkongu.",
    "applications": [
      "Latte specialty",
      "Napoje RTD i butelkowane",
      "Wypieki i cukiernictwo",
      "Lody i desery",
      "Koktajle i mocktaile",
      "Private label"
    ],
    "specs": [
      { "label": "Wygląd", "value": "Bursztynowy proszek" },
      { "label": "Źródło", "value": "Herbata z całych liści, półfermentowana" },
      { "label": "Klasa", "value": "Organiczna · Konwencjonalna" },
      { "label": "Pochodzenie", "value": "Wschodnie Chiny · Fujian" },
      { "label": "Opakowanie", "value": "Saszetka 1 kg → 25 kg / pełny kontener" },
      { "label": "Dokumentacja", "value": "COA + Verification Record™ na partię" }
    ]
  },
  "earl-grey-tea-powder": {
    "tagline": "Czarna herbata z naturalną bergamotką, drobno mielona.",
    "description": "Proszek z czarnej herbaty z naturalnym olejkiem bergamotowym — mocny, cytrusowo wyrazisty i aromatyczny. Wyróżniająca się baza do latte, wypieków i innowacji napojowych. Pozyskiwany i dokumentowany partia po partii.",
    "intro": "Earl Grey to czarna herbata z naturalną bergamotką — mocna, cytrusowo wyrazista i natychmiast rozpoznawalna. Mielemy ją na drobny proszek, który niesie jej aromat w latte, wypiekach i innowacjach napojowych, pozyskiwany we wschodnich Chinach i w Fujianie oraz dokumentowany partia po partii przez nasz hub w Hongkongu.",
    "applications": [
      "Latte i bary herbaciane",
      "Napoje RTD i butelkowane",
      "Wypieki i cukiernictwo",
      "Lody i desery",
      "Koktajle i mocktaile",
      "Private label"
    ],
    "specs": [
      { "label": "Wygląd", "value": "Drobny ciemny proszek" },
      { "label": "Źródło", "value": "Czarna herbata z naturalną bergamotką" },
      { "label": "Klasa", "value": "Konwencjonalna" },
      { "label": "Pochodzenie", "value": "Wschodnie Chiny · Fujian" },
      { "label": "Opakowanie", "value": "Saszetka 1 kg → 25 kg / pełny kontener" },
      { "label": "Dokumentacja", "value": "COA + Verification Record™ na partię" }
    ]
  }
};

export const CATEGORY_PL: Record<string, string> = {
  "Matcha": "Matcha",
  "Hojicha": "Hojicha",
  "Specialty Teas": "Herbaty specjalne",
  "Superfoods": "Superfoods"
};
export const ORIGIN_NAME_PL: Record<string, string> = {
  "east-china-cn": "Wschodnie Chiny",
  "south-china-cn": "Południowe Chiny",
  "philippines-ph": "Filipiny",
  "egypt-eg": "Egipt"
};
export const COUNTRY_PL: Record<string, string> = {
  "Japan": "Japonia",
  "China": "Chiny",
  "Philippines": "Filipiny",
  "Egypt": "Egipt"
};
export const FORM_PL: Record<string, string> = {
  "Organic": "Organiczny",
  "Conventional": "Konwencjonalny"
};
export const ORIGIN_BLURB_PL: Record<string, string> = {
  "uji-jp": "W pobliżu Kioto — historyczna kolebka herbaty w Japonii; cieniowane ogrody, głębokie umami.",
  "shizuoka-jp": "Największy region herbaciany Japonii; niezawodna jakość w skali.",
  "kagoshima-jp": "Wulkaniczne południe Japonii; bogata w minerały gleba, wczesne zbiory.",
  "nara-jp": "Herbaciany teren Yamato koło Nary; łagodny, zrównoważony liść.",
  "gifu-jp": "Górskie ogrody w środkowej Japonii; czysty, świeży charakter.",
  "ibaraki-jp": "Wschodnia Japonia; mocny, pełny liść.",
  "kyoto-jp": "Prefektura Kioto — kulturowy dom japońskiej herbaty.",
  "east-china-cn": "Herbaciany pas wschodnich Chin; szerokie, jednorodne dostawy w wolumenie.",
  "south-china-cn": "Południowe Chiny; ciepły klimat, aromatyczny liść.",
  "fujian-cn": "Fujian — klasyczny region Chin dla zielonej herbaty, oolongu i jaśminu.",
  "china-cn": "Pozyskiwane w całych Chinach; badane i dokumentowane partia po partii.",
  "philippines-ph": "Wyżyny Filipin; żywe, naturalnie słodkie zbiory.",
  "egypt-eg": "Dojrzewające w słońcu wzdłuż Nilu; głęboki kolor, wyrazista kwaskowość."
};
export const ORIGIN_INTRO_PL: Record<string, string> = {
  "china-cn": "Poza herbatą Chiny są jednym z największych i najsprawniejszych światowych producentów upraw funkcjonalnych i specjalistycznych — od soplówki jeżowatej i innych grzybów po ube i proszki botaniczne. Dla tych linii współpracujemy ze zweryfikowanymi chińskimi dostawami, badamy każdą partię pod kątem pozostałości pestycydów, metali ciężkich i zanieczyszczeń mikrobiologicznych, i dokumentujemy ją za pomocą Verification Record™, zanim opuści nasz hub w Hongkongu. To trasa, po którą sięgamy, gdy program potrzebuje prawdziwej skali bez utraty identyfikowalności.",
  "egypt-eg": "Nawadniane wodami Nilu pola Egiptu to klasyczna kolebka hibiskusa (Hibiscus sabdariffa). Długie godziny słońca nadają kielichom głęboki, rubinowy kolor i wyrazistą, czystą kwaskowość. Pozyskujemy dojrzewający w słońcu egipski hibiskus, mielemy go na jednorodny proszek i badamy każdą partię pod kątem zanieczyszczeń, zanim udokumentujemy ją i przeprowadzimy przez Hongkong — tak, aby kolor i kwaskowość, które próbkujesz, były kolorem i kwaskowością, które otrzymujesz w wolumenie."
};

export const PL: LocaleContent = {
  products: PRODUCTS_PL,
  category: CATEGORY_PL,
  originName: ORIGIN_NAME_PL,
  country: COUNTRY_PL,
  form: FORM_PL,
  blurb: ORIGIN_BLURB_PL,
  intro: ORIGIN_INTRO_PL,
};
