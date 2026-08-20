import type { Metadata } from 'next'
import { client, urlFor } from '@/sanity/client'

export const revalidate = 30
import { homePageQuery, casesQuery } from '@/sanity/queries'
import PageSections from '@/components/blocks/pageSections'

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(homePageQuery)
  const seo = page?.seo
  const ogImageUrl = seo?.ogImage?.asset
    ? urlFor(seo.ogImage).width(1200).height(630).url()
    : undefined

  return {
    title: seo?.title ?? undefined,
    description: seo?.description ?? undefined,
    ...(seo?.noIndex && { robots: { index: false, follow: false } }),
    alternates: { canonical: '/' },
    openGraph: {
      url: '/',
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: seo?.ogImage?.alt ?? 'Geta Digital' }],
      }),
    },
    ...(ogImageUrl && { twitter: { images: [ogImageUrl] } }),
  }
}

export default async function HomePage() {
  const [page, cases] = await Promise.all([
    client.fetch(homePageQuery),
    client.fetch(casesQuery),
  ])

  if (!page) return null

  return (
    <main>
      <PageSections sections={page.sections ?? []} cases={cases ?? []} />
    </main>
  )
}
