import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'
import {gradientField} from '../gradientField'
import {backgroundImageField} from '../backgroundMediaFields'
import {borderField} from '../borderField'

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 *
 * The cards themselves come from the `case` documents, so this block only
 * configures the surrounding frame.
 */
export const casesBlock = defineType({
  name: 'casesBlock',
  title: 'Cases',
  type: 'object',
  icon: CaseIcon,
  fieldsets: [
    {name: 'title', title: 'Title', options: {collapsible: true, collapsed: false}},
    {name: 'lede', title: 'Lede', options: {collapsible: true, collapsed: false}},
    {name: 'cta', title: 'Call to action', options: {collapsible: true, collapsed: true}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // ── Title ────────────────────────────────────────────────────────────────
    defineField({name: 'title', type: 'string', title: 'Text', fieldset: 'title'}),
    defineField({
      name: 'headlineColor',
      type: 'string',
      title: 'Color',
      fieldset: 'title',
      description: 'e.g. #151515',
    }),

    // ── Lede ─────────────────────────────────────────────────────────────────
    defineField({name: 'lede', type: 'text', title: 'Text', rows: 2, fieldset: 'lede'}),
    defineField({
      name: 'textColor',
      type: 'string',
      title: 'Color',
      fieldset: 'lede',
      description: 'e.g. #555',
    }),

    // ── Call to action ───────────────────────────────────────────────────────
    defineField({
      name: 'ctaText',
      type: 'string',
      title: 'Text above the button',
      fieldset: 'cta',
    }),
    defineField({
      name: 'ctaTextColor',
      type: 'string',
      title: 'Text color',
      fieldset: 'cta',
      description: 'Colors the text above the button. e.g. #151515',
    }),
    defineField({
      name: 'buttonBackgroundColor',
      type: 'string',
      title: 'Button background',
      fieldset: 'cta',
      description: 'e.g. #02423F',
    }),
    defineField({
      name: 'buttonTextColor',
      type: 'string',
      title: 'Button text color',
      fieldset: 'cta',
      description: 'e.g. #fff',
    }),
    defineField({
      name: 'buttonHoverBackground',
      type: 'string',
      title: 'Button hover background',
      fieldset: 'cta',
      description: 'e.g. #013330',
    }),
    defineField({
      name: 'buttonHoverTextColor',
      type: 'string',
      title: 'Button hover text color',
      fieldset: 'cta',
      description: 'e.g. #fff',
    }),

    // ── Background ───────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundColor',
      type: 'string',
      title: 'Color',
      fieldset: 'background',
      description: 'e.g. #F4EFE5',
    }),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    backgroundImageField({fieldset: 'background', title: 'Image'}),

    // The last two settings stay top level rather than each getting a
    // single-field fold; Borders already collapses on its own.
    defineField({
      name: 'borderRadius',
      title: 'Card corner radius',
      type: 'number',
      description: 'In pixels. Defaults to ~22px.',
    }),
    borderField(),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Cases'}),
  },
})
