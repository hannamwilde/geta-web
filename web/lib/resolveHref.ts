type PageRef = { slug?: { current?: string } } | null | undefined

export function resolveHref(
  linkType?: string,
  href?: string,
  pageRef?: PageRef,
): string {
  if (linkType === 'internal' && pageRef?.slug?.current) return `/${pageRef.slug.current}`
  return href || ''
}
