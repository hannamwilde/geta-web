import { urlFor } from '@/sanity/client'
import { fetchTranslations } from '@/lib/translations/server'
import ContactBannerCTA from './ContactBannerCTA'
import styles from './ContactBanner.module.css'

type Props = {
  block: {
    headline?: string
    subheadline?: string
    cta?: { label?: string; href?: string }
    backgroundImage?: { asset: unknown; alt?: string }
  }
}

export default async function ContactBanner({ block }: Props) {
  const bgUrl = block.backgroundImage?.asset
    ? urlFor(block.backgroundImage).width(1400).url()
    : null

  const t = await fetchTranslations()
  const ctaLabel = block.cta?.label || t.general.contact

  return (
    <section className={styles.section} aria-labelledby="bcta-title">
      <div className="container">
        <div className={styles.frame}>
          {bgUrl && (
            <img className={styles.bg} src={bgUrl} alt={block.backgroundImage?.alt || ''} />
          )}
          <div className={styles.tint} aria-hidden />
          <div className={styles.dome}>
            <div className={styles.domeInner}>
              {block.headline && <h2 className={styles.title} id="bcta-title">{block.headline}</h2>}
              {block.subheadline && <p className={styles.sub}>{block.subheadline}</p>}
              <ContactBannerCTA label={ctaLabel} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
