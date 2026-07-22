import Link from "next/link";
import { TraceABatch } from "@/components/TraceABatch";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { OriginPhoto } from "@/components/OriginPhoto";
import { PRODUCTS, ORIGINS, ORIGIN_LIST } from "@/data/catalog";

// People & Planet — the source is a relationship, not a transaction
const PEOPLE = [
  { t: "Growers first", d: "Long-term contracts and fair pricing that let farms invest in the land." },
  { t: "Care for the ground", d: "Shade-grown, low-intervention practices, protected across generations." },
  { t: "Provenance, proven", d: "A name, a place and a coordinate behind every batch we route." },
];

// Core Model — infrastructure, not a middleman (the 10 commitments)
const CORE_MODEL = [
  { n: "01", t: "Not a broker", d: "An integrated sourcing and supply company — we build partnerships at origin, we don't simply trade ingredients." },
  { n: "02", t: "Farm investment", d: "We invest alongside producers in farms, facilities, quality and long-term capacity." },
  { n: "03", t: "Operational support", d: "Sourcing, compliance, quality control, logistics and project management across the chain." },
  { n: "04", t: "Multi-origin sourcing", d: "We transparently combine origins for consistent quality, security of supply and scale." },
  { n: "05", t: "Hong Kong hub", d: "One entity manages sourcing, suppliers, QA, compliance and logistics across Asia." },
  { n: "06", t: "Independent verification", d: "Every batch tested against the highest international quality and food-safety standards." },
  { n: "07", t: "Compliance infrastructure", d: "Documentation, traceability and compliance systems built for global manufacturers." },
  { n: "08", t: "Enterprise-scale supply", d: "Built for high volume — consistent quality, reliable logistics, scalable operations." },
  { n: "09", t: "End-to-end supply chain", d: "Farm to final delivery: sourcing, QA, documentation, logistics — managed by us." },
  { n: "10", t: "Long-term partnerships", d: "Lasting relationships with growers, processors and customers — not transactional trading." },
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

const CERTS = ["JAS", "EU ORGANIC", "USDA ORGANIC", "HACCP", "FSSC 22000", "KOSHER"];

function Marker({ n, label, color = "text-stone/60" }: { n: string; label: string; color?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="mono text-[11px] text-amber">{n}</span>
      <span className="h-px w-8 bg-stone/30" />
      <span className={`mono text-[11px] uppercase tracking-widest ${color}`}>{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteNav />

      <main className="flex-1">
        {/* HERO — lead with a place and the people who tend it */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 pb-20 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:pt-24 md:pb-28">
          <Reveal>
            <p className="mono text-xs uppercase tracking-widest text-amber">Origin Intelligence™</p>
            <h1 className="display mt-6 text-[3.4rem] leading-[1.03] text-green md:text-[4.6rem]">
              Sourced at scale.
              <br />
              Trusted at origin.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-stone">
              Grown by people we know, in places we return to season after season — then tested,
              documented and moved at the scale you need.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-lg bg-green px-5 py-3 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                Request a volume quote
              </Link>
              <a href="#trace" className="rounded-lg border border-green/25 px-5 py-3 text-sm font-medium text-green transition-colors hover:bg-green/5">
                Trace a batch →
              </a>
            </div>
            <p className="mono mt-8 text-[11px] uppercase tracking-wide text-stone/55">
              A Pure Matcha Partners company · Direct from origin
            </p>
          </Reveal>
          <Reveal delay={0.15} y={28}>
            <OriginPhoto
              src="/photos/hero-shade-nets.jpg"
              alt="A grower among the shade-grown tea gardens at harvest"
              caption="ORIGIN — SHADE-GROWN GARDENS AT HARVEST"
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/5] w-full shadow-[0_30px_80px_-40px_rgba(20,39,27,0.55)]"
            />
          </Reveal>
        </section>

        {/* CATALOGUE */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <Reveal className="mb-8">
            <Marker n="(01)" label="Catalogue" />
            <div className="flex items-end justify-between">
              <h2 className="display text-4xl text-green">{ORIGIN_LIST.length} origins, one standard.</h2>
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
                        className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-[1200ms] ease-out group-hover:opacity-100"
                        style={{ backgroundImage: `url(${p.img})` }}
                      />
                    )}
                    <div className="absolute inset-0" style={{ backgroundColor: p.accent, opacity: 0.5 }} />
                    <span className="relative mono text-[10px] uppercase tracking-wide text-white/70">{label}</span>
                    <span className="relative">
                      <span className="display block text-3xl leading-tight" style={{ color: p.tint }}>{p.name}</span>
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

        {/* PEOPLE & PLANET — the source is a relationship */}
        <section className="bg-oat">
          <div className="mx-auto grid max-w-6xl items-stretch gap-12 px-6 py-24 md:grid-cols-[1fr_0.8fr]">
            <Reveal>
              <Marker n="(02)" label="People & Planet" color="text-lionsmane" />
              <h2 className="display max-w-xl text-4xl leading-tight text-green md:text-5xl">
                The source is a relationship, not a transaction.
              </h2>
              <p className="mt-6 max-w-lg text-stone">
                We buy directly from growers we know by name, in regions we return to season after
                season. Their care for the soil is the first quality check — long before the lab.
                When we say &ldquo;trusted at origin,&rdquo; we mean there is a person standing at that
                origin, and we have shaken their hand.
              </p>
              <div className="mt-9 flex flex-col">
                {PEOPLE.map((p, i) => (
                  <div
                    key={p.t}
                    className={`border-t border-stone/15 py-4 ${i === PEOPLE.length - 1 ? "border-b" : ""}`}
                  >
                    <h3 className="display text-xl text-green">{p.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone">{p.d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.12} y={28}>
              <OriginPhoto
                src="/photos/grower-portrait.jpg"
                alt="A grower in the shade-grown gardens"
                caption="A GROWER IN THE GARDENS AT HARVEST"
                className="h-full min-h-[420px] w-full"
                sizes="(min-width: 768px) 36vw, 100vw"
              />
            </Reveal>
          </div>
        </section>

        {/* CORE MODEL — infrastructure, not a middleman */}
        <section className="bg-green text-oat">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-14 max-w-xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="mono text-[11px] text-amber">(03)</span>
                <span className="h-px w-8 bg-oat/25" />
                <span className="mono text-[11px] uppercase tracking-widest text-oat/60">Core model</span>
              </div>
              <h2 className="display text-4xl leading-tight md:text-5xl">Infrastructure, not a middleman.</h2>
              <p className="mt-5 text-oat/75">
                Ten commitments define how we operate — from the farm to your facility. This is the
                model behind the story: why buyers trust us with volume, not just with warmth.
              </p>
            </Reveal>
            <div className="grid gap-x-12 sm:grid-cols-2">
              {CORE_MODEL.map((c, i) => (
                <Reveal key={c.n} delay={(i % 2) * 0.05}>
                  <div className={`flex gap-5 border-t border-oat/15 py-5 ${i === CORE_MODEL.length - 1 || i === CORE_MODEL.length - 2 ? "border-b" : ""}`}>
                    <span className="mono pt-1 text-[13px] text-amber">{c.n}</span>
                    <div>
                      <h3 className="display text-xl">{c.t}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-oat/70">{c.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TRACE A BATCH — signature, framed as trust */}
        <section id="trace" className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-12 max-w-xl">
              <Marker n="(04)" label="Trace a batch" />
              <h2 className="display text-4xl leading-tight text-green md:text-5xl">
                See exactly what you&apos;re buying.
              </h2>
              <p className="mt-4 text-stone">
                Pick a product and follow it from origin to your facility. Every batch arrives with a
                full Verification Record — the same checks we&apos;d want if we were the ones buying.
                Nothing hidden, nothing to chase down.
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
              <Marker n="(05)" label="How sourcing works" />
              <h2 className="display text-4xl leading-tight text-green">Sourcing, without the guesswork.</h2>
              <p className="mt-4 text-stone">
                Tell us what you need; we handle origin, testing and documentation — and keep you in
                the loop the whole way. You approve before anything scales.
              </p>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="border-t border-stone/20 pt-5">
                    <p className="mono text-xs text-amber">{s.n}</p>
                    <h3 className="display mt-3 text-lg text-green">{s.t}</h3>
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
        <section className="bg-forest text-oat">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 pt-20 pb-12 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.l} delay={i * 0.08}>
                <p className={`display text-6xl ${s.amber ? "text-amber" : "text-oat"}`}>
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mono mt-3 text-[11px] uppercase tracking-wide text-oat/60">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* WHY HONG KONG — with a face behind it */}
        <section className="bg-forest text-oat">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <Reveal>
              <p className="mono text-[11px] uppercase tracking-widest text-amber">Why Hong Kong</p>
              <p className="mono mt-3 text-sm text-oat/55">22.32°N 114.17°E — where every origin converges</p>
              <h2 className="display mt-6 text-4xl leading-tight text-oat md:text-5xl">
                One hub, so trust isn&apos;t scattered.
              </h2>
              <p className="mt-6 max-w-xl leading-relaxed text-oat/75">
                Asia&apos;s origins meet the world here. From a single bonded hub we consolidate, test
                and document every shipment — so you work with one partner who knows your spec, not a
                dozen brokers who don&apos;t.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-oat/75">
                And there are people behind it: a team you can call, in your timezone, who actually
                pick up. Part of the Pure Matcha Partners family.
              </p>
              <Link href="/about" className="mono mt-6 inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-amber transition-opacity hover:opacity-80">
                Our story <span>→</span>
              </Link>
            </Reveal>
            <Reveal delay={0.12} y={28}>
              <OriginPhoto
                src="/photos/harvest-transport.jpg"
                alt="Loaded harvest moving from the gardens"
                caption="WHOLE-FIELD HARVEST — MOVED AT SCALE"
                className="aspect-[4/5] w-full"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </Reveal>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="max-w-xl">
              <Marker n="(06)" label="Trusted by" />
              <h2 className="display text-4xl leading-tight text-green">
                For teams who can&apos;t afford a bad batch.
              </h2>
              <p className="mt-4 text-stone">
                Beverage, supplement and foodservice brands come to us when consistency isn&apos;t
                optional — and stay because the documentation is always there when they need it.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="mt-12 max-w-3xl border-l-2 border-amber pl-6">
                <blockquote className="display-italic text-2xl leading-snug text-green md:text-3xl">
                  &ldquo;They catch the things we&apos;d miss — and when our auditors ask for
                  paperwork, it&apos;s already there.&rdquo;
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
              <h2 className="display text-3xl">Certified, tested, documented.</h2>
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
              <h2 className="display text-5xl tracking-tight text-green md:text-6xl">The source is the story.</h2>
              <p className="mx-auto mt-5 max-w-lg text-stone">
                Tell us what you need and at what scale. We&apos;ll source, verify and document it —
                and route it through Hong Kong to you.
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
