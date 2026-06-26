import { urlFor } from '@/sanity/client'
import { resolveBackground } from '@/lib/background'
import styles from './Services.module.css'

type Pillar = { _key: string; title: string; body?: string; image?: { asset: unknown; alt?: string } }

type Props = {
  block: {
    eyebrow?: string
    headline?: string
    tagline?: string
    pillars?: Pillar[]
    backgroundColor?: string
    backgroundGradient?: { type?: string; from?: string; to?: string; angle?: number; position?: string } | null
    eyebrowColor?: string
    eyebrowFontSize?: number
    headlineColor?: string
    headlineFontSize?: number
    textColor?: string
    alignment?: string
    taglineGradientFrom?: string
    taglineGradientTo?: string
    taglineGradientAngle?: number
    paddingTop?: number
    paddingBottom?: number
  }
}

export default function Services({ block }: Props) {
  const hasGradient = block.tagline && (block.taglineGradientFrom || block.taglineGradientTo)

  const sectionStyle = {
    ...resolveBackground(block.backgroundColor, block.backgroundGradient),
    ...(block.paddingTop != null ? { paddingTop: block.paddingTop + 'px' } : {}),
    ...(block.paddingBottom != null ? { paddingBottom: block.paddingBottom + 'px' } : {}),
    ...(block.textColor ? { '--svc-text': block.textColor } : {}),
    ...(hasGradient ? { '--svc-grad-from': block.taglineGradientFrom ?? '#79B6A6' } : {}),
    ...(hasGradient ? { '--svc-grad-to': block.taglineGradientTo ?? '#C4BCFB' } : {}),
    ...(hasGradient ? { '--svc-grad-angle': (block.taglineGradientAngle ?? 105) + 'deg' } : {}),
  } as React.CSSProperties

  const eyebrowStyle: React.CSSProperties = {
    ...(block.eyebrowColor ? { color: block.eyebrowColor } : {}),
    ...(block.eyebrowFontSize ? { fontSize: block.eyebrowFontSize + 'px' } : {}),
  }

  const headlineStyle: React.CSSProperties = {
    ...(block.headlineColor ? { color: block.headlineColor } : {}),
    ...(block.headlineFontSize ? { fontSize: block.headlineFontSize + 'px' } : {}),
    ...(block.alignment ? { textAlign: block.alignment as React.CSSProperties['textAlign'] } : {}),
  }

  return (
    <section className={styles.section} id="services" style={sectionStyle}>
      <div className={`container ${styles.inner}`}>
        {block.eyebrow && (
          <p className={styles.eyebrow} style={eyebrowStyle}>{block.eyebrow}</p>
        )}
        {block.headline && (
          <h2 className={styles.title} style={headlineStyle}>
            {block.headline}
            {block.tagline && (
              <> <span className={hasGradient ? styles.grad : undefined}>{block.tagline}</span></>
            )}
          </h2>
        )}
        {block.pillars && block.pillars.length > 0 && (
          <div className={styles.grid}>
            {block.pillars.map((pillar) => {
              const imgUrl = pillar.image?.asset
                ? urlFor(pillar.image).width(600).height(500).url()
                : null
              return (
                <article className={styles.card} key={pillar._key}>
                  {imgUrl && (
                    <div className={styles.cardMedia}>
                      <img src={imgUrl} alt={pillar.image?.alt || pillar.title} />
                    </div>
                  )}
                  <div className={styles.cardContent}>
                    <div className={styles.cardText}>
                      <h3 className={styles.cardTitle}>{pillar.title}</h3>
                      {pillar.body && <p className={styles.cardBody}>{pillar.body}</p>}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
