# Content calendar — Insights (SEO + GEO)

The weekly content Routine reads this file and `docs/seo-sprints.md` (section
"Ube-offensief"), takes the **first unchecked topic** in the queue, writes it as
a post in `src/data/insights.ts`, verifies the build, squash-merges to `main`,
then checks the topic off here. Skip anything that already exists in `insights.ts`.

**Cadence:** 1 post per week, Monday. One post per firing. Keep the voice and
depth consistent with the existing posts (a real buyer's-guide tone — specific,
documented, never fluffy).

**Focus (Leonard, 22-10 and 3-11): full focus on ube.** Work the ube queue first;
only after it, alternate with the other product lines.

**Guardrails for every ube post**
- `relatedProducts: ["ube"]`; mention `/products/ube` and, where it fits, Pure Ube Partners (`/pure-ube-partners`).
- Facts only from `src/data/catalog.ts`: no organic or certificate claims that are not there, no health claims.
- We supply ube (Dioscorea alata), taro and blends and recommend the right material per application. Never write "only purple yam" and never call taro or blends inferior. Botanical explanations are fine, with the message "tell us the application, we advise the right material".
- No taro specs (origin, certificates, forms) until they are in `catalog.ts`.

## Queue — Ube cluster (PRIORITY)

Volumes are DataforSEO, US, per month (see `docs/seo-sprints.md` for the full table).

- [ ] `what-is-ube` — Extend toward "what is ube" (90.5k): clear lede for AI extraction, FAQPage. Update `what-is-ube-powder` or write a companion guide, whichever avoids cannibalisation.
- [ ] `ube-flavor-guide` — What does ube taste like, and how to build the flavour in products (27.1k "ube flavor").
- [ ] `buying-ube-powder-wholesale` — How to buy ube powder wholesale: spec, colour, COA, origin, packaging (ube powder bulk / wholesale / supplier: low volume, CPC $6–9).
- [ ] `ube-powder-natural-colour-clean-label` — Ube as a natural violet: colour as an ingredient, what to specify and test. No health claims.
- [ ] `ube-halaya-to-scale` — From ube halaya to scale: using ube powder in commercial dessert production.
- [ ] `ube-milk-tea-and-rtd-drinks` — Ube milk tea, ube drink and RTD formulation (ube drink 3.6k, ube milk tea 1.3k, ube coffee 3.6k).
- [ ] `ube-powder-vs-ube-extract-or-paste` — Which ube format for which job (powder vs fresh/paste), framed as "tell us the application". Only if the formats can be stated from `catalog.ts`.

## Queue — other product lines (after the ube queue; alternate)

- [ ] `hibiscus-grades-acidity-beverages` — Hibiscus: grades, acidity and beverage uses.
- [ ] `lions-mane-sourcing-formulation` — Lion's mane for nutraceuticals: fruiting-body vs mycelium, forms, formulation.
- [ ] `specialty-tea-powders-jasmine-oolong-earl-grey` — Jasmine, oolong & earl grey tea powders for manufacturers.

## Not on SFP — Pure Matcha Partners (decision 20-10)

Matcha and hojicha belong to Pure Matcha Partners. Do **not** write new SFP posts that target matcha or hojicha terms. The earlier matcha topics (formulating with matcha, ordering process, organic certifications, shelf life, cafés, matcha vs green-tea powder) and the hojicha topic are removed from this queue. The existing matcha posts stay as they are.

## People / team (human voice — builds trust, E-E-A-T + GEO)

Posts about the people behind Superfoods Partners so buyers trust the humans,
not just the process.

**ON HOLD — do NOT write individual team profiles until Leonard provides each
person's pronouns / form of address.** German, Spanish, French and Polish force
a grammatical gender, so writing a profile blind risks misgendering a real
person on the live site in six languages. The weekly Routine must SKIP these.

- [ ] (blocked) `meet-wanjin-sourcing` — Profile: Wanjin, supply chain & sourcing.
- [ ] (blocked) `meet-lucinda-quality-control` — Profile: Lucinda, quality control.
- [ ] (blocked) `meet-fannie-sourcing` — Profile: Fannie, sourcing.
- [ ] (blocked) `meet-candy-partnerships` — Profile: Candy, partnerships.

## Published

- [x] `matcha-wholesale-buyers-guide` — pillar (2026-07-29)
- [x] `ceremonial-vs-premium-vs-culinary-matcha` (2026-07-29)
- [x] `how-to-judge-matcha-quality` (2026-07-29)
- [x] `choosing-a-matcha-origin` (2026-07-29)
- [x] `the-people-behind-superfoods-partners` — collective team post (2026-07-30)
- [x] `what-is-ube-powder` — Ube hub (2026-07-30)
- [x] `ube-powder-bakery-rtd-ice-cream` — Ube hub (2026-07-30)
- [x] `matcha-superfood-wholesale-demand-report-2026` — Data-PR report, EN-first (2026-07-30)
- [x] `ube-vs-taro-vs-purple-sweet-potato` — Ube cluster, botanical identity (2026-10-26)
- [x] `ube-latte-cafe-menus-formulating-with-ube-powder` — Ube cluster, café/foodservice (2026-11-02)
- [removed] `hojicha-powder-wholesale-buyers-guide` — published 2026-10-19, removed 2026-10-26 (hojicha now belongs to Pure Matcha Partners); the URL redirects to purematchapartners.com
