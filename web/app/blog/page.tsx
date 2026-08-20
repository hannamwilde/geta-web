import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { blogListQuery, blogCountQuery } from "@/sanity/queries";
import BlogList from "./_components/blogList";
import NavThemeSetter from "@/components/layout/navThemeSetter";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
};

const PER_PAGE = 9;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const start = (page - 1) * PER_PAGE;
  const end = start + PER_PAGE;

  const [posts, total] = await Promise.all([
    client.fetch(blogListQuery, { start, end }),
    client.fetch<number>(blogCountQuery),
  ]);

  const totalPages = Math.ceil((total ?? 0) / PER_PAGE);

  return (
    <main>
      <NavThemeSetter theme="default" />
      <BlogList posts={posts ?? []} page={page} totalPages={totalPages} />
    </main>
  );
}
