import Image from "next/image";
import { assetDimensions } from '@/lib/imageDimensions'
import { preload } from 'react-dom'
import { urlFor } from '@/sanity/client'
import BackgroundMedia, { type BackgroundVideo } from '@/components/ui/backgroundMedia'
import { gradientCss, type Gradient } from '@/lib/background'
import HeroBlockCTAs, { type CTA } from './components/heroBlockCtas'
import styles from './styles.module.scss'
import { resolveBorder, type Border } from '@/lib/border'

type Props = {
  block: {
    border?: Border
    eyebrow?: string
    eyebrowStyle?: string
    eyebrowColor?: string
    eyebrowFontSize?: number
    headline?: string
    tagline?: string
    subheadline?: string
    markImage?: { asset: unknown }
    markWidth?: number
    backgroundImage?: { asset: unknown; alt?: string }
    backgroundVideo?: BackgroundVideo
    overlayColor?: string
    overlayGradient?: Gradient
    overlayOpacity?: number
    ctaPrimary?: CTA
    ctaSecondary?: CTA
    backgroundColor?: string
    backgroundGradient?: Gradient
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

export default function HeroBlock({ block }: Props) {
  const markSrc = block.markImage?.asset
    ? block.markWidth
      ? urlFor(block.markImage).width(Math.round(block.markWidth * 2)).url()
      : urlFor(block.markImage).height(92).url()
    : null
  // CSS drives the rendered width; these only give the browser an aspect ratio.
  const markSize = assetDimensions(block.markImage?.asset) ?? { width: 92, height: 92 }

  const s: Record<string, string> = {}

  const gradient = gradientCss(block.backgroundGradient)
  if (gradient) {
    s.background = gradient
  } else if (block.backgroundColor) {
    s.background = block.backgroundColor
  }

  const backgroundUrl = block.backgroundImage?.asset
    ? urlFor(block.backgroundImage).width(1600).url()
    : null

  if (backgroundUrl) {
    s.backgroundImage = `url(${backgroundUrl})`
    s.backgroundSize = 'cover'
    s.backgroundPosition = 'center'
    // The hero background is the LCP element on most pages, but a CSS background-image
    // isn't discoverable until the stylesheet has parsed. Preloading it lets the browser
    // start the fetch straight from the document.
    preload(backgroundUrl, { as: 'image', fetchPriority: 'high' })
  }

  if (block.markWidth) s['--hero-mark-w'] = block.markWidth + 'px'
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

  // A background image or video makes the section hold an aspect ratio (see styles).
  const hasMedia = Boolean(backgroundUrl || block.backgroundVideo?.asset?.url)

  return (
    <section
      className={`${styles.hero} hero-section`}
      id="top"
      style={{ ...(s as React.CSSProperties), ...resolveBorder(block.border) }}
      data-align={block.alignment || 'left'}
      data-text-align={block.textAlignment || block.alignment || 'left'}
      data-has-media={hasMedia ? 'true' : undefined}
    >
      <BackgroundMedia
        video={block.backgroundVideo}
        posterUrl={backgroundUrl}
        overlayColor={block.overlayColor}
        overlayGradient={block.overlayGradient}
        overlayOpacity={block.overlayOpacity}
      />
      <div className={styles.container}>
        <div className={`${styles.copy} hero-copy`}>
          {markSrc && (
            <Image
              className={styles.mark}
              src={markSrc}
              alt=""
              aria-hidden
              width={markSize.width}
              height={markSize.height}
              priority
            />
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
          <HeroBlockCTAs
            primary={block.ctaPrimary}
            secondary={block.ctaSecondary}
          />
        </div>
      </div>
    </section>
  )
}
