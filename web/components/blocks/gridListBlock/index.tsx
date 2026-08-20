import Icon from '@/components/ui/icon'
import { resolveBackground } from '@/lib/background'
import styles from './styles.module.scss'
import { resolveBorder, type Border } from '@/lib/border'

type Item = {
  _key: string
  name: string
  body?: string
  icon?: string
}

type Gradient = { type?: string; from?: string; to?: string; angle?: number; position?: string } | null

type Props = {
  block: {
    border?: Border
    eyebrow?: string
    headline?: string
    apps?: Item[]
    backgroundColor?: string
    backgroundGradient?: Gradient
    paddingTop?: number
    paddingBottom?: number
    eyebrowColor?: string
    eyebrowFontSize?: number
    headlineColor?: string
    headlineFontSize?: number
    itemTextColor?: string
    iconBackgroundColor?: string
    iconColor?: string
  }
}

export default function GridListBlock({ block }: Props) {
  const items = block.apps ?? []

  if (items.length === 0) return null

  const sectionStyle: React.CSSProperties = {
    ...resolveBackground(block.backgroundColor, block.backgroundGradient),
    ...resolveBorder(block.border),
    ...(block.paddingTop != null ? { paddingTop: block.paddingTop + 'px' } : {}),
    ...(block.paddingBottom != null ? { paddingBottom: block.paddingBottom + 'px' } : {}),
  }
  const eyebrowStyle: React.CSSProperties = {
    ...(block.eyebrowColor ? { color: block.eyebrowColor } : {}),
    ...(block.eyebrowFontSize ? { fontSize: block.eyebrowFontSize + 'px' } : {}),
  }
  const headlineStyle: React.CSSProperties = {
    ...(block.headlineColor ? { color: block.headlineColor } : {}),
    ...(block.headlineFontSize ? { fontSize: block.headlineFontSize + 'px' } : {}),
  }
  const nameStyle: React.CSSProperties = block.itemTextColor ? { color: block.itemTextColor } : {}
  const iconWrapStyle: React.CSSProperties = {
    ...(block.iconBackgroundColor ? { background: block.iconBackgroundColor } : {}),
    ...(block.iconColor ? { color: block.iconColor } : {}),
  }

  return (
    <section className={styles.section} style={sectionStyle}>
      <div className={styles.container}>
        <div className={styles.head}>
          {block.eyebrow && (
            <span className={styles.eyebrow} style={eyebrowStyle}>{block.eyebrow}</span>
          )}
          {block.headline && (
            <h2 className={styles.headline} style={headlineStyle}>{block.headline}</h2>
          )}
        </div>
        <div className={styles.list}>
          {items.map((item) => (
            <article key={item._key} className={styles.row}>
              <div className={styles.nameCell}>
                {item.icon && (
                  <span className={styles.iconWrap} style={iconWrapStyle}>
                    <Icon name={item.icon} size={24} stroke={1.7} />
                  </span>
                )}
                <h3 className={styles.name} style={nameStyle}>{item.name}</h3>
              </div>
              {item.body && <p className={styles.body}>{item.body}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
