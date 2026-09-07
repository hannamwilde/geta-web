/**
 * Global next/image loader (wired up via `images.loaderFile` in next.config).
 *
 * It has to be a module-level default export rather than a `loader` prop:
 * server components cannot pass functions to client components, and next/image
 * is a client component.
 *
 * Sanity's CDN does the resizing, so no bytes pass through this app's own
 * optimizer. Local /assets files are returned untouched — they are already
 * sized and have no CDN params to rewrite.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.startsWith("http")) return src;

  const url = new URL(src);
  const baseW = Number(url.searchParams.get("w"));
  const baseH = Number(url.searchParams.get("h"));
  // A call site that asked for a fixed crop encodes its aspect in w+h. Scale
  // both, or wider srcset entries would come back a different shape.
  if (baseW > 0 && baseH > 0) {
    url.searchParams.set("h", String(Math.round((baseH * width) / baseW)));
  } else if (baseH > 0) {
    // Height-only sources (logos, marks) carry no aspect for us to scale
    // against. Drop it and let width alone resize, preserving the original
    // proportions instead of squashing to a fixed height.
    url.searchParams.delete("h");
  }
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  return url.toString();
}
