// Recipes: one JSON file per recipe in content/recipes/<slug>.json, every locale in the file. Written by Blog Studio
// (same inline markup as the Insights posts: **bold**, *italic* and [label](/path)). Read at build time; the recipe
// pages are statically generated. Pure Matcha Partners uses the same file format (content/recipes/ in that repo).
import fs from "node:fs";
import path from "node:path";
import { routing } from "@/i18n/routing";
import type { Block } from "@/lib/studio/types";
import type { Loc } from "./insights";

export const RECIPE_LOCALES = ["en", "de", "es", "fr", "pl", "zh-Hant"] as const;
export const RECIPE_CATEGORIES = ["Drinks", "Bakery", "Desserts", "Frozen", "Snacks"] as const;
export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number];
export type Difficulty = "easy" | "medium" | "advanced";

export type IngredientGroup = { heading?: string; items: string[] };

export type RecipeCopy = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string; // 1–2 sentences for the overview card
  lede: string; // opening paragraph
  imageAlt?: string;
  yield?: string; // e.g. "2 lattes"; falls back to "Serves {servings}"
  ingredients: IngredientGroup[];
  steps: string[];
  tips?: string[];
  blocks?: Block[]; // optional story/background under the method
  faqs?: { q: string; a: string }[];
};

export type RecipeJson = {
  slug: string;
  date: string; // ISO publication date
  updated?: string;
  author: string;
  category: string; // one of RECIPE_CATEGORIES
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  products?: string[]; // product slugs used in the recipe
  servings?: number;
  prepMins?: number;
  cookMins?: number;
  difficulty?: Difficulty;
  keywords?: { primary?: { keyword: string } };
  studio?: { id: string };
} & Partial<Record<(typeof RECIPE_LOCALES)[number], RecipeCopy>>;

export type Recipe = Omit<RecipeJson, (typeof RECIPE_LOCALES)[number]> & {
  copy: Partial<Record<string, RecipeCopy>>;
  title: Loc;
  summary: Loc;
};

export function recipeCopy(r: Recipe, locale: string): RecipeCopy {
  return (r.copy[locale]?.title ? r.copy[locale] : r.copy[routing.defaultLocale])!;
}

function toRecipe(p: RecipeJson): Recipe | null {
  if (!p.slug || !p.date || !p.en?.title || !p.en.steps?.length) return null;
  const copy: Partial<Record<string, RecipeCopy>> = {};
  const title: Loc = {};
  const summary: Loc = {};
  for (const l of RECIPE_LOCALES) {
    const c = p[l];
    if (!c?.title) continue;
    copy[l] = c;
    title[l] = c.title;
    summary[l] = c.summary;
  }
  const base = Object.fromEntries(Object.entries(p).filter(([k]) => !(RECIPE_LOCALES as readonly string[]).includes(k))) as Omit<RecipeJson, (typeof RECIPE_LOCALES)[number]>;
  return { ...base, products: p.products ?? [], copy, title, summary };
}

let cache: Recipe[] | null = null;
export function allRecipes(): Recipe[] {
  if (cache) return cache;
  const dir = path.join(process.cwd(), "content", "recipes");
  try {
    cache = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => toRecipe(JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as RecipeJson))
      .filter((r): r is Recipe => !!r)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    cache = [];
  }
  return cache;
}

export const getRecipe = (slug: string) => allRecipes().find((r) => r.slug === slug);
export const recipesFor = (product: string) => allRecipes().filter((r) => r.products?.includes(product));

// ISO 8601 duration for schema.org (PT15M, PT1H30M)
export function isoDuration(mins?: number) {
  if (!mins || mins <= 0) return undefined;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}`;
}
