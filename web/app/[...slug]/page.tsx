import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { pageBySlugQuery, allPageSlugsQuery, kundcasesQuery } from '@/sanity/queries'
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
  const [page, kundcases] = await Promise.all([
    client.fetch(pageBySlugQuery, { slug: slugPath }),
    client.fetch(kundcasesQuery),
  ])

  if (!page) notFound()

  return (
    <main>
      <NavThemeSetter theme={page.navTheme === 'purple' ? 'purple' : 'default'} />
      <PageSections sections={page.sections ?? []} kundcases={kundcases ?? []} />
    </main>
  )
}
