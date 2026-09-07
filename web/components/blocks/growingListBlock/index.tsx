import { urlFor } from '@/sanity/client'
import { resolveBackground, type BackgroundImage } from '@/lib/background'
import { resolveHref } from '@/lib/resolveHref'
import styles from './styles.module.scss'
import { resolveBorder, type Border } from '@/lib/border'

type Pillar = {
  _key: string
  title: string
  body?: string
  image?: { asset: unknown; alt?: string; crop?: unknown; hotspot?: unknown }
  linkLabel?: string
  linkType?: string
  href?: string
  pageRef?: { slug?: { current?: string } }
}

type Props = {
  block: {
    backgroundImage?: BackgroundImage;
    border?: Border
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
    borderRadius?: number
    taglineGradientFrom?: string
    taglineGradientTo?: string
    taglineGradientAngle?: number
    paddingTop?: number
    paddingBottom?: number
  }
}

export default function GrowingListBlock({ block }: Props) {
  const hasGradient = block.tagline && (block.taglineGradientFrom || block.taglineGradientTo)

  const sectionStyle = {
    ...resolveBackground(block.backgroundColor, block.backgroundGradient, block.backgroundImage),
    ...resolveBorder(block.border),
    ...(block.paddingTop != null ? { paddingTop: block.paddingTop + 'px' } : {}),
    ...(block.paddingBottom != null ? { paddingBottom: block.paddingBottom + 'px' } : {}),
    ...(block.textColor ? { '--gl-text': block.textColor } : {}),
    ...(hasGradient ? { '--gl-grad-from': block.taglineGradientFrom ?? '#79B6A6' } : {}),
    ...(hasGradient ? { '--gl-grad-to': block.taglineGradientTo ?? '#C4BCFB' } : {}),
    ...(hasGradient ? { '--gl-grad-angle': (block.taglineGradientAngle ?? 105) + 'deg' } : {}),
    ...(block.borderRadius != null ? { '--r-lg': block.borderRadius + 'px', '--r-xl': block.borderRadius + 'px' } : {}),
  } as React.CSSProperties

  const eyebrowStyle: React.CSSProperties = {
    ...(block.eyebrowColor ? { color: block.eyebrowColor } : {}),
    ...(block.eyebrowFontSize ? { fontSize: block.eyebrowFontSize + 'px' } : {}),
  }

  const headlineStyle: React.CSSProperties = {
    ...(block.headlineColor ? { color: block.headlineColor } : {}),
    ...(block.headlineFontSize ? { fontSize: block.headlineFontSize + 'px' } : {}),
  }

  return (
    <section className={styles.section} id="growing-list" style={sectionStyle}>
      <div className={`container ${styles.inner}`}>
        {(block.eyebrow || block.headline) && (
          <div
            className={styles.header}
            data-align={block.alignment ?? 'center'}
            style={{ textAlign: (block.alignment ?? 'center') as React.CSSProperties['textAlign'] }}
          >
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
          </div>
        )}
        {block.pillars && block.pillars.length > 0 && (
          <div className={styles.grid}>
            {block.pillars.map((pillar) => {
              const imgUrl = pillar.image?.asset
                ? urlFor(pillar.image).width(600).height(500).url()
                : null
              const href = resolveHref(pillar.linkType, pillar.href, pillar.pageRef)
              const isExternal = pillar.linkType === 'external'
              const Tag = href ? 'a' : 'article'
              const linkProps = href
                ? { href, ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
                : {}
              return (
                <Tag
                  className={`${styles.card}${href ? ` ${styles.cardLinked}` : ''}`}
                  key={pillar._key}
                  {...(linkProps as object)}
                >
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
                    {pillar.linkLabel && (
                      <span className={styles.cardCta} aria-hidden>
                        {pillar.linkLabel}
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" />
                        </svg>
                      </span>
                    )}
                  </div>
                </Tag>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
