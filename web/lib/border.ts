import type { CSSProperties } from 'react'

export type Border = {
  top?: boolean
  bottom?: boolean
  color?: string
  width?: number
} | null | undefined

/** Top/bottom section borders. Width and color are shared by both edges. */
export function resolveBorder(border?: Border): CSSProperties {
  if (!border?.top && !border?.bottom) return {}
  const line = `${border?.width ?? 1}px solid ${border?.color || 'var(--line)'}`
  return {
    ...(border?.top ? { borderTop: line } : {}),
    ...(border?.bottom ? { borderBottom: line } : {}),
  }
}
