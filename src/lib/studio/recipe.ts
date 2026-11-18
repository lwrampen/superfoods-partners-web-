// Recipes in Blog Studio: helpers shared by the editor (client) and the server. No Node imports.
import type { IngredientGroup, LocaleCopy, StudioPost } from "./types";

export const isRecipe = (p: Pick<StudioPost, "kind">) => p.kind === "recipe";

// Ingredients are edited as plain text: one ingredient per line; a line starting with "#" starts a group
// ("# For the filling"). Lines before the first "#" form a group without a heading.
export function ingredientsToText(groups: IngredientGroup[] | undefined): string {
  return (groups ?? []).map((g) => [g.heading ? `# ${g.heading}` : null, ...g.items].filter((x) => x !== null).join("\n")).join("\n\n");
}
export function textToIngredients(text: string): IngredientGroup[] {
  const out: IngredientGroup[] = [];
  let cur: IngredientGroup = { items: [] };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("#")) {
      if (cur.items.length || cur.heading) out.push(cur);
      cur = { heading: line.replace(/^#+\s*/, ""), items: [] };
    } else cur.items.push(line.replace(/^[-•*]\s+/, ""));
  }
  if (cur.items.length || cur.heading) out.push(cur);
  return out.map((g) => (g.heading ? g : { items: g.items }));
}

// Steps and tips: one per line (a long step simply wraps). Leading "1." / "-" markers are dropped.
export const linesToList = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim().replace(/^(\d+[.)]|[-•*])\s+/, ""))
    .filter(Boolean);
export const listToLines = (items: string[] | undefined) => (items ?? []).join("\n");

export const ingredientCount = (c: LocaleCopy | undefined) => (c?.ingredients ?? []).reduce((n, g) => n + g.items.length, 0);
