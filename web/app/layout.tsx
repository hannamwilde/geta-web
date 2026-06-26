import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { client } from '@/sanity/client'
import { navQuery, footerQuery } from '@/sanity/queries'
import { fetchTranslations } from '@/lib/translations/server'
import Nav from '@/components/nav/Nav'
import Footer, { type FooterData } from '@/components/footer/Footer'
import type { NavData } from '@/components/nav/Nav'
import { NavThemeProvider } from '@/context/NavThemeContext'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal', 'italic'],
  variable: '--font-montserrat',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://getadigital.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Geta Digital', template: '%s | Geta Digital' },
  description: 'Geta Digital är en nordisk e-handelskonsult specialiserad på strategi, design och teknisk utveckling för e-handel.',
  openGraph: {
    siteName: 'Geta Digital',
    locale: 'sv_SE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@getadigital',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [navData, footerData] = await Promise.all([
    client.fetch<NavData>(navQuery),
    client.fetch<FooterData>(footerQuery),
    fetchTranslations(),
  ])

  return (
    <html lang="sv" className={montserrat.variable}>
      <body>
        <NavThemeProvider>
          <Nav data={navData} />
          {children}
          <Footer data={footerData} />
        </NavThemeProvider>
      </body>
    </html>
  )
}
