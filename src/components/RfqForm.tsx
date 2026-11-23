"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { getProduct } from "@/data/catalog";
import { localizeProduct } from "@/data/content.i18n";
import { getBlend } from "@/data/blends";

// Request form in the Pure Matcha Partners layout (Leonard, 23 Nov 2026): what you need first (one tap), then who you
// are, then an optional note. "Shop access" asks for the business address and VAT number; those requests go to the
// ERP for approval (see /api/rfq).
const FIELD = "w-full rounded-lg border border-stone/25 bg-white px-4 py-2.5 text-sm text-green outline-none transition-colors focus:border-green";
const LABEL = "mb-1.5 block text-sm font-medium text-green";
const PILL = "inline-block cursor-pointer rounded-full border border-stone/25 bg-white px-4 py-2 text-sm text-green transition hover:border-green/50 peer-checked:border-green peer-checked:bg-green peer-checked:text-oat peer-focus-visible:ring-2 peer-focus-visible:ring-green/30";
const NEEDS = ["samples", "pricelist", "advice", "shop"] as const;
const VOLUMES = ["0–10 kg", "10–50 kg", "50–100 kg", "100–1,000 kg", "1,000–10,000 kg", "10,000 kg +"];
// ISO 3166-1 codes (+ Kosovo). Names come from the browser after mount: server and browser name lists can differ.
const COUNTRY_CODES = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW".split(" ");

const noop = () => () => {};
function useCountries(locale: string) {
  const client = useSyncExternalStore(noop, () => true, () => false);
  return useMemo(() => {
    if (!client) return [];
    const dn = new Intl.DisplayNames([locale], { type: "region" });
    return COUNTRY_CODES.map((code) => ({ code, name: dn.of(code) ?? code })).sort((x, y) => x.name.localeCompare(y.name, locale));
  }, [client, locale]);
}

function Step({ n, children, first }: { n: number; children: React.ReactNode; first?: boolean }) {
  return (
    <p className={`flex items-center gap-3 border-b border-stone/15 pb-3 text-[1.05rem] font-semibold text-green sm:col-span-2 ${first ? "" : "mt-4"}`}>
      <span className="mono grid h-7 w-7 place-items-center rounded-full bg-green text-[11px] text-oat">{n}</span>
      {children}
    </p>
  );
}

export function RfqForm() {
  const t = useTranslations("rfq");
  const locale = useLocale();
  const params = useSearchParams();
  const pathname = usePathname();
  const countries = useCountries(locale);
  const productSlug = params.get("product");
  const rawProduct = productSlug ? getProduct(productSlug) : undefined;
  const product = rawProduct ? localizeProduct(rawProduct, locale) : undefined;
  // Blending & packaging requests (?service=blend[&blend=<slug>] / ?service=packaging)
  const tb = useTranslations("blending");
  const rawService = params.get("service");
  const service = rawService === "blend" || rawService === "packaging" ? rawService : undefined;
  const blendSlug = params.get("blend");
  const blend = blendSlug ? getBlend(blendSlug) : undefined;
  const prefill =
    product?.name ??
    (service === "blend"
      ? blend
        ? t("prefillBlendNamed", { blend: tb(`blends.${blend.slug}.name`) })
        : t("prefillBlend")
      : service === "packaging"
        ? t("prefillPackaging")
        : "");

  const [need, setNeed] = useState<string>(pathname?.includes("/sample") ? "samples" : "");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const shop = need === "shop";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale, page: pathname }),
      });
      setStatus(res.ok ? "ok" : "error");
      // Fire a GA4 conversion event on a successful request. Mark `generate_lead` as a Key Event in GA4.
      if (res.ok) {
        const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
        gtag?.("event", "generate_lead", {
          form: "rfq",
          product: (data.product as string) || "unspecified",
          service: (data.service as string) || (data.need as string) || "supply",
        });
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-xl border border-stone/15 bg-white p-10 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green text-xl text-oat">✓</span>
        <h2 className="mt-5 display text-2xl text-green">{t("successHeading")}</h2>
        <p className="mx-auto mt-3 max-w-sm text-stone">{shop ? t("successShop") : t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-stone/15 bg-sand p-6 sm:grid-cols-2 md:p-8">
      {/* honeypot */}
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {service && <input type="hidden" name="service" value={service} />}

      <Step n={1} first>{t("stepNeed")}</Step>
      <fieldset className="sm:col-span-2">
        <legend className={LABEL}>{t("need")}</legend>
        <div className="flex flex-wrap gap-2">
          {NEEDS.map((k) => (
            <label key={k}>
              <input type="radio" name="need" value={k} checked={need === k} onChange={() => setNeed(k)} className="peer sr-only" />
              <span className={PILL}>{t(`needs.${k}`)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="product">{t("product")}</label>
        <input id="product" name="product" defaultValue={prefill} placeholder={t("productPlaceholder")} className={FIELD} />
      </div>
      <fieldset className="sm:col-span-2">
        <legend className={LABEL}>{t("volume")}</legend>
        <div className="flex flex-wrap gap-2">
          {VOLUMES.map((v) => (
            <label key={v}>
              <input type="radio" name="volume" value={v} className="peer sr-only" />
              <span className={PILL}>{v}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Step n={2}>{t("stepYou")}</Step>
      <div>
        <label className={LABEL} htmlFor="name">{t("name")} <span className="text-hibiscus">*</span></label>
        <input id="name" name="name" required className={FIELD} />
      </div>
      <div>
        <label className={LABEL} htmlFor="company">{t("company")} <span className="text-hibiscus">*</span></label>
        <input id="company" name="company" required className={FIELD} />
      </div>
      <div>
        <label className={LABEL} htmlFor="email">{t("email")} <span className="text-hibiscus">*</span></label>
        <input id="email" name="email" type="email" required className={FIELD} />
      </div>
      <div>
        <label className={LABEL} htmlFor="country">{t("country")}{shop && <span className="text-hibiscus"> *</span>}</label>
        <select id="country" name="country" required={shop} defaultValue="" className={`${FIELD} cursor-pointer`}>
          <option value="" disabled>{t("choose")}</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>
      {shop && (
        <>
          <p className="text-[13px] text-stone sm:col-span-2">{t("shopNote")}</p>
          <div>
            <label className={LABEL} htmlFor="street">{t("street")} <span className="text-hibiscus">*</span></label>
            <input id="street" name="street" required className={FIELD} />
          </div>
          <div>
            <label className={LABEL} htmlFor="zip">{t("zip")} <span className="text-hibiscus">*</span></label>
            <input id="zip" name="zip" required className={FIELD} />
          </div>
          <div>
            <label className={LABEL} htmlFor="city">{t("city")} <span className="text-hibiscus">*</span></label>
            <input id="city" name="city" required className={FIELD} />
          </div>
          <div>
            <label className={LABEL} htmlFor="vat">{t("vat")}</label>
            <input id="vat" name="vat" className={FIELD} />
          </div>
        </>
      )}

      <Step n={3}>{t("stepMore")} ({t("optional")})</Step>
      <div className="sm:col-span-2">
        <label className={LABEL} htmlFor="message">{t("message")}</label>
        <textarea id="message" name="message" rows={4} className={FIELD} placeholder={t("messagePlaceholder")} />
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2 sm:col-span-2">
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
        <p className="text-sm text-hibiscus sm:col-span-2">
          {t("errorText")}{" "}
          <a href="mailto:leonard@purematchapartners.com" className="underline">leonard@purematchapartners.com</a>.
        </p>
      )}
    </form>
  );
}
