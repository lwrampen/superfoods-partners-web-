import type { LocaleContent, ProductText } from "./content.i18n";

// Traditional Chinese content overrides. English lives in catalog.ts; the
// localize* helpers in content.i18n.ts merge these in for locale "zh-Hant".
// Structural fields (slug, code, colours, img, originSlugs, forms, certs,
// coords) are never translated.

export const PRODUCTS_ZH: Record<string, ProductText> = {
  "matcha": {
    "tagline": "石臼研磨綠茶,源頭遮蔭栽培。",
    "description": "單一產地的鮮亮抹茶,分儀式級、premium 與料理級。遮蔭栽培、石臼研磨,每一批次皆經實驗室檢測——自樣品至整櫃。",
    "intro": "抹茶是一種石臼研磨的綠茶,採收前遮蔭數週,以孕育深厚的鮮味與鮮亮的色澤。我們供應來自日本與中國的單一產地抹茶,分儀式級、premium 與料理級——遮蔭栽培、石臼研磨,並逐批經實驗室檢測,自樣品至整櫃,皆經由我們的香港樞紐轉運。",
    "applications": [
      "拿鐵與抹茶吧",
      "即飲與瓶裝飲品",
      "烘焙與甜點",
      "冰淇淋與甜品",
      "保健品與膠囊",
      "自有品牌"
    ],
    "specs": [
      { "label": "外觀", "value": "細緻綠色粉末" },
      { "label": "來源", "value": "遮蔭栽培綠茶(Camellia sinensis)" },
      { "label": "等級", "value": "儀式級 · Premium · 料理級" },
      { "label": "產地", "value": "日本 · 中國" },
      { "label": "包裝", "value": "1 公斤袋裝 → 25 公斤 / 整櫃" },
      { "label": "文件", "value": "COA + Verification Record™,逐批" }
    ],
    "gradeNotes": [
      { "grade": "Ceremonial", "use": "直接以水點茶——鮮綠、自然回甘、口感細緻。適用於高級拿鐵、抹茶吧與純飲。" },
      { "grade": "Premium", "use": "日常主力——色澤與風味均衡，適合咖啡館、即飲飲品與規模化的每日菜單。" },
      { "grade": "Culinary", "use": "即使搭配其他食材也能維持色澤與厚度——適合烘焙、冰淇淋、甜點與保健品。" },
    ]
  },
  "hojicha": {
    "tagline": "烘焙綠茶——低咖啡因,香氣深沉。",
    "description": "以炭火烘焙的日本綠茶,風味溫暖而帶焙香。天然適合拿鐵、烘焙與即飲應用。",
    "intro": "焙茶是以炭火烘焙的日本綠茶,烘焙使咖啡因變得溫和,並帶出溫暖的焙香。我們供應焙茶粉,研磨至色澤與風味一致——適合拿鐵、烘焙與即飲——採購自日本與華東,並經由我們的香港樞紐逐批記錄。",
    "applications": [
      "拿鐵與焙茶吧",
      "即飲與瓶裝飲品",
      "烘焙與甜點",
      "冰淇淋與甜品",
      "巧克力與糖果",
      "自有品牌"
    ],
    "specs": [
      { "label": "外觀", "value": "溫暖棕色粉末" },
      { "label": "來源", "value": "烘焙綠茶(Camellia sinensis)" },
      { "label": "等級", "value": "有機 · 常規" },
      { "label": "產地", "value": "日本 · 華東" },
      { "label": "咖啡因", "value": "天然偏低" },
      { "label": "文件", "value": "COA + Verification Record™,逐批" }
    ]
  },
  "ube": {
    "tagline": "紫山藥粉——來自菲律賓的色澤與風味。",
    "description": "天然濃郁的紫山藥粉,用於飲品、烘焙與糖果。色澤純淨、粒徑一致、供應可擴充。",
    "intro": "Ube 是紫山藥的塊莖,呈濃郁紫色,已從菲律賓廚房走上世界各地的菜單。我們的紫山藥粉以成熟的紫山藥(Dioscorea alata)研磨而成——呈現純淨、天然的紫色與細緻的香草般甜香,不含人工色素。我們直接在菲律賓採購,並以中國為擴充規模的轉運路線,於經香港樞紐出貨前逐批檢測與記錄。",
    "applications": [
      "拿鐵與即飲飲品",
      "烘焙與麵包",
      "冰淇淋與 gelato",
      "糖果與內餡",
      "起司蛋糕與甜品",
      "鬆餅與格子鬆餅"
    ],
    "specs": [
      { "label": "外觀", "value": "細緻紫色粉末" },
      { "label": "來源", "value": "紫山藥(Dioscorea alata)" },
      { "label": "產地", "value": "菲律賓 · 中國" },
      { "label": "咖啡因", "value": "無咖啡因" },
      { "label": "包裝", "value": "1 公斤袋裝 → 25 公斤 / 整櫃" },
      { "label": "文件", "value": "COA + Verification Record™,逐批" }
    ]
  },
  "lions-mane": {
    "tagline": "供營養補充配方的機能性菇類。",
    "description": "取自子實體的猴頭菇,供保健品與機能性食品品牌。檢測活性成分與污染物,逐批記錄。",
    "intro": "猴頭菇(Hericium erinaceus)是營養補充品牌指名採用的機能性菇類。我們供應子實體粉末——而非穀物上的菌絲體——讓配方師從乾淨、有記錄的原料出發,並檢測活性成分與污染物。採購自中國,逐批檢測並經由我們的香港樞紐轉運,提供有機與常規等級。",
    "applications": [
      "膠囊與錠劑",
      "機能性咖啡與拿鐵",
      "益智(nootropic)配方",
      "粉末與隨手包",
      "軟糖",
      "機能性食品"
    ],
    "specs": [
      { "label": "外觀", "value": "乳白至淺褐色粉末" },
      { "label": "來源", "value": "子實體(Hericium erinaceus)" },
      { "label": "產地", "value": "中國" },
      { "label": "等級", "value": "有機 · 常規" },
      { "label": "萃取", "value": "粉末或萃取比例(可依需求)" },
      { "label": "文件", "value": "COA + Verification Record™,逐批" }
    ]
  },
  "hibiscus": {
    "tagline": "紅寶石般酸香的花朵,用於茶飲與飲品。",
    "description": "深紅色洛神花,用於沖泡、即飲與調配。大宗採購,經檢測與記錄。",
    "intro": "洛神花(Hibiscus sabdariffa)帶來深邃的紅寶石色澤與如蔓越莓般鮮明的酸香,無論在飲品或烘焙中都表現出色。我們採購日曬成熟的花萼——主要來自埃及,並以華東為衝量的轉運路線——研磨為均勻的粉末,於經香港轉運前逐批檢測與記錄。",
    "applications": [
      "茶飲與沖泡",
      "即飲與機能性飲品",
      "天然紅色色素",
      "烘焙與糖果",
      "糖漿與濃糖飲露",
      "優格與甜品"
    ],
    "specs": [
      { "label": "外觀", "value": "深紅色粉末" },
      { "label": "來源", "value": "洛神花(Hibiscus sabdariffa)花萼" },
      { "label": "產地", "value": "埃及 · 華東" },
      { "label": "咖啡因", "value": "無咖啡因" },
      { "label": "包裝", "value": "1 公斤袋裝 → 25 公斤 / 整櫃" },
      { "label": "文件", "value": "COA + Verification Record™,逐批" }
    ]
  },
  "jasmine-tea-powder": {
    "tagline": "茉莉花香綠茶,細緻研磨。",
    "description": "以真實茉莉花層層薰製的綠茶粉——花香馥郁、尾韻柔和。用於拿鐵、即飲、烘焙與調配。大宗採購,逐批檢測與記錄。",
    "intro": "茉莉花茶粉是以真實茉莉花層層薰製的綠茶,再細緻研磨而成——帶來馥郁花香與純淨柔和的尾韻。我們採購自華東與福建——中國經典的茉莉花產區——並於經香港樞紐出貨前逐批檢測與記錄。",
    "applications": [
      "拿鐵與茶吧",
      "即飲與瓶裝飲品",
      "烘焙與甜點",
      "冰淇淋與甜品",
      "調酒與無酒精調飲",
      "自有品牌"
    ],
    "specs": [
      { "label": "外觀", "value": "細緻綠色粉末" },
      { "label": "來源", "value": "茉莉花香綠茶" },
      { "label": "等級", "value": "有機 · 常規" },
      { "label": "產地", "value": "華東 · 福建" },
      { "label": "包裝", "value": "1 公斤袋裝 → 25 公斤 / 整櫃" },
      { "label": "文件", "value": "COA + Verification Record™,逐批" }
    ]
  },
  "oolong-tea-powder": {
    "tagline": "半發酵茶,烘焙後細緻研磨。",
    "description": "全葉烏龍,細緻研磨——焙香、花香而層次豐富。半發酵於中國經典烏龍產區。用於特色拿鐵、即飲與甜點應用。",
    "intro": "烏龍是一種半發酵茶——介於綠茶與紅茶之間——帶有焙香與花香的層次。我們將來自中國經典烏龍產區的全葉烏龍研磨為細緻粉末,用於特色拿鐵、即飲與甜點製作,並經由我們的香港樞紐逐批檢測與記錄。",
    "applications": [
      "特色拿鐵",
      "即飲與瓶裝飲品",
      "烘焙與甜點",
      "冰淇淋與甜品",
      "調酒與無酒精調飲",
      "自有品牌"
    ],
    "specs": [
      { "label": "外觀", "value": "琥珀色粉末" },
      { "label": "來源", "value": "全葉半發酵茶" },
      { "label": "等級", "value": "有機 · 常規" },
      { "label": "產地", "value": "華東 · 福建" },
      { "label": "包裝", "value": "1 公斤袋裝 → 25 公斤 / 整櫃" },
      { "label": "文件", "value": "COA + Verification Record™,逐批" }
    ]
  },
  "earl-grey-tea-powder": {
    "tagline": "帶天然佛手柑的紅茶,細緻研磨。",
    "description": "以天然佛手柑油調製的紅茶粉——濃郁、柑橘鮮明而芳香。是拿鐵、烘焙與飲品創新的獨特基底。逐批採購與記錄。",
    "intro": "伯爵茶是帶天然佛手柑的紅茶——濃郁、柑橘鮮明且辨識度極高。我們將它研磨為細緻粉末,把香氣帶入拿鐵、烘焙與飲品創新,採購自華東與福建,並經由我們的香港樞紐逐批記錄。",
    "applications": [
      "拿鐵與茶吧",
      "即飲與瓶裝飲品",
      "烘焙與甜點",
      "冰淇淋與甜品",
      "調酒與無酒精調飲",
      "自有品牌"
    ],
    "specs": [
      { "label": "外觀", "value": "細緻深色粉末" },
      { "label": "來源", "value": "帶天然佛手柑的紅茶" },
      { "label": "等級", "value": "常規" },
      { "label": "產地", "value": "華東 · 福建" },
      { "label": "包裝", "value": "1 公斤袋裝 → 25 公斤 / 整櫃" },
      { "label": "文件", "value": "COA + Verification Record™,逐批" }
    ]
  }
};

