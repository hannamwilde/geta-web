import Image from "next/image";
import { urlFor } from '@/sanity/client'
import { resolveBackground, type BackgroundImage } from '@/lib/background'
import styles from './styles.module.scss'
import { resolveBorder, type Border } from '@/lib/border'

type Props = {
  block: {
    border?: Border
    headline?: string
    body?: string
    alignment?: string
    contentLayout?: string
    paddingTop?: number
    paddingBottom?: number
    backgroundColor?: string
    backgroundGradient?: { type?: string; from?: string; to?: string; angle?: number; position?: string } | null
    textColor?: string
    backgroundImage?: BackgroundImage
    sideImage?: { asset: unknown; alt?: string }
    sideImagePosition?: string
    borderRadius?: number
  }
}

export default function TextBlock({ block }: Props) {
  const sectionStyle: React.CSSProperties = { ...resolveBackground(block.backgroundColor, block.backgroundGradient, block.backgroundImage), ...resolveBorder(block.border) }
  if (block.textColor) sectionStyle.color = block.textColor
  if (block.paddingTop != null) sectionStyle.paddingTop = block.paddingTop + 'px'
  if (block.paddingBottom != null) sectionStyle.paddingBottom = block.paddingBottom + 'px'
  if (block.borderRadius != null) { (sectionStyle as Record<string, string>)['--r-lg'] = block.borderRadius + 'px' }

  const isFull = block.contentLayout === 'full'
  const hasSideImage = !!block.sideImage?.asset
  const sideImgUrl = hasSideImage ? urlFor(block.sideImage!).width(900).url() : null
  const imagePos = block.sideImagePosition || 'right'

  return (
    <section className={styles.section} data-align={block.alignment || 'left'} style={sectionStyle}>
      <div className={isFull ? styles.containerFull : styles.container}>
        {hasSideImage ? (
          <div className={styles.split} data-image-pos={imagePos}>
            <div className={styles.textCol}>
              {block.headline && <h2 className={styles.headline}>{block.headline}</h2>}
              {block.body && <p className={styles.body}>{block.body}</p>}
            </div>
            <div className={styles.imageCol}>
              <Image
                src={sideImgUrl!}
                alt={block.sideImage?.alt || ''}
                width={900}
                height={675}
                sizes="(max-width: 860px) 100vw, 50vw"
                className={styles.sideImg}
              />
            </div>
          </div>
        ) : (
          <>
            {block.headline && <h2 className={styles.headline}>{block.headline}</h2>}
            {block.body && <p className={styles.body}>{block.body}</p>}
          </>
        )}
      </div>
    </section>
  )
}
