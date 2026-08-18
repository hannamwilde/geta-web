'use client'

import { useContactModal } from '@/context/ContactModalContext'

type Props = {
  primaryLabel?: string
  secondaryLabel?: string
}

export default function HeroCTAs({ primaryLabel, secondaryLabel }: Props) {
  const { open } = useContactModal()
  const openContact = () => open('contact')
  const openBook = () => open('book')

  const primary = primaryLabel?.trim()
  const secondary = secondaryLabel?.trim()

  // No labels set in Sanity — skip the wrapper too, it carries a top margin.
  if (!primary && !secondary) return null

  return (
    <div className="hero-ctas">
      {primary && (
        <button className="btn btn-primary" onClick={openBook}>
          {primary}
        </button>
      )}
      {secondary && (
        <button className="btn btn-outline" onClick={openContact}>
          {secondary}
        </button>
      )}
    </div>
  )
}
