import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About — the trusted superfood sourcing partner",
  description:
    "Superfoods Partners is the Hong Kong–based sourcing arm of the Pure Matcha Partners family. We don't aim to be the largest supplier — we aim to be the most trusted.",
};

const PILLARS = [
  { n: "01", t: "Scale", d: "We think in containers, not sachets." },
  { n: "02", t: "Verification", d: "Every batch tested, documented, traceable." },
  { n: "03", t: "Flow", d: "Asia's crossroads — we route the world's origins through Hong Kong." },
  { n: "04", t: "Trust", d: "Infrastructure, not marketing." },
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">About</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Who we are</span>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-tight text-green md:text-5xl">
              Trust is our product.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone">
              Superfoods Partners is the Hong Kong–based sourcing and trading arm of the Pure Matcha Partners family. Where Pure Matcha Partners drives sales across Europe and North America, we are the sourcing engine — moving large volumes of verified superfoods to manufacturers, routed to the world through one trusted hub.
            </p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">
              We don&apos;t aim to be the largest supplier. We aim to be the <strong className="text-green">most trusted</strong> — because trust, not the ingredient, is what buyers actually buy.
            </p>
          </Reveal>
        </section>

        {/* Pillars */}
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

        {/* Hong Kong / the family */}
        <section className="bg-forest text-oat">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.15fr] md:items-center">
            <div>
              <Image src="/logos/sfp-roundel-reversed.svg" alt="" width={76} height={76} className="opacity-90" />
              <p className="mono mt-8 text-[11px] uppercase tracking-widest text-amber">Why Hong Kong</p>
              <p className="mono mt-3 text-sm text-oat/55">22.32°N 114.17°E — where every origin converges</p>
            </div>
            <Reveal>
              <h2 className="text-3xl font-medium leading-tight text-oat md:text-4xl">One hub, so trust isn&apos;t scattered.</h2>
              <p className="mt-6 max-w-xl leading-relaxed text-oat/75">
                Asia&apos;s origins meet the world here. From a single bonded hub we consolidate, test and document every shipment — so you work with one partner who knows your spec, not a dozen brokers who don&apos;t.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-oat/75">
                And there are people behind it: a team you can call, in your timezone, who actually pick up. Part of the Pure Matcha Partners family.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-24 text-center">
            <Reveal>
              <h2 className="text-4xl font-medium tracking-tight text-green">Move volume you can trust.</h2>
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
