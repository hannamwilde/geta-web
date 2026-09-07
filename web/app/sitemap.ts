import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import {
  sitemapPagesQuery,
  sitemapHomeQuery,
  sitemapPostsQuery,
  sitemapEventsQuery,
} from "@/sanity/queries";
import { SITE_URL } from "@/lib/siteUrl";

type SitemapPage = { slug: string; _updatedAt: string; noIndex?: boolean };
type SitemapHome = { _updatedAt: string; noIndex?: boolean };
type SitemapEntry = { slug: string; _updatedAt: string };

/**
 * Posts and events are the bulk of the site and are only linked from paginated
 * listings, so leaving them out hid ~210 URLs from crawlers. Neither type has a
 * noIndex field — only `page` does.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, home, posts, events] = await Promise.all([
    client.fetch<SitemapPage[]>(sitemapPagesQuery),
    client.fetch<SitemapHome>(sitemapHomeQuery),
    client.fetch<SitemapEntry[]>(sitemapPostsQuery),
    client.fetch<SitemapEntry[]>(sitemapEventsQuery),
  ]);

  const now = new Date().toISOString();
  const entries: MetadataRoute.Sitemap = [];

  if (!home?.noIndex) {
    entries.push({
      url: SITE_URL,
      lastModified: home?._updatedAt ?? now,
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

  // The listing itself is a route, not a Sanity page, so it has no document to
  // date. Its newest post is the closest honest answer.
  const newestPost = (posts ?? [])
    .map((p) => p._updatedAt)
    .sort()
    .at(-1);

  entries.push({
    url: `${SITE_URL}/blog`,
    lastModified: newestPost ?? now,
    changeFrequency: "weekly",
    priority: 0.7,
  });

  for (const post of posts ?? []) {
    entries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post._updatedAt,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  for (const event of events ?? []) {
    entries.push({
      url: `${SITE_URL}/events/${event.slug}`,
      lastModified: event._updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
