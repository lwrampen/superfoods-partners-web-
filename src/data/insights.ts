// Insights (blog) content. Pillar-and-cluster model for SEO + GEO.
//
// Each post is fully self-contained and localized inline: text fields are a
// Record keyed by locale, resolved with pick() (falls back to English). This
// keeps a whole post in one place and easy to verify. If the hub grows large,
// split localized bodies into insights.<locale>.ts on the content.i18n pattern.

import { routing } from "@/i18n/routing";

export type Loc = Record<string, string>;
export type Section = { heading: Loc; body: Loc[] };
export type Fact = { label: Loc; value: Loc };
export type Faq = { q: Loc; a: Loc };

export type InsightPost = {
  slug: string;
  date: string; // ISO, publication date
  updated?: string; // ISO
  author: string; // person name — not translated
  readingMins: number;
  hero?: string; // /photos/... path
  heroAlt: Loc;
  category: Loc;
  authorRole: Loc;
  title: Loc;
  metaTitle: Loc;
  metaDescription: Loc;
  dek: Loc; // deck / standfirst under the title
  lede: Loc; // opening answer paragraph (extractable for AI)
  sections: Section[];
  keyFacts?: Fact[];
  faqs?: Faq[];
  relatedProducts?: string[]; // product slugs
};

export function pick(l: Loc | undefined, locale: string): string {
  if (!l) return "";
  return l[locale] ?? l[routing.defaultLocale] ?? Object.values(l)[0] ?? "";
}

export function getPost(slug: string): InsightPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

// Small helper to cut per-field boilerplate for the 6 locales.
const L = (en: string, de: string, es: string, fr: string, pl: string, zh: string): Loc => ({
  en,
  de,
  es,
  fr,
  pl,
  "zh-Hant": zh,
});

