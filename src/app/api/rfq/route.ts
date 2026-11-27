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

  const esc = (v: string) =>
    v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const requestType =
    data.service === "blend" ? "Custom blend" : data.service === "packaging" ? "Custom packaging" : "";

  // One line per field, in order. Shared by the plain-text part and the
  // copy-paste block so both always match.
  const fields: [string, string | undefined][] = [
    ["Company", company],
    ["Name", name],
    ["Email", email],
    ["Market", data.market],
    ["Request", requestType],
    ["Product", data.product],
    ["Volume", data.volume],
  ];
  const lines = fields.filter(([, v]) => v && v.trim()) as [string, string][];

  // WhatsApp-ready: *bold* labels, one field per line, no tables or HTML.
  const whatsapp = [
    "*New volume request*",
    ...lines.map(([k, v]) => `*${k}:* ${v.trim()}`),
    ...(data.message ? ["", `*Message:*`, data.message.trim()] : []),
  ].join("\n");

  const text = `${whatsapp}\n\n—\nSent from superfoodspartners.com. Reply to this email to reach ${name}.`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#1E3D2A;font-size:15px;line-height:1.5">
      <p style="color:#E0A23E;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin:0">New volume request</p>
      <h2 style="margin:4px 0 16px">${esc(company)}</h2>
      ${lines
        .filter(([k]) => k !== "Company")
        .map(([k, v]) => `<p style="margin:0 0 4px"><strong>${k}:</strong> ${esc(v.trim())}</p>`)
        .join("")}
      ${data.message ? `<p style="margin:16px 0 0;white-space:pre-wrap">${esc(data.message.trim())}</p>` : ""}
      <p style="margin:28px 0 6px;color:#5A5E53;font-size:12px;text-transform:uppercase;letter-spacing:1px">Copy for WhatsApp</p>
      <div style="background:#F4F6EF;border:1px solid #E3EBD5;border-radius:8px;padding:12px 14px;font-family:Menlo,Consolas,monospace;font-size:13px;white-space:pre-wrap;word-break:break-word">${esc(whatsapp)}</div>
      <p style="margin-top:20px;color:#5A5E53;font-size:11px">Sent from superfoodspartners.com. Reply to this email to reach ${esc(name)}.</p>
    </div>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `${data.service === "blend" ? "Blend request" : data.service === "packaging" ? "Packaging request" : "RFQ"} — ${company}${data.product ? ` · ${data.product}` : ""}`,
    html,
    text,
  });

  if (error) {
    console.error("RFQ send error:", error);
    return Response.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
