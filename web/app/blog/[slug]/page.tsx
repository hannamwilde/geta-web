import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/sanity/client";
import { postBySlugQuery, allPostSlugsQuery } from "@/sanity/queries";
import BlogPost from "../_components/blogPost";
import NavThemeSetter from "@/components/layout/navThemeSetter";

export const revalidate = 30;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allPostSlugsQuery);
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });
  if (!post) return {};

  const ogImageUrl = post.coverImage?.asset
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : undefined;

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      url: `/blog/${slug}`,
      ...(ogImageUrl && {
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: post.coverImage?.alt ?? post.title,
          },
        ],
      }),
    },
    ...(ogImageUrl && { twitter: { images: [ogImageUrl] } }),
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await client.fetch(postBySlugQuery, { slug });

  if (!post) notFound();

  return (
    <main>
      <NavThemeSetter theme="default" />
      <BlogPost post={post} />
    </main>
  );
}
