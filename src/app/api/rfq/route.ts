import { buildRfqEmail } from "@/lib/rfqEmail";
import { Resend } from "resend";

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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RFQ: RESEND_API_KEY not set");
    return Response.json({ ok: false, error: "unconfigured" }, { status: 503 });
  }

  // Every request reaches the SFP inbox(es) and Robbert-Jan at Pure Matcha
  // Partners. RFQ_TO_EMAIL (comma-separated) sets the primary recipient(s);
  // robbert-jan@purematchapartners.com is always included.
  const to = Array.from(
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

  const { subject, html, text } = buildRfqEmail(data, "SFP");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject,
    html,
    text,
  });

  if (error) {
    console.error("RFQ send error:", error);
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
