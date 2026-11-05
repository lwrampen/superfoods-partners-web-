#!/usr/bin/env python3
"""Merge Webflow export + live crawl + GSC + backlinks into url_map.csv and summary.json."""
import re, json, csv, collections, difflib, urllib.parse as up
H = "https://www.purematchapartners.com"
L = lambda f: json.load(open(f))
crawl = L("crawl/www.purematchapartners.com.pages.json")
extra = L("crawl/gsc_only_status.json")
nonidx = {n["url"].rstrip("/") for n in L("crawl/www.purematchapartners.com.non_indexable.json")}
g16 = {r["keys"][0].rstrip("/"): r for r in L("gsc/pages_16m.json")["rows"]}
g90 = {r["keys"][0].rstrip("/"): r for r in L("gsc/pages_90d.json")["rows"]}
bl = collections.Counter(b["url_to"].replace("://purematchapartners.com", "://www.purematchapartners.com").rstrip("/")
                         for b in L("backlinks/backlinks.json"))
pages = {p["publishedPath"]: p for p in L("webflow/pages.json")["result"]["pages"]}

rows = {}
def norm(u): return u.replace("://purematchapartners.com", "://www.purematchapartners.com").rstrip("/") or u
for p in crawl:
    m = p.get("meta") or {}
    rows[norm(p["url"])] = {"status": p["status_code"], "location": p.get("location"), "canonical": m.get("canonical"),
                            "title": m.get("title"), "description": m.get("description"), "linked": True}
for e in extra:
    if "shop." in e["url"]: continue
    rows.setdefault(norm(e["url"]), {"status": e["status"], "location": e.get("location"), "canonical": e.get("canonical"), "linked": False})
for u in g16:
    if "shop." in u: continue
    rows.setdefault(norm(u), {"status": None, "linked": False})

live = sorted(u for u, r in rows.items() if r["status"] == 200 and (r.get("canonical") or "").rstrip("/") in ("", u) and "?" not in u)
# en orphans /ceremonial-matcha/X canonicalise to /products/Y: reuse that for the /es and /de twins
EN_CANON = {up.urlparse(u).path: up.urlparse(r["canonical"]).path for u, r in rows.items()
            if r.get("status") == 200 and r.get("canonical") and r["canonical"].rstrip("/") != u}
MANUAL = {  # hand-checked where the fuzzy match picks the wrong product/topic
    "/ceremonial-matcha/hojicha-asa-30g": "/collections/hojicha",
    "/es/ceremonial-matcha/hojicha-japan-organic": "/es/products/hojicha-japan-organic",
    "/es/ceremonial-matcha/hojicha-japan-1kg": "/es/products/hojicha-japan-organic",
    "/es/ceremonial-matcha/hojicha-japan-conventional": "/es/products/hojicha-japan-conventional",
    "/es/ceremonial-matcha/premium-kagoshima-matcha-conventional-1kg": "/es/products/premium-matcha-japan-conventional",
    "/es/ceremonial-matcha/premium-japan-conventional": "/es/products/premium-matcha-japan-conventional",
    "/es/ceremonial-matcha/premium-japan-organic": "/es/products/premium-matcha-japan-organic",
    "/es/ceremonial-matcha/premium-china-conventional": "/es/products/premium-matcha-china-conventional",
    "/es/ceremonial-matcha/premium-matcha-conventional": "/es/products/premium-matcha-china-conventional",
    "/es/ceremonial-matcha/culinary-japan-organic": "/es/products/culinary-matcha-japan-organic",
    "/es/ceremonial-matcha/culinary-japan-conventional": "/es/products/culinary-matcha-japan-conventional",
    "/es/ceremonial-matcha/culinary-japan-conventional-1kg": "/es/products/culinary-matcha-japan-conventional",
    "/es/ceremonial-matcha/culinary-china-conventional": "/es/products/culinary-matcha-china-conventional",
    "/es/ceremonial-matcha/culinary-china-conventional-1kg": "/es/products/culinary-matcha-china-conventional",
    "/es/for/coffee-stores": "/es/for/food-and-beverage-brands",
    "/recipe/easy-matcha-christmas-chocolates": "/recipe",
    "/es/recipe/easy-matcha-christmas-chocolates": "/es/recipe",
    "/blogs/blog/the-magic-of-seasonal-matcha.html": "/blogs/matcha-harvest-seasons-explained",
    "/blogs/matcha-grades-explained-ceremonial-latte-culinary": "/blogs/match-a-making-which-matcha-grade-suits-your-needs",
}
def suggest(u):
    path = up.urlparse(u).path
    if path in MANUAL: return H + MANUAL[path]
    m = re.match(r"^/(es|de)(/ceremonial-matcha/.+)$", path)
    if m and m.group(2) in EN_CANON: return f"{H}/{m.group(1)}{EN_CANON[m.group(2)]}"
    loc = path.split("/")[1] if path.split("/")[1:2] in (["es"], ["de"]) else ""
    pool = [x for x in live if (up.urlparse(x).path.split("/")[1:2] == [loc]) == bool(loc)] or live
    m = difflib.get_close_matches(u, pool, 1, 0.75)
    return m[0] if m else None

