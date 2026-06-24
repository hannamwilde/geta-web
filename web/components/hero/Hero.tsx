import { fetchTranslations } from '@/lib/translations/server'
import HeroCTAs from './HeroCTAs'
import styles from './Hero.module.css'

type Props = {
  block: {
    eyebrow?: string
    headline?: string
    subheadline?: string
    ctaPrimary?: { label?: string }
    ctaSecondary?: { label?: string }
  }
}

export default async function Hero({ block }: Props) {
  const t = await fetchTranslations()
  return (
    <section className={styles.hero} id="top">
      <div className={styles.container}>
        <div className={styles.copy}>
          {block.eyebrow && (
            <div className={styles.eyebrow}>
              <span>{block.eyebrow}</span>
            </div>
          )}
          {block.headline && (
            <h1 className={styles.headline}>{block.headline}</h1>
          )}
          {block.subheadline && (
            <p className={styles.sub}>{block.subheadline}</p>
          )}
          <HeroCTAs
            primaryLabel={block.ctaPrimary?.label || t.hero.primaryCta}
            secondaryLabel={block.ctaSecondary?.label || t.hero.secondaryCta}
          />
        </div>
      </div>
    </section>
  )
}
