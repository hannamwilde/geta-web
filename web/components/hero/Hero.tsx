import { urlFor } from '@/sanity/client'
import HeroCTAs from './HeroCTAs'
import styles from './Hero.module.css'

type Props = {
  block: {
    eyebrow?: string
    eyebrowStyle?: string
    eyebrowColor?: string
    eyebrowFontSize?: number
    headline?: string
    tagline?: string
    subheadline?: string
    markImage?: { asset: unknown }
    backgroundImage?: { asset: unknown; alt?: string }
    ctaPrimary?: { label?: string }
    ctaSecondary?: { label?: string }
    backgroundColor?: string
    backgroundGradient?: {
      type?: string
      from?: string
      to?: string
      angle?: number
      position?: string
    } | null
    headlineColor?: string
    textColor?: string
    paddingTop?: number
    paddingBottom?: number
    alignment?: string
    textAlignment?: string
    taglineGradientFrom?: string
    taglineGradientTo?: string
    taglineGradientAngle?: number
  }
}

export default function Hero({ block }: Props) {
  const markSrc = block.markImage?.asset
    ? urlFor(block.markImage).height(92).url()
    : null

  const s: Record<string, string> = {}

  if (block.backgroundGradient?.from && block.backgroundGradient?.to) {
    const g = block.backgroundGradient
    s.background =
      g.type === 'radial'
        ? `radial-gradient(circle at ${g.position ?? 'center'}, ${g.from}, ${g.to})`
        : `linear-gradient(${g.angle ?? 135}deg, ${g.from}, ${g.to})`
  } else if (block.backgroundColor) {
    s.background = block.backgroundColor
  }

  if (block.backgroundImage?.asset) {
    s.backgroundImage = `url(${urlFor(block.backgroundImage).width(1600).url()})`
    s.backgroundSize = 'cover'
    s.backgroundPosition = 'center'
  }

  if (block.eyebrowColor) s['--hero-eyebrow-color'] = block.eyebrowColor
  if (block.eyebrowFontSize) s['--hero-eyebrow-size'] = block.eyebrowFontSize + 'px'
  if (block.headlineColor) s['--hero-headline'] = block.headlineColor
  if (block.textColor) s['--hero-text'] = block.textColor
  if (block.paddingTop != null) s.paddingTop = block.paddingTop + 'px'
  if (block.paddingBottom != null) s.paddingBottom = block.paddingBottom + 'px'

  const hasGradient = block.tagline && (block.taglineGradientFrom || block.taglineGradientTo)
  if (hasGradient) {
    s['--hero-grad-from'] = block.taglineGradientFrom ?? '#C4BCFB'
    s['--hero-grad-to'] = block.taglineGradientTo ?? '#C77DF0'
    s['--hero-grad-angle'] = (block.taglineGradientAngle ?? 105) + 'deg'
  }

  const eyebrowVariant = block.eyebrowStyle === 'tag' ? styles.eyebrowTag : styles.eyebrowBadge

  return (
    <section
      className={`${styles.hero} hero-section`}
      id="top"
      style={s as React.CSSProperties}
      data-align={block.alignment || 'left'}
      data-text-align={block.textAlignment || block.alignment || 'left'}
    >
      <div className={styles.container}>
        <div className={`${styles.copy} hero-copy`}>
          {markSrc && (
            <img className={styles.mark} src={markSrc} alt="" aria-hidden />
          )}
          {block.eyebrow && (
            <div className={`${styles.eyebrow} ${eyebrowVariant}`}>
              {block.eyebrowStyle === 'tag' && <span className={styles.eyebrowDot} />}
              {block.eyebrow}
            </div>
          )}
          {block.headline && (
            <h1 className={styles.headline}>
              {block.headline}
              {block.tagline && (
                <> <span className={hasGradient ? styles.grad : undefined}>{block.tagline}</span></>
              )}
            </h1>
          )}
          {block.subheadline && (
            <p className={styles.sub}>{block.subheadline}</p>
          )}
          <HeroCTAs
            primaryLabel={block.ctaPrimary?.label}
            secondaryLabel={block.ctaSecondary?.label}
          />
        </div>
      </div>
    </section>
  )
}
