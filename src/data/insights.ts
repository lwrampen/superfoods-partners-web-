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
// Data tables (e.g. for reports). Cells are language-neutral strings.
export type DataTable = { title: string; columns: string[]; rows: string[][]; note?: string };

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
  tables?: DataTable[]; // optional data tables (reports)
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

// English-first helper: content that ships in English now and localizes later.
// pick() falls back to English on every other locale.
const E = (en: string): Loc => ({ en });

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

  {
    slug: "ceremonial-vs-premium-vs-culinary-matcha",
    date: "2026-07-29",
    author: "Lucinda",
    readingMins: 4,
    hero: "/products/matcha.jpg",
    heroAlt: L(
      "Fine green matcha powder, three grades side by side",
      "Feines grünes Matcha-Pulver, drei Grade nebeneinander",
      "Matcha en polvo verde fino, tres grados uno al lado del otro",
      "Poudre de matcha verte fine, trois grades côte à côte",
      "Drobny zielony proszek matcha, trzy gatunki obok siebie",
      "細緻的綠色抹茶粉，三種等級並列",
    ),
    category: L("Guide", "Ratgeber", "Guía", "Guide", "Przewodnik", "指南"),
    authorRole: L("Quality control", "Qualitätskontrolle", "Control de calidad", "Contrôle qualité", "Kontrola jakości", "品質管制"),
    title: L(
      "Ceremonial vs premium vs culinary matcha: which grade to buy",
      "Ceremonial, Premium oder Culinary: welchen Matcha-Grad kaufen?",
      "Matcha ceremonial, premium o culinario: qué grado comprar",
      "Matcha ceremonial, premium ou culinary : quel grade acheter",
      "Matcha ceremonial, premium czy culinary: który gatunek kupić",
      "Ceremonial、premium 或 culinary 抹茶：該買哪個等級",
    ),
    metaTitle: L(
      "Ceremonial vs Premium vs Culinary Matcha — Which Grade to Buy",
      "Ceremonial vs. Premium vs. Culinary Matcha — welcher Grad?",
      "Matcha Ceremonial vs Premium vs Culinario — Qué Grado Comprar",
      "Matcha Ceremonial vs Premium vs Culinary — Quel Grade Acheter",
      "Matcha Ceremonial vs Premium vs Culinary — Który Gatunek",
      "Ceremonial、Premium 與 Culinary 抹茶——該買哪個等級",
    ),
    metaDescription: L(
      "The difference between ceremonial, premium and culinary matcha — colour, taste, use and price — and how to pick the right grade for lattes, RTD, bakery or supplements.",
      "Der Unterschied zwischen Ceremonial-, Premium- und Culinary-Matcha — Farbe, Geschmack, Verwendung und Preis — und wie Sie den richtigen Grad für Lattes, RTD, Backwaren oder Nahrungsergänzung wählen.",
      "La diferencia entre matcha ceremonial, premium y culinario — color, sabor, uso y precio — y cómo elegir el grado adecuado para lattes, RTD, bollería o suplementos.",
      "La différence entre matcha ceremonial, premium et culinary — couleur, goût, usage et prix — et comment choisir le bon grade pour lattes, RTD, boulangerie ou compléments.",
      "Różnica między matchą ceremonial, premium i culinary — kolor, smak, zastosowanie i cena — oraz jak wybrać właściwy gatunek do latte, RTD, wypieków lub suplementów.",
      "Ceremonial、premium 與 culinary 抹茶的差異——色澤、風味、用途與價格——以及如何為拿鐵、即飲、烘焙或保健品選擇正確等級。",
    ),
    dek: L(
      "The three grades explained in plain terms, with the applications each is built for — so you buy the right matcha, not the most expensive.",
      "Die drei Grade einfach erklärt, mit den Anwendungen, für die jeder gemacht ist — damit Sie den richtigen Matcha kaufen, nicht den teuersten.",
      "Los tres grados explicados con claridad, con las aplicaciones para las que cada uno está pensado — para que compre el matcha adecuado, no el más caro.",
      "Les trois grades expliqués simplement, avec les usages pour lesquels chacun est conçu — pour acheter le bon matcha, pas le plus cher.",
      "Trzy gatunki wyjaśnione prosto, z zastosowaniami, do których każdy jest stworzony — abyś kupił właściwą matchę, a nie najdroższą.",
      "以淺白方式說明三種等級，以及各自最適合的用途——讓你買對抹茶，而非最貴的抹茶。",
    ),
    lede: L(
      "Ceremonial, premium and culinary aren't so much quality rankings as fit-for-purpose tiers. Ceremonial is for drinking matcha straight; premium is the everyday café and RTD grade; culinary is built to hold up when blended with other ingredients. Choose by application, not by prestige.",
      "Ceremonial, Premium und Culinary sind weniger Qualitätsränge als vielmehr Eignungsstufen. Ceremonial ist zum puren Trinken; Premium ist der Alltagsgrad für Café und RTD; Culinary ist dafür gemacht, sich beim Mischen mit anderen Zutaten zu behaupten. Wählen Sie nach Anwendung, nicht nach Prestige.",
      "Ceremonial, premium y culinario no son tanto rangos de calidad como niveles según el uso. El ceremonial es para beber matcha solo; el premium es el grado diario de cafetería y RTD; el culinario está hecho para resistir al mezclarse con otros ingredientes. Elija según la aplicación, no según el prestigio.",
      "Ceremonial, premium et culinary sont moins des rangs de qualité que des niveaux adaptés à l'usage. Le ceremonial est pour boire le matcha pur ; le premium est le grade quotidien café et RTD ; le culinary est conçu pour tenir mélangé à d'autres ingrédients. Choisissez selon l'usage, pas selon le prestige.",
      "Ceremonial, premium i culinary to nie tyle rangi jakości, co poziomy dopasowane do zastosowania. Ceremonial jest do picia matchy na czysto; premium to codzienny gatunek do kawiarni i RTD; culinary stworzono, by wytrzymać zmieszany z innymi składnikami. Wybieraj według zastosowania, nie prestiżu.",
      "Ceremonial、premium 與 culinary 與其說是品質排名，不如說是依用途分級。Ceremonial 適合純飲；premium 是咖啡館與即飲的日常等級；culinary 則能在與其他食材混合時維持表現。依用途而非名氣來選擇。",
    ),
    sections: [
      {
        heading: L("What defines each grade", "Was jeden Grad ausmacht", "Qué define a cada grado", "Ce qui définit chaque grade", "Co definiuje każdy gatunek", "各等級的定義"),
        body: [
          L(
            "Ceremonial comes from the youngest, first-harvest leaves, stone-milled to a fine, bright-green powder that is naturally sweet and low in bitterness. Premium uses slightly later leaf for a balanced, versatile cup. Culinary is a robust grade with a stronger, more astringent profile and deeper colour stability that survives heat, milk and sugar.",
            "Ceremonial stammt aus den jüngsten Blättern der ersten Ernte, steingemahlen zu einem feinen, leuchtend grünen Pulver, das natürlich süß und wenig bitter ist. Premium verwendet etwas späteres Blatt für eine ausgewogene, vielseitige Tasse. Culinary ist ein robuster Grad mit kräftigerem, herberem Profil und stabilerer Farbe, die Hitze, Milch und Zucker übersteht.",
            "El ceremonial proviene de las hojas más jóvenes de la primera cosecha, molidas en piedra hasta un polvo fino y verde brillante, naturalmente dulce y poco amargo. El premium usa hoja algo más tardía para una taza equilibrada y versátil. El culinario es un grado robusto, de perfil más fuerte y astringente y mayor estabilidad de color, que resiste el calor, la leche y el azúcar.",
            "Le ceremonial provient des feuilles les plus jeunes de la première récolte, broyées à la meule en une poudre fine et vert vif, naturellement douce et peu amère. Le premium utilise une feuille un peu plus tardive pour une tasse équilibrée et polyvalente. Le culinary est un grade robuste, au profil plus fort et astringent et à la couleur plus stable, qui résiste à la chaleur, au lait et au sucre.",
            "Ceremonial pochodzi z najmłodszych liści pierwszego zbioru, mielonych w kamieniu na drobny, jasnozielony proszek, naturalnie słodki i mało gorzki. Premium wykorzystuje nieco późniejszy liść dla zrównoważonej, wszechstronnej filiżanki. Culinary to solidny gatunek o mocniejszym, bardziej cierpkim profilu i większej stabilności koloru, który znosi ciepło, mleko i cukier.",
            "Ceremonial 取自首採最嫩的葉片，石磨成細緻、鮮綠的粉末，自然回甘、苦味低。Premium 使用略晚的茶葉，帶來均衡、百搭的一杯。Culinary 是強韌的等級，風味更濃、澀感更明顯，色澤更穩定，能承受熱度、牛奶與糖。",
          ),
        ],
      },
      {
        heading: L("Match the grade to the application", "Den Grad an die Anwendung anpassen", "Adapte el grado a la aplicación", "Adapter le grade à l'usage", "Dopasuj gatunek do zastosowania", "依用途搭配等級"),
        body: [
          L(
            "Serve ceremonial where matcha is the star — whisked lattes, matcha bars, straight service. Reach for premium as the workhorse across a busy café menu and RTD bottling, where cost and consistency both matter. Use culinary in bakery, ice cream, desserts and supplements, where it competes with other flavours and needs to keep its colour.",
            "Servieren Sie Ceremonial dort, wo Matcha der Star ist — aufgeschlagene Lattes, Matcha-Bars, purer Ausschank. Greifen Sie zu Premium als Arbeitstier über eine belebte Café-Karte und RTD-Abfüllung, wo Kosten und Konstanz zählen. Setzen Sie Culinary in Backwaren, Eis, Desserts und Nahrungsergänzung ein, wo es mit anderen Aromen konkurriert und seine Farbe halten muss.",
            "Sirva ceremonial donde el matcha sea el protagonista — lattes batidos, barras de matcha, servicio directo. Recurra al premium como caballo de batalla en una carta de cafetería con volumen y en el embotellado RTD, donde importan el coste y la consistencia. Use culinario en bollería, helados, postres y suplementos, donde compite con otros sabores y debe conservar el color.",
            "Servez le ceremonial là où le matcha est la vedette — lattes fouettés, bars à matcha, service pur. Optez pour le premium comme pilier d'une carte de café chargée et de l'embouteillage RTD, où le coût et la régularité comptent. Utilisez le culinary en boulangerie, glaces, desserts et compléments, où il rivalise avec d'autres saveurs et doit garder sa couleur.",
            "Podawaj ceremonial tam, gdzie matcha jest gwiazdą — ubijane latte, bary matcha, podawanie na czysto. Sięgnij po premium jako konia roboczego w ruchliwym menu kawiarni i przy butelkowaniu RTD, gdzie liczą się koszt i spójność. Używaj culinary w wypiekach, lodach, deserach i suplementach, gdzie konkuruje z innymi smakami i musi zachować kolor.",
            "在抹茶為主角之處使用 ceremonial——手打拿鐵、抹茶吧、純飲。在繁忙的咖啡館菜單與即飲裝瓶中，以 premium 作為主力，兼顧成本與一致性。在烘焙、冰淇淋、甜點與保健品中使用 culinary，因為它需與其他風味並存並維持色澤。",
          ),
        ],
      },
      {
        heading: L("Don't overpay — or underspec", "Nicht zu viel zahlen — und nicht unterspezifizieren", "No pague de más — ni especifique de menos", "Ne payez pas trop — ni ne sous-spécifiez", "Nie przepłacaj — ani nie zaniżaj specyfikacji", "別多花錢，也別規格不足"),
        body: [
          L(
            "Paying ceremonial prices for a muffin wastes money; using culinary in a signature latte disappoints customers. The right move is to spec each product line to its grade, then hold that spec across repeat orders. A supplier who can guarantee a consistent grade batch to batch matters more than the label on the tin.",
            "Ceremonial-Preise für einen Muffin zu zahlen ist Geldverschwendung; Culinary in einem Signature-Latte enttäuscht Gäste. Richtig ist, jede Produktlinie auf ihren Grad zu spezifizieren und diese Spezifikation über Folgeaufträge zu halten. Ein Lieferant, der einen konstanten Grad von Charge zu Charge garantiert, zählt mehr als das Etikett auf der Dose.",
            "Pagar precios de ceremonial por un muffin es malgastar dinero; usar culinario en un latte insignia decepciona a los clientes. Lo correcto es especificar cada línea de producto según su grado y mantener esa especificación en pedidos repetidos. Un proveedor que garantice un grado constante de lote en lote importa más que la etiqueta de la lata.",
            "Payer un prix ceremonial pour un muffin est du gaspillage ; utiliser du culinary dans un latte signature déçoit les clients. La bonne approche est de spécifier chaque gamme selon son grade, puis de tenir cette spécification sur les commandes répétées. Un fournisseur capable de garantir un grade constant d'un lot à l'autre compte plus que l'étiquette sur la boîte.",
            "Płacenie cen ceremonial za muffinkę to marnotrawstwo; użycie culinary w flagowym latte rozczarowuje klientów. Właściwym ruchem jest wyspecyfikowanie każdej linii produktów według jej gatunku i utrzymanie tej specyfikacji przy kolejnych zamówieniach. Dostawca, który gwarantuje stały gatunek od partii do partii, znaczy więcej niż etykieta na puszce.",
            "為一個馬芬付 ceremonial 的價格是浪費；在招牌拿鐵裡用 culinary 會讓顧客失望。正確做法是為每條產品線指定對應等級，並在重複訂單間維持該規格。能保證逐批等級一致的供應商，遠比罐上的標籤更重要。",
          ),
        ],
      },
    ],
    keyFacts: [
      { label: L("Ceremonial", "Ceremonial", "Ceremonial", "Ceremonial", "Ceremonial", "Ceremonial"), value: L("Lattes, matcha bars, straight service", "Lattes, Matcha-Bars, purer Ausschank", "Lattes, barras de matcha, servicio directo", "Lattes, bars à matcha, service pur", "Latte, bary matcha, podawanie na czysto", "拿鐵、抹茶吧、純飲") },
      { label: L("Premium", "Premium", "Premium", "Premium", "Premium", "Premium"), value: L("Everyday café menu, RTD drinks", "Alltags-Café-Karte, RTD-Getränke", "Carta diaria de cafetería, bebidas RTD", "Carte de café quotidienne, boissons RTD", "Codzienne menu kawiarni, napoje RTD", "日常咖啡館菜單、即飲飲品") },
      { label: L("Culinary", "Culinary", "Culinario", "Culinary", "Culinary", "Culinary"), value: L("Bakery, ice cream, desserts, supplements", "Backwaren, Eis, Desserts, Nahrungsergänzung", "Bollería, helados, postres, suplementos", "Boulangerie, glaces, desserts, compléments", "Wypieki, lody, desery, suplementy", "烘焙、冰淇淋、甜點、保健品") },
    ],
    faqs: [
      {
        q: L("Is ceremonial matcha always better?", "Ist Ceremonial-Matcha immer besser?", "¿El matcha ceremonial es siempre mejor?", "Le matcha ceremonial est-il toujours meilleur ?", "Czy matcha ceremonial jest zawsze lepsza?", "Ceremonial 抹茶一定比較好嗎？"),
        a: L(
          "No — it is optimised for drinking straight. In a baked good or a sweetened RTD, a culinary or premium grade often performs better and costs less.",
          "Nein — er ist für den puren Genuss optimiert. In Backwaren oder einem gesüßten RTD schneidet ein Culinary- oder Premium-Grad oft besser ab und kostet weniger.",
          "No — está optimizado para beberse solo. En un producto horneado o un RTD azucarado, un grado culinario o premium suele rendir mejor y costar menos.",
          "Non — il est optimisé pour être bu pur. Dans une pâtisserie ou un RTD sucré, un grade culinary ou premium est souvent plus performant et moins cher.",
          "Nie — jest zoptymalizowany do picia na czysto. W wypieku lub słodzonym RTD gatunek culinary lub premium często sprawdza się lepiej i kosztuje mniej.",
          "不一定——它是為純飲最佳化的。在烘焙品或加糖的即飲飲品中，culinary 或 premium 等級往往表現更好、成本更低。",
        ),
      },
      {
        q: L("Can I use one grade across my whole range?", "Kann ich einen Grad für mein ganzes Sortiment verwenden?", "¿Puedo usar un solo grado en toda mi gama?", "Puis-je utiliser un seul grade sur toute ma gamme ?", "Czy mogę użyć jednego gatunku w całej ofercie?", "我能在整個產品線只用一個等級嗎？"),
        a: L(
          "You can, but you will compromise somewhere. Most buyers spec premium as a default and add ceremonial for hero drinks and culinary for food applications.",
          "Können Sie, aber Sie machen irgendwo Abstriche. Die meisten Käufer spezifizieren Premium als Standard und ergänzen Ceremonial für Signature-Drinks und Culinary für Lebensmittelanwendungen.",
          "Puede, pero comprometerá algo. La mayoría de los compradores especifican premium por defecto y añaden ceremonial para bebidas insignia y culinario para aplicaciones alimentarias.",
          "Oui, mais vous ferez un compromis quelque part. La plupart des acheteurs spécifient le premium par défaut et ajoutent le ceremonial pour les boissons phares et le culinary pour les applications alimentaires.",
          "Możesz, ale gdzieś pójdziesz na kompromis. Większość kupujących ustawia premium jako domyślny i dodaje ceremonial do flagowych napojów oraz culinary do zastosowań spożywczych.",
          "可以，但總會在某處妥協。多數買家以 premium 為預設，並為招牌飲品加入 ceremonial、為食品應用加入 culinary。",
        ),
      },
    ],
    relatedProducts: ["matcha"],
  },

  {
    slug: "how-to-judge-matcha-quality",
    date: "2026-07-29",
    author: "Lucinda",
    readingMins: 4,
    hero: "/photos/grading.jpg",
    heroAlt: L(
      "Grading and quality control of matcha powder",
      "Einstufung und Qualitätskontrolle von Matcha-Pulver",
      "Clasificación y control de calidad del matcha en polvo",
      "Classement et contrôle qualité de la poudre de matcha",
      "Klasyfikacja i kontrola jakości proszku matcha",
      "抹茶粉的分級與品質管制",
    ),
    category: L("Guide", "Ratgeber", "Guía", "Guide", "Przewodnik", "指南"),
    authorRole: L("Quality control", "Qualitätskontrolle", "Control de calidad", "Contrôle qualité", "Kontrola jakości", "品質管制"),
    title: L(
      "How to judge matcha quality: colour, texture and aroma",
      "Matcha-Qualität beurteilen: Farbe, Textur und Aroma",
      "Cómo evaluar la calidad del matcha: color, textura y aroma",
      "Comment juger la qualité du matcha : couleur, texture et arôme",
      "Jak ocenić jakość matchy: kolor, tekstura i aromat",
      "如何判斷抹茶品質：色澤、質地與香氣",
    ),
    metaTitle: L(
      "How to Judge Matcha Quality — Colour, Texture, Aroma & Lab Tests",
      "Matcha-Qualität beurteilen — Farbe, Textur, Aroma & Labortests",
      "Cómo Evaluar la Calidad del Matcha — Color, Textura, Aroma y Laboratorio",
      "Juger la Qualité du Matcha — Couleur, Texture, Arôme & Analyses",
      "Jak Ocenić Jakość Matchy — Kolor, Tekstura, Aromat i Badania",
      "如何判斷抹茶品質——色澤、質地、香氣與實驗室檢測",
    ),
    metaDescription: L(
      "The visual and sensory signals of good matcha — vivid colour, fine texture, fresh aroma — and why a lab report matters as much as what you can see.",
      "Die optischen und sensorischen Signale von gutem Matcha — leuchtende Farbe, feine Textur, frisches Aroma — und warum ein Laborbericht so wichtig ist wie das Sichtbare.",
      "Las señales visuales y sensoriales de un buen matcha — color vivo, textura fina, aroma fresco — y por qué un informe de laboratorio importa tanto como lo que se ve.",
      "Les signaux visuels et sensoriels d'un bon matcha — couleur vive, texture fine, arôme frais — et pourquoi un rapport de laboratoire compte autant que ce qui se voit.",
      "Wizualne i sensoryczne sygnały dobrej matchy — żywy kolor, drobna tekstura, świeży aromat — i dlaczego raport laboratoryjny liczy się tak samo jak to, co widać.",
      "優質抹茶的視覺與感官信號——鮮綠色澤、細緻質地、清新香氣——以及為何實驗室報告與肉眼所見同樣重要。",
    ),
    dek: L(
      "What to look for before you commit to a bulk order — and why the eye and nose only get you halfway.",
      "Worauf Sie vor einer Großbestellung achten sollten — und warum Auge und Nase nur die halbe Miete sind.",
      "Qué buscar antes de comprometerse con un pedido a granel — y por qué la vista y el olfato solo llegan a la mitad.",
      "Ce qu'il faut regarder avant de s'engager sur une commande en vrac — et pourquoi l'œil et le nez ne font que la moitié du chemin.",
      "Na co zwrócić uwagę przed zamówieniem hurtowym — i dlaczego oko i nos to dopiero połowa drogi.",
      "在下大宗訂單前該注意什麼——以及為何眼睛與鼻子只能帶你走一半。",
    ),
    lede: L(
      "Good matcha reads first in colour: a vivid, almost electric green signals shade-grown, first-harvest leaf. Dull, yellowish or khaki tones point to older leaf, sun exposure or oxidation. But colour, texture and aroma only tell you so much — a Certificate of Analysis confirms the rest.",
      "Guter Matcha zeigt sich zuerst in der Farbe: ein leuchtendes, fast elektrisches Grün signalisiert schattengezogenes Blatt der ersten Ernte. Stumpfe, gelbliche oder khakifarbene Töne deuten auf älteres Blatt, Sonneneinstrahlung oder Oxidation. Doch Farbe, Textur und Aroma sagen nur begrenzt aus — ein Analysenzertifikat bestätigt den Rest.",
      "Un buen matcha se lee primero en el color: un verde vivo, casi eléctrico, indica hoja de primera cosecha cultivada a la sombra. Los tonos apagados, amarillentos o caqui apuntan a hoja más vieja, exposición al sol u oxidación. Pero el color, la textura y el aroma solo dicen hasta cierto punto — un Certificado de Análisis confirma el resto.",
      "Un bon matcha se lit d'abord à la couleur : un vert vif, presque électrique, signale une feuille de première récolte cultivée à l'ombre. Des tons ternes, jaunâtres ou kaki indiquent une feuille plus vieille, une exposition au soleil ou une oxydation. Mais la couleur, la texture et l'arôme n'en disent qu'une partie — un certificat d'analyse confirme le reste.",
      "Dobra matcha najpierw czyta się w kolorze: żywa, niemal elektryczna zieleń sygnalizuje liść z pierwszego zbioru uprawiany w cieniu. Matowe, żółtawe lub khaki odcienie wskazują na starszy liść, ekspozycję na słońce lub utlenianie. Ale kolor, tekstura i aromat mówią tylko tyle — Certyfikat Analizy potwierdza resztę.",
      "優質抹茶首先反映在色澤：鮮綠、近乎electric的綠色代表遮蔭栽培的首採茶葉。暗沉、偏黃或卡其色調則暗示較老的茶葉、日照或氧化。但色澤、質地與香氣只能說明一部分——分析證明（COA）才能確認其餘。",
    ),
    sections: [
      {
        heading: L("Colour", "Farbe", "Color", "Couleur", "Kolor", "色澤"),
        body: [
          L(
            "Vivid, saturated green is the single clearest quality signal. It comes from weeks of shading before harvest, which raises chlorophyll. Yellow-green or brownish hues usually mean lower-grade or older leaf, or oxidation from poor storage. Compare samples side by side in daylight.",
            "Leuchtendes, gesättigtes Grün ist das klarste Qualitätssignal. Es entsteht durch wochenlange Beschattung vor der Ernte, die den Chlorophyllgehalt erhöht. Gelbgrüne oder bräunliche Töne bedeuten meist geringeren Grad oder älteres Blatt oder Oxidation durch schlechte Lagerung. Vergleichen Sie Muster nebeneinander bei Tageslicht.",
            "El verde vivo y saturado es la señal de calidad más clara. Proviene de semanas de sombreado antes de la cosecha, que eleva la clorofila. Los tonos verde amarillento o parduzcos suelen indicar grado inferior u hoja más vieja, u oxidación por mal almacenamiento. Compare muestras una al lado de otra a la luz del día.",
            "Le vert vif et saturé est le signal de qualité le plus clair. Il vient de semaines d'ombrage avant la récolte, qui augmente la chlorophylle. Les teintes vert-jaune ou brunâtres indiquent généralement un grade inférieur ou une feuille plus vieille, ou une oxydation due à un mauvais stockage. Comparez les échantillons côte à côte à la lumière du jour.",
            "Żywa, nasycona zieleń to najwyraźniejszy sygnał jakości. Pochodzi z tygodni cieniowania przed zbiorem, co podnosi chlorofil. Żółtozielone lub brązowawe odcienie zwykle oznaczają niższy gatunek lub starszy liść, albo utlenianie przez złe przechowywanie. Porównuj próbki obok siebie w świetle dziennym.",
            "鮮豔、飽和的綠色是最明確的品質信號，來自採收前數週的遮蔭，提升葉綠素。黃綠或偏褐的色調通常代表較低等級或較老的茶葉，或因保存不良而氧化。請在日光下並排比較樣品。",
          ),
        ],
      },
      {
        heading: L("Texture and aroma", "Textur und Aroma", "Textura y aroma", "Texture et arôme", "Tekstura i aromat", "質地與香氣"),
        body: [
          L(
            "Stone-milled matcha is fine and silky, almost like talc; gritty or coarse powder points to faster, cheaper milling. Fresh matcha smells sweet, grassy and marine; a flat, hay-like or dusty smell suggests age or heat damage. Both are quick to check on a sample.",
            "Steingemahlener Matcha ist fein und seidig, fast wie Talkum; körniges oder grobes Pulver deutet auf schnelleres, billigeres Mahlen. Frischer Matcha riecht süß, grasig und maritim; ein flacher, heuartiger oder staubiger Geruch deutet auf Alter oder Hitzeschaden. Beides lässt sich an einer Probe schnell prüfen.",
            "El matcha molido en piedra es fino y sedoso, casi como talco; un polvo áspero o grueso apunta a una molienda más rápida y barata. El matcha fresco huele dulce, herbáceo y marino; un olor plano, a heno o polvoriento sugiere edad o daño por calor. Ambos se comprueban rápido en una muestra.",
            "Le matcha broyé à la pierre est fin et soyeux, presque comme du talc ; une poudre granuleuse ou grossière indique un broyage plus rapide et moins cher. Le matcha frais sent le sucré, l'herbe et le marin ; une odeur plate, de foin ou de poussière suggère l'âge ou un dommage thermique. Les deux se vérifient vite sur un échantillon.",
            "Matcha mielona w kamieniu jest drobna i jedwabista, niemal jak talk; ziarnisty lub gruby proszek wskazuje na szybsze, tańsze mielenie. Świeża matcha pachnie słodko, trawiasto i morsko; płaski, sianowy lub kurzowy zapach sugeruje wiek lub uszkodzenie ciepłem. Oba szybko sprawdzisz na próbce.",
            "石磨抹茶細緻滑順，近乎滑石粉；粗糙或顆粒感的粉末代表較快、較廉價的研磨。新鮮抹茶帶有甘甜、草香與海潮氣息；平淡、乾草味或粉塵味則暗示陳舊或受熱損壞。兩者都能在樣品上快速檢查。",
          ),
        ],
      },
      {
        heading: L("Why the lab still matters", "Warum das Labor trotzdem zählt", "Por qué el laboratorio sigue importando", "Pourquoi le laboratoire compte quand même", "Dlaczego laboratorium wciąż się liczy", "為何實驗室仍然重要"),
        body: [
          L(
            "Colour and aroma can be cosmetic. Only a lab panel confirms what you cannot see — pesticide residue, heavy metals, microbiology and radiation. Insist on a Certificate of Analysis per batch, and a supplier who can hold the same spec order after order. That is the difference between a good sample and a reliable supply.",
            "Farbe und Aroma können kosmetisch sein. Nur ein Laborpanel bestätigt, was Sie nicht sehen — Pestizidrückstände, Schwermetalle, Mikrobiologie und Radioaktivität. Bestehen Sie auf einem Analysenzertifikat pro Charge und einem Lieferanten, der die gleiche Spezifikation Bestellung für Bestellung hält. Das ist der Unterschied zwischen einer guten Probe und einer verlässlichen Versorgung.",
            "El color y el aroma pueden ser cosméticos. Solo un panel de laboratorio confirma lo que no se ve — residuos de pesticidas, metales pesados, microbiología y radiación. Exija un Certificado de Análisis por lote y un proveedor que mantenga la misma especificación pedido tras pedido. Esa es la diferencia entre una buena muestra y un suministro fiable.",
            "La couleur et l'arôme peuvent être cosmétiques. Seul un panel de laboratoire confirme ce que vous ne voyez pas — résidus de pesticides, métaux lourds, microbiologie et radioactivité. Exigez un certificat d'analyse par lot et un fournisseur capable de tenir la même spécification commande après commande. C'est la différence entre un bon échantillon et un approvisionnement fiable.",
            "Kolor i aromat mogą być kosmetyczne. Tylko panel laboratoryjny potwierdza to, czego nie widać — pozostałości pestycydów, metale ciężkie, mikrobiologię i promieniowanie. Wymagaj Certyfikatu Analizy dla każdej partii i dostawcy, który utrzyma tę samą specyfikację zamówienie po zamówieniu. To różnica między dobrą próbką a niezawodnymi dostawami.",
            "色澤與香氣可能只是表象。唯有實驗室檢測能確認你看不見的——農藥殘留、重金屬、微生物與輻射。堅持每批附分析證明（COA），並找能逐單維持相同規格的供應商。這正是「好樣品」與「可靠供應」的差別。",
          ),
        ],
      },
    ],
    faqs: [
      {
        q: L("Does brighter green always mean better matcha?", "Bedeutet helleres Grün immer besseren Matcha?", "¿Un verde más brillante siempre significa mejor matcha?", "Un vert plus vif signifie-t-il toujours un meilleur matcha ?", "Czy jaśniejsza zieleń zawsze oznacza lepszą matchę?", "更鮮綠一定代表更好的抹茶嗎？"),
        a: L(
          "Usually, for drinking grades — it signals shade-growing and fresh, young leaf. But confirm with a taste test and a lab report; colour alone can be manipulated.",
          "Meist bei Trinkgraden — es signalisiert Schattenanbau und frisches, junges Blatt. Bestätigen Sie es aber mit Verkostung und Laborbericht; Farbe allein lässt sich manipulieren.",
          "Normalmente, en grados para beber — indica cultivo a la sombra y hoja joven y fresca. Pero confírmelo con una cata y un informe de laboratorio; el color por sí solo puede manipularse.",
          "Généralement, pour les grades à boire — cela signale la culture à l'ombre et une feuille jeune et fraîche. Mais confirmez par une dégustation et un rapport de laboratoire ; la couleur seule peut être manipulée.",
          "Zwykle w gatunkach do picia — sygnalizuje uprawę w cieniu i świeży, młody liść. Ale potwierdź degustacją i raportem laboratoryjnym; sam kolor można zmanipulować.",
          "在飲用等級通常是——它代表遮蔭栽培與新鮮嫩葉。但請以品飲與實驗室報告確認；單靠色澤可能被操縱。",
        ),
      },
      {
        q: L("How should bulk matcha be stored?", "Wie sollte Bulk-Matcha gelagert werden?", "¿Cómo debe almacenarse el matcha a granel?", "Comment stocker le matcha en vrac ?", "Jak przechowywać matchę luzem?", "大宗抹茶該如何保存？"),
        a: L(
          "Cool, dark and airtight. Matcha is sensitive to light, heat, oxygen and moisture, which fade colour and flavour. Keep it sealed until use and follow the shelf-life on the COA.",
          "Kühl, dunkel und luftdicht. Matcha ist empfindlich gegenüber Licht, Hitze, Sauerstoff und Feuchtigkeit, die Farbe und Geschmack verblassen lassen. Halten Sie ihn bis zur Verwendung verschlossen und beachten Sie die Haltbarkeit auf dem COA.",
          "Fresco, oscuro y hermético. El matcha es sensible a la luz, el calor, el oxígeno y la humedad, que apagan el color y el sabor. Manténgalo sellado hasta su uso y respete la caducidad del COA.",
          "Au frais, à l'abri de la lumière et hermétiquement. Le matcha est sensible à la lumière, la chaleur, l'oxygène et l'humidité, qui ternissent couleur et goût. Gardez-le scellé jusqu'à l'usage et suivez la DLUO du COA.",
          "Chłodno, ciemno i hermetycznie. Matcha jest wrażliwa na światło, ciepło, tlen i wilgoć, które gaszą kolor i smak. Trzymaj ją zamkniętą do użycia i przestrzegaj terminu przydatności z COA.",
          "陰涼、避光、密封。抹茶對光、熱、氧氣與濕氣敏感，會使色澤與風味流失。使用前保持密封，並遵循 COA 上的保存期限。",
        ),
      },
    ],
    relatedProducts: ["matcha"],
  },

  {
    slug: "choosing-a-matcha-origin",
    date: "2026-07-29",
    author: "Wanjin",
    readingMins: 5,
    hero: "/photos/field-sky.jpg",
    heroAlt: L(
      "Tea terraces under a working sky",
      "Teeterrassen unter einem arbeitenden Himmel",
      "Terrazas de té bajo un cielo de trabajo",
      "Terrasses de thé sous un ciel de travail",
      "Tarasy herbaciane pod roboczym niebem",
      "勞作天空下的茶園梯田",
    ),
    category: L("Origin", "Ursprung", "Origen", "Origine", "Pochodzenie", "產地"),
    authorRole: L("Supply chain & sourcing", "Lieferkette & Beschaffung", "Cadena de suministro y abastecimiento", "Chaîne d'approvisionnement & sourcing", "Łańcuch dostaw i sourcing", "供應鏈與採購"),
    title: L(
      "Choosing a matcha origin: Uji, Kagoshima, Nishio and beyond",
      "Eine Matcha-Herkunft wählen: Uji, Kagoshima, Nishio und mehr",
      "Elegir un origen de matcha: Uji, Kagoshima, Nishio y más allá",
      "Choisir une origine de matcha : Uji, Kagoshima, Nishio et au-delà",
      "Wybór pochodzenia matchy: Uji, Kagoshima, Nishio i nie tylko",
      "選擇抹茶產地：宇治、鹿兒島、西尾及其他",
    ),
    metaTitle: L(
      "Choosing a Matcha Origin — Uji, Kagoshima, Nishio & Beyond",
      "Matcha-Herkunft wählen — Uji, Kagoshima, Nishio & mehr",
      "Elegir un Origen de Matcha — Uji, Kagoshima, Nishio y Más",
      "Choisir une Origine de Matcha — Uji, Kagoshima, Nishio & Plus",
      "Wybór Pochodzenia Matchy — Uji, Kagoshima, Nishio i Więcej",
      "選擇抹茶產地——宇治、鹿兒島、西尾及其他",
    ),
    metaDescription: L(
      "How origin shapes matcha flavour, colour and price — the famous Japanese gardens, what each is known for, and where other origins offer value at volume.",
      "Wie die Herkunft Geschmack, Farbe und Preis von Matcha prägt — die berühmten japanischen Gärten, wofür jeder bekannt ist, und wo andere Herkünfte Wert bei Volumen bieten.",
      "Cómo el origen moldea el sabor, el color y el precio del matcha — los famosos jardines japoneses, por qué se conoce cada uno y dónde otros orígenes ofrecen valor a volumen.",
      "Comment l'origine façonne le goût, la couleur et le prix du matcha — les célèbres jardins japonais, ce que chacun apporte, et où d'autres origines offrent de la valeur au volume.",
      "Jak pochodzenie kształtuje smak, kolor i cenę matchy — słynne japońskie ogrody, z czego każdy słynie i gdzie inne pochodzenia oferują wartość przy dużych ilościach.",
      "產地如何形塑抹茶的風味、色澤與價格——著名的日本茶園各自的特色，以及其他產地在量產上的價值。",
    ),
    dek: L(
      "Where your matcha is grown changes how it tastes and what it costs. A short guide to the origins that matter.",
      "Wo Ihr Matcha wächst, ändert Geschmack und Preis. Ein kurzer Leitfaden zu den Herkünften, die zählen.",
      "Dónde se cultiva su matcha cambia su sabor y su coste. Una breve guía de los orígenes que importan.",
      "L'endroit où pousse votre matcha change son goût et son prix. Un court guide des origines qui comptent.",
      "To, gdzie rośnie twoja matcha, zmienia jej smak i cenę. Krótki przewodnik po pochodzeniach, które mają znaczenie.",
      "抹茶的產地會改變它的風味與價格。以下是重要產地的簡短指南。",
    ),
    lede: L(
      "Origin is to matcha what appellation is to wine. Japan's historic gardens — Uji, Kagoshima and Nishio — set the benchmark for ceremonial quality, each with its own character. Other origins, including parts of China, offer dependable quality at volume. The right choice depends on your grade, budget and scale.",
      "Herkunft ist für Matcha, was die Appellation für Wein ist. Japans historische Gärten — Uji, Kagoshima und Nishio — setzen den Maßstab für Ceremonial-Qualität, jeder mit eigenem Charakter. Andere Herkünfte, darunter Teile Chinas, bieten verlässliche Qualität bei Volumen. Die richtige Wahl hängt von Grad, Budget und Maßstab ab.",
      "El origen es al matcha lo que la denominación al vino. Los jardines históricos de Japón — Uji, Kagoshima y Nishio — marcan la referencia de la calidad ceremonial, cada uno con su carácter. Otros orígenes, incluidas partes de China, ofrecen calidad fiable a volumen. La elección correcta depende de su grado, presupuesto y escala.",
      "L'origine est au matcha ce que l'appellation est au vin. Les jardins historiques du Japon — Uji, Kagoshima et Nishio — fixent la référence de la qualité ceremonial, chacun avec son caractère. D'autres origines, dont des régions de Chine, offrent une qualité fiable au volume. Le bon choix dépend de votre grade, budget et échelle.",
      "Pochodzenie jest dla matchy tym, czym apelacja dla wina. Historyczne ogrody Japonii — Uji, Kagoshima i Nishio — wyznaczają wzorzec jakości ceremonial, każdy z własnym charakterem. Inne pochodzenia, w tym części Chin, oferują niezawodną jakość przy dużych ilościach. Właściwy wybór zależy od gatunku, budżetu i skali.",
      "產地之於抹茶，猶如產區之於葡萄酒。日本的歷史茶園——宇治、鹿兒島與西尾——為 ceremonial 品質立下標竿，各具特色。其他產地，包括中國部分地區，能在量產上提供可靠品質。正確選擇取決於你的等級、預算與規模。",
    ),
    sections: [
      {
        heading: L("Why origin matters", "Warum die Herkunft zählt", "Por qué importa el origen", "Pourquoi l'origine compte", "Dlaczego pochodzenie ma znaczenie", "為何產地重要"),
        body: [
          L(
            "Climate, soil, cultivar and harvest timing all shape the leaf before it is ever milled. Cooler regions and first-harvest leaf tend to give sweeter, more vivid matcha; warmer regions and later harvests give bolder, more astringent profiles better suited to blending. Origin is also a traceability and price signal.",
            "Klima, Boden, Sorte und Erntezeitpunkt prägen das Blatt, lange bevor es gemahlen wird. Kühlere Regionen und Erstpflückung ergeben tendenziell süßeren, lebendigeren Matcha; wärmere Regionen und spätere Ernten ergeben kräftigere, herbere Profile, die sich besser zum Mischen eignen. Die Herkunft ist auch ein Rückverfolgbarkeits- und Preissignal.",
            "El clima, el suelo, el cultivar y el momento de la cosecha moldean la hoja antes de molerse. Las regiones más frías y la hoja de primera cosecha tienden a dar un matcha más dulce y vivo; las regiones más cálidas y las cosechas tardías dan perfiles más intensos y astringentes, mejores para mezclar. El origen es también una señal de trazabilidad y precio.",
            "Le climat, le sol, le cultivar et le moment de la récolte façonnent la feuille bien avant le broyage. Les régions plus fraîches et la feuille de première récolte donnent un matcha plus doux et plus vif ; les régions plus chaudes et les récoltes tardives donnent des profils plus corsés et astringents, mieux adaptés à l'assemblage. L'origine est aussi un signal de traçabilité et de prix.",
            "Klimat, gleba, odmiana i termin zbioru kształtują liść, zanim jeszcze zostanie zmielony. Chłodniejsze regiony i liść z pierwszego zbioru dają zwykle słodszą, żywszą matchę; cieplejsze regiony i późniejsze zbiory dają mocniejsze, bardziej cierpkie profile, lepsze do mieszania. Pochodzenie to również sygnał identyfikowalności i ceny.",
            "氣候、土壤、品種與採收時機在研磨之前就形塑了茶葉。較涼爽的地區與首採茶葉往往帶來更甘甜、更鮮綠的抹茶；較溫暖的地區與較晚的採收則帶來更濃、更澀、更適合拼配的風味。產地同時也是可追溯性與價格的信號。",
          ),
        ],
      },
      {
        heading: L("The Japanese gardens", "Die japanischen Gärten", "Los jardines japoneses", "Les jardins japonais", "Japońskie ogrody", "日本茶園"),
        body: [
          L(
            "Uji (Kyoto) is the historic heart of matcha — refined, sweet, prized for ceremonial grades. Kagoshima, in the warm south, harvests early and at scale, with a fresh, vibrant profile. Nishio (Aichi) is a long-established milling region known for consistency. Each commands a premium and suits drinking grades.",
            "Uji (Kyoto) ist das historische Herz des Matcha — fein, süß, geschätzt für Ceremonial-Grade. Kagoshima im warmen Süden erntet früh und in großem Umfang, mit frischem, lebendigem Profil. Nishio (Aichi) ist eine alteingesessene Mahlregion, bekannt für Konstanz. Jede hat einen Aufpreis und eignet sich für Trinkgrade.",
            "Uji (Kioto) es el corazón histórico del matcha — refinado, dulce, apreciado para los grados ceremoniales. Kagoshima, en el cálido sur, cosecha temprano y a escala, con un perfil fresco y vibrante. Nishio (Aichi) es una región de molienda de larga tradición conocida por su consistencia. Cada una tiene una prima y encaja con los grados para beber.",
            "Uji (Kyoto) est le cœur historique du matcha — raffiné, doux, prisé pour les grades ceremonial. Kagoshima, dans le sud chaud, récolte tôt et à grande échelle, avec un profil frais et vibrant. Nishio (Aichi) est une région de broyage de longue date, réputée pour sa régularité. Chacune se paie une prime et convient aux grades à boire.",
            "Uji (Kioto) to historyczne serce matchy — wyrafinowane, słodkie, cenione w gatunkach ceremonial. Kagoshima na ciepłym południu zbiera wcześnie i na dużą skalę, o świeżym, żywym profilu. Nishio (Aichi) to region mielenia o długiej tradycji, znany ze spójności. Każde ma wyższą cenę i pasuje do gatunków do picia.",
            "宇治（京都）是抹茶的歷史核心——細緻、甘甜，於 ceremonial 等級備受推崇。鹿兒島位於溫暖的南部，採收早且量大，風味清新鮮活。西尾（愛知）是歷史悠久的研磨產區，以一致性聞名。三者價格較高，適合飲用等級。",
          ),
        ],
      },
      {
        heading: L("Beyond Japan", "Jenseits von Japan", "Más allá de Japón", "Au-delà du Japon", "Poza Japonią", "日本之外"),
        body: [
          L(
            "China produces large, consistent volumes of green tea suitable for premium and culinary grades, often at a lower price point — useful when colour and cost matter more than a ceremonial cup. The key is the same everywhere: single-origin traceability and a lab report per batch, so value never means unknown.",
            "China produziert große, konstante Mengen Grüntee für Premium- und Culinary-Grade, oft zu einem niedrigeren Preis — nützlich, wenn Farbe und Kosten wichtiger sind als eine Ceremonial-Tasse. Der Schlüssel ist überall gleich: Single-Origin-Rückverfolgbarkeit und ein Laborbericht pro Charge, damit Wert nie unbekannt bedeutet.",
            "China produce grandes volúmenes constantes de té verde aptos para grados premium y culinario, a menudo a un precio más bajo — útil cuando el color y el coste importan más que una taza ceremonial. La clave es la misma en todas partes: trazabilidad de origen único y un informe de laboratorio por lote, para que valor nunca signifique desconocido.",
            "La Chine produit de grands volumes constants de thé vert adaptés aux grades premium et culinary, souvent à un prix inférieur — utile quand la couleur et le coût comptent plus qu'une tasse ceremonial. La clé est la même partout : traçabilité mono-origine et rapport de laboratoire par lot, pour que valeur ne rime jamais avec inconnu.",
            "Chiny produkują duże, stałe ilości zielonej herbaty odpowiedniej dla gatunków premium i culinary, często w niższej cenie — przydatne, gdy kolor i koszt liczą się bardziej niż ceremonialna filiżanka. Klucz jest wszędzie ten sam: identyfikowalność jednego źródła i raport laboratoryjny dla każdej partii, aby wartość nigdy nie oznaczała niewiadomej.",
            "中國能生產大量且穩定的綠茶，適合 premium 與 culinary 等級，價格往往更低——當色澤與成本比 ceremonial 純飲更重要時很實用。各地的關鍵都相同：單一產地可追溯性與逐批的實驗室報告，讓「性價比」永遠不等於「來源不明」。",
          ),
        ],
      },
    ],
    faqs: [
      {
        q: L("Is Japanese matcha always better than Chinese?", "Ist japanischer Matcha immer besser als chinesischer?", "¿El matcha japonés es siempre mejor que el chino?", "Le matcha japonais est-il toujours meilleur que le chinois ?", "Czy japońska matcha jest zawsze lepsza od chińskiej?", "日本抹茶一定比中國抹茶好嗎？"),
        a: L(
          "For ceremonial drinking grades, Japanese gardens set the standard. For premium and culinary uses at volume, well-sourced Chinese matcha can be an excellent, cost-effective fit — provided it is single-origin and lab-tested.",
          "Bei Ceremonial-Trinkgraden setzen japanische Gärten den Standard. Für Premium- und Culinary-Anwendungen im großen Maßstab kann gut beschaffter chinesischer Matcha hervorragend und kosteneffizient passen — sofern er Single-Origin und laborgeprüft ist.",
          "Para los grados ceremoniales de beber, los jardines japoneses marcan el estándar. Para usos premium y culinarios a volumen, un matcha chino bien abastecido puede encajar de forma excelente y rentable — siempre que sea de origen único y analizado en laboratorio.",
          "Pour les grades ceremonial à boire, les jardins japonais fixent la norme. Pour les usages premium et culinary au volume, un matcha chinois bien sourcé peut être un excellent choix économique — à condition qu'il soit mono-origine et testé en laboratoire.",
          "W ceremonialnych gatunkach do picia standard wyznaczają japońskie ogrody. Do zastosowań premium i culinary na dużą skalę dobrze pozyskana chińska matcha może być doskonałym, opłacalnym wyborem — pod warunkiem, że jest z jednego źródła i badana laboratoryjnie.",
          "在 ceremonial 飲用等級，日本茶園樹立標準。在量產的 premium 與 culinary 用途上，來源良好的中國抹茶可以是絕佳且具成本效益的選擇——前提是單一產地且經實驗室檢驗。",
        ),
      },
      {
        q: L("Can you blend origins for consistency?", "Kann man Herkünfte für Konstanz mischen?", "¿Se pueden mezclar orígenes para lograr consistencia?", "Peut-on assembler des origines pour la régularité ?", "Czy można mieszać pochodzenia dla spójności?", "可以拼配不同產地以維持一致性嗎？"),
        a: L(
          "Yes. Multi-origin blending, done transparently and documented per batch, is a common way to hold a consistent spec and secure supply across a year.",
          "Ja. Multi-Origin-Blending, transparent durchgeführt und pro Charge dokumentiert, ist ein üblicher Weg, eine konstante Spezifikation zu halten und die Versorgung über ein Jahr zu sichern.",
          "Sí. La mezcla de múltiples orígenes, hecha con transparencia y documentada por lote, es una forma común de mantener una especificación constante y asegurar el suministro durante todo el año.",
          "Oui. L'assemblage multi-origines, réalisé en toute transparence et documenté par lot, est un moyen courant de tenir une spécification constante et de sécuriser l'approvisionnement sur l'année.",
          "Tak. Mieszanie wielu pochodzeń, wykonywane przejrzyście i dokumentowane dla każdej partii, to powszechny sposób na utrzymanie stałej specyfikacji i zabezpieczenie dostaw przez cały rok.",
          "可以。透明進行並逐批記錄的多產地拼配，是維持一致規格並在全年間確保供應的常見做法。",
        ),
      },
    ],
    relatedProducts: ["matcha"],
  },

  {
    slug: "the-people-behind-superfoods-partners",
    date: "2026-07-30",
    author: "Leonard",
    readingMins: 4,
    hero: "/photos/grower-portrait.jpg",
    heroAlt: L(
      "A grower at origin, one of the people behind every batch",
      "Ein Erzeuger am Ursprung, einer der Menschen hinter jeder Charge",
      "Un cultivador en origen, una de las personas detrás de cada lote",
      "Un cultivateur à l'origine, l'une des personnes derrière chaque lot",
      "Producent u źródła, jedna z osób stojących za każdą partią",
      "產地的一位茶農，每一批背後的人之一",
    ),
    category: L("The team", "Das Team", "El equipo", "L'équipe", "Zespół", "團隊"),
    authorRole: L("Superfoods Partners", "Superfoods Partners", "Superfoods Partners", "Superfoods Partners", "Superfoods Partners", "Superfoods Partners"),
    title: L(
      "The people behind Superfoods Partners",
      "Die Menschen hinter Superfoods Partners",
      "Las personas detrás de Superfoods Partners",
      "Les personnes derrière Superfoods Partners",
      "Ludzie stojący za Superfoods Partners",
      "Superfoods Partners 背後的人",
    ),
    metaTitle: L(
      "The People Behind Superfoods Partners — Meet the Team",
      "Die Menschen hinter Superfoods Partners — das Team",
      "Las Personas Detrás de Superfoods Partners — El Equipo",
      "Les Personnes Derrière Superfoods Partners — L'Équipe",
      "Ludzie za Superfoods Partners — Poznaj Zespół",
      "Superfoods Partners 背後的團隊",
    ),
    metaDescription: L(
      "Meet the Hong Kong team behind Superfoods Partners — the people who vet the gardens, test every batch and pick up the phone. Trust starts with knowing who sources your matcha.",
      "Lernen Sie das Hongkong-Team hinter Superfoods Partners kennen — die Menschen, die die Gärten prüfen, jede Charge testen und ans Telefon gehen. Vertrauen beginnt damit zu wissen, wer Ihren Matcha beschafft.",
      "Conozca al equipo de Hong Kong detrás de Superfoods Partners — las personas que evalúan los jardines, analizan cada lote y contestan el teléfono. La confianza empieza por saber quién abastece su matcha.",
      "Rencontrez l'équipe de Hong Kong derrière Superfoods Partners — les personnes qui évaluent les jardins, testent chaque lot et décrochent le téléphone. La confiance commence par savoir qui source votre matcha.",
      "Poznaj zespół z Hongkongu stojący za Superfoods Partners — ludzi, którzy oceniają ogrody, badają każdą partię i odbierają telefon. Zaufanie zaczyna się od wiedzy, kto pozyskuje twoją matchę.",
      "認識 Superfoods Partners 背後的香港團隊——評估茶園、檢驗每批、接聽電話的人。信任始於知道是誰為你採購抹茶。",
    ),
    dek: L(
      "Sourcing you can trust starts with people you can name. Meet the small Hong Kong team that vets the gardens, tests every batch and answers the phone.",
      "Beschaffung, der Sie vertrauen, beginnt mit Menschen, die Sie beim Namen kennen. Lernen Sie das kleine Hongkong-Team kennen, das die Gärten prüft, jede Charge testet und ans Telefon geht.",
      "El abastecimiento en el que puede confiar empieza con personas a las que puede nombrar. Conozca al pequeño equipo de Hong Kong que evalúa los jardines, analiza cada lote y contesta el teléfono.",
      "Un approvisionnement digne de confiance commence par des personnes que vous pouvez nommer. Rencontrez la petite équipe de Hong Kong qui évalue les jardins, teste chaque lot et répond au téléphone.",
      "Zaopatrzenie, któremu ufasz, zaczyna się od ludzi, których możesz wskazać z imienia. Poznaj mały zespół z Hongkongu, który ocenia ogrody, bada każdą partię i odbiera telefon.",
      "值得信任的採購，始於你叫得出名字的人。認識這支評估茶園、檢驗每批、接聽電話的香港小團隊。",
    ),
    lede: L(
      "Superfoods Partners is run by a small, named team based in Hong Kong, working across sourcing, quality control and partnerships. Behind every batch is a specific person who vetted the garden, tested the material or took your call — not an anonymous broker.",
      "Superfoods Partners wird von einem kleinen, namentlich bekannten Team in Hongkong geführt, das in Beschaffung, Qualitätskontrolle und Partnerschaften arbeitet. Hinter jeder Charge steht eine konkrete Person, die den Garten geprüft, das Material getestet oder Ihren Anruf entgegengenommen hat — kein anonymer Zwischenhändler.",
      "Superfoods Partners está dirigida por un equipo pequeño y con nombre propio, con sede en Hong Kong, que trabaja en abastecimiento, control de calidad y alianzas. Detrás de cada lote hay una persona concreta que evaluó el jardín, analizó el material o atendió su llamada — no un intermediario anónimo.",
      "Superfoods Partners est gérée par une petite équipe identifiée, basée à Hong Kong, qui travaille sur le sourcing, le contrôle qualité et les partenariats. Derrière chaque lot, il y a une personne précise qui a évalué le jardin, testé la matière ou pris votre appel — pas un courtier anonyme.",
      "Superfoods Partners jest prowadzona przez mały, znany z imienia zespół z siedzibą w Hongkongu, działający w obszarze sourcingu, kontroli jakości i partnerstw. Za każdą partią stoi konkretna osoba, która oceniła ogród, zbadała materiał lub odebrała twój telefon — nie anonimowy pośrednik.",
      "Superfoods Partners 由一支位於香港、叫得出名字的小團隊營運，橫跨採購、品質管制與合作關係。每一批背後都有一位具體的人——評估茶園、檢驗材料或接聽你的電話——而非匿名的中間商。",
    ),
    sections: [
      {
        heading: L("A team, not a middleman", "Ein Team, kein Zwischenhändler", "Un equipo, no un intermediario", "Une équipe, pas un intermédiaire", "Zespół, nie pośrednik", "一支團隊，而非中間商"),
        body: [
          L(
            "Four people carry the work across the chain. Wanjin leads supply chain and sourcing; Fannie sources at origin; Candy handles partnerships; Lucinda runs quality control. All are based in our Hong Kong hub, close to the gardens we buy from and the shipments we consolidate.",
            "Vier Menschen tragen die Arbeit über die gesamte Kette. Wanjin leitet Lieferkette und Beschaffung; Fannie beschafft am Ursprung; Candy betreut Partnerschaften; Lucinda verantwortet die Qualitätskontrolle. Alle sitzen in unserem Hongkong-Hub, nah an den Gärten, bei denen wir kaufen, und an den Sendungen, die wir bündeln.",
            "Cuatro personas llevan el trabajo a lo largo de la cadena. Wanjin lidera la cadena de suministro y el abastecimiento; Fannie abastece en origen; Candy gestiona las alianzas; Lucinda dirige el control de calidad. Todas trabajan en nuestro hub de Hong Kong, cerca de los jardines a los que compramos y de los envíos que consolidamos.",
            "Quatre personnes portent le travail sur toute la chaîne. Wanjin dirige la chaîne d'approvisionnement et le sourcing ; Fannie source à l'origine ; Candy gère les partenariats ; Lucinda pilote le contrôle qualité. Toutes sont basées dans notre hub de Hong Kong, au plus près des jardins où nous achetons et des expéditions que nous consolidons.",
            "Czworo osób prowadzi pracę wzdłuż całego łańcucha. Wanjin kieruje łańcuchem dostaw i sourcingiem; Fannie pozyskuje u źródła; Candy zajmuje się partnerstwami; Lucinda prowadzi kontrolę jakości. Wszyscy pracują w naszym hubie w Hongkongu, blisko ogrodów, od których kupujemy, i przesyłek, które konsolidujemy.",
            "四個人扛起整條供應鏈的工作。Wanjin 主導供應鏈與採購；Fannie 於產地採購；Candy 負責合作關係；Lucinda 掌管品質管制。他們都在我們的香港樞紐，貼近我們採購的茶園與整併的貨物。",
          ),
        ],
      },
      {
        heading: L("What that means for your order", "Was das für Ihre Bestellung bedeutet", "Qué significa para su pedido", "Ce que cela signifie pour votre commande", "Co to oznacza dla twojego zamówienia", "這對你的訂單意味著什麼"),
        body: [
          L(
            "It means one person has stood in the garden and knows the grower by name; another has tested the batch against pesticide, heavy-metal, microbiology and radiation panels before it shipped; and there is always someone you can reach within your own working day. Nothing important rides on a chain of strangers.",
            "Es bedeutet, dass eine Person im Garten stand und den Erzeuger beim Namen kennt; eine andere die Charge vor dem Versand auf Pestizide, Schwermetalle, Mikrobiologie und Radioaktivität geprüft hat; und dass immer jemand innerhalb Ihres Arbeitstags erreichbar ist. Nichts Wichtiges hängt an einer Kette von Fremden.",
            "Significa que una persona ha estado en el jardín y conoce al cultivador por su nombre; que otra ha analizado el lote frente a paneles de pesticidas, metales pesados, microbiología y radiación antes de enviarlo; y que siempre hay alguien a quien puede contactar dentro de su jornada laboral. Nada importante depende de una cadena de desconocidos.",
            "Cela signifie qu'une personne s'est tenue dans le jardin et connaît le cultivateur par son nom ; qu'une autre a testé le lot pour les pesticides, métaux lourds, microbiologie et radioactivité avant l'expédition ; et qu'il y a toujours quelqu'un que vous pouvez joindre pendant votre journée de travail. Rien d'important ne repose sur une chaîne d'inconnus.",
            "Oznacza to, że jedna osoba stała w ogrodzie i zna producenta z imienia; inna zbadała partię pod kątem pestycydów, metali ciężkich, mikrobiologii i promieniowania przed wysyłką; i zawsze jest ktoś, z kim skontaktujesz się w swoim dniu pracy. Nic ważnego nie zależy od łańcucha obcych ludzi.",
            "這意味著有一個人親自站在茶園、叫得出茶農的名字；另一個人在出貨前針對農藥、重金屬、微生物與輻射檢驗該批；而且永遠有一位能在你的工作時間內聯繫到的人。任何重要的事都不會託付給一串陌生人。",
          ),
        ],
      },
      {
        heading: L("Why we put names to it", "Warum wir Namen dazu nennen", "Por qué le ponemos nombres", "Pourquoi nous y mettons des noms", "Dlaczego podajemy imiona", "為何我們具名"),
        body: [
          L(
            "'Trusted at origin' only means something if there is a real person standing at that origin. Naming the team is how we stay accountable: if a batch is off-spec, you know exactly who owns it. That is the difference between a supplier and a supply chain you can build on.",
            "„Am Ursprung vertraut“ bedeutet nur etwas, wenn dort eine echte Person steht. Das Team zu benennen ist unsere Art, verantwortlich zu bleiben: Ist eine Charge außerhalb der Spezifikation, wissen Sie genau, wer dafür einsteht. Das ist der Unterschied zwischen einem Lieferanten und einer Lieferkette, auf die Sie bauen können.",
            "«Confianza en origen» solo significa algo si hay una persona real en ese origen. Nombrar al equipo es nuestra forma de rendir cuentas: si un lote está fuera de especificación, sabe exactamente quién responde por él. Esa es la diferencia entre un proveedor y una cadena de suministro sobre la que construir.",
            "« La confiance en origine » n'a de sens que s'il y a une personne réelle à cette origine. Nommer l'équipe, c'est notre façon de rester responsables : si un lot est hors spécification, vous savez exactement qui en répond. C'est la différence entre un fournisseur et une chaîne d'approvisionnement sur laquelle bâtir.",
            "„Zaufanie u źródła” coś znaczy tylko wtedy, gdy w tym źródle stoi prawdziwa osoba. Podawanie imion zespołu to nasz sposób na odpowiedzialność: jeśli partia jest niezgodna ze specyfikacją, wiesz dokładnie, kto za nią odpowiada. To różnica między dostawcą a łańcuchem dostaw, na którym można budować.",
            "「源頭可信賴」唯有在源頭確實站著一位真實的人時才有意義。為團隊具名是我們負責的方式：若某批不符規格，你清楚知道由誰負責。這正是「供應商」與「可依靠的供應鏈」之間的差別。",
          ),
        ],
      },
    ],
    keyFacts: [
      { label: L("Wanjin", "Wanjin", "Wanjin", "Wanjin", "Wanjin", "Wanjin"), value: L("Supply chain & sourcing", "Lieferkette & Beschaffung", "Cadena de suministro y abastecimiento", "Chaîne d'approvisionnement & sourcing", "Łańcuch dostaw i sourcing", "供應鏈與採購") },
      { label: L("Fannie", "Fannie", "Fannie", "Fannie", "Fannie", "Fannie"), value: L("Sourcing", "Beschaffung", "Abastecimiento", "Sourcing", "Sourcing", "採購") },
      { label: L("Candy", "Candy", "Candy", "Candy", "Candy", "Candy"), value: L("Partnerships", "Partnerschaften", "Alianzas", "Partenariats", "Partnerstwa", "合作關係") },
      { label: L("Lucinda", "Lucinda", "Lucinda", "Lucinda", "Lucinda", "Lucinda"), value: L("Quality control", "Qualitätskontrolle", "Control de calidad", "Contrôle qualité", "Kontrola jakości", "品質管制") },
      { label: L("Based", "Sitz", "Sede", "Basée à", "Siedziba", "據點"), value: L("Hong Kong hub", "Hongkong-Hub", "Hub de Hong Kong", "Hub de Hong Kong", "Hub w Hongkongu", "香港樞紐") },
    ],
    faqs: [
      {
        q: L("Can I speak to the sourcing team directly?", "Kann ich direkt mit dem Beschaffungsteam sprechen?", "¿Puedo hablar directamente con el equipo de abastecimiento?", "Puis-je parler directement à l'équipe de sourcing ?", "Czy mogę rozmawiać bezpośrednio z zespołem sourcingu?", "我可以直接與採購團隊聯繫嗎？"),
        a: L(
          "Yes. You work with named people in Hong Kong, not a faceless order desk — reachable within your own working day.",
          "Ja. Sie arbeiten mit namentlich bekannten Menschen in Hongkong, nicht mit einem gesichtslosen Bestell-Desk — erreichbar innerhalb Ihres Arbeitstags.",
          "Sí. Trabaja con personas con nombre en Hong Kong, no con un mostrador de pedidos anónimo — accesibles dentro de su jornada laboral.",
          "Oui. Vous travaillez avec des personnes identifiées à Hong Kong, pas un guichet de commandes anonyme — joignables pendant votre journée de travail.",
          "Tak. Współpracujesz z konkretnymi osobami w Hongkongu, a nie z anonimowym działem zamówień — dostępnymi w twoim dniu pracy.",
          "可以。你面對的是香港具名的人，而非無名的接單櫃台——在你的工作時間內可聯繫。",
        ),
      },
      {
        q: L("Where is the team based?", "Wo sitzt das Team?", "¿Dónde está el equipo?", "Où est basée l'équipe ?", "Gdzie znajduje się zespół?", "團隊在哪裡？"),
        a: L(
          "In our Hong Kong hub, close to the origins we source from and the shipments we consolidate and document.",
          "In unserem Hongkong-Hub, nah an den Ursprüngen, bei denen wir beschaffen, und an den Sendungen, die wir bündeln und dokumentieren.",
          "En nuestro hub de Hong Kong, cerca de los orígenes de los que nos abastecemos y de los envíos que consolidamos y documentamos.",
          "Dans notre hub de Hong Kong, au plus près des origines où nous nous approvisionnons et des expéditions que nous consolidons et documentons.",
          "W naszym hubie w Hongkongu, blisko źródeł, z których pozyskujemy, i przesyłek, które konsolidujemy i dokumentujemy.",
          "在我們的香港樞紐，貼近我們採購的產地，以及我們整併與記錄的貨物。",
        ),
      },
    ],
    relatedProducts: ["matcha"],
  },

  {
    slug: "what-is-ube-powder",
    date: "2026-07-30",
    author: "Fannie",
    readingMins: 4,
    hero: "/products/ube.jpg",
    heroAlt: L(
      "Ube purple yam powder, milled to a clean violet",
      "Ube-Süßkartoffelpulver, zu klarem Violett gemahlen",
      "Ube en polvo de ñame morado, molido a un violeta limpio",
      "Poudre d'igname pourpre ube, moulue en un violet net",
      "Sproszkowany fioletowy pochrzyn ube, zmielony na czysty fiolet",
      "紫薯 ube 粉，研磨成純淨的紫色",
    ),
    category: L("Ingredient guide", "Zutaten-Ratgeber", "Guía de ingredientes", "Guide des ingrédients", "Przewodnik po składnikach", "原料指南"),
    authorRole: L("Sourcing", "Beschaffung", "Abastecimiento", "Sourcing", "Sourcing", "採購"),
    title: L(
      "What is ube powder? Colour, flavour and how to use it",
      "Was ist Ube-Pulver? Farbe, Geschmack und Verwendung",
      "¿Qué es el ube en polvo? Color, sabor y cómo usarlo",
      "Qu'est-ce que la poudre d'ube ? Couleur, goût et usages",
      "Czym jest ube w proszku? Kolor, smak i zastosowanie",
      "什麼是 ube 粉？色澤、風味與用法",
    ),
    metaTitle: L(
      "What Is Ube Powder? Colour, Flavour & Uses (Buyer's Guide)",
      "Was ist Ube-Pulver? Farbe, Geschmack & Verwendung",
      "¿Qué Es el Ube en Polvo? Color, Sabor y Usos",
      "Qu'est-ce que la Poudre d'Ube ? Couleur, Goût & Usages",
      "Czym Jest Ube w Proszku? Kolor, Smak i Zastosowania",
      "什麼是 Ube 粉？色澤、風味與用途指南",
    ),
    metaDescription: L(
      "Ube powder is milled purple yam (Dioscorea alata) — a natural violet colour with soft, vanilla-like sweetness. What it is, how it differs from taro, and how manufacturers use it.",
      "Ube-Pulver ist gemahlene lila Yamswurzel (Dioscorea alata) — natürliches Violett mit weicher, vanilleartiger Süße. Was es ist, wie es sich von Taro unterscheidet und wie Hersteller es verwenden.",
      "El ube en polvo es ñame morado molido (Dioscorea alata) — un color violeta natural con dulzor suave tipo vainilla. Qué es, en qué se diferencia del taro y cómo lo usan los fabricantes.",
      "La poudre d'ube est de l'igname pourpre moulue (Dioscorea alata) — une couleur violette naturelle au goût doux vanillé. Ce que c'est, en quoi elle diffère du taro, et comment les fabricants l'utilisent.",
      "Ube w proszku to zmielony fioletowy pochrzyn (Dioscorea alata) — naturalny fiolet o łagodnej, waniliowej słodyczy. Czym jest, czym różni się od taro i jak używają go producenci.",
      "Ube 粉是研磨的紫薯（Dioscorea alata）——天然紫色、帶柔和的香草般甜味。它是什麼、與芋頭有何不同，以及製造商如何使用。",
    ),
    dek: L(
      "The vivid purple yam powder behind lattes, bakery and ice cream — what it is, how it tastes, and what to know before you buy at volume.",
      "Das leuchtend lila Yams-Pulver hinter Lattes, Backwaren und Eis — was es ist, wie es schmeckt und was Sie vor dem Großeinkauf wissen sollten.",
      "El vibrante polvo de ñame morado detrás de lattes, bollería y helados — qué es, a qué sabe y qué saber antes de comprar a volumen.",
      "La poudre d'igname pourpre éclatante derrière lattes, boulangerie et glaces — ce que c'est, son goût, et ce qu'il faut savoir avant d'acheter en volume.",
      "Żywy fioletowy proszek z pochrzynu w latte, wypiekach i lodach — czym jest, jak smakuje i co wiedzieć przed zakupem hurtowym.",
      "拿鐵、烘焙與冰淇淋背後那抹鮮豔的紫薯粉——它是什麼、嚐起來如何，以及大量採購前該知道什麼。",
    ),
    lede: L(
      "Ube powder is dried, milled purple yam (Dioscorea alata) — prized for a naturally vivid violet colour and a soft, vanilla-like sweetness, with no artificial dye. It has moved from Filipino kitchens to menus worldwide, and manufacturers reach for it wherever a clean natural purple is worth more than a synthetic one.",
      "Ube-Pulver ist getrocknete, gemahlene lila Yamswurzel (Dioscorea alata) — geschätzt für ein natürlich leuchtendes Violett und eine weiche, vanilleartige Süße, ohne künstlichen Farbstoff. Von philippinischen Küchen ist es auf Speisekarten weltweit gewandert, und Hersteller greifen dorthin, wo ein sauberes natürliches Violett mehr wert ist als ein synthetisches.",
      "El ube en polvo es ñame morado seco y molido (Dioscorea alata) — apreciado por un color violeta naturalmente vivo y un dulzor suave tipo vainilla, sin colorante artificial. Ha pasado de las cocinas filipinas a las cartas de todo el mundo, y los fabricantes lo eligen donde un morado natural y limpio vale más que uno sintético.",
      "La poudre d'ube est de l'igname pourpre séchée et moulue (Dioscorea alata) — prisée pour une couleur violette naturellement vive et une douceur vanillée, sans colorant artificiel. Passée des cuisines philippines aux cartes du monde entier, les fabricants la choisissent là où un violet naturel et net vaut mieux qu'un synthétique.",
      "Ube w proszku to suszony, zmielony fioletowy pochrzyn (Dioscorea alata) — ceniony za naturalnie żywy fiolet i łagodną, waniliową słodycz, bez sztucznego barwnika. Przeszedł z filipińskich kuchni do menu na całym świecie, a producenci sięgają po niego tam, gdzie czysty naturalny fiolet jest wart więcej niż syntetyczny.",
      "Ube 粉是乾燥研磨的紫薯（Dioscorea alata）——以天然鮮豔的紫色與柔和的香草般甜味著稱，不含人工色素。它已從菲律賓廚房走上世界各地的菜單；當「乾淨的天然紫」比合成色素更有價值時，製造商便會選它。",
    ),
    sections: [
      {
        heading: L("Where ube comes from", "Woher Ube kommt", "De dónde viene el ube", "D'où vient l'ube", "Skąd pochodzi ube", "Ube 的來源"),
        body: [
          L(
            "Ube is a purple yam long grown in the Philippines, where it is a staple of desserts like halaya and ice cream. The colour comes from natural anthocyanins in the tuber, not from dye. Good powder is milled from mature yam, dried and screened for a consistent particle size and colour.",
            "Ube ist eine lila Yamswurzel, die seit Langem auf den Philippinen angebaut wird, wo sie zu Desserts wie Halaya und Eis gehört. Die Farbe stammt aus natürlichen Anthocyanen der Knolle, nicht aus Farbstoff. Gutes Pulver wird aus reifer Yamswurzel gemahlen, getrocknet und auf gleichmäßige Partikelgröße und Farbe geprüft.",
            "El ube es un ñame morado cultivado desde hace mucho en Filipinas, donde es básico en postres como el halaya y el helado. El color proviene de antocianinas naturales del tubérculo, no de colorante. Un buen polvo se muele de ñame maduro, se seca y se controla para lograr un tamaño de partícula y un color constantes.",
            "L'ube est une igname pourpre cultivée de longue date aux Philippines, où elle est un incontournable de desserts comme le halaya et la glace. La couleur vient des anthocyanes naturelles du tubercule, pas d'un colorant. Une bonne poudre est moulue à partir d'igname mûre, séchée et contrôlée pour une granulométrie et une couleur constantes.",
            "Ube to fioletowy pochrzyn od dawna uprawiany na Filipinach, gdzie jest podstawą deserów takich jak halaya i lody. Kolor pochodzi z naturalnych antocyjanów bulwy, nie z barwnika. Dobry proszek mieli się z dojrzałej bulwy, suszy i kontroluje pod kątem stałej wielkości cząstek i koloru.",
            "Ube 是長期在菲律賓栽培的紫薯，是 halaya、冰淇淋等甜點的主角。其色澤來自塊莖中的天然花青素，而非色素。優質的粉由成熟塊莖研磨、乾燥，並篩選以確保一致的粒徑與色澤。",
          ),
        ],
      },
      {
        heading: L("How it tastes and looks", "Wie es schmeckt und aussieht", "A qué sabe y cómo se ve", "Son goût et son aspect", "Jak smakuje i wygląda", "風味與外觀"),
        body: [
          L(
            "Expect a soft, sweet, vanilla- and coconut-like flavour and a violet-to-lavender colour that survives baking and freezing better than many natural colours. Shade and intensity vary by yam and process, so a consistent spec matters for repeat production.",
            "Erwarten Sie einen weichen, süßen Geschmack nach Vanille und Kokos und eine violett-lavendelfarbene Tönung, die Backen und Gefrieren besser übersteht als viele natürliche Farben. Ton und Intensität variieren je nach Yams und Verfahren — eine konstante Spezifikation ist für wiederkehrende Produktion wichtig.",
            "Espere un sabor suave y dulce, con notas de vainilla y coco, y un color violeta a lavanda que resiste el horneado y la congelación mejor que muchos colores naturales. El tono y la intensidad varían según el ñame y el proceso, así que una especificación constante importa para la producción repetida.",
            "Attendez-vous à un goût doux et sucré, aux notes de vanille et de coco, et à une couleur violet-lavande qui résiste mieux à la cuisson et à la congélation que beaucoup de couleurs naturelles. La teinte et l'intensité varient selon l'igname et le procédé — une spécification constante compte pour la production répétée.",
            "Spodziewaj się łagodnego, słodkiego smaku o nutach wanilii i kokosa oraz koloru fioletowo-lawendowego, który znosi pieczenie i mrożenie lepiej niż wiele naturalnych barw. Odcień i intensywność zależą od pochrzynu i procesu, więc stała specyfikacja jest ważna przy powtarzalnej produkcji.",
            "可期待柔和、香甜、帶香草與椰子氣息的風味，以及紫至薰衣草色的色澤，其耐烘烤與冷凍的表現優於許多天然色素。色調與濃度會因塊莖與製程而異，因此一致的規格對重複生產至關重要。",
          ),
        ],
      },
      {
        heading: L("Ube vs taro — they're not the same", "Ube vs. Taro — nicht dasselbe", "Ube vs taro — no son lo mismo", "Ube vs taro — ce n'est pas la même chose", "Ube kontra taro — to nie to samo", "Ube 與芋頭並不相同"),
        body: [
          L(
            "Ube and taro are often confused. Ube (Dioscorea alata) is a yam with naturally purple flesh and a sweet flavour; taro (Colocasia esculenta) is a corm, milder and at most a greyish lilac. If you want the vivid natural purple and the sweetness, you want ube — check the botanical name on the spec, not just the label.",
            "Ube und Taro werden oft verwechselt. Ube (Dioscorea alata) ist eine Yamswurzel mit von Natur aus violettem Fruchtfleisch und süßem Geschmack; Taro (Colocasia esculenta) ist eine Knolle, milder und höchstens gräulich-lila. Wenn Sie das leuchtende natürliche Violett und die Süße wollen, wollen Sie Ube — prüfen Sie den botanischen Namen in der Spezifikation, nicht nur das Etikett.",
            "El ube y el taro se confunden a menudo. El ube (Dioscorea alata) es un ñame de pulpa naturalmente morada y sabor dulce; el taro (Colocasia esculenta) es un cormo, más suave y como mucho de un lila grisáceo. Si quiere el morado natural vivo y el dulzor, quiere ube — verifique el nombre botánico en la especificación, no solo la etiqueta.",
            "L'ube et le taro sont souvent confondus. L'ube (Dioscorea alata) est une igname à la chair naturellement pourpre et au goût sucré ; le taro (Colocasia esculenta) est un corme, plus doux et au mieux d'un lilas grisâtre. Si vous voulez le violet naturel éclatant et la douceur, c'est l'ube — vérifiez le nom botanique sur la spécification, pas seulement l'étiquette.",
            "Ube i taro są często mylone. Ube (Dioscorea alata) to pochrzyn o naturalnie fioletowym miąższu i słodkim smaku; taro (Colocasia esculenta) to bulwocebula, łagodniejsza i co najwyżej szarolila. Jeśli chcesz żywego naturalnego fioletu i słodyczy, potrzebujesz ube — sprawdź nazwę botaniczną w specyfikacji, nie tylko etykietę.",
            "Ube 與芋頭常被混淆。Ube（Dioscorea alata）是果肉天然呈紫色、味道偏甜的薯類；芋頭（Colocasia esculenta）則是球莖，味道較淡，至多呈灰紫色。若你要的是鮮豔的天然紫與甜味，那就是 ube——請查看規格上的學名，而非只看標籤。",
          ),
        ],
      },
    ],
    keyFacts: [
      { label: L("Botanical", "Botanisch", "Botánico", "Botanique", "Nazwa botaniczna", "學名"), value: L("Purple yam (Dioscorea alata)", "Lila Yams (Dioscorea alata)", "Ñame morado (Dioscorea alata)", "Igname pourpre (Dioscorea alata)", "Fioletowy pochrzyn (Dioscorea alata)", "紫薯（Dioscorea alata）") },
      { label: L("Colour", "Farbe", "Color", "Couleur", "Kolor", "色澤"), value: L("Natural violet — anthocyanins, no dye", "Natürliches Violett — Anthocyane, kein Farbstoff", "Violeta natural — antocianinas, sin colorante", "Violet naturel — anthocyanes, sans colorant", "Naturalny fiolet — antocyjany, bez barwnika", "天然紫——花青素，無色素") },
      { label: L("Flavour", "Geschmack", "Sabor", "Goût", "Smak", "風味"), value: L("Soft, sweet, vanilla-like", "Weich, süß, vanilleartig", "Suave, dulce, tipo vainilla", "Doux, sucré, vanillé", "Łagodny, słodki, waniliowy", "柔和、香甜、香草般") },
      { label: L("Caffeine", "Koffein", "Cafeína", "Caféine", "Kofeina", "咖啡因"), value: L("Caffeine-free", "Koffeinfrei", "Sin cafeína", "Sans caféine", "Bez kofeiny", "無咖啡因") },
      { label: L("Origin", "Ursprung", "Origen", "Origine", "Pochodzenie", "產地"), value: L("Philippines (+ China lane for scale)", "Philippinen (+ China-Lane für Skalierung)", "Filipinas (+ ruta de China para escala)", "Philippines (+ voie Chine pour l'échelle)", "Filipiny (+ tor Chin dla skali)", "菲律賓（＋中國供應線以擴量）") },
    ],
    faqs: [
      {
        q: L("Is ube powder the same as purple yam powder?", "Ist Ube-Pulver dasselbe wie lila Yams-Pulver?", "¿El ube en polvo es lo mismo que el ñame morado en polvo?", "La poudre d'ube est-elle la même que la poudre d'igname pourpre ?", "Czy ube w proszku to to samo co fioletowy pochrzyn w proszku?", "Ube 粉和紫薯粉是一樣的嗎？"),
        a: L(
          "Yes — ube is the Filipino name for purple yam (Dioscorea alata), so 'ube powder' and 'purple yam powder' are the same milled ingredient.",
          "Ja — Ube ist der philippinische Name für lila Yams (Dioscorea alata), also sind „Ube-Pulver“ und „lila Yams-Pulver“ dieselbe gemahlene Zutat.",
          "Sí — ube es el nombre filipino del ñame morado (Dioscorea alata), así que «ube en polvo» y «ñame morado en polvo» son el mismo ingrediente molido.",
          "Oui — ube est le nom philippin de l'igname pourpre (Dioscorea alata), donc « poudre d'ube » et « poudre d'igname pourpre » désignent le même ingrédient moulu.",
          "Tak — ube to filipińska nazwa fioletowego pochrzynu (Dioscorea alata), więc „ube w proszku” i „fioletowy pochrzyn w proszku” to ten sam zmielony składnik.",
          "是的——ube 是紫薯（Dioscorea alata）的菲律賓語名稱，因此「ube 粉」與「紫薯粉」是同一種研磨原料。",
        ),
      },
      {
        q: L("Does ube powder contain artificial colour?", "Enthält Ube-Pulver künstliche Farbe?", "¿El ube en polvo contiene color artificial?", "La poudre d'ube contient-elle un colorant artificiel ?", "Czy ube w proszku zawiera sztuczny barwnik?", "Ube 粉含人工色素嗎？"),
        a: L(
          "Good ube powder is 100% purple yam — the violet is natural anthocyanin, with no added dye. Always confirm it on the Certificate of Analysis.",
          "Gutes Ube-Pulver ist zu 100 % lila Yams — das Violett ist natürliches Anthocyan, ohne zugesetzten Farbstoff. Bestätigen Sie das stets im Analysenzertifikat.",
          "Un buen ube en polvo es 100% ñame morado — el violeta es antocianina natural, sin colorante añadido. Confírmelo siempre en el Certificado de Análisis.",
          "Une bonne poudre d'ube est 100 % igname pourpre — le violet est de l'anthocyane naturelle, sans colorant ajouté. Confirmez-le toujours sur le certificat d'analyse.",
          "Dobry ube w proszku to w 100% fioletowy pochrzyn — fiolet to naturalny antocyjan, bez dodanego barwnika. Zawsze potwierdź to w Certyfikacie Analizy.",
          "優質 ube 粉為 100% 紫薯——紫色來自天然花青素，不添加色素。請務必於分析證明（COA）上確認。",
        ),
      },
      {
        q: L("Is ube the same as taro?", "Ist Ube dasselbe wie Taro?", "¿El ube es lo mismo que el taro?", "L'ube est-il la même chose que le taro ?", "Czy ube to to samo co taro?", "Ube 和芋頭一樣嗎？"),
        a: L(
          "No. Ube is a sweet purple yam (Dioscorea alata); taro is a milder corm (Colocasia esculenta). Only ube gives the vivid natural purple and sweetness.",
          "Nein. Ube ist eine süße lila Yams (Dioscorea alata); Taro ist eine mildere Knolle (Colocasia esculenta). Nur Ube liefert das leuchtende natürliche Violett und die Süße.",
          "No. El ube es un ñame morado dulce (Dioscorea alata); el taro es un cormo más suave (Colocasia esculenta). Solo el ube da el morado natural vivo y el dulzor.",
          "Non. L'ube est une igname pourpre sucrée (Dioscorea alata) ; le taro est un corme plus doux (Colocasia esculenta). Seul l'ube donne le violet naturel éclatant et la douceur.",
          "Nie. Ube to słodki fioletowy pochrzyn (Dioscorea alata); taro to łagodniejsza bulwocebula (Colocasia esculenta). Tylko ube daje żywy naturalny fiolet i słodycz.",
          "不一樣。Ube 是味甜的紫薯（Dioscorea alata）；芋頭是味道較淡的球莖（Colocasia esculenta）。只有 ube 能帶來鮮豔的天然紫與甜味。",
        ),
      },
    ],
    relatedProducts: ["ube"],
  },

  {
    slug: "ube-powder-bakery-rtd-ice-cream",
    date: "2026-07-30",
    author: "Wanjin",
    readingMins: 5,
    hero: "/products/ube.jpg",
    heroAlt: L(
      "Ube powder for bakery, beverages and frozen desserts",
      "Ube-Pulver für Backwaren, Getränke und Tiefkühldesserts",
      "Ube en polvo para bollería, bebidas y postres congelados",
      "Poudre d'ube pour boulangerie, boissons et desserts glacés",
      "Ube w proszku do wypieków, napojów i mrożonych deserów",
      "用於烘焙、飲品與冷凍甜點的 ube 粉",
    ),
    category: L("Formulation", "Formulierung", "Formulación", "Formulation", "Formulacja", "配方"),
    authorRole: L("Supply chain & sourcing", "Lieferkette & Beschaffung", "Cadena de suministro y abastecimiento", "Chaîne d'approvisionnement & sourcing", "Łańcuch dostaw i sourcing", "供應鏈與採購"),
    title: L(
      "Formulating with ube powder: bakery, RTD and ice cream",
      "Formulieren mit Ube-Pulver: Backwaren, RTD und Eis",
      "Formular con ube en polvo: bollería, RTD y helado",
      "Formuler avec la poudre d'ube : boulangerie, RTD et glace",
      "Formulacja z ube w proszku: wypieki, RTD i lody",
      "以 ube 粉配方：烘焙、即飲與冰淇淋",
    ),
    metaTitle: L(
      "Ube Powder for Bakery, RTD & Ice Cream — Formulator's Guide",
      "Ube-Pulver für Backwaren, RTD & Eis — Formulierungsratgeber",
      "Ube en Polvo para Bollería, RTD y Helado — Guía de Formulación",
      "Poudre d'Ube pour Boulangerie, RTD & Glace — Guide de Formulation",
      "Ube w Proszku do Wypieków, RTD i Lodów — Przewodnik",
      "Ube 粉用於烘焙、即飲與冰淇淋——配方指南",
    ),
    metaDescription: L(
      "How to formulate with ube powder across bakery, beverages and frozen desserts — dosage, colour hold, flavour pairing and sourcing a consistent spec at volume.",
      "Wie man mit Ube-Pulver in Backwaren, Getränken und Tiefkühldesserts formuliert — Dosierung, Farbstabilität, Aromapaarung und Beschaffung einer konstanten Spezifikation im großen Maßstab.",
      "Cómo formular con ube en polvo en bollería, bebidas y postres congelados — dosis, retención del color, maridaje de sabor y abastecimiento de una especificación constante a volumen.",
      "Comment formuler avec la poudre d'ube en boulangerie, boissons et desserts glacés — dosage, tenue de la couleur, accords de saveurs et approvisionnement d'une spécification constante au volume.",
      "Jak formułować z ube w proszku w wypiekach, napojach i mrożonych deserach — dozowanie, utrzymanie koloru, łączenie smaków i pozyskiwanie stałej specyfikacji przy dużych ilościach.",
      "如何在烘焙、飲品與冷凍甜點中以 ube 粉配方——用量、色澤維持、風味搭配，以及大量採購時取得一致規格。",
    ),
    dek: L(
      "A practical guide to putting ube powder to work — where the natural purple performs, how much to use, and what to lock down before scaling.",
      "Ein praktischer Leitfaden, um Ube-Pulver einzusetzen — wo das natürliche Violett wirkt, wie viel man verwendet und was man vor dem Skalieren festlegt.",
      "Una guía práctica para poner a trabajar el ube en polvo — dónde rinde el morado natural, cuánto usar y qué fijar antes de escalar.",
      "Un guide pratique pour mettre la poudre d'ube au travail — où le violet naturel performe, combien en utiliser, et quoi verrouiller avant de passer à l'échelle.",
      "Praktyczny przewodnik, jak wykorzystać ube w proszku — gdzie naturalny fiolet się sprawdza, ile użyć i co ustalić przed skalowaniem.",
      "將 ube 粉付諸實用的實務指南——天然紫在何處表現最佳、用量多少，以及擴產前該鎖定什麼。",
    ),
    lede: L(
      "Ube powder earns its place wherever a natural violet colour and a soft, sweet flavour add value — lattes and RTD drinks, bakery and viennoiserie, ice cream and confectionery. The keys to a good result are dosage, colour stability and a supplier who holds the same spec batch to batch.",
      "Ube-Pulver verdient seinen Platz überall dort, wo ein natürliches Violett und ein weicher, süßer Geschmack Mehrwert bringen — Lattes und RTD-Getränke, Backwaren und Viennoiserie, Eis und Konfekt. Entscheidend für ein gutes Ergebnis sind Dosierung, Farbstabilität und ein Lieferant, der die gleiche Spezifikation von Charge zu Charge hält.",
      "El ube en polvo se gana su lugar donde un color violeta natural y un sabor suave y dulce aportan valor — lattes y bebidas RTD, bollería y viennoiserie, helado y confitería. Las claves de un buen resultado son la dosis, la estabilidad del color y un proveedor que mantenga la misma especificación de lote en lote.",
      "La poudre d'ube gagne sa place partout où une couleur violette naturelle et un goût doux et sucré ajoutent de la valeur — lattes et boissons RTD, boulangerie et viennoiserie, glace et confiserie. Les clés d'un bon résultat sont le dosage, la stabilité de la couleur et un fournisseur qui tient la même spécification d'un lot à l'autre.",
      "Ube w proszku zasługuje na miejsce wszędzie tam, gdzie naturalny fiolet i łagodny, słodki smak dodają wartości — latte i napoje RTD, wypieki i viennoiserie, lody i wyroby cukiernicze. Kluczem do dobrego efektu są dozowanie, stabilność koloru i dostawca utrzymujący tę samą specyfikację od partii do partii.",
      "當天然紫色與柔和甜味能增添價值時，ube 粉便有其用武之地——拿鐵與即飲飲品、烘焙與維也納麵包、冰淇淋與糖果。成功的關鍵在於用量、色澤穩定性，以及能逐批維持相同規格的供應商。",
    ),
    sections: [
      {
        heading: L("Beverages and RTD", "Getränke und RTD", "Bebidas y RTD", "Boissons et RTD", "Napoje i RTD", "飲品與即飲"),
        body: [
          L(
            "In lattes and bottled drinks, ube brings colour and a mild sweetness that pairs well with coconut, vanilla and milk. Because natural anthocyanin colour shifts with pH, confirm the shade in your actual formula — and, for RTD, across the full shelf life, not just at fill.",
            "In Lattes und abgefüllten Getränken bringt Ube Farbe und eine milde Süße, die gut zu Kokos, Vanille und Milch passt. Da natürliche Anthocyanfarbe sich mit dem pH-Wert verändert, prüfen Sie den Farbton in Ihrer tatsächlichen Rezeptur — und bei RTD über die gesamte Haltbarkeit, nicht nur beim Abfüllen.",
            "En lattes y bebidas embotelladas, el ube aporta color y un dulzor suave que combina bien con coco, vainilla y leche. Como el color de la antocianina natural cambia con el pH, confirme el tono en su fórmula real — y, para RTD, a lo largo de toda la vida útil, no solo al llenar.",
            "Dans les lattes et boissons en bouteille, l'ube apporte couleur et douceur légère, qui s'accordent au coco, à la vanille et au lait. Comme la couleur des anthocyanes naturelles varie avec le pH, confirmez la teinte dans votre formule réelle — et, pour le RTD, sur toute la durée de conservation, pas seulement au remplissage.",
            "W latte i napojach butelkowanych ube wnosi kolor i łagodną słodycz, dobrze komponującą się z kokosem, wanilią i mlekiem. Ponieważ kolor naturalnego antocyjanu zmienia się z pH, potwierdź odcień w rzeczywistej recepturze — a w RTD przez cały okres przydatności, nie tylko przy napełnianiu.",
            "在拿鐵與瓶裝飲品中，ube 帶來色澤與淡淡甜味，與椰子、香草和牛奶都很搭。由於天然花青素的顏色會隨 pH 值變化，請在你的實際配方中確認色調——對即飲產品，更要涵蓋整個保存期，而非僅在灌裝時。",
          ),
        ],
      },
      {
        heading: L("Bakery and frozen", "Backwaren und Tiefkühlware", "Bollería y congelados", "Boulangerie et surgelés", "Wypieki i mrożonki", "烘焙與冷凍"),
        body: [
          L(
            "In bakery and viennoiserie the colour holds through the oven better than many natural purples; in ice cream and gelato it delivers both colour and flavour without a synthetic aftertaste. Dose to the intensity you want, then hold that dose as a written spec so every production run matches.",
            "In Backwaren und Viennoiserie hält die Farbe den Ofen besser aus als viele natürliche Violetttöne; in Eis und Gelato liefert sie Farbe und Geschmack ohne synthetischen Nachgeschmack. Dosieren Sie auf die gewünschte Intensität und halten Sie diese Dosis als schriftliche Spezifikation fest, damit jede Produktion übereinstimmt.",
            "En bollería y viennoiserie el color aguanta el horno mejor que muchos morados naturales; en helado y gelato aporta color y sabor sin regusto sintético. Dosifique a la intensidad deseada y fije esa dosis como especificación escrita para que cada producción coincida.",
            "En boulangerie et viennoiserie, la couleur tient au four mieux que beaucoup de violets naturels ; en glace et gelato, elle apporte couleur et goût sans arrière-goût synthétique. Dosez à l'intensité voulue, puis figez cette dose en spécification écrite pour que chaque production corresponde.",
            "W wypiekach i viennoiserie kolor znosi piekarnik lepiej niż wiele naturalnych fioletów; w lodach i gelato daje kolor i smak bez syntetycznego posmaku. Dozuj do żądanej intensywności, a potem ustal tę dawkę jako pisemną specyfikację, aby każda produkcja była zgodna.",
            "在烘焙與維也納麵包中，其色澤耐烤程度優於許多天然紫色；在冰淇淋與義式冰淇淋中，能同時提供色澤與風味且無合成後味。依所需濃度用量，並將該用量固定為書面規格，讓每批生產一致。",
          ),
        ],
      },
      {
        heading: L("What to lock down before you scale", "Was vor dem Skalieren festzulegen ist", "Qué fijar antes de escalar", "Ce qu'il faut verrouiller avant de passer à l'échelle", "Co ustalić przed skalowaniem", "擴產前該鎖定什麼"),
        body: [
          L(
            "Agree the target colour and particle size, get a Certificate of Analysis per batch, and choose a supplier who can keep colour and flavour consistent order after order. Natural ingredients vary — the value is in a partner who controls that variation, documents it, and can scale from sample to full container.",
            "Vereinbaren Sie Zielfarbe und Partikelgröße, holen Sie ein Analysenzertifikat pro Charge und wählen Sie einen Lieferanten, der Farbe und Geschmack Bestellung für Bestellung konstant hält. Natürliche Zutaten variieren — der Wert liegt in einem Partner, der diese Variation steuert, dokumentiert und von der Probe bis zum ganzen Container skalieren kann.",
            "Acuerde el color objetivo y el tamaño de partícula, obtenga un Certificado de Análisis por lote y elija un proveedor que mantenga color y sabor constantes pedido tras pedido. Los ingredientes naturales varían — el valor está en un socio que controla esa variación, la documenta y puede escalar de muestra a contenedor completo.",
            "Convenez la couleur cible et la granulométrie, obtenez un certificat d'analyse par lot et choisissez un fournisseur capable de garder couleur et goût constants commande après commande. Les ingrédients naturels varient — la valeur réside dans un partenaire qui maîtrise cette variation, la documente et peut passer de l'échantillon au conteneur complet.",
            "Ustal docelowy kolor i wielkość cząstek, uzyskaj Certyfikat Analizy dla każdej partii i wybierz dostawcę, który utrzyma kolor i smak stałe zamówienie po zamówieniu. Naturalne składniki się różnią — wartość tkwi w partnerze, który kontroluje tę zmienność, dokumentuje ją i potrafi skalować od próbki do pełnego kontenera.",
            "議定目標色澤與粒徑、取得每批的分析證明（COA），並選擇能逐單維持色澤與風味一致的供應商。天然原料本有差異——價值在於能掌控並記錄該差異、且能從樣品擴至整櫃的夥伴。",
          ),
        ],
      },
    ],
    keyFacts: [
      { label: L("Uses", "Anwendungen", "Usos", "Usages", "Zastosowania", "用途"), value: L("Lattes / RTD, bakery, ice cream, confectionery", "Lattes / RTD, Backwaren, Eis, Konfekt", "Lattes / RTD, bollería, helado, confitería", "Lattes / RTD, boulangerie, glace, confiserie", "Latte / RTD, wypieki, lody, cukiernictwo", "拿鐵／即飲、烘焙、冰淇淋、糖果") },
      { label: L("Colour", "Farbe", "Color", "Couleur", "Kolor", "色澤"), value: L("pH-sensitive natural anthocyanin — test in formula", "pH-empfindliches natürliches Anthocyan — in Rezeptur testen", "Antocianina natural sensible al pH — probar en fórmula", "Anthocyane naturelle sensible au pH — tester en formule", "Antocyjan naturalny wrażliwy na pH — testuj w recepturze", "對 pH 敏感的天然花青素——請於配方中測試") },
      { label: L("Dosage", "Dosierung", "Dosis", "Dosage", "Dozowanie", "用量"), value: L("To target colour/flavour; fix as a spec", "Auf Zielfarbe/-geschmack; als Spezifikation festlegen", "A color/sabor objetivo; fijar como especificación", "À la couleur/au goût cible ; figer en spécification", "Do docelowego koloru/smaku; ustalić jako specyfikację", "依目標色澤／風味；固定為規格") },
      { label: L("MOQ", "MOQ", "MOQ", "MOQ", "MOQ", "起訂量"), value: L("25 kg → full container", "25 kg → ganzer Container", "25 kg → contenedor completo", "25 kg → conteneur complet", "25 kg → pełny kontener", "25 公斤 → 整櫃") },
      { label: L("Documentation", "Dokumentation", "Documentación", "Documentation", "Dokumentacja", "文件"), value: L("COA + Verification Record™ per batch", "COA + Verification Record™ pro Charge", "COA + Verification Record™ por lote", "COA + Verification Record™ par lot", "COA + Verification Record™ na partię", "每批 COA + Verification Record™") },
    ],
    faqs: [
      {
        q: L("How much ube powder should I use?", "Wie viel Ube-Pulver sollte ich verwenden?", "¿Cuánto ube en polvo debo usar?", "Quelle quantité de poudre d'ube utiliser ?", "Ile ube w proszku użyć?", "我該用多少 ube 粉？"),
        a: L(
          "It depends on the target colour and flavour intensity and your base, so dose to your desired shade in the actual formula, then fix that as a repeatable spec. Order a sample to dial it in before scaling.",
          "Das hängt von Zielfarbe, Geschmacksintensität und Ihrer Basis ab — dosieren Sie also auf den gewünschten Farbton in der tatsächlichen Rezeptur und legen Sie das als wiederholbare Spezifikation fest. Bestellen Sie ein Muster, um es vor dem Skalieren einzustellen.",
          "Depende del color objetivo, la intensidad de sabor y su base, así que dosifique al tono deseado en la fórmula real y fíjelo como especificación repetible. Pida una muestra para ajustarlo antes de escalar.",
          "Cela dépend de la couleur cible, de l'intensité de goût et de votre base ; dosez donc à la teinte voulue dans la formule réelle, puis figez-la en spécification reproductible. Commandez un échantillon pour l'ajuster avant de passer à l'échelle.",
          "Zależy to od docelowego koloru, intensywności smaku i twojej bazy, więc dozuj do żądanego odcienia w rzeczywistej recepturze, a potem ustal to jako powtarzalną specyfikację. Zamów próbkę, aby dopracować przed skalowaniem.",
          "這取決於目標色澤、風味濃度與你的基底，因此請在實際配方中調到想要的色調，再固定為可重複的規格。擴產前先訂樣品來微調。",
        ),
      },
      {
        q: L("Will the purple colour survive baking and freezing?", "Übersteht die lila Farbe Backen und Gefrieren?", "¿El color morado sobrevive al horneado y la congelación?", "La couleur pourpre résiste-t-elle à la cuisson et à la congélation ?", "Czy fioletowy kolor przetrwa pieczenie i mrożenie?", "紫色能耐烘烤與冷凍嗎？"),
        a: L(
          "Ube's natural anthocyanin colour holds through the oven and freezer better than many natural purples, but it shifts with pH — always confirm it in your own recipe and across shelf life.",
          "Ubes natürliche Anthocyanfarbe hält Ofen und Gefrierschrank besser aus als viele natürliche Violetttöne, verändert sich aber mit dem pH-Wert — bestätigen Sie sie stets in Ihrem eigenen Rezept und über die Haltbarkeit.",
          "El color de antocianina natural del ube aguanta el horno y el congelador mejor que muchos morados naturales, pero cambia con el pH — confírmelo siempre en su propia receta y a lo largo de la vida útil.",
          "La couleur d'anthocyane naturelle de l'ube tient au four et au congélateur mieux que beaucoup de violets naturels, mais elle varie avec le pH — confirmez-la toujours dans votre propre recette et sur la durée de conservation.",
          "Naturalny antocyjanowy kolor ube znosi piekarnik i zamrażarkę lepiej niż wiele naturalnych fioletów, ale zmienia się z pH — zawsze potwierdź go we własnym przepisie i przez okres przydatności.",
          "Ube 的天然花青素色澤耐烘烤與冷凍的表現優於許多天然紫色，但會隨 pH 變化——請務必在你自己的配方中並跨越保存期確認。",
        ),
      },
      {
        q: L("Can you supply a consistent colour at volume?", "Können Sie eine konstante Farbe im großen Maßstab liefern?", "¿Pueden suministrar un color constante a volumen?", "Pouvez-vous fournir une couleur constante au volume ?", "Czy możecie dostarczyć stały kolor przy dużych ilościach?", "你們能在大量時供應一致的色澤嗎？"),
        a: L(
          "Yes — we screen and document colour and particle size per batch and consolidate through our Hong Kong hub, so the spec stays consistent across repeat orders.",
          "Ja — wir prüfen und dokumentieren Farbe und Partikelgröße pro Charge und bündeln über unseren Hongkong-Hub, sodass die Spezifikation über Folgeaufträge konstant bleibt.",
          "Sí — controlamos y documentamos el color y el tamaño de partícula por lote y consolidamos a través de nuestro hub de Hong Kong, de modo que la especificación se mantiene constante en pedidos repetidos.",
          "Oui — nous contrôlons et documentons la couleur et la granulométrie par lot et consolidons via notre hub de Hong Kong, de sorte que la spécification reste constante sur les commandes répétées.",
          "Tak — badamy i dokumentujemy kolor oraz wielkość cząstek dla każdej partii i konsolidujemy przez nasz hub w Hongkongu, więc specyfikacja pozostaje stała przy kolejnych zamówieniach.",
          "可以——我們逐批檢驗並記錄色澤與粒徑，並經由香港樞紐整併，使規格在重複訂單間維持一致。",
        ),
      },
    ],
    relatedProducts: ["ube"],
  },

  {
    slug: "matcha-superfood-wholesale-demand-report-2026",
    date: "2026-07-30",
    author: "Wanjin",
    readingMins: 6,
    hero: "/photos/hero-shade-nets.jpg",
    heroAlt: E("Shade-grown tea gardens — the origin of matcha supply"),
    category: E("Report"),
    authorRole: E("Supply chain & sourcing"),
    title: E("Matcha & superfood wholesale: the 2026 demand & sourcing report"),
    metaTitle: E("Matcha & Superfood Wholesale — 2026 Demand & Sourcing Report"),
    metaDescription: E("How much demand sits behind matcha, ube, lion's mane and hibiscus — and the sourcing standards (MOQ, lab testing, incoterms) behind supplying them at scale. Original 2026 data."),
    dek: E("What buyers are searching for across matcha and superfood powders — and the B2B sourcing standards behind meeting that demand. Original 2026 data from Superfoods Partners."),
    lede: E("Consumer demand for matcha and superfood powders is large and still rising — matcha alone draws well over 800,000 US searches a month, with functional mushrooms and botanicals close behind — yet the wholesale side that supplies it, and the tencha price surge now reshaping it, stays largely opaque. This report looks at both: where demand is heading, and what is happening to supply."),
    sections: [
      {
        heading: E("Demand is broad, not niche"),
        body: [
          E("Matcha has crossed fully into the mainstream — it now draws well over 800,000 US searches a month — and the category runs far beyond it, with functional mushrooms like lion's mane and botanicals like hibiscus each pulling six-figure monthly demand. Consumer appetite for these ingredients is broad and durable."),
          E("It is also still climbing. US search interest in matcha rose roughly 89% in 2025 versus 2024, and ube — the clean-label natural purple moving from Filipino kitchens onto global menus — about 16% (Google Trends). Demand is building, not levelling off."),
        ],
      },
      {
        heading: E("What it means for brands and manufacturers"),
        body: [
          E("Demand this size means the question is no longer whether to carry matcha or a superfood powder, but how to source it reliably. That is where the market is thin: buyers routinely struggle with inconsistent colour and flavour batch to batch, unclear minimums, and missing documentation when auditors ask. The opportunity sits with supply that is single-origin, lab-tested and documented — where a consistent spec is guaranteed, not hoped for."),
        ],
      },
      {
        heading: E("The tencha squeeze — why matcha is getting expensive"),
        body: [
          E("Behind every tin of matcha is tencha, the shade-grown leaf it is milled from. Tencha has risen roughly 80–90% versus last year's harvest, according to Superfoods Partners' sourcing desk — a jump that flows straight through to finished matcha and is pushing consistent supply out of reach for many buyers."),
          E("The driver is demand. Tencha farms set the price, and with global matcha demand up sharply year over year they are raising it, while harvest conditions add further swing. That is exactly why leaning on a single country is a risk — it leaves a buyer fully exposed to one harvest and one price. Working directly with farms, and sourcing across more than one origin, is how we build back some control over price and production rather than simply passing the increase on."),
        ],
      },
      {
        heading: E("The sourcing standards behind supply"),
        body: [
          E("Meeting that demand at scale runs on a few concrete standards. Orders typically start at 25 kg and run to a full container, with samples first so buyers approve the material before committing. Lead times run 2–4 weeks, routed through a single hub, on FOB, CIF or DDP terms. And every batch should carry a full lab panel and documentation — the difference between a good sample and a supply you can build a product line on."),
        ],
      },
      {
        heading: E("Methodology"),
        body: [
          E("Demand figures are drawn from Google search data for the United States, 2026. Year-over-year interest is Google Trends relative search interest (US, 2025 versus 2024 average) — an index of interest, not absolute volume. Tencha and matcha price movement is reported by Superfoods Partners' sourcing desk versus the prior harvest. Sourcing standards reflect our operating practice as a B2B sourcing partner. Figures are indicative of demand, trend and process — not a price quotation."),
        ],
      },
    ],
    keyFacts: [
      { label: E("Matcha demand"), value: E("800,000+ US searches / month") },
      { label: E("Matcha interest"), value: E("+89% YoY (2025 vs 2024)") },
      { label: E("Tencha price"), value: E("+80–90% vs last harvest") },
      { label: E("Ube interest"), value: E("+16% YoY (2025 vs 2024)") },
      { label: E("Source"), value: E("Google Trends · US · 2026") },
    ],
    tables: [
      {
        title: "Demand & price trends, year over year",
        columns: ["Signal", "Change", "Basis"],
        rows: [
          ["Matcha — search interest", "+89%", "2025 vs 2024, US (Google Trends)"],
          ["Ube — search interest", "+16%", "2025 vs 2024, US (Google Trends)"],
          ["Tencha — price", "+80–90%", "vs last year's harvest (SFP sourcing desk)"],
        ],
        note: "Search interest is a relative index (Google Trends), not absolute volume. Tencha price movement per Superfoods Partners' sourcing desk.",
      },
      {
        title: "B2B sourcing standards",
        columns: ["Parameter", "Standard"],
        rows: [
          ["Minimum order (MOQ)", "From 25 kg to a full container"],
          ["Lead time", "2–4 weeks, routed via Hong Kong"],
          ["Incoterms", "FOB / CIF / DDP"],
          ["Lab testing (every batch)", "Pesticide residue, heavy metals, microbiology, radiation"],
          ["Certifications", "JAS, EU & USDA Organic; HACCP; FSSC 22000"],
          ["Documentation", "Certificate of Analysis + Verification Record per batch"],
          ["Sampling", "Samples before bulk — approve material before scaling"],
        ],
        note: "Superfoods Partners operating standards, 2026.",
      },
    ],
    faqs: [
      {
        q: E("Where does the demand data come from?"),
        a: E("Demand figures are drawn from Google search data, including Google Trends, for the United States in 2026. Tencha and matcha price movement is reported by our own sourcing desk; sourcing standards reflect our operating practice."),
      },
      {
        q: E("Can I cite this report?"),
        a: E("Yes — please do. Journalists, analysts and buyers are welcome to cite these figures with attribution to Superfoods Partners and a link to this page. For the underlying detail or a comment, contact us."),
      },
    ],
    relatedProducts: ["matcha", "ube", "lions-mane"],
  },
];
