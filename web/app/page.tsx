import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { homePageQuery, kundcasesQuery } from '@/sanity/queries'
import PageSections from '@/components/page-sections/PageSections'

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(homePageQuery)
  const seo = page?.seo
  return {
    title: seo?.title ?? undefined,
    description: seo?.description ?? undefined,
  }
}

export default async function HomePage() {
  const [page, kundcases] = await Promise.all([
    client.fetch(homePageQuery),
    client.fetch(kundcasesQuery),
  ])

  if (!page) return null

  return (
    <main>
      <PageSections sections={page.sections ?? []} kundcases={kundcases ?? []} />
    </main>
  )
}
