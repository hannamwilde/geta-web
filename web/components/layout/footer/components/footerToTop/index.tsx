'use client'

export default function FooterToTop() {
  return (
    <button
      className="footer-totop"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Till toppen"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  )
}
