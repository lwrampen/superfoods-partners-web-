# SEO-sprints — superfoodspartners.com

Tweewekelijks log (elke sprint één PR ter review). Nieuwste entry bovenaan.
Roadmap Q4 2026 – Q1 2027 (besluit Leonard, 20-10):
1. Ube-hub + SFP-categorieën (hibiscus, theepoeders, lion's mane)
2. Europa eerst (voor de SFP-categorieën)
3. Linkprogramma (1 asset of outreach-pakket per sprint, in `docs/outreach/`)
4. Afbakening SFP ↔ PMP. Matcha en hojicha zijn van Pure Matcha Partners: op SFP komen geen nieuwe pagina's of meta's die op matcha of hojicha mikken.

Doelen eind Q1 2027: top-10 op 10/40 gevolgde termen · 25 echte verwijzende domeinen · 500 klikken/28d · elke organische RFQ gemeten.

---

## 2026-10-21 — Ube-hub: indexering, PDP-meta, ube-identiteit

### Data-snapshot
Search Console (sc-domain), 22-09 t/m 19-10 vs. 25-08 t/m 21-09:

| KPI | Nu | Vorige 28d |
|---|---|---|
| Klikken | 100 | 33 |
| Vertoningen | 1.090 | 1.001 |
| CTR | 9,2% | 3,3% |
| Gem. positie | 9,9 | 22,5 |

- Landen (klikken): NL 28, HK 23, TW 10. De groei komt vooral van branded zoekopdrachten en zh-Hant.
- GA4: organische sessies 166 (was 109). Er waren 17 RFQ's (`generate_lead`, alle kanalen), tegen 12 in de vorige periode. **11 van de 17 kwamen binnen op `/products/ube`** (5 via AI-assistenten, 4 direct, 2 organisch). Organische RFQ's: 4 (was 7).
- Let op: `generate_lead` is in GA4 geen *key event* (keyEvents = 0). Markeer het als key event, anders zijn conversies in rapporten onzichtbaar.
- **Indexering (URL Inspection):** `/` is geïndexeerd. `/products`, `/products/ube`, `/products/hibiscus`, `/products/lions-mane` en `/products/matcha` staan op *Discovered – currently not indexed*. `/de/products/ube` en `/fr/products/ube` zijn *unknown to Google*. Google toont nog de oude `/catalog/*`-URL's (308-redirect sinds 07-09). Het verkeer van `/catalog/ube` daalde van 355 naar 115 vertoningen.
- Sitemap: 36 URL's ingediend, laatst opgehaald 11-10. `lastModified` stond vast op 05-09, dus vóór de hernoeming naar `/products`.
- Rankings (snapshot 20-10, `seo-tracking`): 0/40 gevolgde termen in de top-50. Volgens DataforSEO staat superfoodspartners.com in de VS maar op 3 termen in de top-100.
- Kansen in zh-Hant: `/zh-Hant/insights/what-is-ube-powder` heeft 313 vertoningen, CTR 2,9% en positie 7,1, op "ube是什麼" en "ube是紫薯嗎". De zh-tekst noemde ube 紫薯 (paarse zoete aardappel). Dat is botanisch onjuist: ube is 紫山藥 (*Dioscorea alata*).
- Volumes (DataforSEO): "ube powder" 12.100 en "purple yam powder" 12.100 (VS); "Ube Pulver" 4.400 (DE); "lion's mane powder" 4.400 (VS); "hibiscus powder" 1.900 (VS).

### Ingrepen
1. **Sitemap-lastmod klopt per URL** (thema 1/technisch). Paginadatum gezet op 21-10; insights gebruiken hun eigen `updated`/`date`. Doel: Google een geldig signaal geven om de `/products/*`-URL's opnieuw te crawlen.
2. **Eigen title en meta voor ube, lion's mane en hibiscus, in alle 6 locales** (thema 1 + 2). Het sjabloon gaf "UBE Wholesale — Bulk UBE Supplier", zonder "powder"/"Pulver". Nu staat de kernterm voorop (bijv. "Ube Powder Supplier — Bulk & Wholesale, Philippines" en "Ube-Pulver Großhandel — lila Yams von den Philippinen").
3. **Gidsenblok op de PDP** (thema 1). SFP-productpagina's linken nu naar hun insights (ube → 2 gidsen). Insights linkten al terug naar de PDP. Matcha- en hojicha-PDP's zijn bewust uitgesloten (PMP).
4. **Ube-identiteit gecorrigeerd en uitgebreid** (thema 1). zh-Hant 紫薯 → 紫山藥 in de gids en de homepage-intro, en de foute DE-alt-tekst ("Süßkartoffel") verbeterd. Nieuwe meta (beantwoordt "ube vs taro / is het paarse zoete aardappel?") en een nieuwe FAQ "Is ube the same as purple sweet potato?" in 6 talen.
5. **Outreach-pakket** (thema 3): `docs/outreach/2026-10-ube-identity-pitch.md`.

### Verwacht effect
- Indexering van `/products/ube` en de locale-varianten binnen 2–4 weken, mits Leonard handmatig indexering aanvraagt. Dat is de belangrijkste hefboom: de pagina levert ⅔ van alle RFQ's.
- zh-Hant ube-gids: CTR van 2,9% naar 6%+ op dezelfde vertoningen, dus ongeveer +10 klikken per 28 dagen.
- DE "Ube Pulver" (4.400/mnd): `/de/products/ube` heeft nu een titel die op die term mikt. Eerste vertoningen pas na indexering.

### Volgende sprint meten
- URL Inspection: `/products`, `/products/ube`, `/de/products/ube`, `/fr/products/ube`, `/products/hibiscus`, `/products/lions-mane`.
- GSC: vertoningen en CTR van `/zh-Hant/insights/what-is-ube-powder` (nulmeting 313 / 2,9% / pos 7,1); `/products/ube` tegen `/catalog/ube` (nulmeting 115 vertoningen op `/catalog/ube`).
- GA4: RFQ's per landingspagina (nulmeting 17, waarvan 11 op ube; organisch 4). Is `generate_lead` al een key event?
- Verwijzende domeinen naar de ube-gids (outreach-pakket).
