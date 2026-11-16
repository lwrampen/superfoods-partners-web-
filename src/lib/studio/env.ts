// Blog Studio — which integrations are configured. Every secret is an env var Leonard sets in Vercel; when one is
// missing the matching feature shows "not configured yet" instead of failing.

const has = (k: string) => !!process.env[k]?.trim();

// Local testing only: file storage instead of Vercel Blob and mocked SEO/translation responses. Never on Vercel.
export const devMocks = () => !process.env.VERCEL && (process.env.NODE_ENV !== "production" || process.env.STUDIO_DEV_MOCKS === "1");

export function integrations() {
  return {
    auth: has("STUDIO_USERS") && has("STUDIO_SECRET"),
    storage: has("BLOB_READ_WRITE_TOKEN") || devMocks(),
    storageLocal: !has("BLOB_READ_WRITE_TOKEN") && devMocks(),
    dataforseo: has("DATAFORSEO_USERNAME") && has("DATAFORSEO_PASSWORD"),
    anthropic: has("ANTHROPIC_API_KEY"),
    github: has("STUDIO_GITHUB_TOKEN"),
    searchConsole: has("GOOGLE_CLIENT_ID") && has("GOOGLE_CLIENT_SECRET") && has("GOOGLE_REFRESH_TOKEN"),
    cron: has("CRON_SECRET"),
    mocks: devMocks(),
  };
}
export type Integrations = ReturnType<typeof integrations>;
