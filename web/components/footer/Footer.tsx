import { normalizeHref } from '@/lib/href'
import FooterToTop from './FooterToTop'
import styles from './Footer.module.css'

type SocialLink = { _key?: string; platform: string; url: string }
type FooterLink = { _key?: string; label?: string; href?: string; external?: boolean }
type FooterColumn = { _key: string; title: string; links?: FooterLink[] }

export type FooterData = {
  tagline?: string
  email?: string
  phone?: string
  socialLinks?: SocialLink[]
  columns?: FooterColumn[]
  orgLine?: string
}

type Props = { data: FooterData | null }

const SOCIAL_ICONS: Record<string, () => React.JSX.Element> = {
  linkedin: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.25 8.25h4.5V24H.25V8.25zM8.5 8.25h4.31v2.15h.06c.6-1.13 2.07-2.32 4.26-2.32 4.56 0 5.4 3 5.4 6.9V24h-4.5v-6.92c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V24H8.5V8.25z"/>
    </svg>
  ),
  facebook: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M14 13.5h2.5l1-4H14V7.5c0-1.03 0-2 2-2h1.5V2.14c-.33-.04-1.56-.14-2.86-.14C11.93 2 10 3.66 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
    </svg>
  ),
  instagram: () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  ),
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { platform: 'linkedin', url: 'https://www.linkedin.com/company/86458297/' },
  { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=61558806761375' },
  { platform: 'instagram', url: 'https://www.instagram.com/getadigitalsverige/' },
]

export default function Footer({ data }: Props) {
  const tagline = data?.tagline || 'Nordisk e-handel som håller — sedan 2010.'
  const email = data?.email || 'post@getadigital.com'
  const phone = data?.phone || '026 390 13'
  const orgLine = data?.orgLine || 'Geta Digital AB — Org.nr: 556660-1149'
  const socials = (data?.socialLinks && data.socialLinks.length > 0) ? data.socialLinks : DEFAULT_SOCIALS
  const columns = data?.columns

  return (
    <footer className={styles.footer} id="contact">
      <div className="container">
        <div className={styles.top}>
          <div className={styles.identity}>
            <a href="/" className={styles.wordmarkLink} aria-label="Geta Digital">
              <img src="/assets/geta-logo-white.png" alt="Geta" style={{ height: 44, width: 'auto', display: 'block' }} />
            </a>
            <p className={styles.tagline}>{tagline}</p>
          </div>

          <div className={styles.topRight}>
            <div className={styles.contact}>
              <a className={styles.contactLink} href={`mailto:${email}`}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>
                </svg>
                <span>{email}</span>
              </a>
              <a className={styles.contactLink} href={`tel:${phone.replace(/\s/g, '')}`}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>
                </svg>
                <span>{phone}</span>
              </a>
            </div>
            <div className={styles.social}>
              {socials.map((s, i) => {
                const SIcon = SOCIAL_ICONS[s.platform]
                if (!SIcon) return null
                return (
                  <a key={s.platform + i} className={styles.socialLink} href={s.url} target="_blank" rel="noreferrer" aria-label={s.platform}>
                    <SIcon />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {columns && columns.length > 0 && (
          <>
            <hr className={styles.rule} />
            <div className={styles.cols} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
              {columns.map(col => (
                <div key={col._key} className={styles.colGroup}>
                  <h3 className={styles.colTitle}>{col.title}</h3>
                  <ul>
                    {(col.links || []).map((link, i) => (
                      <li key={link._key || i}>
                        <a href={normalizeHref(link.href)} {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        <div className={styles.foot}>
          <div className={styles.org}>{orgLine}</div>
          <FooterToTop />
        </div>
      </div>
    </footer>
  )
}
