const ALLOWED_HOST = 'calendar.google.com'

/**
 * Pulls the URL out of whatever the editor pasted.
 *
 * Google's "Share" dialog hands over a full `<iframe src="…" style="…" …>`
 * snippet, and it's easy to paste the whole thing — or everything after `src="`,
 * which leaves the trailing attributes glued to the URL. Both are treated as the
 * URL they contain.
 */
function extractUrl(raw: string): string {
  const fromIframe = raw.match(/src\s*=\s*["']([^"']+)["']/i)
  const candidate = fromIframe ? fromIframe[1] : raw
  // Cut at the first quote or whitespace — a real scheduling URL contains neither,
  // so anything past that point is leftover iframe markup.
  return candidate.trim().split(/["'\s]/)[0]
}

/**
 * Turns the scheduling link an editor pasted into Sanity into an embeddable
 * iframe src, or null if it isn't one.
 *
 * The value ends up in an iframe src, so the host is locked to Google rather
 * than trusted from the CMS — anything else falls back to the booking form.
 */
export function resolveSchedulingUrl(raw?: string): string | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null

  let url: URL
  try {
    url = new URL(extractUrl(trimmed))
  } catch {
    return null
  }

  if (url.protocol !== 'https:' || url.hostname !== ALLOWED_HOST) return null
  if (!url.pathname.includes('/appointments/schedules/')) return null

  // Google only serves the embeddable widget with gv=true. The "Book an
  // appointment" link editors copy out of Calendar doesn't include it, and a
  // half-pasted snippet can leave a mangled value behind — set it either way.
  if (url.searchParams.get('gv') !== 'true') url.searchParams.set('gv', 'true')

  return url.toString()
}
