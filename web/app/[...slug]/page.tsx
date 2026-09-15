import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 30
import { pageBySlugQuery, allPageSlugsQuery, casesQuery, upcomingEventsQuery, pastEventsQuery } from '@/sanity/queries'
import PageSections from '@/components/blocks/pageSections'
import NavThemeSetter from '@/components/layout/navThemeSetter'

type Props = { params: Promise<{ slug: string[] }> }

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allPageSlugsQuery)
  return slugs.map((slug) => ({ slug: slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const slugPath = slug.join('/')
  const page = await client.fetch(pageBySlugQuery, { slug: slugPath })
  const seo = page?.seo

  return buildMetadata({
    title: seo?.title ?? page?.title,
    description: seo?.description,
    path: `/${slugPath}`,
    image: seo?.ogImage,
    imageAlt: seo?.ogImage?.alt ?? page?.title,
    noIndex: seo?.noIndex,
  })
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const page = await client.fetch(pageBySlugQuery, { slug: slugPath })

  if (!page) notFound()

  const hasEvents = (page.sections ?? []).some((s: { _type: string }) => s._type === 'eventsSection')

  const [cases, upcomingEvents, pastEvents] = await Promise.all([
    client.fetch(casesQuery),
    hasEvents ? client.fetch(upcomingEventsQuery) : Promise.resolve([]),
    hasEvents ? client.fetch(pastEventsQuery) : Promise.resolve([]),
  ])

  return (
    <main>
      <NavThemeSetter theme={page.navTheme === 'purple' ? 'purple' : 'default'} />
      <PageSections
        sections={page.sections ?? []}
        cases={cases ?? []}
        upcomingEvents={upcomingEvents ?? []}
        pastEvents={pastEvents ?? []}
      />
    </main>
  )
}
