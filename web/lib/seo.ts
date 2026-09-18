import { cache } from "react";
import type { Metadata } from "next";
import { client, urlFor, urlForExact } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SanityImage = { asset?: any; alt?: string };

export type SiteSettings = {
  siteName: string;
  locale: string;
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  favicon?: SanityImage | null;
  placeholderImage?: SanityImage | null;
  ogImage?: SanityImage | null;
  twitterSite?: string;
  noIndex: boolean;
};

/** Used until an editor fills in the Site settings document. */
const DEFAULTS: SiteSettings = {
  siteName: "Geta Digital",
  locale: "sv_SE",
  defaultTitle: "Geta Digital",
  titleTemplate: "%s | Geta Digital",
  description:
    "Geta Digital är en nordisk e-handelskonsult specialiserad på strategi, design och teknisk utveckling för e-handel.",
  favicon: null,
  placeholderImage: null,
  ogImage: null,
  twitterSite: "@getadigital",
  noIndex: false,
};

export const fetchSiteSettings = cache(async (): Promise<SiteSettings> => {
  const data = await client.fetch<Partial<SiteSettings> | null>(
    siteSettingsQuery,
  );
  if (!data) return DEFAULTS;

  const siteName = data.siteName || DEFAULTS.siteName;
  return {
    siteName,
    locale: data.locale || DEFAULTS.locale,
    defaultTitle: data.defaultTitle || siteName,
    titleTemplate: data.titleTemplate || `%s | ${siteName}`,
    description: data.description || DEFAULTS.description,
    favicon: data.favicon ?? null,
    placeholderImage: data.placeholderImage ?? null,
    ogImage: data.ogImage ?? null,
    twitterSite: data.twitterSite || DEFAULTS.twitterSite,
    noIndex: data.noIndex ?? DEFAULTS.noIndex,
  };
});

/** Icon in `public/`, used until an editor uploads one to Site settings. */
const FALLBACK_FAVICON = "/favicon.ico";

/**
 * Browser and home-screen icons from the Site settings favicon.
 *
 * SVG uploads pass through untouched — the Sanity CDN doesn't resize them —
 * so the sizes only take effect for raster uploads.
 */
export function buildIcons(site: SiteSettings): Metadata["icons"] {
  if (!site.favicon?.asset) return { icon: FALLBACK_FAVICON };

  const icon = (size: number) =>
    urlForExact(site.favicon).width(size).height(size).url();

  return {
    icon: [
      { url: icon(32), sizes: "32x32" },
      { url: icon(192), sizes: "192x192" },
    ],
    apple: [{ url: icon(180), sizes: "180x180" }],
  };
}

export type ResolvedImage = {
  image: SanityImage;
  alt?: string;
  /** True when the Site settings placeholder stood in for missing content. */
  isPlaceholder: boolean;
};

/**
 * The content's own image, or the Site settings placeholder when it has none.
 * Null only when neither exists — callers size the result themselves, since
 * every card crops differently.
 */
export function withPlaceholder(
  image: SanityImage | null | undefined,
  site: SiteSettings,
): ResolvedImage | null {
  if (image?.asset) return { image, alt: image.alt, isPlaceholder: false };
  const placeholder = site.placeholderImage;
  return placeholder?.asset
    ? { image: placeholder, alt: placeholder.alt, isPlaceholder: true }
    : null;
}

/**
 * Sizes a resolved image to a card's box.
 *
 * Content images are cropped to fill it, as before. The placeholder is
 * letterboxed into it instead: one graphic has to sit in every card's box,
 * from 5:4 to 20:9, and cropping it to each cuts the middle out of it. The
 * padding is fully transparent, so the card's own background shows through.
 */
export function resolvedImageUrl(
  resolved: ResolvedImage,
  size: { width?: number; height?: number },
): string {
  let builder = urlFor(resolved.image);
  if (resolved.isPlaceholder) {
    builder = builder.ignoreImageParams().fit("fill").bg("00000000");
  }
  if (size.width) builder = builder.width(size.width);
  if (size.height) builder = builder.height(size.height);
  return builder.url();
}

/** `sv_SE` → `sv`, for the <html lang> attribute. */
export function htmlLang(locale: string): string {
  return locale.split(/[_-]/)[0] || "sv";
}

type PageSeo = {
  /** Omit for the site-wide default title. */
  title?: string | null;
  description?: string | null;
  /** Canonical path, e.g. "/blog". */
  path: string;
  image?: SanityImage | null;
  imageAlt?: string | null;
  noIndex?: boolean;
  type?: "website" | "article";
};

/**
 * Builds a page's metadata on top of the Site settings document.
 *
 * Next merges metadata shallowly, so a page that sets `openGraph` replaces the
 * layout's entirely — every page has to spell out siteName and locale. Routing
 * them all through here is what keeps the singleton in effect site-wide.
 */
export async function buildMetadata(page: PageSeo): Promise<Metadata> {
  const site = await fetchSiteSettings();

  const image = page.image?.asset ? page.image : site.ogImage;
  const imageUrl = image?.asset
    ? urlFor(image).width(1200).height(630).url()
    : undefined;
  const images = imageUrl
    ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: page.imageAlt || image?.alt || page.title || site.siteName,
        },
      ]
    : undefined;

  const description = page.description || site.description;
  const hidden = page.noIndex || site.noIndex;

  return {
    ...(page.title && { title: page.title }),
    description,
    alternates: { canonical: page.path },
    ...(hidden && { robots: { index: false, follow: false } }),
    openGraph: {
      siteName: site.siteName,
      locale: site.locale,
      type: page.type ?? "website",
      url: page.path,
      // Set explicitly rather than left to inherit: og:title reads better
      // without the title template's brand suffix, which og:site_name carries.
      title: page.title || site.defaultTitle,
      description,
      ...(images && { images }),
    },
    twitter: {
      card: "summary_large_image",
      ...(site.twitterSite && { site: site.twitterSite }),
      title: page.title || site.defaultTitle,
      description,
      ...(images && { images: images.map((i) => i.url) }),
    },
  };
}
