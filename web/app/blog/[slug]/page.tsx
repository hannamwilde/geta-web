import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { buildMetadata } from "@/lib/seo";
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

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    image: post.coverImage,
    imageAlt: post.coverImage?.alt ?? post.title,
    type: "article",
  });
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
