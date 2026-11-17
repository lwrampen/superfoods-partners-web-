// Inline markup used inside text blocks: **bold**, *italic*, [label](/path or https://…). Shared by the Studio editor
// (TipTap ↔ blocks) and the site renderers. Anything else is plain text — no HTML is ever stored.

export type Run = { text: string; bold?: boolean; italic?: boolean; href?: string };

const LINK = /\[([^\]]+)\]\(((?:\/|https:\/\/|mailto:)[^)\s]*)\)/g;

function emphasis(s: string, base: Omit<Run, "text">): Run[] {
  const out: Run[] = [];
  const re = /\*\*\*([^*]+?)\*\*\*|\*\*([^*]+?)\*\*|\*([^*\s][^*]*?)\*/g;
  let last = 0;
  for (const m of s.matchAll(re)) {
    if (m.index! > last) out.push({ ...base, text: s.slice(last, m.index) });
    if (m[1]) out.push({ ...base, text: m[1], bold: true, italic: true });
    else if (m[2]) out.push({ ...base, text: m[2], bold: true });
    else out.push({ ...base, text: m[3], italic: true });
    last = m.index! + m[0].length;
  }
  if (last < s.length) out.push({ ...base, text: s.slice(last) });
  return out;
}

export function parseInline(s: string): Run[] {
  const out: Run[] = [];
  let last = 0;
  for (const m of s.matchAll(LINK)) {
    if (m.index! > last) out.push(...emphasis(s.slice(last, m.index), {}));
    out.push(...emphasis(m[1], { href: m[2] }));
    last = m.index! + m[0].length;
  }
  if (last < s.length) out.push(...emphasis(s.slice(last), {}));
  return out.filter((r) => r.text);
}

export function runsToInline(runs: Run[]): string {
  let out = "";
  let i = 0;
  const fmt = (r: Run) => {
    const t = r.text;
    if (!t.trim()) return t;
    // keep surrounding spaces outside the markers
    const lead = t.match(/^\s*/)![0];
    const trail = t.match(/\s*$/)![0];
    const core = t.trim();
    const mark = r.bold && r.italic ? "***" : r.bold ? "**" : r.italic ? "*" : "";
    return `${lead}${mark}${core}${mark}${trail}`;
  };
  while (i < runs.length) {
    const r = runs[i];
    if (r.href) {
      const group: Run[] = [];
      while (i < runs.length && runs[i].href === r.href) group.push(runs[i++]);
      out += `[${group.map(fmt).join("").trim()}](${r.href})`;
    } else {
      out += fmt(r);
      i++;
    }
  }
  return out;
}

export const stripInline = (s: string) => parseInline(s).map((r) => r.text).join("");

const escHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export function inlineToHtml(s: string, linkPrefix: (href: string) => string = (h) => h) {
  return parseInline(s)
    .map((r) => {
      let h = escHtml(r.text);
      if (r.italic) h = `<em>${h}</em>`;
      if (r.bold) h = `<strong>${h}</strong>`;
      if (r.href) h = `<a href="${escHtml(linkPrefix(r.href))}">${h}</a>`;
      return h;
    })
    .join("");
}
