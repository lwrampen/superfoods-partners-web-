import Image from "next/image";
import Link from "next/link";
import { OriginMap } from "@/components/OriginMap";
import { TraceABatch } from "@/components/TraceABatch";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PRODUCTS, ORIGINS, ORIGIN_LIST } from "@/data/catalog";

const PILLARS = [
  { n: "01", t: "Source", d: "Direct relationships at origin, worldwide." },
  { n: "02", t: "Verify", d: "Every batch lab-tested and validated." },
  { n: "03", t: "Document", d: "Complete traceability, origin to delivery." },
  { n: "04", t: "Scale", d: "From 25 kg to full container volume." },
];

const STEPS = [
  { n: "01", t: "Tell us your spec", d: "Product, grade, volume and market. A short brief is enough to get going." },
  { n: "02", t: "We sample & verify", d: "You taste, test and approve — before anything scales to volume." },
  { n: "03", t: "We document it", d: "A Verification Record and full COA travel with every batch." },
  { n: "04", t: "We ship via Hong Kong", d: "FOB, CIF or DDP — routed through the hub, in 2–4 weeks." },
];

const STATS = [
  { value: ORIGIN_LIST.length, suffix: "", l: "ORIGINS" },
  { value: new Set(ORIGIN_LIST.map((o) => o.country)).size, suffix: "", l: "COUNTRIES" },
  { value: 100, suffix: "%", l: "BATCH-TESTED" },
  { value: 1, suffix: "", l: "HUB · HONG KONG", amber: true },
];

const AUDIENCES = [
  "Beverage manufacturers",
  "Supplement & nutraceutical brands",
  "Foodservice & QSR chains",
  "Private label & co-packers",
  "Distributors & importers",
];

const CERTS = ["JAS", "EU ORGANIC", "USDA ORGANIC", "HACCP", "FSSC 22000", "KOSHER"];

