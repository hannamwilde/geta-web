import {defineField, defineType, defineArrayMember} from 'sanity'
import {ThLargeIcon} from '@sanity/icons'
import {gradientField} from '../gradientField'
import {backgroundImageField} from '../backgroundMediaFields'
import {borderField} from '../borderField'

const color = (fieldset: string, name: string, title: string, description?: string) =>
  defineField({name, title, type: 'string', fieldset, description})

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 */
export const mozaikServicesBlock = defineType({
  name: 'mozaikServicesBlock',
  title: 'Mozaik — twelve services',
  type: 'object',
  icon: ThLargeIcon,
  fieldsets: [
    {name: 'title', title: 'Title', options: {collapsible: true, collapsed: false}},
    {name: 'subtitle', title: 'Subtitle', options: {collapsible: true, collapsed: false}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
    {name: 'services', title: 'Services', options: {collapsible: true, collapsed: false}},
  ],
  fields: [
    // ── Title ────────────────────────────────────────────────────────────────
    defineField({name: 'headline', title: 'Block title', type: 'string', fieldset: 'title'}),
    color('title', 'headlineColor', 'Color', 'e.g. #FFFFFF'),
    defineField({
      name: 'headlineFontSize',
      title: 'Font size',
      type: 'number',
      fieldset: 'title',
      description: 'In pixels.',
    }),

    // ── Subtitle ─────────────────────────────────────────────────────────────
    defineField({name: 'subheadline', title: 'Text', type: 'text', rows: 2, fieldset: 'subtitle'}),
    // Drives both the subtitle and each service description.
    color(
      'subtitle',
      'textColor',
      'Subtitle & description color',
      'Also colors each service description. e.g. rgba(255,255,255,0.72)',
    ),
    // Styles every service tile, not one — it lives on the block, not the array.

    // ── Background ───────────────────────────────────────────────────────────
    color('background', 'backgroundColor', 'Color', 'Defaults to charcoal. e.g. #26232E'),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    backgroundImageField({fieldset: 'background', title: 'Image'}),

    // ── Layout & spacing ─────────────────────────────────────────────────────
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~100px.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~100px.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),

    // ── Services ─────────────────────────────────────────────────────────────
    defineField({
      name: 'items',
      title: 'Services',
      type: 'array',
      fieldset: 'services',
      description:
        'Each service carries one piece of the Mozaik mark. The pieces fly out of these tiles and assemble into the M in a following "Mozaik — properties heading" block.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'service',
          fields: [
            defineField({
              name: 'piece',
              title: 'Mark piece',
              type: 'number',
              description: '1–12. Each piece should be used once.',
              validation: (rule) => rule.required().min(1).max(12).integer(),
            }),
            defineField({
              name: 'title',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'body', title: 'Description', type: 'text', rows: 2}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'body', piece: 'piece'},
            prepare: ({title, subtitle, piece}) => ({
              title: title || '—',
              subtitle: [piece ? `Piece ${piece}` : null, subtitle].filter(Boolean).join(' · '),
            }),
          },
        }),
      ],
    }),
    color('services', 'itemTextColor', 'Name color', 'e.g. #FFFFFF'),
  ],
  preview: {
    select: {title: 'headline', items: 'items'},
    prepare: ({title, items}) => {
      const list = Array.isArray(items) ? items : []
      return {
        title: title || 'Mozaik — twelve services',
        subtitle: `${list.length} service${list.length === 1 ? '' : 's'}`,
      }
    },
  },
})
