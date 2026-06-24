import { urlFor } from '@/sanity/client'
import { fetchTranslations } from '@/lib/translations/server'
import MozaikHeroCTAs from './MozaikHeroCTAs'
import styles from './MozaikHero.module.css'

type CTA = string | { label?: string } | null | undefined

type Props = {
  block: {
    eyebrow?: string
    headline?: string
    tagline?: string
    intro?: string
    ctaPrimary?: CTA
    ctaSecondary?: CTA
    markImage?: { asset: unknown }
  }
}

export default async function MozaikHero({ block }: Props) {
  const markSrc = block.markImage?.asset
    ? urlFor(block.markImage).height(92).url()
    : '/assets/mozaik-mark.png'

  const t = await fetchTranslations()
  const headline = block.headline || t.mozaik.headline
  const gradientPart = block.tagline || t.mozaik.tagline
  const kicker = block.eyebrow || t.mozaik.eyebrow
  const lead = block.intro || t.mozaik.intro
  const ctaPrimary = (typeof block.ctaPrimary === 'string' ? block.ctaPrimary : block.ctaPrimary?.label) || t.mozaik.primaryCta
  const ctaSecondary = (typeof block.ctaSecondary === 'string' ? block.ctaSecondary : block.ctaSecondary?.label) || t.mozaik.secondaryCta

  return (
    <header className={`${styles.hero} mzs-hero`}>
      <div className={styles.glow} aria-hidden />
      <div className={`container ${styles.inner}`}>
        <img className={styles.mark} src={markSrc} alt="Mozaik" />
        <span className={styles.kicker}>{kicker}</span>
        <h1 className={styles.title}>
          {headline} <span className={styles.grad}>{gradientPart}</span>
        </h1>
        <p className={styles.lead}>{lead}</p>
        <MozaikHeroCTAs primaryLabel={ctaPrimary} secondaryLabel={ctaSecondary} />
      </div>
    </header>
  )
}
