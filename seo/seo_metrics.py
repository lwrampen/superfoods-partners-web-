#!/usr/bin/env python3
"""SFP SEO metrics snapshot: Search Console totals, quality backlink counts vs competitors,
and the competitor link-gap prospect list (spam filtered).
Usage: python3 seo_metrics.py out.json [--no-linkgap] [--site=pmp]"""
import os, sys, json, base64, datetime, urllib.request, urllib.parse

DFS = base64.b64encode(f'{os.environ["DATAFORSEO_USERNAME"]}:{os.environ["DATAFORSEO_PASSWORD"]}'.encode()).decode()
COMPETITORS = ["jadeleafmatcha.com", "matchaful.com", "keichamatcha.com", "matcha.com"]
# ube SERP leaders (ube powder wholesale/supplier, Oct 2026) — link-gap set for SFP
COMPETITORS_UBE = ["botanicalcube.com", "wholesale-tea-supplier.com", "texture-maker.com", "ubesuperfood.com",
                   "imube.com", "sacfoodsupplies.com"]
OURS = ["superfoodspartners.com", "purematchapartners.com"]
# auto-generated "SEO checker" link farms that link to every domain; Google ignores them
SPAM_TLDS = {"store", "site", "online", "website", "space", "shop", "link", "xyz", "top", "click", "info", "pro", "center"}
RELEVANT = ("tea", "matcha", "cha", "coffee", "cafe", "café", "food", "kitchen", "recipe", "bake", "barista",
            "drink", "latte", "japan", "kyoto", "uji", "wellness", "nutrition", "ingredient", "bev")
COST = [0.0]


def dfs(path, payload):
    req = urllib.request.Request("https://api.dataforseo.com" + path, data=json.dumps(payload).encode(),
                                 headers={"Authorization": "Basic " + DFS, "Content-Type": "application/json"})
    r = json.load(urllib.request.urlopen(req, timeout=300))
    COST[0] += r.get("cost", 0) or 0
    return r


def gsc(prop):
    data = urllib.parse.urlencode({"client_id": os.environ["GOOGLE_CLIENT_ID"],
                                   "client_secret": os.environ["GOOGLE_CLIENT_SECRET"],
                                   "refresh_token": os.environ["GOOGLE_REFRESH_TOKEN"],
                                   "grant_type": "refresh_token"}).encode()
    at = json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", data))["access_token"]
    end = datetime.date.today() - datetime.timedelta(days=2)
    out = {}
    for days in (28, 90):
        body = {"startDate": str(end - datetime.timedelta(days=days - 1)), "endDate": str(end)}
        req = urllib.request.Request(
            f"https://www.googleapis.com/webmasters/v3/sites/sc-domain%3A{prop}/searchAnalytics/query",
            data=json.dumps(body).encode(), headers={"Authorization": "Bearer " + at, "Content-Type": "application/json"})
        row = (json.load(urllib.request.urlopen(req)).get("rows") or [{}])[0]
        out[f"d{days}"] = {k: round(row.get(k, 0), 4) for k in ("clicks", "impressions", "ctr", "position")}
    return out


def quality_ref_domains(target):
    r = dfs("/v3/backlinks/referring_domains/live", [{
        "target": target, "limit": 1000, "order_by": ["rank,desc"],
        "filters": [["backlinks_spam_score", "<", 30], "and", ["rank", ">=", 30]]}])
    items = (r["tasks"][0]["result"] or [{}])[0].get("items") or []
    good = [i["domain"] for i in items if i["domain"].split(".")[-1] not in SPAM_TLDS and not i["domain"].endswith(tuple(OURS))]
    return {"count": len(good), "domains": good[:40]}


def link_gap(competitors=COMPETITORS):
    r = dfs("/v3/backlinks/domain_intersection/live", [{
        "targets": {str(i + 1): d for i, d in enumerate(competitors)}, "exclude_targets": OURS,
        "intersection_mode": "partial", "limit": 1000, "order_by": ["1.rank,desc"],
        "filters": [["1.backlinks_spam_score", "<", 30]]}])
    rows = []
    for it in (r["tasks"][0]["result"] or [{}])[0].get("items") or []:
        hits = {k: v for k, v in it["domain_intersection"].items() if v}
        if len(hits) < 2:
            continue
        vs = list(hits.values())
        dom = vs[0]["target"]
        if dom.split(".")[-1] in SPAM_TLDS or max(v.get("backlinks_spam_score", 0) for v in vs) >= 30:
            continue
        rows.append({"domain": dom, "competitors": len(hits), "rank": vs[0].get("rank", 0),
                     "links_to": [competitors[int(k) - 1] for k in hits],
                     "relevant": any(w in dom for w in RELEVANT)})
    rows.sort(key=lambda x: (not x["relevant"], -x["competitors"], -x["rank"]))
    return rows


def main(out, with_gap=True, site="sfp"):
    snap = {"date": datetime.date.today().isoformat(), "site": site}
    try:
        snap["gsc"] = gsc(OURS[0] if site == "sfp" else OURS[1])
    except Exception as e:
        snap["gsc_error"] = str(e)[:200]
    snap["ref_domains"] = {d: quality_ref_domains(d) for d in OURS + COMPETITORS}
    if with_gap:
        snap["link_gap"] = link_gap()
        if site == "sfp":
            snap["link_gap_ube"] = link_gap(COMPETITORS_UBE)
    snap["cost_usd"] = round(COST[0], 3)
    json.dump(snap, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("gsc:", snap.get("gsc") or snap.get("gsc_error"))
    print("quality ref domains:", {k: v["count"] for k, v in snap["ref_domains"].items()})
    if with_gap:
        print("link gap:", len(snap["link_gap"]), "relevant:", sum(r["relevant"] for r in snap["link_gap"]))
    print("cost $", snap["cost_usd"])


if __name__ == "__main__":
    main(sys.argv[1], "--no-linkgap" not in sys.argv, "pmp" if "--site=pmp" in sys.argv else "sfp")
