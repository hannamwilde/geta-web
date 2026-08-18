/**
 * Sanity asset refs encode the intrinsic pixel size, e.g. `image-abc123-2364x414-png`.
 * Reading it here means an <img> can carry width/height — and therefore an aspect
 * ratio the browser can reserve space with — without an extra query for asset metadata.
 */
export function assetDimensions(
  asset: unknown,
): { width: number; height: number } | null {
  if (typeof asset !== 'object' || asset === null) return null
  const ref = (asset as { _ref?: unknown })._ref
  if (typeof ref !== 'string') return null
  const match = /-(\d+)x(\d+)-[a-z0-9]+$/i.exec(ref)
  if (!match) return null
  return { width: Number(match[1]), height: Number(match[2]) }
}
