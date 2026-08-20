'use client'

import { resolveHref } from '@/lib/resolveHref'
import { normalizeHref } from '@/lib/href'
import { useContactModal } from '@/context/ContactModalContext'

type PageRef = { slug?: { current?: string } } | null
export type CTA = {
  label?: string
  action?: string
  href?: string
  linkType?: string
  pageRef?: PageRef
}

type Props = {
  primary?: CTA | null
  secondary?: CTA | null
}

export default function HeroBlockCTAs({ primary, secondary }: Props) {
  const { open } = useContactModal()
  const openContact = () => open('contact')
  const openBook = () => open('book')

  /**
   * `fallback` covers CTAs saved before the action field existed: they carry a
   * label and nothing else, and used to be hardwired to these modals. Without it
   * they'd fall through to the link branch and render nothing.
   */
  const renderCta = (
    cta: CTA | null | undefined,
    className: string,
    fallback: string,
  ) => {
    if (!cta?.label) return null
    const action = cta.action || fallback
    if (action === 'openContact')
      return (
        <button className={`btn ${className}`} onClick={openContact}>
          {cta.label}
        </button>
      )
    if (action === 'openBook')
      return (
        <button className={`btn ${className}`} onClick={openBook}>
          {cta.label}
        </button>
      )
    const href = normalizeHref(resolveHref(cta.linkType, cta.href, cta.pageRef))
    if (href && href !== '/')
      return (
        <a href={href} className={`btn ${className}`}>
          {cta.label}
        </a>
      )
    return null
  }

  // No labels set in Sanity — skip the wrapper too, it carries a top margin.
  if (!primary?.label?.trim() && !secondary?.label?.trim()) return null

  return (
    <div className="hero-ctas">
      {renderCta(primary, 'btn-primary', 'openBook')}
      {renderCta(secondary, 'btn-outline', 'openContact')}
    </div>
  )
}
