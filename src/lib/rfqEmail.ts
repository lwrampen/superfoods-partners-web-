// Builds the RFQ notification email (subject, HTML, plain text).
// Kept free of framework imports so it can be rendered and previewed on its own.

export type RfqData = Record<string, string | undefined>;

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const SITE = "https://www.superfoodspartners.com";
// Logo in white on the dark brand bar. Add a PMP entry here when PMP reuses this builder.
const BRANDS: Record<string, { src: string; alt: string }> = {
  SFP: { src: `${SITE}/email/sfp-lockup-light.png`, alt: "Superfoods Partners" },
};

const NEED: Record<string, string> = { samples: "Samples", pricelist: "Price list", advice: "Advice", shop: "Shop access" };

const countryName = (code?: string) => {
  if (!code) return undefined;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
};

export function buildRfqEmail(data: RfqData, brand = "SFP", shop = false) {
  const company = (data.company ?? "").trim();
  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const service =
    data.service === "blend" ? "Custom blend" : data.service === "packaging" ? "Custom packaging" : "";
  const need = NEED[data.need ?? ""] ?? "";
  const badge = shop ? "Shop access" : need || service || "Volume request";
  const country = countryName(data.country) ?? data.market;
  const address = [data.street, [data.zip, data.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  const vat = data.vat || (data.noVat ? "No VAT number – charge VAT" : "");

  const fields: [string, string | undefined][] = [
    ["Company", company],
    ["Name", name],
    ["Email", email],
    ["Phone", data.phone],
    ["Country", country],
    ["Address", address],
    ["VAT number", vat],
    ["Looking for", need],
    ["Type", service],
    ["Product", data.product],
    ["Blend", data.blend],
    ["Volume", data.volume],
  ];
  const lines = fields
    .map(([k, v]) => [k, (v ?? "").trim()] as [string, string])
    .filter(([, v]) => v);
  const message = (data.message ?? "").trim();

  // WhatsApp-ready: *bold* labels, one field per line, no tables or HTML.
  const whatsapp = [
    `*${brand} · ${shop ? "Shop access request" : "New request"}*`,
    "",
    ...lines.map(([k, v]) => `*${k}:* ${v}`),
    ...(message ? ["", "*Message:*", message] : []),
  ].join("\n");

  const text = `${whatsapp}\n\n—\nSent from the website. Reply to this email to reach ${name}.`;

  const logo = BRANDS[brand] ?? BRANDS.SFP;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(whatsapp)}`;
  const copyUrl = `${SITE}/rfq-copy.html#${Buffer.from(whatsapp, "utf8").toString("base64url")}`;
  const font = "Arial,Helvetica,sans-serif";

  const html = `
    <div style="background:#f6f6f3;padding:20px 12px;font-family:${font}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #eceae2">
        <tr><td style="background:#16240f;padding:10px 20px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><img src="${logo.src}" alt="${esc(logo.alt)}" height="30" style="display:block;height:30px;width:auto;border:0"></td>
            <td align="right" style="font-family:${font};font-size:11px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase;color:#8cc541">${shop ? "Shop access" : "New request"}</td>
          </tr></table>
        </td></tr>
        <tr><td style="font-size:0;line-height:0;height:3px;background:#8cc541"></td></tr>
        <tr><td style="padding:22px 20px 8px;color:#16240f;font-size:15px;line-height:1.55">
          ${lines
            .map(([k, v]) => `<div style="margin:0 0 3px"><strong>${k}:</strong> ${k === "Email" ? `<a href="mailto:${esc(v)}" style="color:#16240f">${esc(v)}</a>` : esc(v)}</div>`)
            .join("")}
          ${message ? `<div style="margin-top:14px"><strong>Message:</strong></div><div style="white-space:pre-wrap">${esc(message)}</div>` : ""}
        </td></tr>
        <tr><td style="padding:16px 20px 14px">
          <a href="${copyUrl}" style="display:inline-block;background:#16240f;color:#ffffff;font-weight:bold;font-size:14px;text-decoration:none;padding:11px 18px;border-radius:8px;margin:0 8px 8px 0">Copy</a>
          <a href="${waUrl}" style="display:inline-block;background:#ffffff;color:#16240f;font-weight:bold;font-size:14px;text-decoration:none;padding:10px 17px;border-radius:8px;border:1px solid #16240f;margin:0 8px 8px 0">Share on WhatsApp</a>
        </td></tr>
        <tr><td style="padding:2px 20px 22px;color:#565b4e;font-size:11px">Reply to this email to reach ${esc(name)}.</td></tr>
      </table>
    </div>`;

  const subject = `${brand} ${shop ? "SHOP ACCESS request" : `· ${badge}`} — ${company || name}${data.product ? ` · ${data.product}` : ""}`;

  return { subject, html, text, whatsapp };
}
