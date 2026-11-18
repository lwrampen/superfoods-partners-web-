// Studio post → the files committed to the target repo: the post JSON (block format, every live locale) and the
// images under public/blog/<slug>/. Published posts never reference Vercel Blob.
import { SITES, productsFor } from "./config";
import type { Block, ImageRef, LocaleCopy, StudioPost } from "./types";
import { mediaPathFromUrl, readMedia } from "./store";
import type { FileChange } from "./github";
import { isRecipe } from "./recipe";

export { validateForPublish, type ValidationIssue } from "./validate";

const fileName = (src: string) => (src.split("/").pop() ?? "image.webp").replace(/[^a-zA-Z0-9._-]/g, "-");

/** body blocks + video + gallery for one locale, with image paths rewritten for the repo */
export function composeBlocks(p: StudioPost, c: LocaleCopy, rewrite: (src: string) => string): Block[] {
  const fix = (i: ImageRef): ImageRef => ({ ...i, src: rewrite(i.src) });
  const body: Block[] = (c.blocks ?? []).map((b) => (b.type === "image" ? { ...b, ...fix(b) } : b));
  const video: Block[] = p.video ? [{ type: "video", provider: p.video.provider, id: p.video.id, ...(c.videoTitle ? { title: c.videoTitle } : {}) }] : [];
  const en = p.locales.en;
  const gallery = p.gallery
    .map((g, i) => ({ g, i }))
    .filter(({ g }) => g.inGallery !== false)
    .map(({ g, i }) => {
      const t = c.gallery?.[i] ?? en?.gallery?.[i];
      return fix({ src: g.src, alt: t?.alt || g.alt || "", ...(t?.caption || g.caption ? { caption: t?.caption || g.caption } : {}), ...(g.width ? { width: g.width, height: g.height } : {}) });
    });
  const galleryBlock: Block[] = gallery.length ? [{ type: "gallery", images: gallery }] : [];
  if (p.video?.position === "after-intro") return [...video, ...body, ...galleryBlock];
  return [...body, ...video, ...galleryBlock];
}

function amsterdamDate(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export async function buildRepoFiles(p: StudioPost, opts: { date?: string } = {}) {
  const s = SITES[p.site];
  const recipe = isRecipe(p);
  const pub = recipe ? `/recipes/${p.slug}` : `/blog/${p.slug}`; // image folder under public/
  const dir = `public${pub}`;
  const images = new Map<string, string>(); // studio src → public path
  const rewrite = (src: string) => {
    if (!src.startsWith("/api/studio/media/")) return src; // already a site path
    if (!images.has(src)) images.set(src, `${pub}/${src === p.header?.src ? `header.${src.split(".").pop()}` : fileName(src)}`);
    return images.get(src)!;
  };
  const date = opts.date ?? (p.publishedAt ? amsterdamDate(new Date(p.publishedAt)) : amsterdamDate());
  const header = p.header ? rewrite(p.header.src) : "";
  const keywords = p.seo?.primary ? { primary: p.seo.primary, secondary: p.seo.secondary } : undefined;
  const related = productsFor(p.site, p.products);

  const locales: Record<string, unknown> = {};
  for (const l of s.locales) {
    const c = p.locales[l];
    if (!c) continue;
    if (recipe) {
      const blocks = composeBlocks(p, c, rewrite);
      locales[l] = {
        title: c.title,
        metaTitle: c.metaTitle,
        metaDescription: c.metaDescription,
        summary: c.summary,
        lede: c.lede,
        imageAlt: c.headerAlt || p.locales.en?.headerAlt || p.header?.alt || "",
        ...(c.yield?.trim() ? { yield: c.yield.trim() } : {}),
        ingredients: (c.ingredients ?? []).map((g) => ({ ...(g.heading ? { heading: g.heading } : {}), items: g.items.filter((x) => x.trim()) })).filter((g) => g.items.length),
        steps: (c.steps ?? []).filter((x) => x.trim()),
        ...(c.tips?.some((x) => x.trim()) ? { tips: c.tips.filter((x) => x.trim()) } : {}),
        ...(blocks.length ? { blocks } : {}),
        faqs: (c.faqs ?? []).filter((f) => f.q.trim() && f.a.trim()),
      };
      continue;
    }
    locales[l] = {
      title: c.title,
      metaTitle: c.metaTitle,
      metaDescription: c.metaDescription,
      summary: c.summary,
      lede: c.lede,
      imageAlt: c.headerAlt || p.locales.en?.headerAlt || p.header?.alt || "",
      blocks: composeBlocks(p, c, rewrite),
      faqs: (c.faqs ?? []).filter((f) => f.q.trim() && f.a.trim()),
    };
  }

  const common = {
    slug: p.slug,
    date,
    author: p.author,
    category: p.category,
    image: header,
    imageAlt: p.locales.en?.headerAlt || p.header?.alt || "",
    ...(p.header?.width ? { imageWidth: p.header.width, imageHeight: p.header.height } : {}),
  };
  const r = p.recipe ?? {};
  const json = recipe
    ? {
        ...(p.importedExtra ?? {}),
        ...common,
        products: related.filter((x) => x.kind !== "page").map((x) => x.id),
        ...(r.servings ? { servings: r.servings } : {}),
        ...(r.prepMins ? { prepMins: r.prepMins } : {}),
        ...(r.cookMins ? { cookMins: r.cookMins } : {}),
        ...(r.difficulty ? { difficulty: r.difficulty } : {}),
        ...(keywords ? { keywords } : {}),
        studio: { id: p.id },
        ...locales,
      }
    : p.site === "pmp"
      ? {
          ...common,
          // back-compat: the first selected product group drives the existing related-group block
          ...(related.find((x) => x.kind === "group") ? { group: related.find((x) => x.kind === "group")!.id } : {}),
          related: related.map((x) => x.path),
          ...(keywords ? { keywords } : {}),
          studio: { id: p.id },
          ...locales,
        }
      : {
          ...common,
          relatedProducts: related.map((x) => x.id),
          ...(keywords ? { keywords } : {}),
          studio: { id: p.id },
          ...locales,
        };

  const files: FileChange[] = [{ path: `${recipe ? s.recipeDir : s.postDir}/${p.slug}.json`, content: JSON.stringify(json, null, 2) + "\n" }];
  for (const [src, publicPath] of images) {
    const media = mediaPathFromUrl(src);
    const r = media ? await readMedia(media) : null;
    if (!r) throw new Error(`Image not found in storage: ${src}`);
    files.push({ path: `public${publicPath}`, content: r.body });
  }
  return { files, json, dir };
}
