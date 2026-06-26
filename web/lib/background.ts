import type { CSSProperties } from 'react'

type Gradient = {
  type?: string
  from?: string
  to?: string
  angle?: number
  position?: string
} | null | undefined

export function resolveBackground(color?: string, gradient?: Gradient): CSSProperties {
  if (gradient?.from && gradient?.to) {
    const css = gradient.type === 'radial'
      ? `radial-gradient(circle at ${gradient.position ?? 'center'}, ${gradient.from}, ${gradient.to})`
      : `linear-gradient(${gradient.angle ?? 135}deg, ${gradient.from}, ${gradient.to})`
    return { background: css }
  }
  if (color) return { backgroundColor: color }
  return {}
}