export const CATEGORY_ZH: Record<string, string> = {
  "Matcha": "抹茶",
  "Hojicha": "焙茶",
  "Specialty Teas": "特色茶",
  "Superfoods": "超級食物"
};
export const ORIGIN_NAME_ZH: Record<string, string> = {
  "east-china-cn": "華東",
  "south-china-cn": "華南",
  "philippines-ph": "菲律賓",
  "egypt-eg": "埃及"
};
export const COUNTRY_ZH: Record<string, string> = {
  "Japan": "日本",
  "China": "中國",
  "Philippines": "菲律賓",
  "Egypt": "埃及"
};
export const FORM_ZH: Record<string, string> = {
  "Organic": "有機",
  "Conventional": "常規"
};
export const ORIGIN_BLURB_ZH: Record<string, string> = {
  "uji-jp": "鄰近京都——日本茶的歷史發祥地;遮蔭茶園,鮮味深厚。",
  "shizuoka-jp": "日本最大的茶產區;規模下品質穩定可靠。",
  "kagoshima-jp": "日本南部火山地帶;礦物豐富的土壤,採收較早。",
  "nara-jp": "奈良附近的大和茶區;茶葉柔和而均衡。",
  "gifu-jp": "日本中部山區茶園;風味純淨清新。",
  "ibaraki-jp": "日本東部;茶葉濃郁飽滿。",
  "kyoto-jp": "京都府——日本茶的文化原鄉。",
  "east-china-cn": "華東茶帶;衝量下供應廣泛而一致。",
  "south-china-cn": "華南;氣候溫暖,茶葉芳香。",
  "fujian-cn": "福建——中國綠茶、烏龍與茉莉的經典產區。",
  "china-cn": "採購自中國各地;逐批檢測與記錄。",
  "philippines-ph": "菲律賓高地;收成鮮明而天然帶甜。",
  "egypt-eg": "沿尼羅河日曬成熟;色澤深邃,酸香鮮明。"
};
export const ORIGIN_INTRO_ZH: Record<string, string> = {
  "china-cn": "除了茶葉,中國更是全球最大且最具實力的機能性與特色作物產地之一——從猴頭菇及其他菇類,到紫山藥與植物粉末。就這些產品線,我們採用經驗證的中國供應,逐批檢測農藥殘留、重金屬與微生物污染,並在貨物離開我們的香港樞紐前以 Verification Record™ 完成記錄。當一項計畫需要真正的規模化又不願失去可追溯性時,這正是我們仰賴的路線。",
  "egypt-eg": "尼羅河灌溉的埃及田野是洛神花(Hibiscus sabdariffa)的經典發源地。漫長的日照為花萼賦予深邃的紅寶石色澤與鮮明純淨的酸香。我們採購日曬成熟的埃及洛神花,研磨為均勻粉末,並在記錄與經香港轉運前逐批檢測污染物——讓您取樣時所見的色澤與酸香,正是您衝量時所收到的色澤與酸香。"
};

export const ZH: LocaleContent = {
  products: PRODUCTS_ZH,
  category: CATEGORY_ZH,
  originName: ORIGIN_NAME_ZH,
  country: COUNTRY_ZH,
  form: FORM_ZH,
  blurb: ORIGIN_BLURB_ZH,
  intro: ORIGIN_INTRO_ZH,
};
