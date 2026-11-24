// Branded notification email for website requests (sent to the team), in the style of the new sites: Anton display
// headings, IBM Plex Mono labels, numbered blocks like the request form. Table layout + inline styles so it holds up in
// Gmail, Outlook and Apple Mail; web fonts load where supported (Apple Mail, iOS), elsewhere Impact / Menlo / Arial
// stand in. The same file lives in the PMP and SFP site repos; only the brand differs.

export type Brand = {
  name: string;
  site: string; // https://www.example.com
  logo: string; // absolute URL of a PNG for a dark background
  logoWidth: number; // display size in px
  logoHeight: number;
  dark: string; // header / footer colour
  accent: string; // lime
  ink: string;
  muted: string;
  surface: string; // page background
  tint: string; // fact tiles / quote background
  line: string;
  stripe: string[]; // colour bar under the header
};

export type Row = [label: string, value: string | undefined | null];
export type LeadEmail = {
  brand: Brand;
  badge: string; // e.g. "Shop access"
  title: string; // company (or name)
  subtitle?: string; // e.g. "Anna de Vries · Netherlands"
  facts?: Row[]; // up to 3 key facts shown as tiles
  replyEmail?: string;
  replyName?: string;
  replySubject?: string;
  sections: { title: string; rows: Row[] }[];
  message?: string;
  meta: Row[]; // page, language, received
  /** highlighted list above the details (e.g. warnings) */
  notices?: { title: string; items: string[] };
  /** big buttons instead of the reply button (e.g. approve / reject); the reply link moves below them */
  actions?: { label: string; href: string; bg: string; color: string }[];
  /** small text under the buttons */
  actionsNote?: string;
  /** raw HTML placed after the buttons (used by web pages: forms, step lists) */
  extraHtml?: string;
};

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const SANS = "'Archivo','Helvetica Neue',Helvetica,Arial,sans-serif";
const DISPLAY = "'Anton',Impact,'Haettenschweiler','Arial Narrow Bold',sans-serif";
const MONO = "'IBM Plex Mono',Menlo,Consolas,'Courier New',monospace";
const FONTS = "https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap";

