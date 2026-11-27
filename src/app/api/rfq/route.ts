import { Resend } from "resend";
import { buildLeadEmail } from "@/lib/lead-email-sfp";

export const runtime = "nodejs";

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

  // Sales needs the country of every request (Leonard, 27 Nov 2026): the form marks it required, and the API enforces it.
  if (!data.country?.trim()) {
    return Response.json({ ok: false, error: "missing-country" }, { status: 400 });
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
            "Postal-code": data.zip, City: data.city, "VAT-number": data.vat, "No-VAT": data.noVat, Phone: data.phone, Product: data.product, Volume: data.volume, Message: data.message,
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

  const { subject, html, text } = buildLeadEmail(data, shop);
  const { error } = await new Resend(apiKey).emails.send({ from, to, replyTo: email, subject, html, text });

  if (error) {
    console.error("RFQ send error:", error);
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
