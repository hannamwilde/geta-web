'use client'

import { urlFor } from '@/sanity/client'
import Icon from '@/components/icons/Icon'
import styles from './Mozaik.module.css'

type Component = { _key: string; label: string; description?: string; icon?: string; logo?: { asset: unknown; alt?: string } }

type Props = {
  block: {
    headline?: string
    subheadline?: string
    markImage?: { asset: unknown }
    wordImage?: { asset: unknown }
    hubNameImage?: { asset: unknown }
    components?: Component[]
  }
}

export default function Mozaik({ block }: Props) {
  const markSrc = block.markImage?.asset ? urlFor(block.markImage).height(104).url() : '/assets/mozaik-mark.png'
  const wordSrc = block.wordImage?.asset ? urlFor(block.wordImage).height(80).url() : '/assets/mozaik-word.png'
  const hubNameSrc = block.hubNameImage?.asset ? urlFor(block.hubNameImage).height(60).url() : '/assets/mozaik-word.png'
  const nodes = block.components || []

  const openContact = () => { /* TODO: wire up contact modal */ }

  return (
    <section className={styles.section} id="mozaik">
      <div className={styles.bg} aria-hidden>
        <div className={styles.grid} />
        <div className={styles.glow} />
      </div>

      <div className="container">
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Ekosystem
          </div>
          <h2 className={styles.title}>
            {block.headline || 'Bygg med'}{' '}
            {wordSrc && <img className={styles.word} src={wordSrc} alt="Mozaik" />}
          </h2>
          {block.subheadline && <p className={styles.headerText}>{block.subheadline}</p>}
        </div>

        <div className={styles.hub}>
          <div className={styles.hubGlow} />
          <div className={styles.hubDisc}>
            <img src={markSrc} alt="" className={styles.mark} aria-hidden />
            <img src={hubNameSrc} alt="Mozaik" className={styles.hubName} />
            <span className={styles.hubSub}>PLATFORM</span>
          </div>
        </div>

        {nodes.length > 0 && (
          <div className={styles.mobileGrid}>
            {nodes.map(node => {
              const logoUrl = node.logo?.asset ? urlFor(node.logo).width(44).height(44).url() : null
              return (
                <div key={node._key} className={styles.card}>
                  <div className={styles.cardIcon}>
                    {logoUrl
                      ? <img src={logoUrl} alt={node.logo?.alt || node.label} style={{ width: 22, height: 22, objectFit: 'contain', borderRadius: 4 }} />
                      : node.icon ? <Icon name={node.icon} size={18} stroke={1.7} /> : null
                    }
                  </div>
                  <div>
                    <div className={styles.cardTitle}>{node.label}</div>
                    {node.description && <div className={styles.cardBlurb}>{node.description}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className={styles.ctaWrap}>
          <button className={styles.cta} onClick={openContact}>
            Utforska plattformen
            <Icon name="arrow-right" size={16} stroke={2} />
          </button>
        </div>
      </div>
    </section>
  )
}
