import type { CSSProperties } from 'react'
import { urlFor } from '@/sanity/client'

export type Gradient = {
  type?: string
  from?: string
  to?: string
  angle?: number
  position?: string
} | null | undefined

export type BackgroundImage = {
  asset?: unknown
  alt?: string
  hotspot?: { x?: number; y?: number }
} | null | undefined

/** The CSS for an editor-defined gradient, or null when both stops aren't set. */
export function gradientCss(gradient?: Gradient): string | null {
  if (!gradient?.from || !gradient?.to) return null
  return gradient.type === 'radial'
    ? `radial-gradient(circle at ${gradient.position ?? 'center'}, ${gradient.from}, ${gradient.to})`
    : `linear-gradient(${gradient.angle ?? 135}deg, ${gradient.from}, ${gradient.to})`
}

/** Keeps the hotspot in frame once `cover` starts cropping. */
function focalPoint(image?: BackgroundImage): string {
  const { x, y } = image?.hotspot ?? {}
  if (typeof x !== 'number' || typeof y !== 'number') return 'center'
  return `${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`
}

/**
 * Section background, layered back to front: color, image, gradient. With an image
 * present the gradient becomes its scrim rather than replacing it — otherwise the
 * gradient still overrides the solid color, as before.
 */
export function resolveBackground(
  color?: string,
  gradient?: Gradient,
  image?: BackgroundImage,
): CSSProperties {
  const css = gradientCss(gradient)
  const url = image?.asset ? urlFor(image).width(1920).url() : null

  if (url) {
    return {
      backgroundImage: [css, `url(${url})`].filter(Boolean).join(', '),
      backgroundSize: 'cover',
      backgroundPosition: focalPoint(image),
      backgroundRepeat: 'no-repeat',
      ...(color ? { backgroundColor: color } : {}),
    }
  }
  if (css) return { background: css }
  if (color) return { backgroundColor: color }
  return {}
}
