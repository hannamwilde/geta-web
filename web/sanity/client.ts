import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
export const client = createClient({
  projectId: 'a8gycbga',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = createImageUrlBuilder(client)

// `auto('format')` lets the Sanity CDN content-negotiate a modern format (WebP/AVIF)
// per request, falling back to the original for clients that don't advertise support —
// so crawlers and og:image consumers still get the plain PNG/JPG.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source).auto('format').quality(75)
}

// No `auto('format')`: a favicon has to keep a type every browser recognises,
// and content negotiation doesn't apply to a <link rel="icon"> fetch.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlForExact(source: any) {
  return builder.image(source)
}
