// "Optimise for SEO": (a) keyword research with DataforSEO in the site's main markets → 1 primary + 3–5 secondary
// keywords, (b) Claude rewrites the English draft for search (keeping the writer's voice and facts) and returns strict
// JSON; (c) Claude translates the result into every other live locale (one request per locale, run in parallel by
// the Studio so no single request runs long).
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { LOCALE_NAMES, SITES, productsFor, slugify } from "./config";
import type { Block, ImageRef, Keyword, LocaleCopy, SeoData, StudioPost } from "./types";
import { devMocks } from "./env";
import { stripInline } from "./inline";

export const MODEL = "claude-sonnet-5-5";

export class NotConfigured extends Error {
  constructor(public what: string) {
    super(`${what} is not configured yet.`);
  }
}

// ---------------------------------------------------------------- keywords (DataforSEO)

const STOP = new Set(
  "a an and are as at be by can do does for from how in into is it its of on or our the their this to vs what when where which who why with your you we best guide".split(" "),
);
const tokens = (s: string) =>
  stripInline(s)
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => (t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t));

function seedsFor(p: StudioPost) {
  const en = p.locales.en;
  const products = productsFor(p.site, p.products).map((x) => x.seed);
  const titleSeed = stripInline(en?.title ?? "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .slice(0, 5)
    .join(" ");
  return [...new Set([titleSeed, ...products].filter(Boolean))].slice(0, 6);
}

type DfsItem = { keyword: string; keyword_info?: { search_volume?: number | null } };

async function dataforseo(path: string, task: Record<string, unknown>) {
  const auth = Buffer.from(`${process.env.DATAFORSEO_USERNAME}:${process.env.DATAFORSEO_PASSWORD}`).toString("base64");
  const res = await fetch(`https://api.dataforseo.com/v3/${path}`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify([task]),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`DataforSEO ${res.status}`);
  const j = (await res.json()) as { status_code: number; status_message: string; cost?: number; tasks?: { status_code: number; status_message: string; result?: { items?: DfsItem[] }[] }[] };
  const t = j.tasks?.[0];
  if (j.status_code !== 20000 || !t || t.status_code !== 20000) throw new Error(`DataforSEO: ${t?.status_message ?? j.status_message}`);
  return { items: t.result?.[0]?.items ?? [], cost: j.cost ?? 0 };
}

export async function researchKeywords(p: StudioPost): Promise<SeoData> {
  const s = SITES[p.site];
  const seeds = seedsFor(p);
  const en = p.locales.en;
  const context = new Set(tokens([en?.title, en?.lede, ...(en?.blocks ?? []).map((b) => ("text" in b ? b.text : "")), ...seeds].join(" ")));
  const notes: string[] = [];
  let merged = new Map<string, { volume: number; parts: string[] }>();
  let mocked = false;

  if (process.env.DATAFORSEO_USERNAME && process.env.DATAFORSEO_PASSWORD) {
    const results = await Promise.all(
      s.markets.map((m) =>
        dataforseo("dataforseo_labs/google/keyword_ideas/live", {
          keywords: seeds,
          location_code: m.location,
          language_code: m.language,
          limit: 100,
          order_by: ["keyword_info.search_volume,desc"],
        }).then((r) => ({ m, ...r })),
      ),
    );
    for (const { m, items } of results)
      for (const it of items) {
        const v = it.keyword_info?.search_volume ?? 0;
        const e = merged.get(it.keyword) ?? { volume: 0, parts: [] };
        e.volume += v;
        e.parts.push(`${m.label === "United States" ? "US" : m.label === "United Kingdom" ? "UK" : m.label} ${v.toLocaleString("en")}`);
        merged.set(it.keyword, e);
      }
    notes.push(`Keyword ideas from DataforSEO (Google, ${s.markets.map((m) => m.label).join(" + ")}).`);
  } else if (devMocks()) {
    mocked = true;
    merged = new Map(seeds.flatMap((sd, i) => [
      [sd, { volume: 1900 - i * 300, parts: ["mock"] }],
      [`${sd} wholesale`, { volume: 590 - i * 70, parts: ["mock"] }],
      [`${sd} supplier`, { volume: 480 - i * 60, parts: ["mock"] }],
      [`bulk ${sd}`, { volume: 260 - i * 30, parts: ["mock"] }],
      [`what is ${sd}`, { volume: 880 - i * 90, parts: ["mock"] }],
    ]));
    notes.push("Mocked keyword volumes (local test mode — DataforSEO is not configured).");
  } else {
    notes.push("DataforSEO is not configured yet: keywords are based on the selected products, without search volumes.");
  }

  const scored = [...merged.entries()]
    .filter(([k]) => !s.forbiddenKeyword.test(k))
    .map(([keyword, e]) => {
      const t = tokens(keyword);
      const rel = t.length ? t.filter((x) => context.has(x)).length / t.length : 0;
      return { keyword, volume: e.volume, market: e.parts.join(" · "), score: rel * rel * Math.log10(e.volume + 10), rel };
    })
    .filter((x) => x.rel >= 0.5 && x.volume > 0)
    .sort((a, b) => b.score - a.score);

  const candidates: Keyword[] = scored.slice(0, 25).map(({ keyword, volume, market }) => ({ keyword, volume, market }));
  let primary: Keyword | null = candidates[0] ?? null;
  const secondary: Keyword[] = [];
  const seen = new Set<string>(primary ? [tokens(primary.keyword).sort().join(" ")] : []);
  for (const c of candidates.slice(1)) {
    const key = tokens(c.keyword).sort().join(" ");
    if (seen.has(key)) continue;
    seen.add(key);
    secondary.push(c);
    if (secondary.length >= 5) break;
  }
  if (!primary) {
    const fallback = seeds.filter((x) => !s.forbiddenKeyword.test(x));
    primary = fallback[0] ? { keyword: fallback[0], volume: null } : null;
    for (const k of fallback.slice(1, 5)) secondary.push({ keyword: k, volume: null });
    if (merged.size) notes.push("No keyword idea matched the draft closely; using the product terms.");
  }
  return { primary, secondary: secondary.slice(0, Math.max(3, Math.min(5, secondary.length))), candidates, generatedAt: new Date().toISOString(), mocked, notes };
}

// ---------------------------------------------------------------- Claude

const BlockOut = z.object({
  type: z.enum(["heading", "paragraph", "list", "quote", "image"]),
  level: z.number().int().describe("2 or 3 for headings, 0 for every other type"),
  text: z.string().describe("heading/paragraph/quote text with inline **bold**, *italic*, [label](/path); empty for list and image"),
  items: z.array(z.string()).describe("list items (inline markup allowed); empty array for other types"),
  ordered: z.boolean(),
  imageRef: z.number().int().describe("for image blocks: the imageRef of the input image (unchanged); -1 otherwise"),
  alt: z.string().describe("image alt text; empty for other types"),
  caption: z.string().describe("image caption; empty when none"),
  cite: z.string().describe("quote attribution; empty when none"),
});

const CopyOut = z.object({
  slug: z.string().describe("English slug, lowercase words joined by hyphens, max ~6 words, primary keyword first"),
  title: z.string(),
  metaTitle: z.string().describe("max 60 characters, primary keyword first"),
  metaDescription: z.string().describe("max 155 characters"),
  summary: z.string().describe("1–2 sentences for overview cards"),
  lede: z.string().describe("first paragraph that answers the search question directly"),
  blocks: z.array(BlockOut),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).describe("3–5 FAQs"),
  headerAlt: z.string(),
  gallery: z.array(z.object({ alt: z.string(), caption: z.string() })).describe("one entry per input gallery photo, same order"),
  videoTitle: z.string(),
  internalLinks: z.array(z.object({ path: z.string(), anchor: z.string() })).describe("the internal links you placed in the text"),
  notes: z.array(z.string()).describe("short notes for the writer: what changed and anything they should check; empty if nothing"),
});
type CopyOutT = z.infer<typeof CopyOut>;

