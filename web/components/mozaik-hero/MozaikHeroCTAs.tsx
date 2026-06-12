'use client'

type Props = { primaryLabel: string; secondaryLabel: string }

export default function MozaikHeroCTAs({ primaryLabel, secondaryLabel }: Props) {
  const openContact = () => { /* TODO: wire up contact modal */ }
  const openBook = () => { /* TODO: wire up booking modal */ }

  return (
    <div className="mzs-hero-ctas">
      <button className="btn mzs-btn-primary" onClick={openContact}>
        {primaryLabel}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      <button className="btn mzs-btn-ghost" onClick={openBook}>{secondaryLabel}</button>
    </div>
  )
}
