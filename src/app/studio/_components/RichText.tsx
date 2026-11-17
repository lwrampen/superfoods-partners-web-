"use client";
import { useEffect, useState } from "react";
import { useEditor, EditorContent, type Editor as TEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import type { TNode } from "@/lib/studio/blocks";

// Image with alt + caption (+ size), shown as a figure in the editor.
const Figure = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: null, renderHTML: () => ({}) },
      width: { default: null, renderHTML: () => ({}) },
      height: { default: null, renderHTML: () => ({}) },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    return ["figure", {}, ["img", { ...HTMLAttributes, alt: node.attrs.alt ?? "" }], ["figcaption", {}, node.attrs.caption ?? ""]];
  },
});

function Btn({ on, active, children, label, disabled }: { on: () => void; active?: boolean; children: React.ReactNode; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={on}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-[13px] transition ${active ? "bg-forest text-offwhite" : "text-forest hover:bg-sand"} disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

export type LinkTarget = { path: string; name: string };

export function RichText({
  initial,
  onChange,
  onEditor,
  onInsertImage,
  linkTargets,
}: {
  initial: TNode | undefined;
  onChange: (doc: TNode) => void;
  onEditor?: (e: TEditor) => void;
  onInsertImage: () => void;
  linkTargets: LinkTarget[];
}) {
  const [, force] = useState(0);
  const [linkOpen, setLinkOpen] = useState(false);
  const [href, setHref] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        underline: false,
        horizontalRule: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https", HTMLAttributes: { rel: null, target: null } },
      }),
      Figure.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: "Write the article here. Use H2 for sections, H3 for sub-points…" }),
    ],
    content: (initial as object) ?? undefined,
    onUpdate: ({ editor }) => onChange(editor.getJSON() as TNode),
    onSelectionUpdate: () => force((x) => x + 1),
    onTransaction: () => force((x) => x + 1),
  });
  useEffect(() => {
    if (editor && onEditor) onEditor(editor);
  }, [editor, onEditor]);
  if (!editor) return <div className="rte min-h-[380px] rounded-2xl border border-[#e3e3da] bg-white" />;

  const img = editor.isActive("image") ? editor.getAttributes("image") : null;
  const openLink = () => {
    setHref(editor.getAttributes("link").href ?? "");
    setLinkOpen(true);
  };
  const applyLink = (h: string) => {
    const v = h.trim();
    if (!v) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: v.startsWith("/") || /^https?:\/\//.test(v) || v.startsWith("mailto:") ? v : `https://${v}` }).run();
    setLinkOpen(false);
  };

  return (
    <div className="rte rounded-2xl border border-[#e3e3da] bg-white">
      <div className="sticky top-14 z-20 flex flex-wrap items-center gap-0.5 rounded-t-2xl border-b border-[#ececE4] bg-white/95 px-2 py-1.5 backdrop-blur">
        <Btn label="Heading 2" active={editor.isActive("heading", { level: 2 })} on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <span className="mono text-[12px] font-medium">H2</span>
        </Btn>
        <Btn label="Heading 3" active={editor.isActive("heading", { level: 3 })} on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <span className="mono text-[12px] font-medium">H3</span>
        </Btn>
        <span className="mx-1 h-5 w-px bg-[#e3e3da]" />
        <Btn label="Bold" active={editor.isActive("bold")} on={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </Btn>
        <Btn label="Italic" active={editor.isActive("italic")} on={() => editor.chain().focus().toggleItalic().run()}>
          <i className="font-serif">I</i>
        </Btn>
        <Btn label="Link" active={editor.isActive("link")} on={openLink}>
          <span className="text-[12px] underline decoration-lime decoration-2 underline-offset-2">Link</span>
        </Btn>
        <span className="mx-1 h-5 w-px bg-[#e3e3da]" />
        <Btn label="Bullet list" active={editor.isActive("bulletList")} on={() => editor.chain().focus().toggleBulletList().run()}>
          <span className="text-[15px]">•≡</span>
        </Btn>
        <Btn label="Numbered list" active={editor.isActive("orderedList")} on={() => editor.chain().focus().toggleOrderedList().run()}>
          <span className="mono text-[12px]">1.</span>
        </Btn>
        <Btn label="Quote" active={editor.isActive("blockquote")} on={() => editor.chain().focus().toggleBlockquote().run()}>
          <span className="font-serif text-[18px] leading-none">“</span>
        </Btn>
        <Btn label="Insert image" on={onInsertImage}>
          <span className="text-[12px]">Image</span>
        </Btn>
        <span className="ml-auto" />
        <Btn label="Undo" on={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          ↶
        </Btn>
        <Btn label="Redo" on={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          ↷
        </Btn>
      </div>

      {linkOpen ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-[#ececE4] bg-[#fafaf7] px-3 py-2">
          <input
            autoFocus
            value={href}
            onChange={(e) => setHref(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyLink(href))}
            placeholder="/products/ube or https://…"
            className="field !w-64 !py-1.5 text-sm"
            aria-label="Link address"
          />
          <button type="button" className="btn btn-primary !px-3 !py-1.5" onClick={() => applyLink(href)}>
            Apply
          </button>
          <button type="button" className="btn btn-ghost !px-3 !py-1.5" onClick={() => applyLink("")}>
            Remove
          </button>
          {linkTargets.length ? <span className="text-xs text-stone">Our pages:</span> : null}
          {linkTargets.map((t) => (
            <button key={t.path} type="button" onClick={() => applyLink(t.path)} className="rounded-md bg-white px-2 py-1 text-xs text-forest ring-1 ring-[#e3e3da] hover:ring-forest">
              {t.name}
            </button>
          ))}
        </div>
      ) : null}

      {img ? (
        <div className="grid gap-2 border-b border-[#ececE4] bg-[#fafaf7] px-3 py-2 sm:grid-cols-2">
          <input
            value={img.alt ?? ""}
            onChange={(e) => editor.chain().updateAttributes("image", { alt: e.target.value }).run()}
            placeholder="Alt text — describe the photo"
            className="field !py-1.5 text-sm"
            aria-label="Image alt text"
          />
          <input
            value={img.caption ?? ""}
            onChange={(e) => editor.chain().updateAttributes("image", { caption: e.target.value || null }).run()}
            placeholder="Caption (optional)"
            className="field !py-1.5 text-sm"
            aria-label="Image caption"
          />
        </div>
      ) : null}

      <EditorContent editor={editor} />
    </div>
  );
}
