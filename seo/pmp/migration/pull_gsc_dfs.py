#!/usr/bin/env python3
"""Read-only: GSC per-URL performance + DataforSEO backlink target pages for purematchapartners.com."""
import os, json, base64, datetime, urllib.request, urllib.parse
OUT = os.path.dirname(os.path.abspath(__file__))
PROP = "purematchapartners.com"

def token():
    data = urllib.parse.urlencode({k.lower(): os.environ["GOOGLE_" + k] for k in ("CLIENT_ID", "CLIENT_SECRET", "REFRESH_TOKEN")}
                                  | {"grant_type": "refresh_token"}).encode()
    return json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", data))["access_token"]

AT = token()
def gsc(body):
    rows, start = [], 0
    while True:
        b = dict(body, rowLimit=25000, startRow=start)
        req = urllib.request.Request(f"https://www.googleapis.com/webmasters/v3/sites/sc-domain%3A{PROP}/searchAnalytics/query",
                                     data=json.dumps(b).encode(), headers={"Authorization": "Bearer " + AT, "Content-Type": "application/json"})
        r = json.load(urllib.request.urlopen(req, timeout=120)).get("rows") or []
        rows += r
        if len(r) < 25000: return rows
        start += 25000

end = datetime.date.today() - datetime.timedelta(days=2)
for name, days in (("28d", 28), ("90d", 90), ("16m", 486)):
    rng = {"startDate": str(end - datetime.timedelta(days=days - 1)), "endDate": str(end)}
    pages = gsc(rng | {"dimensions": ["page"]})
    json.dump({"range": rng, "rows": pages}, open(f"{OUT}/gsc/pages_{name}.json", "w"), indent=1)
    print(name, "pages", len(pages))
    if name != "28d":
        pq = gsc(rng | {"dimensions": ["page", "query"]})
        json.dump({"range": rng, "rows": pq}, open(f"{OUT}/gsc/page_query_{name}.json", "w"), indent=1)
        print(name, "page+query", len(pq))

# sitemaps known to GSC
req = urllib.request.Request(f"https://www.googleapis.com/webmasters/v3/sites/sc-domain%3A{PROP}/sitemaps", headers={"Authorization": "Bearer " + AT})
json.dump(json.load(urllib.request.urlopen(req)), open(f"{OUT}/gsc/sitemaps.json", "w"), indent=1)

DFS = base64.b64encode(f'{os.environ["DATAFORSEO_USERNAME"]}:{os.environ["DATAFORSEO_PASSWORD"]}'.encode()).decode()
cost = 0
def dfs(path, payload):
    global cost
    req = urllib.request.Request("https://api.dataforseo.com" + path, data=json.dumps(payload).encode(),
                                 headers={"Authorization": "Basic " + DFS, "Content-Type": "application/json"})
    r = json.load(urllib.request.urlopen(req, timeout=300)); cost += r.get("cost", 0) or 0
    return (r["tasks"][0]["result"] or [{}])[0]

for kind, path, extra in (("pages", "/v3/backlinks/domain_pages/live", {"order_by": ["page_summary.referring_domains,desc"]}),
                          ("backlinks", "/v3/backlinks/backlinks/live", {"mode": "as_is", "order_by": ["rank,desc"]})):
    items, off = [], 0
    while True:
        res = dfs(path, [{"target": PROP, "limit": 1000, "offset": off, "include_subdomains": True} | extra])
        it = res.get("items") or []
        items += it
        if len(it) < 1000 or off > 9000: break
        off += 1000
    json.dump(items, open(f"{OUT}/backlinks/{kind}.json", "w"), indent=1)
    print("dfs", kind, len(items))
summary = dfs("/v3/backlinks/summary/live", [{"target": PROP, "include_subdomains": True}])
json.dump(summary, open(f"{OUT}/backlinks/summary.json", "w"), indent=1)
print("dfs cost", round(cost, 4))
