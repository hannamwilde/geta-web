import { resolveBackground } from '@/lib/background'
import styles from './Services.module.css'

type Pillar = { _key: string; title: string; body?: string }

type Props = {
  block: {
    eyebrow?: string
    headline?: string
    pillars?: Pillar[]
    stripText?: string
    backgroundColor?: string
    backgroundGradient?: { type?: string; from?: string; to?: string; angle?: number; position?: string } | null
    eyebrowColor?: string
    eyebrowFontSize?: number
    headlineColor?: string
    headlineFontSize?: number
    textColor?: string
    iconColor?: string
    paddingTop?: number
    paddingBottom?: number
  }
}

const ICONS = [
  <svg key={0} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="24" cy="24" r="13" /><circle cx="24" cy="24" r="7.5" />
    <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
    <path d="M24 11V5M24 43v-6M11 24H5M43 24h-6" opacity="0.55" /><path d="M24 24l9-9" />
  </svg>,
  <svg key={1} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M19 17l-7 7 7 7" /><path d="M29 17l7 7-7 7" />
  </svg>,
  <svg key={2} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M13 21v6a2 2 0 0 0 2 2h2l2.5 5a1.5 1.5 0 0 0 2.8-.8V29" />
    <path d="M13 21l16-7v20l-16-7z" />
    <path d="M13 21H11a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2" />
    <path d="M33 19a5 5 0 0 1 0 10" opacity="0.7" />
  </svg>,
]

export default function Services({ block }: Props) {
  const sectionStyle = {
    ...resolveBackground(block.backgroundColor, block.backgroundGradient),
    ...(block.paddingTop != null ? { paddingTop: block.paddingTop + 'px' } : {}),
    ...(block.paddingBottom != null ? { paddingBottom: block.paddingBottom + 'px' } : {}),
    ...(block.textColor ? { '--svc-text': block.textColor } : {}),
    ...(block.iconColor ? { '--svc-icon': block.iconColor } : {}),
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
    <section className={styles.section} id="services" style={sectionStyle}>
      <div className={`container ${styles.inner}`}>
        {block.eyebrow && (
          <p className={styles.eyebrow} style={eyebrowStyle}>{block.eyebrow}</p>
        )}
        {block.headline && (
          <h2 className={styles.title} style={headlineStyle}>{block.headline}</h2>
        )}
        {block.pillars && block.pillars.length > 0 && (
          <div className={styles.grid}>
            {block.pillars.map((pillar, i) => (
              <article className={styles.card} key={pillar._key}>
                <div className={styles.cardIcon}>{ICONS[i] || ICONS[0]}</div>
                <h3 className={styles.cardTitle}>{pillar.title}</h3>
                {pillar.body && <p className={styles.cardBody}>{pillar.body}</p>}
              </article>
            ))}
          </div>
        )}
        {block.stripText && (
          <div className={styles.strip}>
            <div className={styles.stripIcon}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="9" cy="8" r="3.2" />
                <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
                <path d="M16 5.4a3 3 0 0 1 0 5.4" />
                <path d="M17.5 14.7c2.1.7 3.5 2.5 3.5 5.3" />
              </svg>
            </div>
            <p className={styles.stripText}>{block.stripText}</p>
          </div>
        )}
      </div>
    </section>
  )
}
