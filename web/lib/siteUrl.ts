const RAW = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.getadigital.com";

function resolveSiteUrl(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not a valid URL: ${JSON.stringify(raw)}`,
    );
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be a bare origin with no path — got ${JSON.stringify(raw)}. ` +
        `Use ${JSON.stringify(url.origin)}.`,
    );
  }
  return url.origin;
}

export const SITE_URL = resolveSiteUrl(RAW);
