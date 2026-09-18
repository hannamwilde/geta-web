import {defineField, defineType} from 'sanity'
import {StackCompactIcon} from '@sanity/icons'
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
export const mozaikPropsHeading = defineType({
  name: 'mozaikPropsHeading',
  title: 'Mozaik — properties heading',
  type: 'object',
  icon: StackCompactIcon,
  fieldsets: [
    {name: 'heading', title: 'Heading', options: {collapsible: true, collapsed: false}},
    {name: 'subtitle', title: 'Subtitle', options: {collapsible: true, collapsed: false}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // ── Heading ──────────────────────────────────────────────────────────────
    defineField({
      name: 'headline',
      title: 'Text',
      type: 'string',
      fieldset: 'heading',
      description:
        'The first letter is drawn by the Mozaik mark, which assembles from the pieces in the services block above. Write the heading in full, e.g. "Mozaik är byggd för komplex handel".',
      validation: (rule) => rule.required(),
    }),
    color('heading', 'headlineColor', 'Color', 'e.g. #FFFFFF'),
    defineField({
      name: 'headlineFontSize',
      title: 'Font size',
      type: 'number',
      fieldset: 'heading',
      description: 'In pixels. Defaults to a responsive 26–44px.',
    }),

    // ── Subtitle ─────────────────────────────────────────────────────────────
    defineField({
      name: 'subheadline',
      title: 'Text',
      type: 'text',
      rows: 2,
      fieldset: 'subtitle',
    }),
    color('subtitle', 'textColor', 'Color', 'e.g. rgba(255,255,255,0.72)'),

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
      description: 'In pixels. Defaults to ~130px.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~0 — the block that follows carries the spacing.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({
      title: title || '—',
      subtitle: 'Mozaik properties heading',
    }),
  },
})
