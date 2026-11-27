// The team notification for SFP request-form submissions: a branded, readable email (see lead-email.ts).
import { renderLeadEmail, type Brand } from "@/lib/lead-email";

const SITE = "https://www.superfoodspartners.com";
const BRAND: Brand = {
  name: "Superfoods Partners", site: SITE, logo: `${SITE}/email/sfp-lockup-light.png`, logoWidth: 180, logoHeight: 60,
  dark: "#16240F", accent: "#8CC541", ink: "#16240F", muted: "#565B4E", surface: "#F6F6F3", tint: "#ECEAE2", line: "#ECEAE2",
  stripe: ["#8CC541", "#B24A18", "#AE1D49", "#5A338C"], // the colour bar from the SFP logo
};
const NEED: Record<string, string> = { samples: "Samples", pricelist: "Price list", advice: "Advice", shop: "Shop access" };
const countryName = (code?: string) => {
  if (!code) return undefined;
  try {
    return `${new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code} (${code})`;
  } catch {
    return code;
  }
};

export function buildLeadEmail(data: Record<string, string>, shop: boolean) {
  const service = data.service === "blend" ? "Custom blend" : data.service === "packaging" ? "Custom packaging" : undefined;
  const badge = shop ? "Shop access" : NEED[data.need] ?? service ?? "Volume request";
  const country = countryName(data.country) ?? data.market;
  const address = [data.street, [data.zip, data.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const page = data.page ? `${SITE}${data.page}` : undefined;
  const received = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Amsterdam" }).format(new Date());
  const { html, text } = renderLeadEmail({
    brand: BRAND,
    badge,
    title: data.company || data.name,
    subtitle: [data.name, country].filter(Boolean).join(" · "),
    facts: [["Looking for", badge], ["Volume", data.volume], ["Country", country?.replace(/ \([A-Z]{2}\)$/, "")]],
    replyEmail: data.email,
    replyName: data.name,
    replySubject: "Your request to Superfoods Partners",
    sections: [
      { title: "Request", rows: [["Looking for", NEED[data.need]], ["Service", service], ["Products", data.product], ["Blend", data.blend], ["Volume", data.volume]] },
      { title: "Contact", rows: [["Name", data.name], ["Company", data.company], ["Email", data.email], ["Phone", data.phone], ["Country", country]] },
      { title: "Company details", rows: [["Address", address], ["VAT number", data.vat || (data.noVat ? "No VAT number – charge VAT" : undefined)]] },
    ],
    message: data.message,
    meta: [["Page", page], ["Language", (data.locale || "en").toUpperCase()], ["Received", `${received} (Amsterdam)`]],
  });
  const subject = `SFP ${shop ? "SHOP ACCESS request" : `· ${badge}`} — ${data.company || data.name}${data.product ? ` · ${data.product}` : ""}`;
  return { subject, html, text };
}
