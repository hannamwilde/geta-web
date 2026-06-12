'use client'

type Props = { label?: string }

export default function KundcaseCTA({ label }: Props) {
  const openContact = () => { /* TODO: wire up contact modal */ }
  return (
    <button className="btn btn-primary" onClick={openContact}>
      {label || 'Kontakta oss'}
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  )
}