function systemPrompt(site: StudioPost["site"]) {
  const s = SITES[site];
  return `You are the SEO editor for ${s.name} (${s.host}), a B2B ingredient supplier. Writers on the team draft blog posts; you optimise them for Google and for AI answer engines while keeping them recognisably the writer's own article.

Audience: B2B buyers (cafés, food and beverage brands, private label brands, distributors, manufacturers).

Rules — never break these:
- Keep the writer's voice, structure and facts. Improve clarity, headings and keyword use; do not pad.
- Never invent facts, numbers, statistics, test results, customers, partners or certificates. If a claim would need a fact the draft does not contain, leave it out.
- No prices. No health or medical claims (no "boosts immunity", "lowers blood sugar", "detox", disease or treatment wording).
- Never write "we buy". Say "we work with growers" or "we source at origin" / "we manage supply at origin".
- No farm names (people's first names are fine if the draft has them).
- ${s.guardrail}
- Inline formatting only as **bold**, *italic* and [label](/path). No HTML, no markdown headings inside text.
- Internal links: only to the paths you are given (English paths, they work in every language). Link each selected product/page once, where it fits naturally, with descriptive anchor text. Do not link the same path twice.
- Image blocks: keep every input image, in the same place and order, with its imageRef unchanged; you may improve alt text (describe the image, include a keyword only if natural) and captions.
- Headings: H2 for main sections, H3 for sub-points. Make them descriptive and keyword-aware.
- The lede (first paragraph) answers the main search question directly in 2–4 sentences — this is what AI answers quote.
- metaTitle ≤ 60 characters, primary keyword first. metaDescription ≤ 155 characters, answers the query and invites the click.
- FAQs: 3–5 real questions buyers search for, answered briefly from the article's facts only.

Return only the JSON object described by the schema.`;
}

