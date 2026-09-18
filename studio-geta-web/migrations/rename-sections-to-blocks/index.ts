import {defineMigration, at, set, setIfMissing, unset} from 'sanity/migrate'

/** Block types that were still named `*Section`. `textSection` has no schema
 * left — the frontend only kept a fallback case for stored content. */
const TYPE_RENAMES: Record<string, string> = {
  heroSection: 'heroBlock',
  trustBarSection: 'trustBarBlock',
  mozaikSection: 'mozaikBlock',
  growingListSection: 'growingListBlock',
  casesSection: 'casesBlock',
  contactBannerSection: 'contactBannerBlock',
  eventsSection: 'eventsBlock',
  mozaikServicesSection: 'mozaikServicesBlock',
  textSection: 'textBlock',
}

/**
 * Sanity now calls these blocks everywhere: the `sections` array on `page` and
 * `homePage` became `blocks`, and the `*Section` types became `*Block`. Field
 * names inside the blocks are unchanged, so this only moves the array and
 * rewrites `_type`.
 *
 * Dry run:  npx sanity migrations run rename-sections-to-blocks
 * Apply:    npx sanity migrations run rename-sections-to-blocks --no-dry-run
 */
export default defineMigration({
  title: 'Rename page sections to blocks',
  documentTypes: ['page', 'homePage'],
  migrate: {
    document(doc) {
      const legacy = (doc as Record<string, unknown>).sections
      if (!Array.isArray(legacy)) return

      const renamed = legacy.map((node) => {
        const type = (node as {_type?: string})?._type
        const next = type ? TYPE_RENAMES[type] : undefined
        return next ? {...(node as object), _type: next} : node
      })

      // setIfMissing so a re-run never clobbers a `blocks` array that a later
      // edit already added.
      return [at('blocks', setIfMissing(renamed)), at('sections', unset())]
    },
    // Documents migrated before this ran keep their old `_type`s, so rewrite
    // those in place too.
    object(node, path) {
      const type = node._type
      const next = typeof type === 'string' ? TYPE_RENAMES[type] : undefined
      if (next && path[0] === 'blocks') {
        return set({...node, _type: next})
      }
    },
  },
})
