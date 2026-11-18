// Checks before a post can be scheduled or published (shared by the Studio UI and the server).
import { SITES } from "./config";
import type { StudioPost } from "./types";
import { ingredientCount, isRecipe } from "./recipe";

export type ValidationIssue = { field: string; message: string };

export function validateForPublish(p: StudioPost): ValidationIssue[] {
  const s = SITES[p.site];
  const out: ValidationIssue[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) out.push({ field: "slug", message: "Slug: lowercase letters, numbers and hyphens only." });
  if (!p.header?.src) out.push({ field: "header", message: "Add a header image." });
  if (!p.author) out.push({ field: "author", message: "Author is missing." });
  for (const l of s.locales) {
    const c = p.locales[l];
    const name = l === "en" ? "English" : l;
    if (!c?.title?.trim()) {
      out.push({ field: `locales.${l}`, message: l === "en" ? "Add a title." : `The ${name} translation is missing (run Optimise for SEO or Translate).` });
      continue;
    }
    if (!c.metaTitle?.trim() || !c.metaDescription?.trim()) out.push({ field: `locales.${l}`, message: `${name}: meta title and meta description are needed.` });
    if (!c.lede?.trim()) out.push({ field: `locales.${l}`, message: `${name}: the opening paragraph (lede) is empty.` });
    if (isRecipe(p)) {
      if (!ingredientCount(c)) out.push({ field: `locales.${l}`, message: `${name}: add the ingredients.` });
      if (!c.steps?.length) out.push({ field: `locales.${l}`, message: `${name}: add the method (steps).` });
    } else if (!c.blocks?.length) out.push({ field: `locales.${l}`, message: `${name}: the article has no body text.` });
  }
  return out;
}