function draftPayload(p: StudioPost, c: LocaleCopy) {
  const images: ImageRef[] = [];
  const blocks = (c.blocks ?? []).map((b) => {
    if (b.type === "image") {
      images.push(b);
      return { type: "image", imageRef: images.length - 1, alt: b.alt, caption: b.caption ?? "" };
    }
    return b;
  });
  return {
    images,
    payload: {
      title: c.title,
      metaTitle: c.metaTitle,
      metaDescription: c.metaDescription,
      summary: c.summary,
      lede: c.lede,
      blocks,
      faqs: c.faqs ?? [],
      headerAlt: c.headerAlt || p.header?.alt || "",
      gallery: p.gallery.map((g, i) => ({ alt: c.gallery?.[i]?.alt ?? g.alt ?? "", caption: c.gallery?.[i]?.caption ?? g.caption ?? "" })),
      videoTitle: c.videoTitle ?? "",
    },
  };
}

function toCopy(out: CopyOutT, images: ImageRef[]): LocaleCopy {
  const used = new Set<number>();
  const blocks: Block[] = [];
  for (const b of out.blocks) {
    if (b.type === "image") {
      const img = images[b.imageRef];
      if (!img || used.has(b.imageRef)) continue;
      used.add(b.imageRef);
      blocks.push({ type: "image", ...img, alt: b.alt || img.alt, ...(b.caption ? { caption: b.caption } : { caption: undefined }) });
    } else if (b.type === "heading") blocks.push({ type: "heading", level: b.level >= 3 ? 3 : 2, text: stripInline(b.text) });
    else if (b.type === "list") {
      if (b.items.length) blocks.push({ type: "list", ...(b.ordered ? { ordered: true } : {}), items: b.items });
    }
    else if (b.type === "quote") blocks.push({ type: "quote", text: b.text, ...(b.cite ? { cite: b.cite } : {}) });
    else if (b.text.trim()) blocks.push({ type: "paragraph", text: b.text });
  }
  images.forEach((img, i) => !used.has(i) && blocks.push({ type: "image", ...img })); // never lose a photo
  return {
    title: out.title,
    metaTitle: out.metaTitle,
    metaDescription: out.metaDescription,
    summary: out.summary,
    lede: out.lede,
    blocks,
    faqs: out.faqs.filter((f) => f.q.trim() && f.a.trim()),
    headerAlt: out.headerAlt,
    gallery: out.gallery.map((g) => ({ alt: g.alt, ...(g.caption ? { caption: g.caption } : {}) })),
    videoTitle: out.videoTitle || undefined,
  };
}

async function callClaude(system: string, user: string): Promise<CopyOutT> {
  const client = new Anthropic({ maxRetries: 2, timeout: 280_000 });
  // Server-side fallbacks: if the model declines, the API re-runs the same request on a fallback model.
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 32000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: "medium", format: betaZodOutputFormat(CopyOut) },
    system,
    messages: [{ role: "user", content: user }],
  });
  const msg = await stream.finalMessage();
  if (msg.stop_reason === "refusal") throw new Error("The model declined this request. Try rephrasing the draft or contact Leonard.");
  if (msg.stop_reason === "max_tokens") throw new Error("The answer was cut off (too long). Try a shorter draft.");
  const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  const parsed = CopyOut.safeParse(JSON.parse(text));
  if (!parsed.success) throw new Error("The model returned an unexpected format. Please try again.");
  return parsed.data;
}

