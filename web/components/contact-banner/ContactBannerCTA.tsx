'use client'

type Props = { label: string }

export default function ContactBannerCTA({ label }: Props) {
  const openContact = () => { /* TODO: wire up contact modal */ }
  return (
    <button className="btn bcta-btn" onClick={openContact}>
      {label}
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </button>
  )
}
