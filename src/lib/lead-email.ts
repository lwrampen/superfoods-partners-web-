// Branded notification email for website requests (sent to the team). Table layout + inline styles so it renders the
// same in Gmail, Outlook and Apple Mail. The same file lives in the PMP and SFP site repos; only the brand differs.

export type Brand = {
  name: string;
  site: string; // https://www.example.com
  logo: string; // absolute URL of a PNG for a dark background
  logoWidth: number; // display size in px
  logoHeight: number;
  dark: string; // header / button colour
  accent: string; // badge colour
  ink: string;
  muted: string;
  surface: string; // page background
  line: string;
};

export type Row = [label: string, value: string | undefined | null];
export type LeadEmail = {
  brand: Brand;
  badge: string; // e.g. "Shop access"
  title: string; // company (or name)
  subtitle?: string; // e.g. "Anna de Vries · Netherlands"
  replyEmail?: string;
  replyName?: string;
  replySubject?: string;
  sections: { title: string; rows: Row[] }[];
  message?: string;
  meta: Row[]; // page, language, received
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

export function renderLeadEmail(e: LeadEmail): { html: string; text: string } {
  const b = e.brand;
  const filled = e.sections.map((s) => ({ ...s, rows: s.rows.filter(([, v]) => v && String(v).trim()) as [string, string][] })).filter((s) => s.rows.length);
  const valueHtml = (label: string, v: string) =>
    /e-?mail/i.test(label) && /^[^@\s]+@[^@\s]+$/.test(v)
      ? `<a href="mailto:${esc(v)}" style="color:${b.dark};text-decoration:underline">${esc(v)}</a>`
      : esc(v).replace(/\n/g, "<br>");
  const section = (s: { title: string; rows: [string, string][] }) => `
<tr><td style="padding:0 32px 22px">
  <p style="margin:0 0 8px;font:600 11px/1.4 ${FONT};letter-spacing:1.4px;text-transform:uppercase;color:${b.muted}">${esc(s.title)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid ${b.line};border-radius:8px">
    ${s.rows
      .map(
        ([k, v], i) => `<tr>
      <td valign="top" style="padding:10px 14px;width:150px;font:13px/1.5 ${FONT};color:${b.muted};${i ? `border-top:1px solid ${b.line};` : ""}">${esc(k)}</td>
      <td valign="top" style="padding:10px 14px;font:600 14px/1.5 ${FONT};color:${b.ink};${i ? `border-top:1px solid ${b.line};` : ""}">${valueHtml(k, v)}</td>
    </tr>`,
      )
      .join("")}
  </table>
</td></tr>`;
  const reply =
    e.replyEmail &&
    `<a href="mailto:${esc(e.replyEmail)}?subject=${encodeURIComponent(e.replySubject ?? `Re: your request to ${b.name}`)}" style="display:inline-block;background:${b.dark};color:#ffffff;text-decoration:none;font:600 14px/1 ${FONT};padding:13px 20px;border-radius:6px">Reply to ${esc(e.replyName || e.replyEmail)} →</a>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${b.surface}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${b.surface}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${b.line}">
  <tr><td style="background:${b.dark};padding:22px 32px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><a href="${b.site}"><img src="${b.logo}" width="${b.logoWidth}" height="${b.logoHeight}" alt="${esc(b.name)}" style="display:block;border:0"></a></td>
      <td align="right" style="font:600 11px/1.4 ${FONT};letter-spacing:1.4px;text-transform:uppercase;color:rgba(255,255,255,0.75)">Website request</td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:28px 32px 6px">
    <span style="display:inline-block;background:${b.accent};color:${b.dark};font:700 11px/1 ${FONT};letter-spacing:1px;text-transform:uppercase;padding:7px 10px;border-radius:999px">${esc(e.badge)}</span>
    <h1 style="margin:14px 0 4px;font:700 24px/1.25 ${FONT};color:${b.ink}">${esc(e.title)}</h1>
    ${e.subtitle ? `<p style="margin:0;font:15px/1.5 ${FONT};color:${b.muted}">${esc(e.subtitle)}</p>` : ""}
  </td></tr>
  ${reply ? `<tr><td style="padding:18px 32px 26px">${reply}</td></tr>` : `<tr><td style="padding:12px"></td></tr>`}
  ${filled.map(section).join("")}
  ${
    e.message?.trim()
      ? `<tr><td style="padding:0 32px 24px">
    <p style="margin:0 0 8px;font:600 11px/1.4 ${FONT};letter-spacing:1.4px;text-transform:uppercase;color:${b.muted}">Message</p>
    <div style="border-left:3px solid ${b.accent};background:${b.surface};padding:14px 16px;border-radius:0 8px 8px 0;font:15px/1.6 ${FONT};color:${b.ink};white-space:pre-wrap">${esc(e.message.trim())}</div>
  </td></tr>`
      : ""
  }
  <tr><td style="padding:18px 32px 24px;border-top:1px solid ${b.line};font:12px/1.7 ${FONT};color:${b.muted}">
    ${e.meta
      .filter(([, v]) => v)
      .map(([k, v]) => `${esc(k)}: ${/^https?:\/\//.test(String(v)) ? `<a href="${esc(String(v))}" style="color:${b.muted}">${esc(String(v))}</a>` : esc(String(v))}`)
      .join("<br>")}
    ${e.replyEmail ? `<br>Replying to this email reaches ${esc(e.replyName || e.replyEmail)} directly.` : ""}
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
  const text = [
    `${e.badge.toUpperCase()} — ${e.title}`,
    e.subtitle ?? "",
    "",
    ...filled.flatMap((s) => [s.title.toUpperCase(), ...s.rows.map(([k, v]) => `${k}: ${v}`), ""]),
    ...(e.message?.trim() ? ["MESSAGE", e.message.trim(), ""] : []),
    ...e.meta.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
  ].join("\n");
  return { html, text };
}