export type Suggestion = { slug: string; copy: LocaleCopy; seo: SeoData };

export async function optimise(p: StudioPost): Promise<Suggestion> {
  const en = p.locales.en;
  if (!en?.title?.trim()) throw new Error("Write a title first.");
  const seo = await researchKeywords(p);
  const s = SITES[p.site];
  const { images, payload } = draftPayload(p, en);
  const links = productsFor(p.site, p.products).map((x) => ({ path: x.path, name: x.name }));
  const generalLinks = p.site === "pmp" ? ["/contact", "/faq", "/about"] : ["/contact", "/products", "/verification"];

  if (!process.env.ANTHROPIC_API_KEY) {
    if (!devMocks()) throw new NotConfigured("The AI step (ANTHROPIC_API_KEY)");
    return { ...mockOptimise(p, payload, images, seo, links), seo: { ...seo, mocked: true, notes: [...(seo.notes ?? []), "Mocked AI suggestion (local test mode)."] } };
  }

  const user = `Site: ${s.name} — blog path ${s.blogPath}/<slug>
Primary keyword: ${seo.primary ? `${seo.primary.keyword}${seo.primary.volume != null ? ` (${seo.primary.volume}/month)` : ""}` : "(none — pick the most natural search phrase from the draft)"}
Secondary keywords: ${seo.secondary.map((k) => `${k.keyword}${k.volume != null ? ` (${k.volume})` : ""}`).join("; ") || "(none)"}
Selected products/pages to link: ${JSON.stringify(links)}
Other allowed internal links: ${generalLinks.join(", ")}

Use the primary keyword in the slug, title, metaTitle, lede and one H2, and the secondary keywords naturally where they fit. Keep the language English.

Draft (JSON):
${JSON.stringify(payload, null, 1)}`;
  const out = await callClaude(systemPrompt(p.site), user);
  return {
    slug: slugify(out.slug || out.title),
    copy: toCopy(out, images),
    seo: { ...seo, internalLinks: out.internalLinks, notes: [...(seo.notes ?? []), ...out.notes] },
  };
}

const LOCALE_RULES: Record<string, string> = {
  de: "German. Address the reader formally with Sie (Ihr, Ihnen).",
  es: "Spanish (Spain/international). Address the reader informally with tú.",
  fr: "French. Address the reader formally with vous.",
  pl: "Polish. Address the reader with the polite plural/neutral business form (Państwo or impersonal), as Polish B2B sites do.",
  "zh-Hant":
    "Traditional Chinese (Hong Kong / Taiwan usage). Ube is 紫山藥粉 (ube powder = 紫山藥粉) — never 紫薯 or 芋頭 for ube. Keep Latin product names where the site does (e.g. COA).",
};

export async function translate(p: StudioPost, locale: string): Promise<LocaleCopy> {
  const s = SITES[p.site];
  if (!s.locales.includes(locale) || locale === "en") throw new Error("Unknown language");
  const en = p.locales.en;
  if (!en?.title) throw new Error("The English text is empty.");
  const { images, payload } = draftPayload(p, en);
  if (!process.env.ANTHROPIC_API_KEY) {
    if (!devMocks()) throw new NotConfigured("The AI step (ANTHROPIC_API_KEY)");
    return mockTranslate(payload, images, locale);
  }
  const keywords = p.seo?.primary ? [p.seo.primary, ...p.seo.secondary].map((k) => k.keyword) : [];
  const user = `Translate this ${s.name} blog post from English into ${LOCALE_NAMES[locale]} (${locale}).

Language rules: ${LOCALE_RULES[locale] ?? ""}
- Translate naturally for B2B buyers in that market, as a native SEO copywriter would: use the search terms buyers in that language actually use for the English keywords (${keywords.join("; ") || "see the text"}), in the title, metaTitle, lede and one heading.
- metaTitle ≤ 60 characters, metaDescription ≤ 155 characters (characters, not bytes).
- Keep every block in the same order and type; translate text, list items, alt texts, captions, FAQs. Keep imageRef values.
- Keep link paths exactly as they are (English paths) and translate only the anchor text: [translated label](/same/path).
- Keep **bold** / *italic* markup on the matching words. Keep numbers, units and product names as in the English text.
- Same rules as the English article: no prices, no health or medical claims, never "we buy", no farm names, no new facts.
- slug: return the English slug unchanged ("${p.slug}"). internalLinks: the links in your translation. notes: anything the writer should check.

English post (JSON):
${JSON.stringify(payload, null, 1)}`;
  const out = await callClaude(systemPrompt(p.site), user);
  return toCopy(out, images);
}

