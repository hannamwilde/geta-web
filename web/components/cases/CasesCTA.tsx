'use client'

import { useState } from 'react'

type Props = {
  label?: string
  bgColor?: string
  textColor?: string
  hoverBgColor?: string
  hoverTextColor?: string
}

export default function CasesCTA({ label, bgColor, textColor, hoverBgColor, hoverTextColor }: Props) {
  const [hovered, setHovered] = useState(false)
  const openContact = () => { /* TODO: wire up contact modal */ }

  const hasStyle = bgColor || textColor
  const style = hasStyle ? {
    backgroundColor: hovered && hoverBgColor ? hoverBgColor : bgColor,
    color: hovered && hoverTextColor ? hoverTextColor : textColor,
    borderColor: hovered && hoverBgColor ? hoverBgColor : bgColor,
  } : undefined

  return (
    <button
      className="btn btn-primary"
      onClick={openContact}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      {label}
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </button>
  )
}
