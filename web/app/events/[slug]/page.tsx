import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { buildMetadata } from "@/lib/seo";
import { eventBySlugQuery, allEventSlugsQuery } from "@/sanity/queries";
import EventPage from "../_components/eventPage";
import NavThemeSetter from "@/components/layout/navThemeSetter";

export const revalidate = 30;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allEventSlugsQuery);
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await client.fetch(eventBySlugQuery, { slug });
  if (!event) return {};

  return buildMetadata({
    title: event.title,
    description: event.excerpt,
    path: `/events/${slug}`,
    image: event.image,
    imageAlt: event.image?.alt ?? event.title,
    type: "article",
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const event = await client.fetch(eventBySlugQuery, { slug });

  if (!event) notFound();

  return (
    <main>
      <NavThemeSetter theme="default" />
      <EventPage event={event} />
    </main>
  );
}
