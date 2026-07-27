"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { getProduct } from "@/data/catalog";
import { localizeProduct } from "@/data/content.de";

const FIELD = "w-full rounded-lg border border-stone/25 bg-white px-4 py-2.5 text-sm text-green outline-none transition-colors focus:border-green";
const LABEL = "mono mb-1.5 block text-[10px] uppercase tracking-wide text-stone/60";

export function RfqForm() {
  const t = useTranslations("rfq");
  const locale = useLocale();
  const params = useSearchParams();
  const productSlug = params.get("product");
  const rawProduct = productSlug ? getProduct(productSlug) : undefined;
  const product = rawProduct ? localizeProduct(rawProduct, locale) : undefined;

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
        <h2 className="mt-5 display text-2xl text-green">{t("successHeading")}</h2>
        <p className="mx-auto mt-3 max-w-sm text-stone">
          {t("successBody")}
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
          <label className={LABEL} htmlFor="company">{t("company")} *</label>
          <input id="company" name="company" required className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="name">{t("name")} *</label>
          <input id="name" name="name" required className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="email">{t("email")} *</label>
          <input id="email" name="email" type="email" required className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="market">{t("market")}</label>
          <input id="market" name="market" className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="product">{t("product")}</label>
          <input id="product" name="product" defaultValue={product?.name ?? ""} placeholder={t("productPlaceholder")} className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="volume">{t("volume")}</label>
          <input id="volume" name="volume" placeholder={t("volumePlaceholder")} className={FIELD} />
        </div>
      </div>

      <div className="mt-5">
        <label className={LABEL} htmlFor="message">{t("message")}</label>
        <textarea id="message" name="message" rows={4} className={FIELD} placeholder={t("messagePlaceholder")} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg bg-green px-6 py-3 text-sm font-medium text-oat transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? t("sending") : t("submit")}
        </button>
        <span className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("replyNote")}</span>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-hibiscus">
          {t("errorText")}{" "}
          <a href="mailto:leonard@purematchapartners.com" className="underline">leonard@purematchapartners.com</a>.
        </p>
      )}
    </form>
  );
}
