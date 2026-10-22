# Linkbuilding — SFP + PMP

Budget approved by Leonard on 22 Oct 2026: **€2,000/month** ("Groei").
Goal: real, relevant referring domains, so PMP reaches the top 3 for matcha wholesale terms and SFP owns ube.

## Baseline (20 Oct 2026, quality referring domains: spam score <30, rank ≥30)

| Domain | Quality ref. domains |
|---|---|
| purematchapartners.com | 1 |
| superfoodspartners.com | 1 |
| matcha.com | 51 |
| jadeleafmatcha.com | 30 |
| matchaful.com | 18 |

The ube competitors (botanicalcube, ubesuperfood, imube, texture-maker…) have almost no quality links, only press-release syndication. A handful of good links puts SFP ahead.

## Targets

| By | PMP | SFP |
|---|---|---|
| End of Jan 2027 | 10 | 6 |
| End of Apr 2027 | 25 | 15 |

The measurement routines track this weekly in the Search Command dashboards.

## Rules

- **No bought dofollow links, PBNs, link packages or link exchanges.** They break Google's spam policies and put the rankings we already have at risk. Paid placements, sponsorships and gifted samples are fine, as long as the link is labelled `rel="sponsored"` or the coverage stays editorial.
- Relevance beats authority: tea, coffee, café, food trade, ingredient and recipe sites.
- No health claims in pitches or guest content, and no "we buy" language.
- Matcha and hojicha links go to **PMP**; ube and the other superfoods go to **SFP**. Family links between the two sites are fine.

## Budget split (per month)

| Bucket | € | What |
|---|---|---|
| Digital PR + content assets | 900 | One linkable data asset per quarter (Matcha Harvest & Price Report, Ube identity explainer), plus a freelance PR or outreach writer |
| Samples + creator / café collabs | 400 | Sample parcels to tea bloggers, recipe sites and cafés; recipe or menu collabs (disclosed) |
| Directories, memberships, sponsorships | 500 | Trade directory premium profiles, tea or food association memberships, event or barista sponsorships (`sponsored`) |
| Tools | 200 | DataforSEO top-up, journalist-request platform (Qwoted / Featured) |

Split: about **60% PMP / 40% SFP**. PMP already ranks in the top 50 for 28 of 44 terms, so links lift it fastest. SFP first needs `/products/*` indexed (PR #52).
Log every euro in `spend.csv`.

## Process (monthly cycle, mostly automated)

1. **Day 3 of each month (routine):**
   - Claude refreshes the link gap with DataforSEO (matcha set for PMP, ube set for SFP) and updates `prospects.csv`.
   - Claude picks the 15–20 best new prospects and writes `batches/<YYYY-MM>.md` with a tailored angle and a ready-to-send email draft per prospect.
2. **Leonard (or a VA) sends the emails.** Claude cannot send email. Mark `status` = `contacted` and the date.
3. **Weekly (measurement routines):** new referring domains are picked up automatically. Claude marks `status` = `won` with the link URL.
4. **Quarterly:** Claude drafts the data asset. Leonard supplies the internal data (prices, MOQs, harvest notes), and the PR freelancer pitches it.

## Month 1 (Nov 2026)

- **Free foundation links (P0 in `../authority-checklist.md`):**
  - family links PMP ⇄ SFP ⇄ asa-matcha
  - LinkedIn
  - Google Business Profile
  - Crunchbase
- **Directories:**
  - Faire (SFP ube)
  - Europages, Kompass, Tridge, Sourcify
  - matchadb.com and teabrands.org (PMP)
- **Outreach batch 1:** the tier-A trade titles (World Tea News, Specialty Food, Tea House Times, TeaTrade) plus 8 tea and recipe blogs with samples.
- **SFP ube PR:** send the ube identity pitch (`docs/outreach/2026-10-ube-identity-pitch.md` on the sprint branch).
