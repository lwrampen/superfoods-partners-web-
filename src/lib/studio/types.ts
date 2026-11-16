// Blog Studio — shared types (client + server). No Node imports here.
//
// The post body is stored as structured JSON blocks (never raw HTML). Inline formatting inside a text field uses a
// tiny, safe markup that both sites already understand: **bold**, *italic* and [label](/path). The same block format
// is written to the target repo (PMP: content/posts/<slug>.json, SFP: content/insights/<slug>.json).

export type SiteId = "pmp" | "sfp";

export type ImageRef = {
  src: string; // studio: media URL (/api/studio/media/...); published: /blog/<slug>/<file>
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | ({ type: "image" } & ImageRef)
  | { type: "gallery"; images: ImageRef[] }
  | { type: "video"; provider: "youtube" | "vimeo"; id: string; title?: string };

export type Faq = { q: string; a: string };

// One locale's copy of a post.
export type LocaleCopy = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  lede: string;
  blocks: Block[]; // body only (headings, text, lists, quotes, inline images); video + gallery are post-level
  faqs: Faq[];
  headerAlt?: string;
  gallery?: { alt: string; caption?: string }[]; // per extra photo, same order as post.gallery
  videoTitle?: string;
  sourceHash?: string; // translations: hash of the English copy they were made from (shows "English changed")
};

export type Keyword = { keyword: string; volume: number | null; market?: string };

export type SeoData = {
  primary: Keyword | null;
  secondary: Keyword[];
  candidates?: Keyword[];
  generatedAt: string;
  mocked?: boolean;
  notes?: string[];
  internalLinks?: { path: string; anchor: string }[];
};

export type PostStatus = "draft" | "scheduled" | "publishing" | "live" | "needs_attention";

export type PublishPhase = "branch" | "preview" | "production" | "verify" | "done";

export type PublishState = {
  phase: PublishPhase;
  branch?: string;
  prNumber?: number;
  prUrl?: string;
  headSha?: string;
  mergeSha?: string;
  previewUrl?: string;
  startedAt: string;
  phaseStartedAt?: string;
  lockUntil?: string; // a tick is working on this post (prevents double merges)
  log: { at: string; msg: string }[];
};

export type StudioPost = {
  id: string;
  site: SiteId;
  slug: string;
  status: PostStatus;
  author: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  scheduledAt?: string | null; // ISO UTC instant (entered as Europe/Amsterdam date + time)
  publishedAt?: string | null;
  liveUrl?: string | null;
  error?: string | null;
  header: ImageRef | null;
  gallery: (ImageRef & { inGallery?: boolean })[];
  video: { url: string; provider: "youtube" | "vimeo"; id: string; position: "after-intro" | "end" } | null;
  products: string[]; // ids from the site's product list (config.ts)
  editorDoc?: unknown; // TipTap JSON of the source (English) text, for re-editing
  locales: Record<string, LocaleCopy>; // "en" is the source; other live locales come from the SEO/translation step
  seo?: SeoData | null;
  suggestion?: { slug: string; copy: LocaleCopy; at: string } | null; // last SEO suggestion, until accepted/dismissed
  publish?: PublishState | null;
};

// Row in the overview (studio drafts + existing posts read from the repos).
export type OverviewRow = {
  key: string;
  site: SiteId;
  slug: string;
  title: string;
  author: string;
  status: PostStatus;
  source: "studio" | "repo";
  id?: string; // studio post id
  date?: string | null;
  updatedAt?: string | null;
  scheduledAt?: string | null;
  url?: string | null;
  primaryKeyword?: string | null;
  error?: string | null;
  visits?: { clicks: number; impressions: number; position: number | null } | null;
};
