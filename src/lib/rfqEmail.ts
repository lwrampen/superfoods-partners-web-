// Builds the RFQ notification email (subject, HTML, plain text).
// Kept free of framework imports so it can be rendered and previewed on its own.

export type RfqData = Record<string, string | undefined>;

const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function buildRfqEmail(data: RfqData, brand = "SFP") {
  const company = (data.company ?? "").trim();
  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim();
  const requestType =
    data.service === "blend" ? "Custom blend" : data.service === "packaging" ? "Custom packaging" : "";

  const fields: [string, string | undefined][] = [
    ["Product", data.product],
    ["Volume", data.volume],
    ["Market", data.market],
    ["Type", requestType],
  ];
  const lines = fields
    .map(([k, v]) => [k, (v ?? "").trim()] as [string, string])
    .filter(([, v]) => v);
  const message = (data.message ?? "").trim();

  // WhatsApp-ready: *bold* labels, one field per line, no tables or HTML.
  const whatsapp = [
    `*${brand} · New request*`,
    `*${company}* · ${name}`,
    email,
    "",
    ...lines.map(([k, v]) => `*${k}:* ${v}`),
    ...(message ? ["", "*Message:*", message] : []),
  ].join("\n");

  const text = `${whatsapp}\n\n—\nSent from the website. Reply to this email to reach ${name}.`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;color:#1E3D2A;font-size:15px;line-height:1.55">
      <p style="margin:0;color:#B07A1E;font-size:11px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase">${esc(brand)} · New request</p>
      <h2 style="margin:4px 0 2px;font-size:22px">${esc(company)}</h2>
      <p style="margin:0 0 18px;color:#5A5E53">${esc(name)} · <a href="mailto:${esc(email)}" style="color:#1E3D2A">${esc(email)}</a></p>
      ${lines
        .map(
          ([k, v]) =>
            `<p style="margin:0 0 4px"><span style="color:#5A5E53">${k}:</span> <strong>${esc(v)}</strong></p>`,
        )
        .join("")}
      ${
        message
          ? `<p style="margin:18px 0 0;padding-top:14px;border-top:1px solid #E3EBD5;white-space:pre-wrap">${esc(message)}</p>`
          : ""
      }
      <p style="margin:30px 0 6px;color:#5A5E53;font-size:11px;font-weight:bold;letter-spacing:1.2px;text-transform:uppercase">Copy for WhatsApp</p>
      <div style="background:#F4F6EF;border:1px solid #E3EBD5;border-radius:8px;padding:12px 14px;font-family:Menlo,Consolas,monospace;font-size:13px;line-height:1.5;white-space:pre-wrap;word-break:break-word">${esc(whatsapp)}</div>
      <p style="margin:18px 0 0;color:#5A5E53;font-size:11px">Reply to this email to reach ${esc(name)}.</p>
    </div>`;

  const subject = `${
    data.service === "blend" ? "Blend request" : data.service === "packaging" ? "Packaging request" : "RFQ"
  } — ${company}${data.product ? ` · ${data.product}` : ""}`;

  return { subject, html, text, whatsapp };
}
