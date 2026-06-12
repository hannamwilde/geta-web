/** Strip legacy hash-routing prefix stored in Sanity (e.g. "/#/tjanster" → "/tjanster"). */
export function normalizeHref(href: string | null | undefined): string {
  if (!href) return '/'
  if (href.startsWith('/#')) return href.slice(2) || '/'
  return href
}
