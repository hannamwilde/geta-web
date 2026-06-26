import Icon from '@/components/icons/Icon'
import { resolveBackground } from '@/lib/background'
import styles from './BulletListBlock.module.css'

type ArchItem = {
  _key: string
  icon?: string
  iconBackgroundColor?: string
  title: string
  body?: string
  backgroundColor?: string
  textColor?: string
  iconColor?: string
  points?: string[]
}

type Props = {
  block: {
    eyebrow?: string
    headline?: string
    eyebrowColor?: string
    eyebrowFontSize?: number
    headlineColor?: string
    headlineFontSize?: number
    backgroundColor?: string
    backgroundGradient?: { type?: string; from?: string; to?: string; angle?: number; position?: string } | null
    archItems?: ArchItem[]
  }
}

export default function BulletListBlock({ block }: Props) {
  const items = block.archItems || []
  if (items.length === 0) return null

  const sectionStyle: React.CSSProperties = resolveBackground(block.backgroundColor, block.backgroundGradient)
  const eyebrowStyle: React.CSSProperties = {
    ...(block.eyebrowColor ? { color: block.eyebrowColor } : {}),
    ...(block.eyebrowFontSize ? { fontSize: block.eyebrowFontSize + 'px' } : {}),
  }
  const headlineStyle: React.CSSProperties = {
    ...(block.headlineColor ? { color: block.headlineColor } : {}),
    ...(block.headlineFontSize ? { fontSize: block.headlineFontSize + 'px' } : {}),
  }

  return (
    <section className={styles.section} style={sectionStyle}>
      <div className={styles.container}>
        {(block.eyebrow || block.headline) && (
          <div className={styles.head}>
            {block.eyebrow && <span className={styles.eyebrow} style={eyebrowStyle}>{block.eyebrow}</span>}
            {block.headline && <h2 className={styles.headline} style={headlineStyle}>{block.headline}</h2>}
          </div>
        )}
        <div className={styles.grid}>
          {items.map((a, i) => {
            const cardStyle: React.CSSProperties = {
              ...(a.backgroundColor ? { '--card-bg': a.backgroundColor } as React.CSSProperties : {}),
              ...(a.iconBackgroundColor ? { '--icon-bg': a.iconBackgroundColor } as React.CSSProperties : {}),
              ...(a.iconColor ? { '--points-icon-color': a.iconColor } as React.CSSProperties : {}),
              ...(a.textColor ? { color: a.textColor } : {}),
            }
            return (
              <article key={a._key || i} className={styles.card} style={cardStyle}>
                {a.icon && (
                  <span className={styles.cardIcon}>
                    <Icon name={a.icon} size={26} stroke={1.7} />
                  </span>
                )}
                <h3 className={styles.cardTitle}>{a.title}</h3>
                {a.body && <p className={styles.cardBody}>{a.body}</p>}
                {Array.isArray(a.points) && a.points.length > 0 && (
                  <ul className={styles.points}>
                    {a.points.map((p, j) => {
                      const colonIdx = p.indexOf(':')
                      const lead = colonIdx !== -1 ? p.slice(0, colonIdx) : p
                      const rest = colonIdx !== -1 ? p.slice(colonIdx + 1) : ''
                      return (
                        <li key={j}>
                          <Icon name="check" size={15} stroke={2.4} />
                          <span><strong>{lead}:</strong>{rest}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
