import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { sitemapPagesQuery, sitemapHomeQuery } from "@/sanity/queries";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://getadigital.com/sv";

type SitemapPage = { slug: string; _updatedAt: string; noIndex?: boolean };
type SitemapHome = { _updatedAt: string; noIndex?: boolean };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, home] = await Promise.all([
    client.fetch<SitemapPage[]>(sitemapPagesQuery),
    client.fetch<SitemapHome>(sitemapHomeQuery),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  if (!home?.noIndex) {
    entries.push({
      url: SITE_URL,
      lastModified: home?._updatedAt ?? new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 1,
    });
  }

  for (const page of pages ?? []) {
    if (page.noIndex) continue;
    entries.push({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: page._updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