export const POSTS: InsightPost[] = [
  {
    slug: "matcha-wholesale-buyers-guide",
    date: "2026-07-29",
    author: "Wanjin",
    readingMins: 7,
    hero: "/photos/hero-shade-nets.jpg",
    heroAlt: L(
      "Shade nets over a matcha tea garden before harvest",
      "Schattennetze über einem Matcha-Teegarten vor der Ernte",
      "Mallas de sombra sobre un jardín de té matcha antes de la cosecha",
      "Filets d'ombrage au-dessus d'un jardin de thé matcha avant la récolte",
      "Siatki cieniujące nad ogrodem herbaty matcha przed zbiorem",
      "採收前覆蓋於抹茶茶園上的遮蔭網",
    ),
    category: L("Buyer's guide", "Einkaufsratgeber", "Guía de compra", "Guide d'achat", "Przewodnik kupującego", "採購指南"),
    authorRole: L("Supply chain & sourcing", "Lieferkette & Beschaffung", "Cadena de suministro y abastecimiento", "Chaîne d'approvisionnement & sourcing", "Łańcuch dostaw i sourcing", "供應鏈與採購"),
    title: L(
      "The B2B buyer's guide to matcha wholesale",
      "Der B2B-Einkaufsratgeber für Matcha-Großhandel",
      "La guía B2B para comprar matcha al por mayor",
      "Le guide B2B de l'achat de matcha en gros",
      "Przewodnik B2B po hurtowym zakupie matchy",
      "抹茶批發 B2B 採購指南",
    ),
    metaTitle: L(
      "Matcha Wholesale: The B2B Buyer's Guide (Grades, MOQ, Certs)",
      "Matcha-Großhandel: Der B2B-Einkaufsratgeber (Grade, MOQ, Zertifikate)",
      "Matcha al por Mayor: Guía B2B (Grados, MOQ, Certificaciones)",
      "Matcha en Gros : le Guide B2B (Grades, MOQ, Certifications)",
      "Matcha Hurtowo: Przewodnik B2B (Gatunki, MOQ, Certyfikaty)",
      "抹茶批發：B2B 採購指南（等級、起訂量、認證）",
    ),
    metaDescription: L(
      "How to buy matcha wholesale: grades explained, price and MOQ, organic certifications, incoterms and how to vet a supplier. A practical B2B guide from Superfoods Partners.",
      "Matcha im Großhandel kaufen: Grade erklärt, Preis und MOQ, Bio-Zertifikate, Incoterms und wie man einen Lieferanten prüft. Ein praktischer B2B-Leitfaden von Superfoods Partners.",
      "Cómo comprar matcha al por mayor: grados, precio y MOQ, certificaciones ecológicas, incoterms y cómo evaluar a un proveedor. Una guía B2B práctica de Superfoods Partners.",
      "Comment acheter du matcha en gros : grades, prix et MOQ, certifications bio, incoterms et comment évaluer un fournisseur. Un guide B2B pratique de Superfoods Partners.",
      "Jak kupować matchę hurtowo: gatunki, cena i MOQ, certyfikaty ekologiczne, incoterms i jak ocenić dostawcę. Praktyczny przewodnik B2B od Superfoods Partners.",
      "如何批發採購抹茶：等級解析、價格與起訂量、有機認證、貿易條件，以及如何評估供應商。Superfoods Partners 的實用 B2B 指南。",
    ),
    dek: L(
      "Everything a manufacturer, café group or private-label brand needs to source bulk matcha with confidence — grades, pricing, documentation and the questions that separate a real supplier from a broker.",
      "Alles, was ein Hersteller, eine Café-Gruppe oder eine Private-Label-Marke braucht, um Bulk-Matcha sicher zu beschaffen — Grade, Preise, Dokumentation und die Fragen, die einen echten Lieferanten von einem Zwischenhändler unterscheiden.",
      "Todo lo que un fabricante, grupo de cafeterías o marca de marca blanca necesita para abastecerse de matcha a granel con confianza: grados, precios, documentación y las preguntas que separan a un proveedor real de un intermediario.",
      "Tout ce qu'un fabricant, un groupe de cafés ou une marque de distributeur doit savoir pour s'approvisionner en matcha en vrac en confiance — grades, prix, documentation et les questions qui distinguent un vrai fournisseur d'un courtier.",
      "Wszystko, czego producent, sieć kawiarni lub marka private-label potrzebuje, by pewnie kupować matchę luzem — gatunki, ceny, dokumentacja i pytania, które odróżniają prawdziwego dostawcę od pośrednika.",
      "製造商、連鎖咖啡館或自有品牌採購大宗抹茶所需的一切——等級、價格、文件，以及區分真正供應商與中間商的關鍵問題。",
    ),
    lede: L(
      "Buying matcha wholesale means sourcing bulk green-tea powder — typically from 25 kg up to a full container — direct from an origin or a sourcing partner, with a Certificate of Analysis per batch. Price and suitability come down to grade (ceremonial, premium or culinary), origin, and how the leaf was grown and milled. This guide walks through each decision.",
      "Matcha im Großhandel zu kaufen bedeutet, Bulk-Grüntee-Pulver zu beziehen — typischerweise ab 25 kg bis zum ganzen Container — direkt vom Ursprung oder von einem Beschaffungspartner, mit einem Analysenzertifikat pro Charge. Preis und Eignung hängen vom Grad (Ceremonial, Premium oder Culinary), vom Ursprung und davon ab, wie das Blatt angebaut und gemahlen wurde. Dieser Leitfaden führt durch jede Entscheidung.",
      "Comprar matcha al por mayor significa abastecerse de té verde en polvo a granel — normalmente desde 25 kg hasta un contenedor completo — directamente de un origen o un socio de abastecimiento, con un Certificado de Análisis por lote. El precio y la idoneidad dependen del grado (ceremonial, premium o culinario), el origen y cómo se cultivó y molió la hoja. Esta guía recorre cada decisión.",
      "Acheter du matcha en gros, c'est s'approvisionner en poudre de thé vert en vrac — généralement de 25 kg jusqu'à un conteneur complet — directement à l'origine ou auprès d'un partenaire de sourcing, avec un certificat d'analyse par lot. Le prix et l'adéquation dépendent du grade (ceremonial, premium ou culinary), de l'origine et de la façon dont la feuille a été cultivée et broyée. Ce guide passe en revue chaque décision.",
      "Kupowanie matchy hurtowo oznacza zaopatrywanie się w sproszek z zielonej herbaty luzem — zwykle od 25 kg do pełnego kontenera — bezpośrednio od źródła lub partnera sourcingowego, z Certyfikatem Analizy dla każdej partii. Cena i przydatność zależą od gatunku (ceremonial, premium lub culinary), pochodzenia oraz sposobu uprawy i mielenia liścia. Ten przewodnik omawia każdą decyzję.",
      "批發採購抹茶，意味著以大宗方式取得綠茶粉——通常從 25 公斤到整櫃——直接來自產地或採購夥伴，並附每批的分析證明（COA）。價格與適用性取決於等級（ceremonial、premium 或 culinary）、產地，以及茶葉的栽培與研磨方式。本指南逐一說明每個決策。",
    ),
    sections: [
      {
        heading: L("Grades: ceremonial, premium, culinary", "Grade: Ceremonial, Premium, Culinary", "Grados: ceremonial, premium, culinario", "Grades : ceremonial, premium, culinary", "Gatunki: ceremonial, premium, culinary", "等級：ceremonial、premium、culinary"),
        body: [
          L(
            "Grade is the first decision and the biggest driver of price. Ceremonial matcha is whisked straight with water — vivid green, naturally sweet, fine on the palate — and suits premium lattes, matcha bars and straight service. Premium is the everyday workhorse: balanced colour and flavour for cafés, RTD drinks and daily menu use at scale. Culinary is built to hold its colour and body against other ingredients — for bakery, ice cream, desserts and supplements.",
            "Der Grad ist die erste Entscheidung und der größte Preistreiber. Ceremonial-Matcha wird pur mit Wasser aufgeschlagen — leuchtend grün, natürlich süß, fein am Gaumen — und eignet sich für Premium-Lattes, Matcha-Bars und puren Ausschank. Premium ist das Allround-Arbeitstier: ausgewogene Farbe und Geschmack für Cafés, RTD-Getränke und den täglichen Menüeinsatz im großen Maßstab. Culinary behält Farbe und Körper auch neben anderen Zutaten — für Backwaren, Eis, Desserts und Nahrungsergänzung.",
            "El grado es la primera decisión y el mayor factor de precio. El matcha ceremonial se bate directamente con agua — verde vivo, naturalmente dulce, fino en el paladar — y encaja con lattes premium, barras de matcha y servicio directo. El premium es el caballo de batalla diario: color y sabor equilibrados para cafeterías, bebidas RTD y uso en carta a escala. El culinario está diseñado para mantener color y cuerpo junto a otros ingredientes — para bollería, helados, postres y suplementos.",
            "Le grade est la première décision et le principal facteur de prix. Le matcha ceremonial se fouette directement à l'eau — vert vif, naturellement doux, fin en bouche — et convient aux lattes premium, aux bars à matcha et au service pur. Le premium est le pilier du quotidien : couleur et goût équilibrés pour cafés, boissons RTD et usage à la carte à grande échelle. Le culinary est conçu pour tenir sa couleur et son corps face aux autres ingrédients — pour boulangerie, glaces, desserts et compléments.",
            "Gatunek to pierwsza decyzja i największy czynnik ceny. Matcha ceremonial ubijana jest prosto z wodą — żywa zieleń, naturalnie słodka, delikatna w smaku — i pasuje do latte premium, barów matcha i podawania na czysto. Premium to codzienny koń roboczy: zrównoważony kolor i smak do kawiarni, napojów RTD i użycia w menu na dużą skalę. Culinary stworzono, by utrzymać kolor i ciało przy innych składnikach — do wypieków, lodów, deserów i suplementów.",
            "等級是第一個決策，也是價格的最大變數。Ceremonial 抹茶直接以水點茶——鮮綠、自然回甘、口感細緻——適合高級拿鐵、抹茶吧與純飲。Premium 是日常主力：色澤與風味均衡，適合咖啡館、即飲飲品與規模化每日菜單。Culinary 即使搭配其他食材也能維持色澤與厚度——適合烘焙、冰淇淋、甜點與保健品。",
          ),
        ],
      },
      {
        heading: L("What drives quality — and price", "Was Qualität — und Preis — bestimmt", "Qué determina la calidad — y el precio", "Ce qui détermine la qualité — et le prix", "Co decyduje o jakości — i cenie", "決定品質與價格的因素"),
        body: [
          L(
            "Matcha is shade-grown: the plants are covered for weeks before harvest, which raises chlorophyll and amino acids and builds the deep colour and umami. First-harvest leaf, careful de-veining and slow stone-milling all lift quality and cost. Origin matters too — Japanese gardens (Uji, Kagoshima, Nishio) command a premium; other origins offer value at volume. A good supplier is transparent about all of this, per batch.",
            "Matcha wird schattengezogen: Die Pflanzen werden vor der Ernte wochenlang beschattet, was Chlorophyll und Aminosäuren erhöht und die tiefe Farbe und das Umami aufbaut. Erstpflückung, sorgfältiges Entstielen und langsames Steinmahlen steigern Qualität und Kosten. Auch der Ursprung zählt — japanische Gärten (Uji, Kagoshima, Nishio) haben einen Aufpreis; andere Ursprünge bieten Wert bei Volumen. Ein guter Lieferant ist darüber transparent, pro Charge.",
            "El matcha se cultiva a la sombra: las plantas se cubren durante semanas antes de la cosecha, lo que eleva la clorofila y los aminoácidos y construye el color profundo y el umami. La hoja de primera cosecha, el desvenado cuidadoso y la molienda lenta en piedra elevan la calidad y el coste. El origen también importa — los jardines japoneses (Uji, Kagoshima, Nishio) tienen una prima; otros orígenes ofrecen valor a volumen. Un buen proveedor es transparente sobre todo esto, por lote.",
            "Le matcha est cultivé à l'ombre : les plants sont couverts pendant des semaines avant la récolte, ce qui augmente la chlorophylle et les acides aminés et construit la couleur profonde et l'umami. La feuille de première récolte, l'épépinage soigneux et le broyage lent à la meule de pierre élèvent la qualité et le coût. L'origine compte aussi — les jardins japonais (Uji, Kagoshima, Nishio) se paient une prime ; d'autres origines offrent de la valeur au volume. Un bon fournisseur est transparent sur tout cela, par lot.",
            "Matcha jest uprawiana w cieniu: rośliny są okrywane przez tygodnie przed zbiorem, co podnosi chlorofil i aminokwasy oraz buduje głęboki kolor i umami. Liść z pierwszego zbioru, staranne odżyłowanie i powolne mielenie w kamieniu podnoszą jakość i koszt. Pochodzenie też ma znaczenie — japońskie ogrody (Uji, Kagoshima, Nishio) mają wyższą cenę; inne źródła oferują wartość przy dużych ilościach. Dobry dostawca jest w tym przejrzysty, dla każdej partii.",
            "抹茶採遮蔭栽培：植株在採收前覆蓋數週，提升葉綠素與胺基酸，形成深綠色澤與甘味。首採茶、細心去梗與緩慢石磨都能提升品質與成本。產地同樣重要——日本茶園（宇治、鹿兒島、西尾）價格較高；其他產地則在量產上具性價比。好的供應商會逐批對此保持透明。",
          ),
        ],
      },
      {
        heading: L("MOQ, lead times and incoterms", "MOQ, Lieferzeiten und Incoterms", "MOQ, plazos e incoterms", "MOQ, délais et incoterms", "MOQ, terminy i incoterms", "起訂量、交期與貿易條件"),
        body: [
          L(
            "Most B2B matcha ships from a 25 kg minimum up to full-container volumes, with samples available first so you can approve the material before a bulk order. Typical lead times run 2–4 weeks depending on grade, packaging and route. Incoterms are usually FOB, CIF or DDP — agree these up front, along with packaging (1 kg foil up to 25 kg cartons) and shelf-life handling.",
            "Der meiste B2B-Matcha wird ab 25 kg Mindestmenge bis zu ganzen Containern versandt, wobei zuerst Muster verfügbar sind, damit Sie das Material vor einer Großbestellung freigeben können. Typische Lieferzeiten liegen bei 2–4 Wochen, je nach Grad, Verpackung und Route. Incoterms sind meist FOB, CIF oder DDP — vereinbaren Sie diese im Voraus, ebenso Verpackung (1-kg-Folie bis 25-kg-Kartons) und Haltbarkeit.",
            "La mayoría del matcha B2B se envía desde un mínimo de 25 kg hasta volúmenes de contenedor completo, con muestras disponibles primero para que apruebe el material antes de un pedido a granel. Los plazos típicos van de 2 a 4 semanas según el grado, el envasado y la ruta. Los incoterms suelen ser FOB, CIF o DDP — acuérdelos por adelantado, junto con el envasado (papel de aluminio de 1 kg hasta cajas de 25 kg) y la gestión de la caducidad.",
            "La plupart du matcha B2B est expédié à partir d'un minimum de 25 kg jusqu'à des volumes de conteneur complet, avec des échantillons disponibles au préalable afin d'approuver la matière avant une commande en vrac. Les délais typiques sont de 2 à 4 semaines selon le grade, l'emballage et la route. Les incoterms sont généralement FOB, CIF ou DDP — convenez-en à l'avance, ainsi que l'emballage (film de 1 kg jusqu'aux cartons de 25 kg) et la gestion de la DLUO.",
            "Większość matchy B2B wysyłana jest od minimum 25 kg do pełnych kontenerów, z próbkami dostępnymi najpierw, aby zatwierdzić materiał przed zamówieniem hurtowym. Typowe terminy to 2–4 tygodnie w zależności od gatunku, opakowania i trasy. Incoterms to zwykle FOB, CIF lub DDP — ustal je z góry, wraz z opakowaniem (folia 1 kg do kartonów 25 kg) i obsługą terminu przydatności.",
            "多數 B2B 抹茶自 25 公斤起訂，至整櫃出貨，並可先提供樣品，讓您在下大宗訂單前確認材料。交期通常為 2–4 週，視等級、包裝與航線而定。貿易條件多為 FOB、CIF 或 DDP——請事先議定，並確認包裝（1 公斤鋁袋至 25 公斤紙箱）與保存期限處理。",
          ),
        ],
      },
      {
        heading: L("Certifications and documentation", "Zertifikate und Dokumentation", "Certificaciones y documentación", "Certifications et documentation", "Certyfikaty i dokumentacja", "認證與文件"),
        body: [
          L(
            "For food-grade matcha, expect organic certification where relevant — JAS (Japan), EU Organic and USDA Organic — plus food-safety systems such as HACCP and FSSC 22000. Every batch should ship with a Certificate of Analysis covering pesticide residue, heavy metals, microbiology and radiation. We add a Verification Record per batch so buyers and their auditors have the paperwork before they ask.",
            "Bei lebensmitteltauglichem Matcha ist eine Bio-Zertifizierung zu erwarten, wo relevant — JAS (Japan), EU-Bio und USDA-Bio — plus Lebensmittelsicherheitssysteme wie HACCP und FSSC 22000. Jede Charge sollte mit einem Analysenzertifikat versandt werden, das Pestizidrückstände, Schwermetalle, Mikrobiologie und Radioaktivität abdeckt. Wir fügen pro Charge einen Verification Record hinzu, damit Käufer und ihre Auditoren die Unterlagen haben, bevor sie fragen.",
            "Para matcha de grado alimentario, espere certificación ecológica cuando corresponda — JAS (Japón), EU Orgánico y USDA Orgánico — más sistemas de seguridad alimentaria como HACCP y FSSC 22000. Cada lote debe enviarse con un Certificado de Análisis que cubra residuos de pesticidas, metales pesados, microbiología y radiación. Añadimos un Verification Record por lote para que los compradores y sus auditores tengan la documentación antes de pedirla.",
            "Pour un matcha de qualité alimentaire, attendez-vous à une certification bio le cas échéant — JAS (Japon), bio UE et USDA bio — ainsi qu'à des systèmes de sécurité alimentaire comme HACCP et FSSC 22000. Chaque lot doit être expédié avec un certificat d'analyse couvrant les résidus de pesticides, les métaux lourds, la microbiologie et la radioactivité. Nous ajoutons un Verification Record par lot afin que les acheteurs et leurs auditeurs aient les documents avant même de les demander.",
            "W przypadku matchy klasy spożywczej oczekuj certyfikacji ekologicznej tam, gdzie to istotne — JAS (Japonia), EU Organic i USDA Organic — oraz systemów bezpieczeństwa żywności, takich jak HACCP i FSSC 22000. Każda partia powinna być wysyłana z Certyfikatem Analizy obejmującym pozostałości pestycydów, metale ciężkie, mikrobiologię i promieniowanie. Dodajemy Verification Record dla każdej partii, aby kupujący i ich audytorzy mieli dokumenty, zanim o nie poproszą.",
            "食品級抹茶通常應具備相關有機認證——JAS（日本）、歐盟有機與 USDA 有機——以及 HACCP、FSSC 22000 等食品安全系統。每批都應附分析證明（COA），涵蓋農藥殘留、重金屬、微生物與輻射。我們為每批加上 Verification Record，讓買家與其稽核員在提出要求前就已備妥文件。",
          ),
        ],
      },
      {
        heading: L("How to vet a matcha supplier", "So prüfen Sie einen Matcha-Lieferanten", "Cómo evaluar a un proveedor de matcha", "Comment évaluer un fournisseur de matcha", "Jak ocenić dostawcę matchy", "如何評估抹茶供應商"),
        body: [
          L(
            "Ask five questions. Can they name the origin and show it? Do they lab-test every batch and share the COA? Can they hold a consistent spec across repeat orders? What are the real MOQ, lead time and incoterms? And is there a person you can reach in your timezone? A supplier who answers all five with documentation — not adjectives — is one you can build on.",
            "Stellen Sie fünf Fragen. Können sie den Ursprung nennen und zeigen? Prüfen sie jede Charge im Labor und teilen das COA? Können sie über Folgeaufträge hinweg eine konstante Spezifikation halten? Wie lauten die echten MOQ, Lieferzeit und Incoterms? Und gibt es eine Person, die Sie in Ihrer Zeitzone erreichen? Ein Lieferant, der alle fünf mit Dokumentation beantwortet — nicht mit Adjektiven — ist einer, auf dem Sie aufbauen können.",
            "Haga cinco preguntas. ¿Pueden nombrar el origen y mostrarlo? ¿Analizan cada lote en laboratorio y comparten el COA? ¿Pueden mantener una especificación constante en pedidos repetidos? ¿Cuáles son el MOQ, el plazo y los incoterms reales? ¿Y hay una persona a la que pueda contactar en su zona horaria? Un proveedor que responde a las cinco con documentación — no con adjetivos — es uno sobre el que puede construir.",
            "Posez cinq questions. Peuvent-ils nommer l'origine et la montrer ? Analysent-ils chaque lot en laboratoire et partagent-ils le COA ? Peuvent-ils tenir une spécification constante sur des commandes répétées ? Quels sont les vrais MOQ, délai et incoterms ? Et y a-t-il une personne joignable dans votre fuseau horaire ? Un fournisseur qui répond aux cinq avec des documents — pas des adjectifs — est un fournisseur sur lequel bâtir.",
            "Zadaj pięć pytań. Czy potrafią wskazać pochodzenie i je pokazać? Czy badają laboratoryjnie każdą partię i udostępniają COA? Czy potrafią utrzymać stałą specyfikację przy kolejnych zamówieniach? Jakie są rzeczywiste MOQ, termin i incoterms? I czy jest osoba, z którą skontaktujesz się w swojej strefie czasowej? Dostawca, który odpowiada na wszystkie pięć dokumentami — nie przymiotnikami — to ten, na którym można budować.",
            "問五個問題。他們能否指出並展示產地？是否逐批做實驗室檢驗並提供 COA？能否在重複訂單間維持一致規格？真實的起訂量、交期與貿易條件為何？以及，是否有能在你時區聯繫到的人？能以文件——而非形容詞——回答這五點的供應商，才值得長期合作。",
          ),
        ],
      },
    ],
    keyFacts: [
      { label: L("MOQ", "MOQ", "MOQ", "MOQ", "MOQ", "起訂量"), value: L("25 kg → full container", "25 kg → ganzer Container", "25 kg → contenedor completo", "25 kg → conteneur complet", "25 kg → pełny kontener", "25 公斤 → 整櫃") },
      { label: L("Lead time", "Lieferzeit", "Plazo", "Délai", "Termin", "交期"), value: L("2–4 weeks via Hong Kong", "2–4 Wochen über Hongkong", "2–4 semanas vía Hong Kong", "2–4 semaines via Hong Kong", "2–4 tygodnie przez Hongkong", "2–4 週，經香港") },
      { label: L("Incoterms", "Incoterms", "Incoterms", "Incoterms", "Incoterms", "貿易條件"), value: L("FOB / CIF / DDP", "FOB / CIF / DDP", "FOB / CIF / DDP", "FOB / CIF / DDP", "FOB / CIF / DDP", "FOB / CIF / DDP") },
      { label: L("Grades", "Grade", "Grados", "Grades", "Gatunki", "等級"), value: L("Ceremonial · Premium · Culinary", "Ceremonial · Premium · Culinary", "Ceremonial · Premium · Culinary", "Ceremonial · Premium · Culinary", "Ceremonial · Premium · Culinary", "Ceremonial · Premium · Culinary") },
      { label: L("Certifications", "Zertifikate", "Certificaciones", "Certifications", "Certyfikaty", "認證"), value: L("JAS, EU & USDA Organic; HACCP; FSSC 22000", "JAS, EU- & USDA-Bio; HACCP; FSSC 22000", "JAS, EU y USDA Orgánico; HACCP; FSSC 22000", "JAS, bio UE & USDA ; HACCP ; FSSC 22000", "JAS, EU i USDA Organic; HACCP; FSSC 22000", "JAS、歐盟與 USDA 有機；HACCP；FSSC 22000") },
    ],
    faqs: [
      {
        q: L("What is the minimum order for wholesale matcha?", "Was ist die Mindestbestellmenge für Großhandels-Matcha?", "¿Cuál es el pedido mínimo de matcha al por mayor?", "Quelle est la commande minimale pour le matcha en gros ?", "Jakie jest minimalne zamówienie matchy hurtowej?", "抹茶批發的最低訂購量是多少？"),
        a: L("From 25 kg, up to full-container volumes. Sample quantities can be arranged first so you can confirm the material before a bulk order.", "Ab 25 kg, bis zu ganzen Containern. Mustermengen können zuerst arrangiert werden, damit Sie das Material vor einer Großbestellung bestätigen können.", "Desde 25 kg, hasta volúmenes de contenedor completo. Se pueden organizar cantidades de muestra primero para confirmar el material antes de un pedido a granel.", "À partir de 25 kg, jusqu'à des volumes de conteneur complet. Des quantités d'échantillon peuvent être organisées au préalable pour confirmer la matière avant une commande en vrac.", "Od 25 kg, do pełnych kontenerów. Można najpierw zorganizować ilości próbne, aby potwierdzić materiał przed zamówieniem hurtowym.", "從 25 公斤起，至整櫃。可先安排樣品數量，讓您在下大宗訂單前確認材料。"),
      },
      {
        q: L("Which matcha grade should I buy?", "Welchen Matcha-Grad sollte ich kaufen?", "¿Qué grado de matcha debo comprar?", "Quel grade de matcha dois-je acheter ?", "Który gatunek matchy wybrać?", "我該購買哪個抹茶等級？"),
        a: L("Ceremonial for premium lattes and straight service; premium for everyday café and RTD use at scale; culinary for bakery, desserts and supplements where it sits alongside other ingredients.", "Ceremonial für Premium-Lattes und puren Ausschank; Premium für den täglichen Café- und RTD-Einsatz im großen Maßstab; Culinary für Backwaren, Desserts und Nahrungsergänzung, wo es neben anderen Zutaten steht.", "Ceremonial para lattes premium y servicio directo; premium para uso diario en cafetería y RTD a escala; culinario para bollería, postres y suplementos donde acompaña a otros ingredientes.", "Ceremonial pour les lattes premium et le service pur ; premium pour l'usage quotidien en café et RTD à grande échelle ; culinary pour boulangerie, desserts et compléments où il côtoie d'autres ingrédients.", "Ceremonial do latte premium i podawania na czysto; premium do codziennego użytku w kawiarni i RTD na dużą skalę; culinary do wypieków, deserów i suplementów, gdzie towarzyszy innym składnikom.", "Ceremonial 適合高級拿鐵與純飲；premium 適合規模化的日常咖啡館與即飲；culinary 適合與其他食材並用的烘焙、甜點與保健品。"),
      },
      {
        q: L("Is your matcha organic-certified?", "Ist Ihr Matcha bio-zertifiziert?", "¿Su matcha tiene certificación ecológica?", "Votre matcha est-il certifié bio ?", "Czy wasza matcha ma certyfikat ekologiczny?", "你們的抹茶有有機認證嗎？"),
        a: L("Organic matcha is available with JAS, EU Organic and USDA Organic certification, alongside HACCP and FSSC 22000 food-safety systems. Every batch ships with a Certificate of Analysis and a Verification Record.", "Bio-Matcha ist mit JAS-, EU-Bio- und USDA-Bio-Zertifizierung erhältlich, zusammen mit HACCP- und FSSC-22000-Lebensmittelsicherheitssystemen. Jede Charge wird mit einem Analysenzertifikat und einem Verification Record versandt.", "Hay matcha ecológico disponible con certificación JAS, EU Orgánico y USDA Orgánico, junto con sistemas de seguridad alimentaria HACCP y FSSC 22000. Cada lote se envía con un Certificado de Análisis y un Verification Record.", "Le matcha bio est disponible avec les certifications JAS, bio UE et USDA bio, ainsi que les systèmes de sécurité alimentaire HACCP et FSSC 22000. Chaque lot est expédié avec un certificat d'analyse et un Verification Record.", "Matcha ekologiczna jest dostępna z certyfikatami JAS, EU Organic i USDA Organic, wraz z systemami bezpieczeństwa żywności HACCP i FSSC 22000. Każda partia jest wysyłana z Certyfikatem Analizy i Verification Record.", "有機抹茶可提供 JAS、歐盟有機與 USDA 有機認證，並搭配 HACCP 與 FSSC 22000 食品安全系統。每批皆附分析證明（COA）與 Verification Record。"),
      },
      {
        q: L("Can I get a sample before ordering?", "Kann ich vor der Bestellung ein Muster erhalten?", "¿Puedo obtener una muestra antes de pedir?", "Puis-je obtenir un échantillon avant de commander ?", "Czy mogę otrzymać próbkę przed zamówieniem?", "下單前可以先索取樣品嗎？"),
        a: L("Yes. We sample and verify first — you taste, test and approve the material before anything scales to a bulk order.", "Ja. Wir bemustern und verifizieren zuerst — Sie verkosten, testen und geben das Material frei, bevor etwas zu einer Großbestellung skaliert.", "Sí. Muestreamos y verificamos primero — usted cata, analiza y aprueba el material antes de que nada escale a un pedido a granel.", "Oui. Nous échantillonnons et vérifions d'abord — vous goûtez, testez et approuvez la matière avant toute montée en commande en vrac.", "Tak. Najpierw próbkujemy i weryfikujemy — degustujesz, testujesz i zatwierdzasz materiał, zanim cokolwiek przejdzie do zamówienia hurtowego.", "可以。我們先取樣並驗證——由您品嚐、檢測並核准材料，任何大宗訂單之前皆如此。"),
      },
    ],
    relatedProducts: ["matcha", "hojicha"],
  },
];
