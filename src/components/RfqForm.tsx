"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProduct } from "@/data/catalog";

const FIELD = "w-full rounded-lg border border-stone/25 bg-white px-4 py-2.5 text-sm text-green outline-none transition-colors focus:border-green";
const LABEL = "mono mb-1.5 block text-[10px] uppercase tracking-wide text-stone/60";

export function RfqForm() {
  const params = useSearchParams();
  const productSlug = params.get("product");
  const product = productSlug ? getProduct(productSlug) : undefined;

  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-stone/15 bg-white p-10 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green text-xl text-oat">✓</span>
        <h2 className="mt-5 text-2xl font-medium text-green">We&apos;ve got it.</h2>
        <p className="mx-auto mt-3 max-w-sm text-stone">
          Thanks — we&apos;ll come back with a lab report and a quote, usually within 48 hours. Check your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-stone/15 bg-sand p-6 md:p-8">
      {/* honeypot */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="company">Company *</label>
          <input id="company" name="company" required className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="name">Name *</label>
          <input id="name" name="name" required className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="email">Work email *</label>
          <input id="email" name="email" type="email" required className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="market">Country / market</label>
          <input id="market" name="market" className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="product">Product</label>
          <input id="product" name="product" defaultValue={product?.name ?? ""} placeholder="e.g. Ceremonial matcha" className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="volume">Estimated volume</label>
          <input id="volume" name="volume" placeholder="e.g. 500 kg / month" className={FIELD} />
        </div>
      </div>

      <div className="mt-5">
        <label className={LABEL} htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={4} className={FIELD} placeholder="Grade, certification, timeline, anything specific…" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg bg-green px-6 py-3 text-sm font-medium text-oat transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send request"}
        </button>
        <span className="mono text-[11px] uppercase tracking-wide text-stone/50">Lab report &amp; quote within 48h</span>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-hibiscus">
          Something went wrong sending your request. Please email us directly at{" "}
          <a href="mailto:leonard@purematchapartners.com" className="underline">leonard@purematchapartners.com</a>.
        </p>
      )}
    </form>
  );
}
