import { resolveBackground } from '@/lib/background'
import styles from './QuoteBlock.module.css'

type Props = {
  block: {
    quote?: string
    author?: string
    companyRole?: string
    alignment?: string
    backgroundColor?: string
    backgroundGradient?: { type?: string; from?: string; to?: string; angle?: number; position?: string } | null
    textColor?: string
    paddingTop?: number
    paddingBottom?: number
  }
}

export default function QuoteBlock({ block }: Props) {
  const style: React.CSSProperties = { ...resolveBackground(block.backgroundColor, block.backgroundGradient) }
  if (block.textColor) style.color = block.textColor
  if (block.paddingTop != null) style.paddingTop = block.paddingTop + 'px'
  if (block.paddingBottom != null) style.paddingBottom = block.paddingBottom + 'px'

  return (
    <section className={styles.section} data-align={block.alignment || 'left'} style={style}>
      <div className={styles.container}>
        <figure className={styles.figure}>
          <blockquote className={styles.quote}>{block.quote}</blockquote>
          {(block.author || block.companyRole) && (
            <figcaption className={styles.attribution}>
              {block.author && <span className={styles.author}>{block.author}</span>}
              {block.companyRole && <span className={styles.role}>{block.companyRole}</span>}
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  )
}
