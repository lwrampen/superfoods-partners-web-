// Blog Studio posts for Insights: one JSON file per post in content/insights/<slug>.json, every locale in the file
// (same block format as the Pure Matcha Partners blog). Mapped onto InsightPost so the overview, sitemap, product pages
// and the post page treat them exactly like the hand-written posts in insights.ts. Read at build time (the post pages
// are statically generated).
import fs from "node:fs";
import path from "node:path";
import type { InsightPost, Loc } from "./insights";
import type { Block } from "@/lib/studio/types";
import { TEAM } from "./trust";
import de from "../../messages/de.json";
import es from "../../messages/es.json";
import fr from "../../messages/fr.json";
import pl from "../../messages/pl.json";
import zh from "../../messages/zh-Hant.json";

const LOCALES = ["en", "de", "es", "fr", "pl", "zh-Hant"] as const;
const ROLES: Record<string, Record<string, string>> = { de: de.roles, es: es.roles, fr: fr.roles, pl: pl.roles, "zh-Hant": zh.roles };

// category names as used on the existing posts
const CATEGORIES: Record<string, string[]> = {
  "Buyer's guide": ["Einkaufsratgeber", "Guía de compra", "Guide d'achat", "Przewodnik kupującego", "採購指南"],
  Guide: ["Ratgeber", "Guía", "Guide", "Przewodnik", "指南"],
  "Ingredient guide": ["Zutaten-Ratgeber", "Guía de ingredientes", "Guide des ingrédients", "Przewodnik po składnikach", "原料指南"],
  Formulation: ["Formulierung", "Formulación", "Formulation", "Formulacja", "配方"],
  Origin: ["Ursprung", "Origen", "Origine", "Pochodzenie", "產地"],
  Report: ["Bericht", "Informe", "Rapport", "Raport", "報告"],
};

type Copy = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  lede: string;
  imageAlt?: string;
  blocks: Block[];
  faqs?: { q: string; a: string }[];
};
export type JsonPost = {
  slug: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  relatedProducts?: string[];
  keywords?: { primary?: { keyword: string } };
  studio?: { id: string };
} & Partial<Record<(typeof LOCALES)[number], Copy>>;

const loc = (p: JsonPost, f: (c: Copy) => string | undefined): Loc => {
  const out: Loc = {};
  for (const l of LOCALES) {
    const v = p[l] && f(p[l]!);
    if (v) out[l] = v;
  }
  return out;
};

function words(c: Copy) {
  const t = [c.lede, ...c.blocks.flatMap((b) => (b.type === "list" ? b.items : "text" in b ? [b.text] : []))].join(" ");
  const cjk = (t.match(/[㐀-鿿]/g) ?? []).length;
  return t.split(/\s+/).filter(Boolean).length + cjk / 2;
}

export function toInsight(p: JsonPost): InsightPost | null {
  const en = p.en;
  if (!en?.title || !p.slug || !p.date) return null;
  const role = TEAM.find((m) => m.name === p.author)?.role;
  const roleLoc: Loc = role ? { en: role, ...Object.fromEntries(Object.entries(ROLES).map(([l, r]) => [l, r[role] ?? role])) } : { en: "Superfoods Partners" };
  const cat = CATEGORIES[p.category];
  const blocks: Record<string, Block[]> = {};
  for (const l of LOCALES) if (p[l]?.blocks?.length) blocks[l] = p[l]!.blocks;
  return {
    slug: p.slug,
    date: p.date,
    ...(p.updated ? { updated: p.updated } : {}),
    author: p.author,
    readingMins: Math.max(2, Math.round(words(en) / 220)),
    hero: p.image || undefined,
    heroAlt: loc(p, (c) => c.imageAlt || p.imageAlt),
    ...(p.imageWidth && p.imageHeight ? { heroSize: { width: p.imageWidth, height: p.imageHeight } } : {}),
    category: cat ? { en: p.category, de: cat[0], es: cat[1], fr: cat[2], pl: cat[3], "zh-Hant": cat[4] } : { en: p.category },
    authorRole: roleLoc,
    title: loc(p, (c) => c.title),
    metaTitle: loc(p, (c) => c.metaTitle),
    metaDescription: loc(p, (c) => c.metaDescription),
    dek: loc(p, (c) => c.summary),
    lede: loc(p, (c) => c.lede),
    sections: [],
    blocks,
    faqs: (en.faqs ?? []).map((f, i) => ({ q: loc(p, (c) => c.faqs?.[i]?.q ?? (c === en ? f.q : undefined)), a: loc(p, (c) => c.faqs?.[i]?.a ?? (c === en ? f.a : undefined)) })),
    relatedProducts: p.relatedProducts ?? [],
    ...(p.keywords?.primary?.keyword ? { primaryKeyword: p.keywords.primary.keyword } : {}),
    ...(p.studio?.id ? { studioId: p.studio.id } : {}),
  };
}

let cache: InsightPost[] | null = null;
export function jsonPosts(): InsightPost[] {
  if (cache) return cache;
  const dir = path.join(process.cwd(), "content", "insights");
  try {
    cache = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => toInsight(JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as JsonPost))
      .filter((p): p is InsightPost => !!p);
  } catch {
    cache = [];
  }
  return cache;
}
