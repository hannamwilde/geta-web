import type { Metadata } from "next";
import Link from "next/link";
import MessagePage from "@/components/layout/messagePage";
import NavThemeSetter from "@/components/layout/navThemeSetter";
import { fetchTranslations } from "@/lib/translations/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await fetchTranslations();
  return {
    title: t.errorPages.notFoundTitle,
    robots: { index: false, follow: true },
  };
}

export default async function NotFound() {
  const t = await fetchTranslations();

  return (
    <>
      <NavThemeSetter theme="default" />
      <MessagePage
        eyebrow="404"
        title={t.errorPages.notFoundTitle}
        body={t.errorPages.notFoundBody}
      >
        <Link href="/" className="btn btn-on-dark">
          {t.errorPages.notFoundCta}
        </Link>
      </MessagePage>
    </>
  );
}
