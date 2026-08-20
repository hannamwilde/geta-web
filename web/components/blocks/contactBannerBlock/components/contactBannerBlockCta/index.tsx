'use client'

import { useState } from 'react'
import { useContactModal } from '@/context/ContactModalContext'
import styles from './styles.module.scss'

type Props = {
  label: string
  bgColor?: string
  textColor?: string
  hoverBgColor?: string
  hoverTextColor?: string
}

export default function ContactBannerBlockCta({ label, bgColor, textColor, hoverBgColor, hoverTextColor }: Props) {
  const [hovered, setHovered] = useState(false)
  const { open } = useContactModal()
  const openContact = () => open('contact')

  const hasStyle = bgColor || textColor
  const style = hasStyle ? {
    backgroundColor: hovered && hoverBgColor ? hoverBgColor : bgColor,
    color: hovered && hoverTextColor ? hoverTextColor : textColor,
    borderColor: hovered && hoverBgColor ? hoverBgColor : bgColor,
  } : undefined

  return (
    <button
      className={`btn ${styles.button}`}
      onClick={openContact}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      {label}
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </button>
  )
}
