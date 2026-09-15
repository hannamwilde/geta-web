import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 30
import { homePageQuery, casesQuery } from '@/sanity/queries'
import PageBlocks from '@/components/blocks/pageBlocks'

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(homePageQuery)
  const seo = page?.seo

  return buildMetadata({
    title: seo?.title,
    description: seo?.description,
    path: '/',
    image: seo?.ogImage,
    imageAlt: seo?.ogImage?.alt,
    noIndex: seo?.noIndex,
  })
}

export default async function HomePage() {
  const [page, cases] = await Promise.all([
    client.fetch(homePageQuery),
    client.fetch(casesQuery),
  ])

  if (!page) return null

  return (
    <main>
      <PageBlocks blocks={page.blocks ?? []} cases={cases ?? []} />
    </main>
  )
}
