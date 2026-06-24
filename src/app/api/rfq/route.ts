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

  const to = process.env.RFQ_TO_EMAIL || "leonard@bouwportaal.nl";
  const from = process.env.RFQ_FROM_EMAIL || "Superfoods Partners <onboarding@resend.dev>";

  const row = (k: string, v?: string) =>
    v ? `<tr><td style="padding:4px 12px 4px 0;color:#5A5E53;font-size:13px">${k}</td><td style="padding:4px 0;color:#1E3D2A;font-size:13px"><strong>${v}</strong></td></tr>` : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <p style="color:#E0A23E;font-size:11px;letter-spacing:1px;text-transform:uppercase">New volume request</p>
      <h2 style="color:#1E3D2A;margin:4px 0 16px">${company}</h2>
      <table style="border-collapse:collapse">
        ${row("Name", name)}
        ${row("Email", email)}
        ${row("Market", data.market)}
        ${row("Product", data.product)}
        ${row("Volume", data.volume)}
      </table>
      ${data.message ? `<p style="margin-top:16px;color:#1E3D2A;font-size:14px;white-space:pre-wrap">${data.message}</p>` : ""}
      <p style="margin-top:20px;color:#5A5E53;font-size:11px">Sent from superfoodspartners.com — reply to this email to reach ${name}.</p>
    </div>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `RFQ — ${company}${data.product ? ` · ${data.product}` : ""}`,
    html,
  });

  if (error) {
    console.error("RFQ send error:", error);
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
