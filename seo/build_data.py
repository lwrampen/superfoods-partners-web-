#!/usr/bin/env python3
"""Merge rankings-*.json + metrics-*.json snapshots into dashboard/data.json (latest + history).
Usage: python3 build_data.py snapshots_dir out.json"""
import sys, json, glob, os

TARGETS = {  # top-3 goal per cluster for the current roadmap horizon
    "Matcha wholesale": "Top-10 US, top-3 EU", "Private label": "Top-10 US",
    "Ube": "Top-10 US (B2B terms)", "Hojicha": "Top-10 US (B2B terms)",
    "Hibiscus": "Top-10 US", "Superfood powders": "Top-10 US", "Mushroom powders": "Top-20 US"}


def load(pattern):
    out = []
    for f in sorted(glob.glob(pattern)):
        out.append(json.load(open(f, encoding="utf-8")))
    return out


def main(d, out):
    ranks, mets = load(os.path.join(d, "rankings-*.json")), load(os.path.join(d, "metrics-*.json"))
    r, m = ranks[-1], mets[-1]
    kws = r["results"]
    clusters = {}
    for k in kws:
        c = clusters.setdefault(k["cluster"], {"name": k["cluster"], "markets": set(), "volume": 0,
                                               "sfp_best": None, "pmp_best": None, "keywords": 0, "sfp_top10": 0})
        c["markets"].add(k["market"]); c["volume"] += k.get("volume") or 0; c["keywords"] += 1
        for key in ("sfp", "pmp"):
            p = k.get("pos_" + key)
            if p and (c[key + "_best"] is None or p < c[key + "_best"]):
                c[key + "_best"] = p
        if k.get("pos_sfp") and k["pos_sfp"] <= 10:
            c["sfp_top10"] += 1
    for c in clusters.values():
        c["markets"] = sorted(c["markets"]); c["target"] = TARGETS.get(c["name"], "")
        lead = [k for k in kws if k["cluster"] == c["name"] and k["top3"]]
        lead.sort(key=lambda k: -(k.get("volume") or 0))
        c["leader"] = lead[0]["top3"][0] if lead else ""
    history = []
    mets_by_date = {x["date"]: x for x in mets}
    for x in ranks:
        res = x["results"]
        mm = mets_by_date.get(x["date"], {})
        history.append({
            "date": x["date"],
            "sfp_top50": sum(1 for k in res if k.get("pos_sfp")),
            "sfp_top10": sum(1 for k in res if (k.get("pos_sfp") or 99) <= 10),
            "sfp_top3": sum(1 for k in res if (k.get("pos_sfp") or 99) <= 3),
            "pmp_top50": sum(1 for k in res if k.get("pos_pmp")),
            "clicks28": (mm.get("gsc") or {}).get("d28", {}).get("clicks"),
            "ref_sfp": (mm.get("ref_domains") or {}).get("superfoodspartners.com", {}).get("count")})
    gap = m.get("link_gap") or next((x["link_gap"] for x in reversed(mets) if x.get("link_gap")), [])
    data = {"updated": r["date"], "gsc": m.get("gsc"), "history": history,
            "clusters": sorted(clusters.values(), key=lambda c: -c["volume"]),
            "keywords": sorted(kws, key=lambda k: (k["cluster"], -(k.get("volume") or 0))),
            "ref_domains": {k: v["count"] for k, v in (m.get("ref_domains") or {}).items()},
            "prospects": [p for p in gap if p["relevant"]][:60] + [p for p in gap if not p["relevant"]][:20],
            "prospects_total": len(gap)}
    json.dump(data, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("wrote", out, "| clusters", len(data["clusters"]), "| keywords", len(kws), "| prospects", len(data["prospects"]))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
