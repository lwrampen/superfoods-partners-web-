# SEO-sprints — superfoodspartners.com

Tweewekelijks log (elke sprint één PR ter review). Nieuwste entry bovenaan.
Roadmap Q4 2026 – Q1 2027 (besluit Leonard, 20-10):
1. Ube-hub + SFP-categorieën (hibiscus, theepoeders, lion's mane)
2. Europa eerst (voor de SFP-categorieën)
3. Linkprogramma (1 asset of outreach-pakket per sprint, in `docs/outreach/`)
4. Afbakening SFP ↔ PMP. Matcha en hojicha zijn van Pure Matcha Partners: op SFP komen geen nieuwe pagina's of meta's die op matcha of hojicha mikken.

Doelen eind Q1 2027: top-10 op 10/40 gevolgde termen · 25 echte verwijzende domeinen · 500 klikken/28d · elke organische RFQ gemeten.

## Ube-offensief (besluit Leonard, 22-10) — prioriteit 1 voor elke SFP-sprint

Ube blijft op superfoodspartners.com: één domein bouwt alle autoriteit op. Pure Ube Partners is het specialist-label (net als PMP), maar zonder eigen site.
`pureubepartners.com` is alleen een 308-redirect.

**Paginastructuur (hub & spoke): elke pagina mikt op één taak, er is geen kannibalisatie**

| Rol | URL | Mikt op |
|---|---|---|
| Merk | `/pure-ube-partners` | alleen "Pure Ube Partners" |
| Commercieel (money page) | `/products/ube` | ube powder, purple yam powder, wholesale/bulk/supplier, organic ube powder; DE Ube-Pulver |
| Informatief (gidsen) | `/insights/*` | what is ube, ube vs taro, ube vs purple sweet potato, ube flavor, ube latte, toepassingen |
| Herkomst | `/origins/philippines-ph`, `/origins/china-cn` | ube powder Philippines, herkomst en seizoen |

Elke gids linkt naar `/products/ube`. De PDP en de merkpagina linken terug naar de gidsen.

**Zoekvolumes (DataforSEO, 22-10, per maand)**

| Term | Markt | Volume | Opmerking |
|---|---|---|---|
| what is ube | US | 90.500 | info, AI-antwoorden; zh-Hant-gids staat al op pos. 7 |
| ube flavor | US | 27.100 | info |
| ube vs taro | US | 14.800 | info, nog geen gids |
| ube powder | US | 12.100 | kern-commercieel |
| purple yam powder | US | 12.100 | kern-commercieel |
| ube latte | US | 8.100 | café/foodservice-hoek |
| Ube Pulver | DE | 4.400 | `/de/products/ube` |
| ube powder | UK | 1.900 | |
| ube vs purple sweet potato | US | 1.600 | identiteit; FAQ staat er (#52) |
| ube poeder | NL | 1.300 | er is geen NL-locale; de EN-pagina bedient NL |
| organic ube powder | US | 390 | CPC $2,46 |
| ube powder bulk / wholesale / supplier | US | 30 / 20 / 10 | weinig volume, maar CPC $6–9 = pure koopintentie. Moet makkelijk top-3 worden (concurrenten hebben amper echte links) |

**Backlog (op volgorde; per sprint 1–2 items naast de meting)**
1. Indexering `/products/ube` in 6 locales bewaken: URL Inspection elke sprint, tot alle locales *Indexed* zijn.
2. Structured data: `Organization` met `brand` Pure Ube Partners op de merkpagina, en `Product` met `brand` op `/products/ube`.
3. Nieuwe gids "Ube vs taro vs purple sweet potato" (14,8k + 1,6k): de hoek van de botanische identiteit. Laat de wekelijkse blog dit oppakken.
4. EN-gids "What is ube powder" uitbreiden richting "what is ube" (90,5k), met FAQPage en een duidelijke lede voor AI-extractie.
5. Gids "Ube latte & café menus: formulating with ube powder" (8,1k), met een link naar de PDP-sectie over toepassingen.
6. `/de/products/ube` inhoudelijk verdiepen voor "Ube Pulver" (4,4k), met toepassingen en FAQ in natuurlijk Duits.
7. `/origins/philippines-ph`: een ube-specifieke alinea (herkomst, seizoen, verwerking). Alleen feiten die Leonard aanlevert.
8. Optioneel na Q1: een NL-locale, als NL-verkeer blijft groeien (nu land #1 op klikken).

Niet doen: ube-claims verzinnen (organic, certificaten en vormen alleen zoals in `catalog.ts`), gezondheidsclaims, en de merkpagina laten concurreren met `/products/ube`.

**Links:** ongeveer 40% van het linkbudget (€2.000/mnd) gaat naar SFP, met ube voorop. Denk aan de ube-identiteitspitch (`docs/outreach/`), Faire, blogs over Filipijns eten en bakken, en eventueel een ube-marktrapport als data-asset in Q1.
Het plan staat in `docs/seo/linkbuilding/` op de `seo-tracking`-branch.

**Ube-doelen eind Q1 2027**
- `/products/ube` geïndexeerd in alle 6 locales.
- Top-3 op ube powder wholesale / bulk / supplier (US).
- Top-20 op "ube powder" en "purple yam powder" (US).
- Top-10 op "Ube Pulver" (DE).
- 10 kwaliteitsdomeinen die naar ube-pagina's linken.
- ≥ 20 ube-RFQ's per 28 dagen (nu 11).

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
