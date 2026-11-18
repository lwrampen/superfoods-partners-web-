// TipTap document JSON ↔ Studio blocks. The editor works on TipTap JSON; what is stored for the sites is blocks.
import type { Block, ImageRef, LocaleCopy } from "./types";
import { parseInline, runsToInline, stripInline, type Run } from "./inline";

type Mark = { type: string; attrs?: Record<string, unknown> };
export type TNode = { type: string; attrs?: Record<string, unknown>; content?: TNode[]; text?: string; marks?: Mark[] };

function runsOf(nodes: TNode[] = []): Run[] {
  const out: Run[] = [];
  for (const n of nodes) {
    if (n.type === "text" && n.text) {
      const marks = n.marks ?? [];
      const link = marks.find((m) => m.type === "link");
      out.push({
        text: n.text,
        bold: marks.some((m) => m.type === "bold") || undefined,
        italic: marks.some((m) => m.type === "italic") || undefined,
        href: (link?.attrs?.href as string | undefined) || undefined,
      });
    } else if (n.type === "hardBreak") out.push({ text: " " });
  }
  return out;
}
const inlineOf = (n: TNode) => runsToInline(runsOf(n.content)).replace(/\s+/g, " ").trim();
const paragraphsText = (n: TNode): string =>
  (n.content ?? [])
    .map((c): string => (c.type === "paragraph" || c.type === "heading" ? inlineOf(c) : c.content ? paragraphsText(c) : ""))
    .filter(Boolean)
    .join(" ");

function imageOf(n: TNode): ImageRef {
  const a = n.attrs ?? {};
  return {
    src: String(a.src ?? ""),
    alt: String(a.alt ?? ""),
    ...(a.caption ? { caption: String(a.caption) } : {}),
    ...(a.width ? { width: Number(a.width) } : {}),
    ...(a.height ? { height: Number(a.height) } : {}),
  };
}

export function tiptapToBlocks(doc: TNode | null | undefined): Block[] {
  const out: Block[] = [];
  for (const n of doc?.content ?? []) {
    if (n.type === "heading") {
      const text = inlineOf(n);
      const level = Number(n.attrs?.level ?? 2);
      if (text) out.push({ type: "heading", level: level >= 3 ? 3 : 2, text: stripInline(text) });
    } else if (n.type === "paragraph") {
      // an image can sit inside a paragraph when inserted inline
      for (const c of n.content ?? []) if (c.type === "image") out.push({ type: "image", ...imageOf(c) });
      const text = inlineOf({ ...n, content: (n.content ?? []).filter((c) => c.type !== "image") });
      if (text) out.push({ type: "paragraph", text });
    } else if (n.type === "bulletList" || n.type === "orderedList") {
      const items = (n.content ?? []).map(paragraphsText).filter(Boolean);
      if (items.length) out.push({ type: "list", ...(n.type === "orderedList" ? { ordered: true } : {}), items });
    } else if (n.type === "blockquote") {
      const text = paragraphsText(n);
      if (text) out.push({ type: "quote", text });
    } else if (n.type === "image") {
      if (n.attrs?.src) out.push({ type: "image", ...imageOf(n) });
    }
  }
  return out;
}

function textNodes(s: string): TNode[] {
  return parseInline(s).map((r) => {
    const marks: Mark[] = [];
    if (r.bold) marks.push({ type: "bold" });
    if (r.italic) marks.push({ type: "italic" });
    if (r.href) marks.push({ type: "link", attrs: { href: r.href } });
    return { type: "text", text: r.text, ...(marks.length ? { marks } : {}) };
  });
}
const para = (s: string): TNode => ({ type: "paragraph", content: textNodes(s) });

export function blocksToTiptap(blocks: Block[]): TNode {
  const content: TNode[] = [];
  for (const b of blocks) {
    if (b.type === "heading") content.push({ type: "heading", attrs: { level: b.level }, content: textNodes(b.text) });
    else if (b.type === "paragraph") content.push(para(b.text));
    else if (b.type === "list")
      content.push({ type: b.ordered ? "orderedList" : "bulletList", content: b.items.map((i) => ({ type: "listItem", content: [para(i)] })) });
    else if (b.type === "quote") content.push({ type: "blockquote", content: [para(b.text)] });
    else if (b.type === "image") content.push({ type: "image", attrs: { src: b.src, alt: b.alt, caption: b.caption ?? null, width: b.width ?? null, height: b.height ?? null } });
  }
  if (!content.length) content.push({ type: "paragraph" });
  return { type: "doc", content };
}

export function wordCount(blocks: Block[], extra: string[] = []) {
  const text = [
    ...extra,
    ...blocks.flatMap((b) => (b.type === "heading" || b.type === "paragraph" || b.type === "quote" ? [b.text] : b.type === "list" ? b.items : [])),
  ]
    .map(stripInline)
    .join(" ");
  // CJK: count characters / 2 as a rough word equivalent
  const cjk = (text.match(/[㐀-鿿]/g) ?? []).length;
  return text.replace(/[㐀-鿿]/g, " ").split(/\s+/).filter(Boolean).length + Math.round(cjk / 2);
}

/** short hash of the English copy, to tell when a translation is out of date */
export function copyHash(c: LocaleCopy | undefined) {
  if (!c) return "";
  const base = [c.title, c.metaTitle, c.metaDescription, c.summary, c.lede, c.blocks, c.faqs, c.headerAlt ?? "", c.gallery ?? []];
  // recipe fields only when present, so the hashes of blog posts stay as they were
  const s = JSON.stringify(c.steps || c.ingredients ? [...base, c.yield ?? "", c.ingredients ?? [], c.steps ?? [], c.tips ?? []] : base);
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}
