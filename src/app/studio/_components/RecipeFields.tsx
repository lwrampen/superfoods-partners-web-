"use client";
import { useState } from "react";
import type { LocaleCopy } from "@/lib/studio/types";
import { ingredientsToText, linesToList, listToLines, textToIngredients } from "@/lib/studio/recipe";
import { Label } from "./ui";

// Ingredients, method, tips and yield of a recipe, in one language. Plain text areas so writers can paste a recipe:
// one ingredient / step / tip per line; "# For the filling" starts an ingredient group. Links and bold work as in the
// article: [ube powder](/products/ube), **bold**.
export function RecipeFields({ copy, onChange, disabled, source }: { copy: LocaleCopy; onChange: (patch: Partial<LocaleCopy>) => void; disabled?: boolean; source?: boolean }) {
  // keep the typed text (blank lines, a "#" being typed) and parse it on every change
  const [ing, setIng] = useState(() => ingredientsToText(copy.ingredients));
  const [steps, setSteps] = useState(() => listToLines(copy.steps));
  const [tips, setTips] = useState(() => listToLines(copy.tips));
  const rows = (s: string, min: number) => Math.max(min, s.split("\n").length + 1);
  return (
    <div className="grid gap-4">
      <label className="block">
        <Label hint={source ? "e.g. “2 lattes” — leave empty to show “Serves …”" : undefined}>Yield</Label>
        <input value={copy.yield ?? ""} onChange={(e) => onChange({ yield: e.target.value })} className="field mt-1.5 text-sm" disabled={disabled} placeholder={source ? "2 lattes" : ""} />
      </label>
      <label className="block">
        <Label hint={source ? "One per line, with amount: “4 g [ube powder](/products/ube)”. A line starting with # starts a group." : "One per line. Keep amounts and links."}>Ingredients</Label>
        <textarea
          value={ing}
          onChange={(e) => {
            setIng(e.target.value);
            onChange({ ingredients: textToIngredients(e.target.value) });
          }}
          rows={rows(ing, 5)}
          className="field mono mt-1.5 text-[13px]"
          disabled={disabled}
          placeholder={source ? "4 g ube powder\n200 ml oat milk\n\n# To serve\nIce" : ""}
        />
      </label>
      <label className="block">
        <Label hint={source ? "One step per line, in order. Numbers are added on the site." : "One step per line."}>Method</Label>
        <textarea
          value={steps}
          onChange={(e) => {
            setSteps(e.target.value);
            onChange({ steps: linesToList(e.target.value) });
          }}
          rows={rows(steps, 4)}
          className="field mt-1.5 text-[15px]"
          disabled={disabled}
          placeholder={source ? "Sift the ube powder into a cup.\nAdd 30 ml hot water and whisk until smooth.\nTop with cold milk and ice." : ""}
        />
      </label>
      <label className="block">
        <Label hint="Optional, one per line">Tips</Label>
        <textarea
          value={tips}
          onChange={(e) => {
            setTips(e.target.value);
            onChange({ tips: linesToList(e.target.value) });
          }}
          rows={rows(tips, 2)}
          className="field mt-1.5 text-[15px]"
          disabled={disabled}
        />
      </label>
    </div>
  );
}
