import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { RfqForm } from "@/components/RfqForm";

export const metadata: Metadata = {
  title: "Request a volume quote",
  description:
    "Tell us what you need — product, grade, volume and market. We'll source, verify and document it, and reply with a lab report and quote within 48 hours.",
};

export default function ContactPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-24 md:grid-cols-[0.9fr_1.1fr] md:pt-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">RFQ</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Request a quote</span>
            </div>
            <h1 className="mt-5 text-4xl font-medium leading-tight text-green md:text-5xl">
              Move volume you can trust.
            </h1>
            <p className="mt-5 max-w-md text-lg text-stone">
              Tell us what you need and at what scale. We&apos;ll source, verify and document it — and route it through Hong Kong to you.
            </p>
            <div className="mono mt-8 space-y-2 border-t border-stone/15 pt-6 text-[11px] uppercase tracking-wide text-stone/60">
              <p>MOQ · 25 kg → full container</p>
              <p>Lead time · 2–4 weeks</p>
              <p>Incoterms · FOB / CIF / DDP</p>
            </div>
          </div>
          <Suspense fallback={<div className="rounded-xl border border-stone/15 bg-sand p-8 text-stone">Loading…</div>}>
            <RfqForm />
          </Suspense>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
