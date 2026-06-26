'use client'

import { resolveHref } from '@/lib/resolveHref'
import { normalizeHref } from '@/lib/href'

type PageRef = { slug?: { current?: string } } | null
type CTA = { label?: string; action?: string; href?: string; linkType?: string; pageRef?: PageRef }

type Props = {
  primary?: CTA | null
  secondary?: CTA | null
}

export default function BannerBlockCTAs({ primary, secondary }: Props) {
  const openContact = () => { /* TODO: wire up contact modal */ }
  const openBook = () => { /* TODO: wire up booking modal */ }

  const renderCta = (cta: CTA | null | undefined, className: string) => {
    if (!cta?.label) return null
    if (cta.action === 'openContact') return <button className={`btn ${className}`} onClick={openContact}>{cta.label}</button>
    if (cta.action === 'openBook') return <button className={`btn ${className}`} onClick={openBook}>{cta.label}</button>
    const href = normalizeHref(resolveHref(cta.linkType, cta.href, cta.pageRef))
    if (href && href !== '/') return <a href={href} className={`btn ${className}`}>{cta.label}</a>
    return null
  }

  const hasCtas = primary?.label || secondary?.label
  if (!hasCtas) return null

  return (
    <div className="sp-hero-ctas">
      {renderCta(primary, 'btn-primary')}
      {renderCta(secondary, 'btn-outline')}
    </div>
  )
}
