import { urlFor } from '@/sanity/client'
import KundcaseCTA from './KundcaseCTA'
import styles from './Kundcase.module.css'

type Testimonial = { quote?: string; person?: string; role?: string }
type KundcaseItem = {
  _id: string
  client: string
  tag?: string
  excerpt?: string
  testimonial?: Testimonial
  coverImage?: { asset: unknown; alt?: string }
  slug?: { current?: string }
}

type Props = {
  block: {
    title?: string
    lede?: string
    ctaText?: string
  }
  cases: KundcaseItem[]
}

function KundcaseCard({ item, index }: { item: KundcaseItem; index: number }) {
  const imgUrl = item.coverImage?.asset
    ? urlFor(item.coverImage).width(600).height(480).url()
    : null

  return (
    <article className={styles.card} style={{ '--d': `${index * 0.09}s` } as React.CSSProperties}>
      <div className={styles.media}>
        {imgUrl ? (
          <img src={imgUrl} alt={item.coverImage?.alt || item.client} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--forest-tint)' }} />
        )}
        {item.tag && <span className={styles.tag}>{item.tag}</span>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.client}>{item.client}</h3>
        {item.excerpt && <p className={styles.summary}>{item.excerpt}</p>}
        {item.testimonial?.quote && (
          <blockquote className={styles.quote}>
            <span className={styles.quoteMark} aria-hidden>&ldquo;</span>
            {item.testimonial.quote}
            <span className={styles.quoteMark} aria-hidden>&rdquo;</span>
          </blockquote>
        )}
        {item.testimonial?.person && (
          <div className={styles.byline}>
            <span className={styles.bylineName}>{item.testimonial.person}</span>
            {item.testimonial.role && <span className={styles.bylineRole}>{item.testimonial.role}</span>}
          </div>
        )}
        <a href="#kundcase" className={styles.link}>
          Läs kundcaset
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </article>
  )
}

export default function Kundcase({ block, cases }: Props) {
  if (!cases || cases.length === 0) return null

  return (
    <section className={styles.section} id="kundcase">
      <div className="container">
        {(block.title || block.lede) && (
          <div className={styles.head}>
            {block.title && <h2 className={styles.title}>{block.title}</h2>}
            {block.lede && <p className={styles.lede}>{block.lede}</p>}
          </div>
        )}
        <div className={styles.grid}>
          {cases.map((c, i) => <KundcaseCard key={c._id} item={c} index={i} />)}
        </div>
        <div className={styles.cta}>
          {block.ctaText && <p className={styles.ctaText}>{block.ctaText}</p>}
          <KundcaseCTA label="Kontakta oss" />
        </div>
      </div>
    </section>
  )
}
