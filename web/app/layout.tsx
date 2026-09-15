import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { client } from "@/sanity/client";
import { navQuery, footerQuery, modalsQuery } from "@/sanity/queries";
import { fetchTranslations } from "@/lib/translations/server";
import { SITE_URL } from "@/lib/siteUrl";
import { fetchSiteSettings, htmlLang } from "@/lib/seo";
import Nav from "@/components/layout/nav";
import Footer, { type FooterData } from "@/components/layout/footer";
import type { NavData } from "@/components/layout/nav";
import { NavThemeProvider } from "@/context/NavThemeContext";
import { ContactModalProvider } from "@/context/ContactModalContext";
import ContactModal, { type ModalsData } from "@/components/layout/contactModal";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CookieConsent from "@/components/layout/cookieConsent";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-montserrat",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await fetchSiteSettings();

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.defaultTitle, template: site.titleTemplate },
    description: site.description,
    ...(site.noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      siteName: site.siteName,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      ...(site.twitterSite && { site: site.twitterSite }),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navData, footerData, modalsData, translations, site] =
    await Promise.all([
      client.fetch<NavData>(navQuery),
      client.fetch<FooterData>(footerQuery),
      client.fetch<ModalsData>(modalsQuery),
      fetchTranslations(),
      fetchSiteSettings(),
    ]);

  return (
    <html lang={htmlLang(site.locale)} className={montserrat.variable}>
      <body>
        <NavThemeProvider>
          <ContactModalProvider>
            <CookieConsentProvider>
              <Nav data={navData} t={translations.a11y} />
              {children}
              <Footer data={footerData} />
              <ContactModal data={modalsData ?? {}} t={translations.modal} />
              <CookieConsent t={translations.cookieConsent} />
            </CookieConsentProvider>
          </ContactModalProvider>
        </NavThemeProvider>
      </body>
    </html>
  );
}
