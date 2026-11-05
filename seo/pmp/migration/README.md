# PMP migration: Webflow → Next.js, phase 1 inventory

Snapshot taken 2026-11-05. Everything is read-only: nothing was changed in Webflow.
This folder is the baseline for rebuilding www.purematchapartners.com 1:1 in the new repo
(`pure-matcha-partners-web`) and comparing old against new per URL.

## Contents

| Folder/file | Source | What it holds |
|---|---|---|
| `webflow/pages*.json` | Webflow API | 64 pages per locale (en/es/de): slug, SEO title/description, OG, publishedPath |
| `webflow/page_meta/` | Webflow API | Full metadata per page × locale (192 files) |
| `webflow/schema.json` | Webflow API | JSON-LD per page per locale (21 pages carry schema) |
| `webflow/page_content/` | Webflow API | All text nodes per page × locale; es/de contain only the overrides (the rest falls back to en) |
| `webflow/components*` | Webflow API | 11 components (nav, footer, etc.) with content |
| `webflow/cms/` | Webflow API | Blogs, Blog categories, Recipes, Blog writers: schema + all items per locale (including drafts) |
| `webflow/assets.json` | Webflow API | 541 assets with hostedUrl, alt text and variants |
| `webflow/scripts.json` | Webflow API | Site-wide code: GA4 G-GCVVK26GTZ, Crisp chat, Organization JSON-LD, ProductSchemaJSONLD, LocaleSwitcher; per page: GSC verification (home) and submissionDate script (forms) |
| `crawl/` | DataforSEO On-Page | Live crawl of www (323 URLs) and shop (241 URLs): status, canonical, meta, non-indexable |
| `crawl/gsc_only_status.json` | DataforSEO instant pages | Status of 135 URLs that Google knows but the crawl did not find |
| `gsc/` | Search Console | Per URL and per URL+query: 28 days, 90 days, 16 months; sitemaps |
| `backlinks/` | DataforSEO | All 46 backlinks + summary (38 referring domains) |
| `url_map.csv` | merge (`build_inventory.py`) | **The working list**: every known URL with status, canonical, GSC clicks/impressions, backlinks and the action on the new site |

## Key figures

- **Live and indexable:** 143 en + 113 es + 107 de URLs.
- **Webflow:** 64 static pages per locale.
- **CMS, published:**
  - Blogs: 46 en, 41 es, 41 de.
  - Recipes: 6 per locale.
- **GSC 16 months:** 9,519 clicks; 96% of those (9,155) fall on URLs that we keep 1:1.
  - Homepage: 5,309 clicks.
  - `/es`: 872.
  - Top blogs: matcha-ratios 381, flavor-pairing 229, match-a-making 213, microfoam 210.
  - `/about`: 202.
  - `/for/private-label-matcha`: 185.
- **Backlinks:** almost all point to the homepage (44 of 46). Only `/for/private-label-matcha` and `/products/rooibos-tea-powder` have one each.

## Actions in `url_map.csv`

| Action | Count | Meaning |
|---|---|---|
| keep 1:1 | 310 | Same path, same title/description/canonical/hreflang/schema |
| keep 1:1 (noindex) | 11 | Forms and terms pages stay noindex |
| 301 (keep) | 3 | Existing Webflow 301s `/ceremonial-matcha/*` → `/products/*` |
| 301 to canonical | 24 | Old `/ceremonial-matcha/*` product URLs that are now 200 with a canonical to `/products/*` → turned into a proper 301 (cleaner signal) |
| 301 suggested (404 now) | 44 | URLs Google still knows that return 404 now (mainly `/es/ceremonial-matcha/*` and blog slug typos) → small win: 301 to the right page. Fuzzy matches were checked by hand (`MANUAL` in the script) |
| pagination param | 18 | `?38ac87a4_page=N` on blog overviews; keep the canonical to the overview |

## Known gaps / still to arrange

1. **Webflow 301 redirect list + robots.txt:** not available through the API (Enterprise only).
   - Export manually: Site settings → Publishing → 301 redirects.
   - The live crawl only sees 3 redirects; the full list may contain more historic rules.
2. **`shop.purematchapartners.com`:** a separate (Shopify) shop, outside Webflow.
   - Still 67 URLs in Google, but only 18 clicks in 16 months.
   - Stays untouched for now: its DNS record stays as it is.
3. **Images:** all on the Webflow CDN. They need to be downloaded into the new repo (same file names / alt text) before the DNS switch, because the Webflow CDN stops working after the site is cancelled.
4. **Forms:** contact, sample-request, pricelist-request and complain-form currently run on Webflow Forms + GA4 form tracking. On the new site they move to our own route + `generate_lead` event (as on SFP).
5. **Blog automation:** moves from ChatGPT→Webflow to the routine/PR flow (as on SFP). The 10 en drafts in the CMS are kept in the export.
6. **es/de content:** pages without translation overrides currently show English text under /es and /de. Rebuild 1:1 as well; improve later.

## Refresh

```bash
python3 pull_gsc_dfs.py      # GSC + backlinks (needs GOOGLE_* and DATAFORSEO_* env)
python3 build_inventory.py   # rebuilds url_map.csv + summary.json
```
