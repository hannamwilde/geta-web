import {defineField, defineType, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {iconPicker} from '../iconField'
import {gradientField} from '../gradientField'
import {backgroundImageField} from '../backgroundMediaFields'
import {borderField} from '../borderField'

const color = (fieldset: string, name: string, title: string, description?: string) =>
  defineField({name, title, type: 'string', fieldset, description})

const size = (fieldset: string, name: string, title: string) =>
  defineField({name, title, type: 'number', fieldset, description: 'In pixels.'})

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 */
export const GridList = defineType({
  name: 'GridList',
  title: 'Grid list',
  type: 'object',
  icon: DocumentTextIcon,
  fieldsets: [
    {name: 'eyebrow', title: 'Eyebrow', options: {collapsible: true, collapsed: true}},
    {name: 'headline', title: 'Headline', options: {collapsible: true, collapsed: false}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
    {name: 'items', title: 'Items', options: {collapsible: true, collapsed: false}},
  ],
  fields: [
    // ── Eyebrow ──────────────────────────────────────────────────────────────
    defineField({name: 'eyebrow', type: 'string', title: 'Text', fieldset: 'eyebrow'}),
    color('eyebrow', 'eyebrowColor', 'Color'),
    size('eyebrow', 'eyebrowFontSize', 'Font size'),

    // ── Headline ─────────────────────────────────────────────────────────────
    defineField({name: 'headline', type: 'string', title: 'Block title', fieldset: 'headline'}),
    color('headline', 'headlineColor', 'Color'),
    size('headline', 'headlineFontSize', 'Font size'),
    // These style every item, not one — they live on the block, not the array.

    // ── Background ───────────────────────────────────────────────────────────
    color('background', 'backgroundColor', 'Color'),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    backgroundImageField({fieldset: 'background', title: 'Image'}),

    // ── Layout & spacing ─────────────────────────────────────────────────────
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~128px.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~80px.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),

    // ── Items ────────────────────────────────────────────────────────────────
    defineField({
      name: 'apps',
      title: 'Items',
      type: 'array',
      fieldset: 'items',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Name',
              validation: (r) => r.required(),
            }),
            defineField({name: 'body', type: 'text', title: 'Description', rows: 2}),
            defineField({name: 'icon', type: 'string', title: 'Icon', ...iconPicker}),
          ],
          preview: {select: {title: 'name', subtitle: 'body'}},
        }),
      ],
    }),
    color('items', 'itemTextColor', 'Name color', 'Colors the item name, not the description.'),
    color('items', 'iconBackgroundColor', 'Icon background color'),
    color('items', 'iconColor', 'Icon color'),
  ],
  preview: {
    select: {title: 'eyebrow', subtitle: 'headline'},
    prepare: ({title, subtitle}: {title?: string; subtitle?: string}) => ({
      title: subtitle || title || '—',
      subtitle: 'Grid list',
    }),
  },
})
