import {defineMigration, set} from 'sanity/migrate'

/**
 * The `servicesSection` block was renamed to `growingListSection`. Only the
 * type name changed — every field name is identical — so this rewrites `_type`
 * on the stored blocks and touches nothing else.
 *
 * Dry run:  npx sanity migrations run rename-services-to-growing-list
 * Apply:    npx sanity migrations run rename-services-to-growing-list --no-dry-run
 */
export default defineMigration({
  title: 'Rename servicesSection block to growingListSection',
  documentTypes: ['page', 'homePage'],
  migrate: {
    object(node, path) {
      // Only the section blocks themselves, not nested objects that happen to
      // sit inside them.
      if (node._type === 'servicesSection' && path[0] === 'sections') {
        return set({...node, _type: 'growingListSection'})
      }
    },
  },
})
