/**
 * Storage for the visitor's cookie choice.
 *
 * The choice itself is kept in a first-party cookie: it is strictly functional
 * (it only records that the visitor was asked), so it may be set before consent.
 *
 * Framework-agnostic on purpose — the banner, the context and any future
 * script gating all read the same helpers.
 */

export const CONSENT_COOKIE = 'geta-cookie-consent'

/** Six months. Consent should lapse and be asked again, not last forever. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180

export type ConsentValue = 'accepted' | 'rejected'

/** Narrows an untrusted cookie value; anything unrecognised counts as "not asked yet". */
export function parseConsent(raw: string | null | undefined): ConsentValue | null {
  return raw === 'accepted' || raw === 'rejected' ? raw : null
}

export function readConsent(): ConsentValue | null {
  if (typeof document === 'undefined') return null
  const prefix = `${CONSENT_COOKIE}=`
  const match = document.cookie.split('; ').find((c) => c.startsWith(prefix))
  return parseConsent(match?.slice(prefix.length))
}

export function writeConsent(value: ConsentValue) {
  if (typeof document === 'undefined') return
  // Secure would drop the cookie on plain-http localhost, so only set it on https.
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`
}

/** Forgets the choice, so the banner asks again. */
export function clearConsent() {
  if (typeof document === 'undefined') return
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
}
