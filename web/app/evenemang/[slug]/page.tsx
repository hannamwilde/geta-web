import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client, urlFor } from '@/sanity/client'
import { eventBySlugQuery, allEventSlugsQuery } from '@/sanity/queries'
import EventPage from '../_components/eventPage'
import NavThemeSetter from '@/components/layout/navThemeSetter'

export const revalidate = 30

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allEventSlugsQuery)
  return (slugs ?? []).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await client.fetch(eventBySlugQuery, { slug })
  if (!event) return {}

  const ogImageUrl = event.image?.asset
    ? urlFor(event.image).width(1200).height(630).url()
    : undefined

  return {
    title: event.title,
    description: event.excerpt ?? undefined,
    alternates: { canonical: `/evenemang/${slug}` },
    openGraph: {
      url: `/evenemang/${slug}`,
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: event.image?.alt ?? event.title }],
      }),
    },
    ...(ogImageUrl && { twitter: { images: [ogImageUrl] } }),
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const event = await client.fetch(eventBySlugQuery, { slug })

  if (!event) notFound()

  return (
    <main>
      <NavThemeSetter theme="default" />
      <EventPage event={event} />
    </main>
  )
}
