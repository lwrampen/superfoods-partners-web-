# SEO tracking — SFP + PMP (branch `seo-tracking` — never merged to main)

Weekly measurement for the **SFP Search Command** dashboard
(https://claude.ai/artifact/97vC1BccsMgtoMLReDekc1).

| File | What |
|---|---|
| `keywords.csv` | Tracked keyword universe: cluster, market, DataforSEO location/language |
| `seo_tracker.py keywords.csv snapshots/rankings-<date>.json` | SERP top-50 position of SFP + PMP, top-3 domains, search volume (~$1/run) |
| `seo_metrics.py snapshots/metrics-<date>.json [--no-linkgap]` | Search Console 28/90d, quality referring domains vs competitors, competitor link-gap (~$0.20/run) |
| `ai_visibility.py ai_prompts.csv <sfp|pmp> <dir>/ai-<date>.json [--max-cost 4]` | AI-answer visibility: buyer questions to ChatGPT, Perplexity, Gemini, Claude (web search on) → mentioned / cited / retrieved + most-cited competitors + the engines' own search queries (~$2/run PMP, ~$1.3 SFP) |
| `build_data.py snapshots dashboard/data.json` | Latest + history → dashboard data (incl. `ai`: AI answers + Google AI Overviews from the rankings run) |
| `make_page.py dashboard/index.html dashboard/data.json <out.html>` | Page with data embedded (only needed when the page itself changes) |

Env: `DATAFORSEO_USERNAME`, `DATAFORSEO_PASSWORD`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`.
Link-gap filter drops auto-generated "SEO checker" link farms (spam score ≥ 30, TLDs like .store/.site/.online).
SFP snapshots also carry `link_gap_ube` (ube SERP leaders). Linkbuilding plan, prospects and spend ledger: `docs/seo/linkbuilding/`.

## Pure Matcha Partners (`seo/pmp/`)
Dashboard **PMP Search Command**: https://claude.ai/artifact/2cQy8q6GiqLVi696WL6yZu
PMP site is Webflow (site id `6798bd1e4b234bad93cdaa9c`), not this repo; this branch only stores its measurements.
```
cd seo
python3 seo_tracker.py pmp/keywords.csv pmp/snapshots/rankings-$D.json
python3 seo_metrics.py pmp/snapshots/metrics-$D.json --site=pmp [--no-linkgap]
python3 ai_visibility.py ai_prompts.csv pmp pmp/snapshots/ai-$D.json --max-cost 4
python3 build_data.py pmp/snapshots pmp/dashboard/data.json pmp
```
SFP: `python3 ai_visibility.py ai_prompts.csv sfp snapshots/ai-$D.json --max-cost 3` before `build_data.py`.
PMP site moved from Webflow to Next.js on 12 Nov 2026 (repo lwrampen/pure-matcha-partners-web); the Webflow notes below are history.
`build_data.py <dir> <out> sfp|pmp` sets the primary brand; the dashboard template reads `primary` from data.json.

### PMP site snapshot (`seo/pmp/site/`)
`pages.json` (page id, path, SEO title/description) and `blogs.json` (CMS blog items, word count, links) exported from Webflow, because routine sessions cannot reach Webflow. Refreshed by the main session after every applied sprint.
Webflow ids: site `6798bd1e4b234bad93cdaa9c`, Blogs collection `6798bd1e4b234bad93cdab3d` (fields: name, slug, blog-summary, blog-post-body, blog-post-body-two, blog-category, writer-detail, blog-date, blog-main-image, blog-thumbnail-image), locales EN (primary), ES (/es), DE (/de).
