#!/usr/bin/env python3
"""AI-answer visibility for PMP / SFP: asks buyer questions to ChatGPT, Perplexity, Gemini and Claude (with web
search, via DataforSEO AI Optimization) and records per answer whether we are

  mentioned  — brand or domain named in the answer text
  cited      — our URL among the answer's source links
  retrieved  — our URL among the pages the engine read (search results), even if not used

plus which domains were cited instead (share of voice) and the engine's own search queries ("fan-out"), which are
content ideas. Usage:

  python3 ai_visibility.py ai_prompts.csv <brand pmp|sfp> snapshots/ai-<date>.json [--max-cost 4] [--engines chat_gpt,perplexity]

Env: DATAFORSEO_USERNAME, DATAFORSEO_PASSWORD. Cost ≈ $0.01–0.03 per answer; the run stops at --max-cost (USD).
"""
import csv, json, os, re, sys, time, urllib.parse, datetime
from collections import Counter
from concurrent.futures import ThreadPoolExecutor

import requests

API = "https://api.dataforseo.com/v3/ai_optimization"
AUTH = (os.environ.get("DATAFORSEO_USERNAME", ""), os.environ.get("DATAFORSEO_PASSWORD", ""))
ENGINES = {  # engine -> model (cheap, web-search capable; check /llm_responses/models when one disappears)
    "chat_gpt": "gpt-6-luna",
    "perplexity": "sonar",
    "gemini": "gemini-3.8-flash",
    "claude": "claude-sonnet-5-5",
}
BRANDS = {
    "pmp": {"domain": "purematchapartners.com", "names": ["pure matcha partners", "purematchapartners", "purematcha partners"]},
    "sfp": {"domain": "superfoodspartners.com", "names": ["superfoods partners", "superfoodspartners", "superfood partners"]},
}
COST = [0.0]


def dom(url):
    d = urllib.parse.urlparse(url or "").netloc.lower()
    return d.removeprefix("www.")


def ask(engine, prompt):
    body = [{"user_prompt": prompt, "model_name": ENGINES[engine]}]
    if engine != "perplexity":
        body[0]["web_search"] = True
    for i in range(3):
        try:
            r = requests.post(f"{API}/{engine}/llm_responses/live", auth=AUTH, json=body, timeout=240).json()
            COST[0] += r.get("cost") or 0
            t = r["tasks"][0]
            if t.get("status_code") != 20000:
                return {"error": t.get("status_message")}
            return (t.get("result") or [{}])[0]
        except Exception as e:  # dropped connection / timeout
            err = f"{type(e).__name__}"
            time.sleep(3 * (i + 1))
    return {"error": err}


def analyse(res, brand):
    if res.get("error"):
        return {"error": res["error"]}
    text, cites = "", []
    for it in res.get("items") or []:
        if it.get("type") != "message":
            continue
        for s in it.get("sections") or []:
            text += (s.get("text") or "") + "\n"
            cites += [a.get("url") for a in s.get("annotations") or [] if a.get("url")]
    # links written into the answer text count as citations too
    cites += re.findall(r"https?://[^\s)\]]+", text)
    # grounding redirects (Gemini) carry no site; skip them
    cited_domains = list(dict.fromkeys(d for d in (dom(u) for u in cites) if d and not d.endswith(("vertexaisearch.cloud.google.com", "google.com"))))
    retrieved = [dom(x.get("url")) for x in res.get("search_results") or []]
    b = BRANDS[brand]
    low = text.lower()
    other = BRANDS["sfp" if brand == "pmp" else "pmp"]
    return {
        "mentioned": any(n in low for n in b["names"]) or b["domain"] in low,
        "cited": any(d.endswith(b["domain"]) for d in cited_domains),
        "retrieved": any(d.endswith(b["domain"]) for d in retrieved),
        "sister_mentioned": any(n in low for n in other["names"]) or other["domain"] in low,
        "cited_domains": cited_domains[:15],
        "fan_out": res.get("fan_out_queries") or [],
        "chars": len(text),
    }


def main(prompts_csv, brand, out, max_cost=4.0, engines=None):
    rows = [r for r in csv.DictReader(open(prompts_csv, encoding="utf-8")) if r["brand"] == brand]
    engines = engines or list(ENGINES)
    results = []

    def run(r, e):
        if COST[0] >= max_cost:
            return None
        a = analyse(ask(e, r["prompt"]), brand)
        print(f"{e:10} {'M' if a.get('mentioned') else '-'}{'C' if a.get('cited') else '-'}{'R' if a.get('retrieved') else '-'} {r['prompt'][:70]}", file=sys.stderr)
        return {**r, "engine": e, "model": ENGINES[e], **a}

    # one worker per engine: the engines answer in parallel, each engine one question at a time
    with ThreadPoolExecutor(max_workers=len(engines)) as pool:
        futs = [pool.submit(run, r, e) for r in rows for e in engines]
        results = [f.result() for f in futs]
    if any(x is None for x in results):
        print(f"cost cap ${max_cost} reached — some questions skipped", file=sys.stderr)
    results = [x for x in results if x]
    ok = [x for x in results if not x.get("error")]
    per_engine = {}
    for e in engines:
        xs = [x for x in ok if x["engine"] == e]
        if xs:
            per_engine[e] = {k: round(sum(1 for x in xs if x[k]) / len(xs), 3) for k in ("mentioned", "cited", "retrieved")} | {"answers": len(xs)}
    sov = Counter(d for x in ok for d in x["cited_domains"])
    summary = {
        "answers": len(ok), "errors": len(results) - len(ok),
        "mentioned": round(sum(x["mentioned"] for x in ok) / max(len(ok), 1), 3),
        "cited": round(sum(x["cited"] for x in ok) / max(len(ok), 1), 3),
        "retrieved": round(sum(x["retrieved"] for x in ok) / max(len(ok), 1), 3),
        "per_engine": per_engine,
        "top_cited_domains": sov.most_common(25),
        "cost_usd": round(COST[0], 3),
    }
    snap = {"date": datetime.date.today().isoformat(), "brand": brand, "summary": summary, "results": results}
    json.dump(snap, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps({k: v for k, v in summary.items() if k != "top_cited_domains"}), "| top cited:", [d for d, _ in sov.most_common(8)])


if __name__ == "__main__":
    a = sys.argv[1:]
    opt = lambda k, d=None: a[a.index(k) + 1] if k in a else d
    main(a[0], a[1], a[2], float(opt("--max-cost", 4)), opt("--engines", "").split(",") if opt("--engines") else None)
