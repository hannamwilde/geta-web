import {defineMigration, set} from 'sanity/migrate'

/**
 * `quoteBlock.companyRole` was renamed to `role` when the block was reworked
 * into the customer-case layout. Only the field name changed, so this copies
 * the value across and drops the old key.
 *
 * Dry run:  npx sanity migrations run rename-quote-company-role
 * Apply:    npx sanity migrations run rename-quote-company-role --no-dry-run
 */
export default defineMigration({
  title: 'Rename quoteBlock companyRole to role',
  documentTypes: ['page', 'homePage'],
  migrate: {
    object(node) {
      if (node._type !== 'quoteBlock') return
      const {companyRole, ...rest} = node as Record<string, unknown>
      if (companyRole === undefined) return
      // `role` wins if both somehow exist — a later edit already set it.
      return set({...rest, role: rest.role ?? companyRole})
    },
  },
})