export function renderLeadEmail(e: LeadEmail): { html: string; text: string } {
  const b = e.brand;
  const filled = e.sections
    .map((s) => ({ ...s, rows: s.rows.filter(([, v]) => v && String(v).trim()) as [string, string][] }))
    .filter((s) => s.rows.length);
  const facts = (e.facts ?? []).filter(([, v]) => v && String(v).trim()).slice(0, 3) as [string, string][];
  const label = (t: string, color = b.muted) =>
    `<span style="font:500 10px/1.4 ${MONO};letter-spacing:2.2px;text-transform:uppercase;color:${color}">${esc(t)}</span>`;
  const valueHtml = (k: string, v: string) =>
    /e-?mail/i.test(k) && /^[^@\s]+@[^@\s]+$/.test(v)
      ? `<a href="mailto:${esc(v)}" style="color:${b.ink};text-decoration:underline;text-decoration-color:${b.accent}">${esc(v)}</a>`
      : esc(v).replace(/\n/g, "<br>");
  const stripe = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${b.stripe
    .map((c) => `<td height="5" style="height:5px;line-height:5px;font-size:0;background:${c}">&nbsp;</td>`)
    .join("")}</tr></table>`;

  const section = (s: { title: string; rows: [string, string][] }, n: number) => `
<tr><td style="padding:0 36px 26px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td width="30" valign="middle"><div style="width:24px;height:24px;border-radius:12px;background:${b.dark};color:#ffffff;font:500 11px/24px ${MONO};text-align:center">${n}</div></td>
    <td valign="middle" style="font:400 18px/1 ${DISPLAY};text-transform:uppercase;letter-spacing:0.3px;color:${b.ink}">${esc(s.title)}</td>
  </tr></table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;border-top:2px solid ${b.ink}">
    ${s.rows
      .map(
        ([k, v]) => `<tr>
      <td valign="top" style="padding:11px 12px 11px 0;width:140px;border-bottom:1px solid ${b.line}">${label(k)}</td>
      <td valign="top" style="padding:10px 0;border-bottom:1px solid ${b.line};font:600 15px/1.45 ${SANS};color:${b.ink}">${valueHtml(k, v)}</td>
    </tr>`,
      )
      .join("")}
  </table>
</td></tr>`;

  const factTiles = facts.length
    ? `<tr><td style="padding:0 36px 28px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    ${facts
      .map(
        ([k, v], i) => `<td valign="top" width="${Math.floor(100 / facts.length)}%" style="background:${b.tint};padding:14px 14px 16px;${i ? `border-left:3px solid #ffffff;` : ""}">
      ${label(k)}<div style="margin-top:6px;font:400 19px/1.15 ${DISPLAY};text-transform:uppercase;color:${b.ink}">${esc(v)}</div></td>`,
      )
      .join("")}
  </tr></table>
</td></tr>`
    : "";

  const reply = e.replyEmail
    ? `<a href="mailto:${esc(e.replyEmail)}?subject=${encodeURIComponent(e.replySubject ?? `Re: your request to ${b.name}`)}" style="display:inline-block;background:${b.accent};color:${b.dark};text-decoration:none;font:500 12px/1 ${MONO};letter-spacing:2px;text-transform:uppercase;padding:15px 22px;border-radius:4px">Reply to ${esc((e.replyName || e.replyEmail).split(" ")[0])} &nbsp;→</a>`
    : "";

  const buttons = e.actions?.length
    ? `${e.actions
        .map(
          (a) =>
            `<a href="${esc(a.href)}" style="display:inline-block;margin:0 10px 10px 0;background:${a.bg};color:${a.color};text-decoration:none;font:500 13px/1 ${MONO};letter-spacing:2px;text-transform:uppercase;padding:17px 26px;border-radius:4px">${esc(a.label)}</a>`,
        )
        .join("")}${e.actionsNote ? `<p style="margin:6px 0 0;font:400 13px/1.55 ${SANS};color:${b.muted}">${esc(e.actionsNote)}</p>` : ""}${
        e.replyEmail
          ? `<p style="margin:12px 0 0;font:400 13px/1.5 ${SANS}"><a href="mailto:${esc(e.replyEmail)}?subject=${encodeURIComponent(e.replySubject ?? `Re: your request to ${b.name}`)}" style="color:${b.ink};text-decoration:underline;text-decoration-color:${b.accent}">Reply to ${esc(e.replyName || e.replyEmail)}</a></p>`
          : ""
      }`
    : reply;
  const notices = e.notices?.items.length
    ? `<tr><td style="padding:0 36px 28px"><div style="background:#FFF6E0;border-left:4px solid #E0A23E;padding:14px 16px">
    ${label(e.notices.title, "#8A5A00")}
    ${e.notices.items.map((t) => `<div style="margin-top:6px;font:400 14px/1.5 ${SANS};color:${b.ink}">${esc(t)}</div>`).join("")}
  </div></td></tr>`
    : "";
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<link href="${FONTS}" rel="stylesheet"></head>
<body style="margin:0;padding:0;background:${b.surface};-webkit-font-smoothing:antialiased">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${b.surface}"><tr><td align="center" style="padding:28px 10px">
<table role="presentation" width="620" cellpadding="0" cellspacing="0" style="width:100%;max-width:620px;background:#ffffff">
  <tr><td style="background:${b.dark};padding:24px 36px 22px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><a href="${b.site}"><img src="${b.logo}" width="${b.logoWidth}" height="${b.logoHeight}" alt="${esc(b.name)}" style="display:block;border:0"></a></td>
      <td align="right" valign="middle">${label("— Website request", "rgba(255,255,255,0.7)")}</td>
    </tr></table>
  </td></tr>
  <tr><td>${stripe}</td></tr>
  <tr><td style="padding:34px 36px 8px">
    <span style="display:inline-block;background:${b.accent};color:${b.dark};font:500 11px/1 ${MONO};letter-spacing:2px;text-transform:uppercase;padding:8px 11px;border-radius:2px">● ${esc(e.badge)}</span>
    <h1 style="margin:18px 0 8px;font:400 40px/1.02 ${DISPLAY};text-transform:uppercase;letter-spacing:0.2px;color:${b.ink}">${esc(e.title)}</h1>
    ${e.subtitle ? `<p style="margin:0;font:400 16px/1.5 ${SANS};color:${b.muted}">${esc(e.subtitle)}</p>` : ""}
  </td></tr>
  ${buttons ? `<tr><td style="padding:22px 36px 30px">${buttons}</td></tr>` : `<tr><td style="padding:14px"></td></tr>`}
  ${e.extraHtml ? `<tr><td style="padding:0 36px 30px">${e.extraHtml}</td></tr>` : ""}
  ${factTiles}
  ${notices}
  ${filled.map((s, i) => section(s, i + 1)).join("")}
  ${
    e.message?.trim()
      ? `<tr><td style="padding:4px 36px 34px">
    <div style="font:400 54px/0.6 ${DISPLAY};color:${b.accent}">“</div>
    <div style="margin-top:4px;padding-left:16px;border-left:3px solid ${b.accent};font:400 17px/1.6 ${SANS};color:${b.ink};white-space:pre-wrap">${esc(e.message.trim())}</div>
  </td></tr>`
      : ""
  }
  <tr><td style="background:${b.dark};padding:22px 36px 24px">
    ${e.meta
      .filter(([, v]) => v)
      .map(
        ([k, v]) =>
          `<div style="margin:2px 0;font:400 11px/1.7 ${MONO};letter-spacing:0.6px;color:rgba(255,255,255,0.72)"><span style="color:${b.accent}">${esc(k)}</span>&nbsp;&nbsp;${
            /^https?:\/\//.test(String(v)) ? `<a href="${esc(String(v))}" style="color:rgba(255,255,255,0.72)">${esc(String(v).replace(/^https?:\/\/(www\.)?/, ""))}</a>` : esc(String(v))
          }</div>`,
      )
      .join("")}
    ${e.replyEmail && !e.actions?.length ? `<div style="margin-top:10px;font:400 11px/1.7 ${MONO};color:rgba(255,255,255,0.5)">Reply to this email to reach ${esc(e.replyName || e.replyEmail)} directly.</div>` : ""}
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
