import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { pageBySlugQuery, allPageSlugsQuery, casesQuery, upcomingEventsQuery, pastEventsQuery } from '@/sanity/queries'
import PageSections from '@/components/page-sections/PageSections'
import NavThemeSetter from '@/components/nav/NavThemeSetter'

type Props = { params: Promise<{ slug: string[] }> }

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allPageSlugsQuery)
  return slugs.map((slug) => ({ slug: slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await client.fetch(pageBySlugQuery, { slug: slug.join('/') })
  const seo = page?.seo
  return {
    title: seo?.title ?? page?.title ?? undefined,
    description: seo?.description ?? undefined,
  }
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
