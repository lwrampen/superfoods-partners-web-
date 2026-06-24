import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Verification — how every batch is tested & documented",
  description:
    "Origin Intelligence™: how Superfoods Partners tests, documents and traces every batch. Lab panels, the Verification Record™, certifications and answers to common sourcing questions.",
};

const STEPS = [
  { n: "01", t: "Source at origin", d: "Direct relationships with growers and processors, worldwide." },
  { n: "02", t: "Lab-test every batch", d: "Pesticide residue, heavy metals, microbiology, radiation — independently tested." },
  { n: "03", t: "Document & trace", d: "A Verification Record™ and full COA accompany every shipment." },
  { n: "04", t: "Route via Hong Kong", d: "Consolidated, bonded and shipped from one trusted hub." },
];

const PANEL = [
  "Pesticide residue (multi-residue screen)",
  "Heavy metals — lead, arsenic, cadmium, mercury",
  "Microbiology — total plate count, yeast & mould, pathogens",
  "Radiation (where applicable)",
  "Moisture, particle size & sensory",
];

const CERTS = ["JAS", "EU ORGANIC", "USDA ORGANIC", "HACCP", "FSSC 22000", "KOSHER"];

const FAQ = [
  { q: "What's your minimum order quantity?", a: "We supply from 25 kg up to full container volume. Sampling is available before you commit to a recurring program." },
  { q: "Do I get lab reports?", a: "Yes — every batch ships with a Verification Record™ and a full Certificate of Analysis (COA), covering pesticides, heavy metals, microbiology and more." },
  { q: "What are your lead times and Incoterms?", a: "Typically 2–4 weeks, consolidated and routed through our Hong Kong hub. We work FOB, CIF or DDP depending on your needs." },
  { q: "Can you do private label or custom blends?", a: "Yes. Through our Blend Library™ we support private-label and custom formulations for manufacturers and co-packers." },
  { q: "Which certifications do you hold?", a: "JAS, EU Organic, USDA Organic, HACCP, FSSC 22000 and Kosher, alongside independent lab testing on every batch." },
];

export default function VerificationPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24">
          <Reveal>
            <p className="mono text-xs uppercase tracking-widest text-amber">Origin Intelligence™</p>
            <h1 className="mt-5 max-w-2xl text-4xl font-medium leading-tight text-green md:text-5xl">
              Trust isn&apos;t a promise. It&apos;s a paper trail.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone">
              Every batch we ship is tested, documented and traceable — so your QA team, your auditors and your customers all get the same answer.
            </p>
          </Reveal>
        </section>

        {/* Process */}
        <section className="bg-green text-oat">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <p className="mono text-xs text-amber">{s.n}</p>
                <h3 className="mt-3 text-xl font-medium">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-oat/70">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Test panel + record */}
        <section className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-20 md:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-medium text-green">What we test, every batch.</h2>
            <ul className="mt-6 space-y-3">
              {PANEL.map((p) => (
                <li key={p} className="flex items-start gap-3 text-stone">
                  <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-green text-[10px] text-oat">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-stone/15 bg-white p-6">
              <p className="mono text-[10px] uppercase tracking-wide text-stone/50">Verification Record™</p>
              <p className="mt-3 leading-relaxed text-stone">
                A single document that travels with each batch: origin and coordinates, batch and COA references, the full test panel, certifications, and the route through Hong Kong. One source of truth — for you, your auditors and your customers.
              </p>
              <p className="mono mt-5 flex items-center gap-2 text-[11px] uppercase text-stone/70">
                <span className="h-2.5 w-2.5 rounded-full bg-amber" /> Routed via Hong Kong · 22.32°N 114.17°E
              </p>
            </div>
          </Reveal>
        </section>

        {/* Certs */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <Reveal>
              <h2 className="text-2xl font-medium text-green">Certified, tested, documented.</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {CERTS.map((c) => (
                  <span key={c} className="mono rounded-lg border border-green/25 px-4 py-2 text-xs uppercase text-green">{c}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-20">
          <Reveal>
            <h2 className="text-3xl font-medium text-green">Common questions</h2>
          </Reveal>
          <div className="mt-8 divide-y divide-stone/15">
            {FAQ.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium text-green">
                    {f.q}
                    <span className="mono text-amber transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-stone">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <Link href="/contact" className="mt-10 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
              Request a volume quote
            </Link>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
