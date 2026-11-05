# Linkbuilding routine: extra steps (from 5 Nov 2026)

On top of the monthly batch (steps in README.md), the routine (trig_01Db5kuUvzCHi6P6eq7cJriq) does the following.

## Choosing prospects
Start with prospects from the previous batch that have not been contacted yet. Their status is `batch-YYYY-MM` and not `contacted`. Then add the best new ones.

## Looking up contacts
1. For each domain, fetch these pages through DataforSEO `on_page/content_parsing/live` with `markdown_view: true`:
   `/`, `/contact`, `/contact-us`, `/about`, `/write-for-us`, `/submit`.
   This costs about $0.02 in total.
2. Record what you find, in this order of preference:
   - an email address that appears literally on the site (this includes the form `name(at)domain`);
   - otherwise, the URL of the contact form;
   - otherwise, "look up on the site".
3. Never guess an address.

## The outreach pack
Write `batches/<YYYY-MM>-outreach-pakket.md`. The example is `batches/2026-11-outreach-pakket.md`.

The pack contains, in this order:
1. The ChatGPT instruction: make Gmail drafts, do not send them.
2. An overview table.
3. Part A: email address known. Give To, Subject and the complete email.
4. Part B: contact form. Give the form URL and the complete text.
5. Part B2: look up the contact on the site. Give the complete text.
6. Part C: profiles that Leonard creates himself.
7. Follow-ups: one short follow-up for each prospect with status `contacted` that was contacted more than 14 days ago and has not been won. Send at most one follow-up per prospect.

## Facts to use in the emails
- PMP: orders from 10 kg, a COA for every batch, organic and conventional grades, origins Japan and China.
- US sites:
  - add this line: "We hold U.S. stock in Salt Lake City and deliver across the U.S. in 2–4 days; our U.S. team is based in Los Angeles.";
  - link to https://www.purematchapartners.com/bulk-matcha-supplier-usa.

## Rules for the emails
- No health claims.
- No "we buy".
- Never pay for a link.
- No prices.
- Sign off with "Leonard Rampen" and the brand name. Do not include an email address.

## Delivery
1. Commit and push to `seo-tracking`.
2. Send the pack to Leonard as a file attachment.
3. Ask him which emails he has sent.
4. Set those prospects to `status=contacted` with the date.
