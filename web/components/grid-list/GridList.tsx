import styles from './GridList.module.css'

type Item = {
  _key: string
  name: string
  body?: string
}

type Props = {
  block: {
    eyebrow?: string
    headline?: string
    apps?: Item[]
    backgroundColor?: string
    paddingTop?: number
    paddingBottom?: number
    eyebrowColor?: string
    eyebrowFontSize?: number
    headlineColor?: string
    headlineFontSize?: number
    itemTextColor?: string
  }
}

export default function GridList({ block }: Props) {
  const items = block.apps ?? []

  if (items.length === 0) return null

  const sectionStyle: React.CSSProperties = {
    ...(block.backgroundColor ? { backgroundColor: block.backgroundColor } : {}),
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
              <h3 className={styles.name} style={nameStyle}>{item.name}</h3>
              {item.body && <p className={styles.body}>{item.body}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