// ---------------------------------------------------------------- local test mode

function mockOptimise(p: StudioPost, payload: ReturnType<typeof draftPayload>["payload"], images: ImageRef[], seo: SeoData, links: { path: string; name: string }[]): Suggestion {
  const kw = seo.primary?.keyword ?? "";
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const title = kw && !payload.title.toLowerCase().includes(kw) ? `${cap(kw)}: ${payload.title}` : payload.title;
  const blocks = payload.blocks.map((b, i) => {
    const bb = b as Block & { imageRef?: number };
    if (bb.type === "heading" && i === 0 && kw) return { ...bb, text: `${bb.text} (${kw})` };
    if (bb.type === "paragraph" && links[0] && !bb.text.includes("](")) {
      links.shift();
      return { ...bb, text: `${bb.text} See our [${(p.products.length && productsFor(p.site, p.products)[0]?.name) || "range"}](${productsFor(p.site, p.products)[0]?.path ?? "/contact"}).` };
    }
    return bb;
  });
  const out: CopyOutT = {
    slug: slugify(kw || payload.title),
    title,
    metaTitle: title.slice(0, 60),
    metaDescription: (stripInline(payload.lede) || title).slice(0, 152) + (payload.lede.length > 152 ? "…" : ""),
    summary: stripInline(payload.lede).split(/(?<=\.)\s/)[0] ?? title,
    lede: payload.lede ? `${payload.lede}` : `${title}.`,
    blocks: blocks.map((b) => {
      const x = b as Block & { imageRef?: number };
      return {
        type: x.type as "heading",
        level: x.type === "heading" ? x.level : 0,
        text: "text" in x ? x.text : "",
        items: x.type === "list" ? x.items : [],
        ordered: x.type === "list" ? !!x.ordered : false,
        imageRef: x.imageRef ?? -1,
        alt: "alt" in x ? String(x.alt) : "",
        caption: "caption" in x ? String(x.caption ?? "") : "",
        cite: x.type === "quote" ? (x.cite ?? "") : "",
      };
    }),
    faqs: [
      { q: `What is ${kw || "this"}?`, a: stripInline(payload.lede).slice(0, 200) || "See the article." },
      { q: "How do I request samples?", a: "Ask for samples on the [contact page](/contact)." },
      { q: "Which documents come with each batch?", a: "Each batch ships with its documentation; ask us for details." },
    ],
    headerAlt: payload.headerAlt || title,
    gallery: payload.gallery,
    videoTitle: payload.videoTitle,
    internalLinks: productsFor(p.site, p.products).slice(0, 1).map((x) => ({ path: x.path, anchor: x.name })),
    notes: ["Mock suggestion: keyword added to the title and the first heading, one internal link added."],
  };
  return { slug: out.slug, copy: toCopy(out, images), seo };
}

function mockTranslate(payload: ReturnType<typeof draftPayload>["payload"], images: ImageRef[], locale: string): LocaleCopy {
  const t = (s: string) => (s ? `[${locale}] ${s}` : s);
  return {
    title: t(payload.title),
    metaTitle: t(payload.metaTitle).slice(0, 60),
    metaDescription: t(payload.metaDescription).slice(0, 155),
    summary: t(payload.summary),
    lede: t(payload.lede),
    blocks: payload.blocks.map((b) => {
      const x = b as Block & { imageRef?: number };
      if (x.type === "image") return { type: "image" as const, ...images[x.imageRef ?? 0], alt: t(x.alt) };
      if (x.type === "list") return { ...x, items: x.items.map(t) };
      if (x.type === "heading" || x.type === "paragraph" || x.type === "quote") return { ...x, text: t(x.text) };
      return x;
    }),
    faqs: payload.faqs.map((f) => ({ q: t(f.q), a: t(f.a) })),
    headerAlt: t(payload.headerAlt),
    gallery: payload.gallery.map((g) => ({ alt: t(g.alt), caption: t(g.caption) })),
    videoTitle: payload.videoTitle ? t(payload.videoTitle) : undefined,
  };
}
