import { requireUser } from "@/lib/studio/auth";
import { listPosts, newId, savePost, StorageNotConfigured } from "@/lib/studio/store";
import { githubConfigured, readText } from "@/lib/studio/github";
import { SITES, postUrl } from "@/lib/studio/config";
import type { Difficulty, LocaleCopy, SiteId, StudioPost } from "@/lib/studio/types";

export const dynamic = "force-dynamic";

// "Edit in Studio": take over a recipe that is already on the site (content/recipes/<slug>.json on main) as a Studio
// post, so it can be edited, re-translated and published again. The URL (slug) stays; the file is overwritten on
// publish. Fields the Studio does not edit are kept and written back unchanged.
type FileCopy = Partial<LocaleCopy> & { imageAlt?: string };
type RecipeFile = Record<string, unknown> & {
  slug: string;
  date: string;
  author?: string;
  category?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  products?: string[];
  servings?: number;
  prepMins?: number;
  cookMins?: number;
  difficulty?: Difficulty;
  studio?: { id?: string };
};
const KNOWN = new Set(["slug", "date", "author", "category", "image", "imageAlt", "imageWidth", "imageHeight", "products", "servings", "prepMins", "cookMins", "difficulty", "keywords", "studio"]);

export async function POST(req: Request) {
  const a = await requireUser();
  if ("response" in a) return a.response;
  const { site, slug } = (await req.json().catch(() => ({}))) as { site?: SiteId; slug?: string };
  if ((site !== "pmp" && site !== "sfp") || !slug || !/^[a-z0-9-]+$/.test(slug)) return Response.json({ error: "Bad request" }, { status: 400 });
  if (!githubConfigured()) return Response.json({ error: "GitHub is not connected yet (STUDIO_GITHUB_TOKEN)." }, { status: 503 });
  const s = SITES[site];
  try {
    // already in the Studio? open that one
    const existing = (await listPosts()).find((p) => p.site === site && p.kind === "recipe" && p.slug === slug);
    if (existing) return Response.json({ post: existing });

    const raw = await readText(site, `${s.recipeDir}/${slug}.json`);
    if (!raw) return Response.json({ error: "This recipe is not a JSON file on the site (yet)." }, { status: 404 });
    const f = JSON.parse(raw) as RecipeFile;
    const locales: Record<string, LocaleCopy> = {};
    for (const l of s.locales) {
      const c = f[l] as FileCopy | undefined;
      if (!c?.title) continue;
      locales[l] = {
        title: c.title,
        metaTitle: c.metaTitle ?? "",
        metaDescription: c.metaDescription ?? "",
        summary: c.summary ?? "",
        lede: c.lede ?? "",
        blocks: c.blocks ?? [],
        faqs: c.faqs ?? [],
        headerAlt: c.imageAlt ?? f.imageAlt ?? "",
        ...(c.yield ? { yield: c.yield } : {}),
        ingredients: c.ingredients ?? [],
        steps: c.steps ?? [],
        tips: c.tips ?? [],
      };
    }
    if (!locales.en) return Response.json({ error: "The recipe file has no English version." }, { status: 422 });
    const extra = Object.fromEntries(Object.entries(f).filter(([k]) => !KNOWN.has(k) && !s.locales.includes(k)));
    const now = new Date().toISOString();
    const post: StudioPost = {
      id: f.studio?.id && /^[a-z0-9-]{6,40}$/.test(f.studio.id) ? f.studio.id : newId(),
      kind: "recipe",
      imported: true,
      ...(Object.keys(extra).length ? { importedExtra: extra } : {}),
      recipe: { servings: f.servings, prepMins: f.prepMins, cookMins: f.cookMins, difficulty: f.difficulty },
      site,
      slug: f.slug,
      status: "live",
      author: f.author ?? a.user,
      createdAt: now,
      updatedAt: now,
      category: f.category ?? "Drinks",
      publishedAt: new Date(`${f.date.slice(0, 10)}T12:00:00Z`).toISOString(),
      liveUrl: postUrl(site, f.slug, "en", "recipe"),
      header: f.image ? { src: f.image, alt: f.imageAlt ?? "", ...(f.imageWidth && f.imageHeight ? { width: f.imageWidth, height: f.imageHeight } : {}) } : null,
      gallery: [],
      video: null,
      products: (f.products ?? []).filter((id) => s.products.some((x) => x.id === id)),
      locales,
      seo: null,
      publish: null,
    };
    await savePost(post);
    return Response.json({ post });
  } catch (e) {
    if (e instanceof StorageNotConfigured) return Response.json({ error: e.message, notConfigured: true }, { status: 503 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
