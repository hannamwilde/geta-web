import { urlFor } from '@/sanity/client'
import styles from './TextBlock.module.css'

type Props = {
  block: {
    headline?: string
    body?: string
    alignment?: string
    backgroundColor?: string
    textColor?: string
    backgroundImage?: { asset: unknown; alt?: string }
  }
}

export default function TextBlock({ block }: Props) {
  const style: React.CSSProperties = {}
  if (block.backgroundColor) style.backgroundColor = block.backgroundColor
  if (block.textColor) style.color = block.textColor
  if (block.backgroundImage?.asset) {
    style.backgroundImage = `url(${urlFor(block.backgroundImage).width(1400).url()})`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
  }

  return (
    <section className={styles.section} data-align={block.alignment || 'left'} style={style}>
      <div className={styles.container}>
        {block.headline && <h2 className={styles.headline}>{block.headline}</h2>}
        {block.body && <p className={styles.body}>{block.body}</p>}
      </div>
    </section>
  )
}
