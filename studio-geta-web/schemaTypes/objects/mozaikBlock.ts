import {defineField, defineType, defineArrayMember} from 'sanity'
import {SparklesIcon} from '@sanity/icons'
import {borderField} from '../borderField'
import {ctaFields} from '../ctaFields'

/**
 * One arm of the hub-and-spoke diagram. `label` only shows on the stacked
 * mobile layout, where the arms become headed lists; on desktop the position
 * around the hub already says which arm an item belongs to.
 */
const armField = (name: string, title: string, description: string, max?: number) =>
  defineField({
    name,
    title,
    type: 'object',
    description,
    fieldset: 'diagram',
    options: {collapsible: true, collapsed: false},
    fields: [
      defineField({
        name: 'label',
        type: 'string',
        title: 'Group label (mobile only)',
      }),
      defineField({
        name: 'items',
        type: 'array',
        title: 'Items',
        of: [
          defineArrayMember({
            type: 'object',
            fields: [
              defineField({
                name: 'label',
                type: 'string',
                title: 'Label',
                validation: (rule) => rule.required(),
              }),
            ],
            preview: {select: {title: 'label'}},
          }),
        ],
        validation: max ? (rule) => rule.max(max) : undefined,
      }),
    ],
  })

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 */
export const mozaikBlock = defineType({
  name: 'mozaikBlock',
  title: 'Mozaik — Ecosystem',
  type: 'object',
  icon: SparklesIcon,
  fieldsets: [
    {name: 'heading', title: 'Heading', options: {collapsible: true, collapsed: false}},
    {
      name: 'marks',
      title: 'Brand marks',
      description: 'The Mozaik wordmark and hub symbols. Leave empty to fall back to text.',
      options: {collapsible: true, collapsed: true},
    },
    {name: 'cta', title: 'Call to action', options: {collapsible: true, collapsed: true}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {
      name: 'diagram',
      title: 'Diagram',
      description:
        'The hub-and-spoke diagram around the Mozaik mark: storefront above, ' +
        'connected systems to the left, delivered capabilities to the right, add-ons below.',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    // ── Heading ──────────────────────────────────────────────────────────────
    defineField({name: 'headline', type: 'string', title: 'Headline', fieldset: 'heading'}),
    defineField({
      name: 'subheadline',
      type: 'text',
      title: 'Subheadline',
      rows: 2,
      fieldset: 'heading',
    }),

    // ── Brand marks ──────────────────────────────────────────────────────────
    defineField({
      name: 'wordImage',
      type: 'image',
      title: 'Wordmark (header title)',
      description: 'Replaces "Mozaik" text in the headline',
      fieldset: 'marks',
      options: {hotspot: false},
    }),
    defineField({
      name: 'markImage',
      type: 'image',
      title: 'Mark (hub center icon)',
      description: 'The M symbol in the hub disc',
      fieldset: 'marks',
      options: {hotspot: false},
    }),
    defineField({
      name: 'hubNameImage',
      type: 'image',
      title: 'Hub wordmark (below mark)',
      description: 'The "Mozaik" wordmark inside the hub disc',
      fieldset: 'marks',
      options: {hotspot: false},
    }),

    // ── Call to action ───────────────────────────────────────────────────────
    defineField({
      name: 'cta',
      title: 'Button',
      type: 'object',
      description: 'Fades in at the end of the scroll sequence.',
      fieldset: 'cta',
      options: {collapsible: false},
      fields: ctaFields('link'),
    }),

    // ── Background ───────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundImage',
      type: 'image',
      title: 'Image',
      description: 'Sits behind the ecosystem. Falls back to the gradient bloom when empty.',
      fieldset: 'background',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),

    // ── Diagram ──────────────────────────────────────────────────────────────
    // Items reveal on scroll in this order: top, left column, right column, bottom.
    armField('topGroup', 'Above the hub', 'Usually a single storefront node.', 3),
    armField(
      'leftGroup',
      'Left column',
      'Systems Mozaik connects to. Five items match the reference layout; more will compress the column.',
      7,
    ),
    armField(
      'rightGroup',
      'Right column',
      'Capabilities Mozaik delivers. Five items match the reference layout; more will compress the column.',
      7,
    ),
    armField('bottomGroup', 'Below the hub', 'Usually a single add-ons node.', 3),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Mozaik'}),
  },
})
