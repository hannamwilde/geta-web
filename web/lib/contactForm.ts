/**
 * Name of the decoy input the contact modal renders off-screen. A real visitor
 * never sees it, so anything that fills it in is automated.
 *
 * Lives here rather than in the route so the client form and the API can share
 * it without the form pulling server-only code into the browser bundle.
 */
export const HONEYPOT_FIELD = 'website'
