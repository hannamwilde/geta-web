import { urlFor } from '@/sanity/client'
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

export default function MozaikHero({ block }: Props) {
  const markSrc = block.markImage?.asset
    ? urlFor(block.markImage).height(92).url()
    : '/assets/mozaik-mark.png'

  const headline = block.headline || 'Frigör din'
  const gradientPart = block.tagline || 'potential.'
  const kicker = block.eyebrow || 'AI-driven digital handel'
  const lead = block.intro || 'Den flexibla e-handelsplattformen byggd för att lösa komplex affärslogik och integrera sömlöst med vilken motor som helst.'
  const ctaPrimary = (typeof block.ctaPrimary === 'string' ? block.ctaPrimary : block.ctaPrimary?.label) || 'Kontakta oss'
  const ctaSecondary = (typeof block.ctaSecondary === 'string' ? block.ctaSecondary : block.ctaSecondary?.label) || 'Boka en demo'

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