out = []
for u, r in sorted(rows.items()):
    path = up.urlparse(u).path or "/"
    seg = path.strip("/").split("/")
    locale = seg[0] if seg[0] in ("es", "de") else "en"
    base = "/" + "/".join(seg[1:] if locale != "en" else seg)
    canon = (r.get("canonical") or "").rstrip("/")
    q = up.urlparse(u).query
    if r["status"] == 301:
        action, target = "301 (keep)", r["location"]
    elif r["status"] == 200 and q:
        action, target = "pagination param (keep canonical)", canon
    elif r["status"] == 200 and canon and canon != u:
        action, target = "301 to canonical (was 200+canonical)", canon
    elif r["status"] == 200:
        action, target = "keep 1:1" + (" (noindex)" if u in nonidx else ""), ""
    elif r["status"] == 404:
        s = suggest(u)
        action, target = ("301 suggested (404 now)", s) if s else ("410/404 (no match)", "")
    else:
        action, target = "check", ""
    wf = pages.get(base.rstrip("/") or "/") or pages.get(base)
    a, b = g16.get(u, {}), g90.get(u, {})
    out.append({"url": u, "locale": locale, "path": path, "live_status": r["status"], "linked_internally": r["linked"],
                "canonical": canon, "noindex": u in nonidx, "webflow_page": wf["id"] if wf else "",
                "clicks_16m": a.get("clicks", 0), "impr_16m": a.get("impressions", 0), "pos_16m": round(a.get("position", 0), 1),
                "clicks_90d": b.get("clicks", 0), "impr_90d": b.get("impressions", 0), "backlinks": bl.get(u, 0),
                "action": action, "target": target or ""})
out.sort(key=lambda x: (-x["clicks_16m"], -x["impr_16m"], x["url"]))
with open("url_map.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(out[0])); w.writeheader(); w.writerows(out)
c = collections.Counter(x["action"] for x in out)
summ = {"urls": len(out), "by_action": c, "by_locale_live": collections.Counter(x["locale"] for x in out if x["live_status"] == 200),
        "clicks_16m_total": sum(x["clicks_16m"] for x in out),
        "clicks_16m_on_keep": sum(x["clicks_16m"] for x in out if x["action"].startswith("keep")),
        "top_by_clicks": [(x["url"], x["clicks_16m"]) for x in out[:15]]}
json.dump(summ, open("summary.json", "w"), indent=1)
print(json.dumps(summ, indent=1))
for x in out:
    if x["action"].startswith("301 suggested") or x["action"].startswith("410") or x["action"] == "check":
        print(x["action"][:14], x["clicks_16m"], x["impr_16m"], x["path"], "->", up.urlparse(x["target"]).path if x["target"] else "")
