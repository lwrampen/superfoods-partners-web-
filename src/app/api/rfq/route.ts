import { Resend } from "resend";

export const runtime = "nodejs";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const countryName = (code?: string) => {
  if (!code) return undefined;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
};
const NEED: Record<string, string> = { samples: "Samples", pricelist: "Price list", advice: "Advice", shop: "Shop access" };

export async function POST(req: Request) {
  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  // Honeypot — silently accept bots without sending.
  if (data.company_website) return Response.json({ ok: true });

  const { company, name, email } = data;
  if (!company || !name || !email) {
    return Response.json({ ok: false, error: "missing-fields" }, { status: 400 });
  }

  // "Shop access" requests go to the ERP first: it checks the VAT number and emails Leonard only, with approve /
  // reject buttons (Leonard, 23 Nov 2026). Needs ERP_ACCESS_REQUEST_URL + ACCESS_REQUEST_SECRET; without them, or when
  // the ERP fails, the request is emailed like before but only to Leonard, marked as shop access.
  const shop = data.need === "shop";
  if (shop && process.env.ERP_ACCESS_REQUEST_URL && process.env.ACCESS_REQUEST_SECRET) {
    try {
      const r = await fetch(process.env.ERP_ACCESS_REQUEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.ACCESS_REQUEST_SECRET}` },
        body: JSON.stringify({
          brand: "sfp",
          locale: data.locale,
          page: data.page,
          data: {
            "Full-name": name, "Company-name": company, Email: email, Country: data.country, Street: data.street,
            "Postal-code": data.zip, City: data.city, "VAT-number": data.vat, Product: data.product, Volume: data.volume, Message: data.message,
          },
        }),
        signal: AbortSignal.timeout(25_000),
      });
      if (r.ok) return Response.json({ ok: true });
      console.error("RFQ: ERP access request failed", r.status);
    } catch (e) {
      console.error("RFQ: ERP access request error", e instanceof Error ? e.message : e);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RFQ: RESEND_API_KEY not set");
    return Response.json({ ok: false, error: "unconfigured" }, { status: 503 });
  }

  // Every request reaches the SFP inbox(es) and Robbert-Jan at Pure Matcha
  // Partners. RFQ_TO_EMAIL (comma-separated) sets the primary recipient(s);
  // robbert-jan@purematchapartners.com is always included.
  const to = shop ? [process.env.ACCESS_REQUEST_FALLBACK_EMAIL || "leonard@purematchapartners.com"] : Array.from(
    new Set(
      [
        ...(process.env.RFQ_TO_EMAIL || "leonard@purematchapartners.com").split(","),
        "robbert-jan@purematchapartners.com",
      ]
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
  const from = process.env.RFQ_FROM_EMAIL || "Superfoods Partners <sourcing@superfoodspartners.com>";

  const row = (k: string, v?: string) =>
    v ? `<tr><td style="padding:4px 12px 4px 0;color:#5A5E53;font-size:13px">${k}</td><td style="padding:4px 0;color:#1E3D2A;font-size:13px"><strong>${esc(String(v))}</strong></td></tr>` : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <p style="color:#E0A23E;font-size:11px;letter-spacing:1px;text-transform:uppercase">${shop ? "Shop access request" : "New volume request"}</p>
      <h2 style="color:#1E3D2A;margin:4px 0 16px">${esc(company)}</h2>
      <table style="border-collapse:collapse">
        ${row("Name", name)}
        ${row("Email", email)}
        ${row("Need", NEED[data.need])}
        ${row("Country", countryName(data.country) ?? data.market)}
        ${row("Request", data.service === "blend" ? "Custom blend" : data.service === "packaging" ? "Custom packaging" : undefined)}
        ${row("Product", data.product)}
        ${row("Volume", data.volume)}
        ${row("Address", [data.street, [data.zip, data.city].filter(Boolean).join(" ")].filter(Boolean).join(", "))}
        ${row("VAT", data.vat)}
      </table>
      ${data.message ? `<p style="margin-top:16px;color:#1E3D2A;font-size:14px;white-space:pre-wrap">${esc(data.message)}</p>` : ""}
      <p style="margin-top:20px;color:#5A5E53;font-size:11px">Sent from superfoodspartners.com — reply to this email to reach ${esc(name)}.</p>
    </div>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `${shop ? "SHOP ACCESS request" : data.service === "blend" ? "Blend request" : data.service === "packaging" ? "Packaging request" : "RFQ"} — ${company}${data.product ? ` · ${data.product}` : ""}`,
    html,
  });

  if (error) {
    console.error("RFQ send error:", error);
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
