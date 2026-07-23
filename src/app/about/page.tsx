import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { OriginPhoto } from "@/components/OriginPhoto";

export const metadata: Metadata = {
  title: "About — the trusted superfood sourcing partner",
  description:
    "Superfoods Partners is the Hong Kong–based sourcing arm of the Pure Matcha Partners family. We don't aim to be the largest supplier — we aim to be the most trusted.",
};

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

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-16 md:grid-cols-[1.05fr_0.95fr] md:pt-24 md:pb-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">About</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Who we are</span>
            </div>
            <h1 className="display mt-5 max-w-2xl text-5xl leading-[1.04] text-green md:text-6xl">
              The source is the story.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">
              Superfoods Partners is the sourcing engine of the Pure Matcha Partners family. We buy
              direct from the farms that grow the world&apos;s finest superfoods and move large,
              verified volumes to the biggest manufacturers — routed, when it helps, through our hub
              in Hong Kong.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone">
              We don&apos;t aspire to be the largest supplier. We aspire to be the one you never have
              to worry about.
            </p>
          </Reveal>
          <Reveal delay={0.12} y={28}>
            <OriginPhoto
              src="/photos/grower-portrait.jpg"
              alt="A grower in the shade-grown gardens"
              caption="A GROWER IN THE GARDENS AT HARVEST"
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/5] w-full shadow-[0_30px_80px_-40px_rgba(20,39,27,0.55)]"
            />
          </Reveal>
        </section>

        {/* CORE MODEL */}
        <section className="bg-green text-oat">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-14 max-w-xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="mono text-[11px] text-amber">Core model</span>
                <span className="h-px w-8 bg-oat/25" />
                <span className="mono text-[11px] uppercase tracking-widest text-oat/60">How we operate</span>
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

        {/* Hong Kong / the family — with a face behind it */}
        <section className="bg-forest text-oat">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <Reveal>
              <p className="mono text-[11px] uppercase tracking-widest text-amber">Why Hong Kong</p>
              <p className="mono mt-3 text-sm text-oat/55">22.32°N 114.17°E — where every origin converges</p>
              <h2 className="display mt-6 text-4xl leading-tight text-oat md:text-5xl">One hub, so trust isn&apos;t scattered.</h2>
              <p className="mt-6 max-w-xl leading-relaxed text-oat/75">
                Asia&apos;s origins meet the world here. From a single bonded hub we consolidate, test
                and document every shipment — so you work with one partner who knows your spec, not a
                dozen brokers who don&apos;t.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-oat/75">
                And there are people behind it: a team you can call, in your timezone, who actually
                pick up. Part of the Pure Matcha Partners family.
              </p>
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

        <section className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-28 text-center">
            <Reveal>
              <h2 className="display text-4xl tracking-tight text-green md:text-5xl">Move volume you can trust.</h2>
              <Link href="/contact" className="mt-8 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                Request a volume quote
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
