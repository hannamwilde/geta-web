import { cache } from "react";
import type { Metadata } from "next";
import { client, urlFor } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImage = { asset?: any; alt?: string };

export type SiteSettings = {
  siteName: string;
  locale: string;
  defaultTitle: string;
  titleTemplate: string;
  description: string;
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
    ogImage: data.ogImage ?? null,
    twitterSite: data.twitterSite || DEFAULTS.twitterSite,
    noIndex: data.noIndex ?? DEFAULTS.noIndex,
  };
});

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