export default function Home() {
  return (
    <>
      <SiteNav />

      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 pb-20 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:pt-28 md:pb-28">
          <Reveal>
            <p className="mono text-xs uppercase tracking-widest text-amber">Origin Intelligence™</p>
            <h1 className="mt-6 text-[3.25rem] font-medium leading-[1.02] tracking-tight text-green md:text-7xl">
              Sourced at scale.
              <br />
              Trusted at origin.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-stone">
              Every origin in the world, routed through one trusted hub in Hong Kong. Verified, documented, traceable.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-lg bg-green px-5 py-3 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                Request a volume quote
              </Link>
              <a href="#trace" className="rounded-lg border border-green/25 px-5 py-3 text-sm font-medium text-green transition-colors hover:bg-green/5">
                Trace a batch →
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15} y={28}>
            <OriginMap />
          </Reveal>
        </section>

        {/* CATALOG GRID */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <Reveal className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="mono text-[11px] text-amber">(01)</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Catalogue</span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-medium text-green">{ORIGIN_LIST.length} origins, one standard.</h2>
              <Link href="/catalog" className="mono text-[11px] uppercase tracking-widest text-stone/60 transition-colors hover:text-green">
                View all →
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p, i) => {
              const o = ORIGINS[p.originSlugs[0]];
              const label = p.grades ? p.grades.join(" · ") : p.category;
              return (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <Link
                    href={`/catalog/${p.slug}`}
                    className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1.5"
                    style={{ backgroundColor: p.accent }}
                  >
                    {p.img && (
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-[1800ms] ease-out group-hover:opacity-100"
                        style={{ backgroundImage: `url(${p.img})` }}
                      />
                    )}
                    <div className="absolute inset-0" style={{ backgroundColor: p.accent, opacity: 0.5 }} />
                    <span className="relative mono text-[10px] uppercase tracking-wide text-white/70">{label}</span>
                    <span className="relative">
                      <span className="block text-3xl font-medium leading-tight" style={{ color: p.tint }}>{p.name}</span>
                      <span className="mono mt-2 flex items-center gap-1 text-[10px] uppercase text-white/80">
                        {o.name === o.country ? o.name : `${o.name} · ${o.country}`}
                        <span className="translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* PILLAR BAND */}
        <section className="bg-green text-oat">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.08}>
                <p className="mono text-xs text-amber">{p.n}</p>
                <h3 className="mt-3 text-xl font-medium">{p.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-oat/70">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* TRACE A BATCH — signature */}
        <section id="trace" className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-12 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="mono text-[11px] text-amber">(02)</span>
                <span className="h-px w-8 bg-stone/30" />
                <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Trace a batch</span>
              </div>
              <h2 className="mt-5 text-4xl font-medium leading-tight text-green md:text-5xl">
                See exactly what you&apos;re buying.
              </h2>
              <p className="mt-4 text-stone">
                Pick a product and follow it from origin to your facility. Every batch arrives with a full Verification Record — the same checks we&apos;d want if we were the ones buying. Nothing hidden, nothing to chase down.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <TraceABatch />
            </Reveal>
          </div>
        </section>

        {/* HOW SOURCING WORKS */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-12 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="mono text-[11px] text-amber">(03)</span>
                <span className="h-px w-8 bg-stone/30" />
                <span className="mono text-[11px] uppercase tracking-widest text-stone/60">How sourcing works</span>
              </div>
              <h2 className="mt-5 text-4xl font-medium leading-tight text-green">Sourcing, without the guesswork.</h2>
              <p className="mt-4 text-stone">
                Tell us what you need; we handle origin, testing and documentation — and keep you in the loop the whole way. You approve before anything scales.
              </p>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="border-t border-stone/20 pt-5">
                    <p className="mono text-xs text-amber">{s.n}</p>
                    <h3 className="mt-3 text-lg font-medium text-green">{s.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <div className="mono mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-stone/15 pt-6 text-[11px] uppercase tracking-wide text-stone/70">
                <span>MOQ · 25 kg → full container</span>
                <span>Lead time · 2–4 weeks</span>
                <span>Incoterms · FOB / CIF / DDP</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* STAT BAND */}
        <section className="bg-green text-oat">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-20 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.l} delay={i * 0.08}>
                <p className={`text-5xl font-medium ${s.amber ? "text-amber" : "text-oat"}`}>
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mono mt-3 text-[11px] uppercase tracking-wide text-oat/60">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* AUDIENCES */}
        <section className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="mono text-[11px] text-amber">(04)</span>
                <span className="h-px w-8 bg-stone/30" />
                <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Who we supply</span>
              </div>
              <h2 className="mt-5 text-3xl font-medium text-green">Built for volume.</h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AUDIENCES.map((a, i) => (
                <Reveal key={a} delay={i * 0.07}>
                  <div className="rounded-xl border border-stone/15 bg-sand p-6 text-green transition-colors hover:border-green/30">
                    {a}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHY HONG KONG */}
        <section className="bg-forest text-oat">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.15fr] md:items-center">
            <div>
              <Image src="/logos/sfp-roundel-reversed.svg" alt="" width={76} height={76} className="opacity-90" />
              <p className="mono mt-8 text-[11px] uppercase tracking-widest text-amber">Why Hong Kong</p>
              <p className="mono mt-3 text-sm text-oat/55">22.32°N 114.17°E — where every origin converges</p>
            </div>
            <Reveal>
              <h2 className="text-3xl font-medium leading-tight text-oat md:text-4xl">
                One hub, so trust isn&apos;t scattered.
              </h2>
              <p className="mt-6 max-w-xl leading-relaxed text-oat/75">
                Asia&apos;s origins meet the world here. From a single bonded hub we consolidate, test and document every shipment — so you work with one partner who knows your spec, not a dozen brokers who don&apos;t.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-oat/75">
                And there are people behind it: a team you can call, in your timezone, who actually pick up. Part of the Pure Matcha Partners family.
              </p>
              <Link href="/about" className="mono mt-6 inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-amber transition-opacity hover:opacity-80">
                Our story <span>→</span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="max-w-xl">
              <div className="flex items-center gap-3">
                <span className="mono text-[11px] text-amber">(05)</span>
                <span className="h-px w-8 bg-stone/30" />
                <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Trusted by</span>
              </div>
              <h2 className="mt-5 text-3xl font-medium leading-tight text-green">
                For teams who can&apos;t afford a bad batch.
              </h2>
              <p className="mt-4 text-stone">
                Beverage, supplement and foodservice brands come to us when consistency isn&apos;t optional — and stay because the documentation is always there when they need it.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="mt-12 max-w-3xl border-l-2 border-amber pl-6">
                <blockquote className="text-2xl font-medium leading-snug text-green md:text-3xl">
                  &ldquo;They catch the things we&apos;d miss — and when our auditors ask for paperwork, it&apos;s already there.&rdquo;
                </blockquote>
                <figcaption className="mono mt-5 text-[11px] uppercase tracking-wide text-stone/60">
                  Head of Procurement · EU beverage brand
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mono mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-stone/15 pt-6 text-[11px] uppercase tracking-wide text-stone/45">
                <span>Global beverage brands</span>
                <span>Supplement makers</span>
                <span>Foodservice groups</span>
                <span>Private-label co-packers</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <section className="bg-green text-oat">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <Reveal>
              <h2 className="text-2xl font-medium">Certified, tested, documented.</h2>
              <div className="mt-7 flex flex-wrap gap-3">
                {CERTS.map((c) => (
                  <span key={c} className="mono rounded-lg border border-amber/40 px-4 py-2 text-xs uppercase text-oat">
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-28 text-center">
            <Reveal>
              <h2 className="text-4xl font-medium tracking-tight text-green md:text-5xl">Move volume you can trust.</h2>
              <p className="mx-auto mt-5 max-w-lg text-stone">
                Tell us what you need and at what scale. We&apos;ll source, verify and document it — and route it through Hong Kong to you.
              </p>
              <Link href="/contact" className="mt-9 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                Request a volume quote
              </Link>
              <p className="mono mt-5 text-[11px] uppercase tracking-wide text-stone/50">
                Send your spec — lab report &amp; quote within 48 hours
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
