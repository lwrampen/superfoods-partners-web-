#!/usr/bin/env python3
"""SFP rank tracker: per keyword/market the SERP position of superfoodspartners.com
(and sister purematchapartners.com), top-3 domains and monthly search volume.
Usage: python3 seo_tracker.py keywords.csv out.json"""
import os, sys, csv, json, time, base64, datetime, urllib.request
from concurrent.futures import ThreadPoolExecutor

AUTH = base64.b64encode(f'{os.environ["DATAFORSEO_USERNAME"]}:{os.environ["DATAFORSEO_PASSWORD"]}'.encode()).decode()
OURS = {"superfoodspartners.com": "sfp", "purematchapartners.com": "pmp"}
COST = [0.0]


def post(path, payload, attempts=4):
    req = urllib.request.Request("https://api.dataforseo.com" + path, data=json.dumps(payload).encode(),
                                 headers={"Authorization": "Basic " + AUTH, "Content-Type": "application/json"})
    # Retry dropped connections (the agent proxy resets long calls now and then);
    # one reset used to kill the whole run after most SERPs were already paid for.
    for i in range(attempts):
        try:
            r = json.load(urllib.request.urlopen(req, timeout=300))
            break
        except OSError as e:  # ConnectionResetError, URLError, timeouts
            if i == attempts - 1:
                raise
            print(f"retry {i + 1} {path}: {type(e).__name__}", file=sys.stderr)
            time.sleep(2 ** (i + 1))
    COST[0] += r.get("cost", 0) or 0
    return r


def serp(row):
    r = post("/v3/serp/google/organic/live/advanced", [{
        "keyword": row["keyword"], "location_code": int(row["location_code"]),
        "language_code": row["language_code"], "depth": 50}])
    items = [i for i in (r["tasks"][0]["result"] or [{}])[0].get("items") or [] if i.get("type") == "organic"]
    pos = {"sfp": None, "pmp": None}
    for i in items:
        for dom, key in OURS.items():
            if i["domain"].endswith(dom) and pos[key] is None:
                pos[key] = i["rank_group"]
    top3 = [i["domain"].removeprefix("www.") for i in items[:3]]
    return {**row, "pos_sfp": pos["sfp"], "pos_pmp": pos["pmp"], "top3": top3}


def volumes(rows):
    out = {}
    groups = {}
    for r in rows:
        groups.setdefault((r["location_code"], r["language_code"]), []).append(r["keyword"])
    for (loc, lang), kws in groups.items():
        # Google Ads volume has no zh-TW language; fall back to location only
        task = {"keywords": kws, "location_code": int(loc)}
        if lang in ("en", "de", "fr", "es", "nl", "pl"):
            task["language_code"] = lang
        try:
            res = post("/v3/keywords_data/google_ads/search_volume/live", [task])["tasks"][0]["result"] or []
            for x in res:
                out[(loc, x["keyword"])] = x.get("search_volume")
        except Exception as e:  # volume is nice-to-have
            print("volume error", loc, e, file=sys.stderr)
    return out


def main(kw_csv, out_json):
    rows = list(csv.DictReader(open(kw_csv, encoding="utf-8")))
    with ThreadPoolExecutor(4) as ex:
        results = list(ex.map(serp, rows))
    vol = volumes(rows)
    for r in results:
        r["volume"] = vol.get((r["location_code"], r["keyword"]))
    snap = {"date": datetime.date.today().isoformat(), "results": results, "cost_usd": round(COST[0], 3)}
    json.dump(snap, open(out_json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    ranked = [r for r in results if r["pos_sfp"]]
    print(f"{len(results)} keywords, SFP ranks top-50 on {len(ranked)}, cost ${snap['cost_usd']}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
