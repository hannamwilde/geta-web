import {defineField, defineType, defineArrayMember} from 'sanity'
import {ThListIcon} from '@sanity/icons'
import {gradientField} from '../gradientField'
import {backgroundImageField} from '../backgroundMediaFields'
import {linkTypeField, pageRefField} from '../linkFields'
import {borderField} from '../borderField'

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 */
export const growingListBlock = defineType({
  name: 'growingListBlock',
  title: 'Growing list',
  type: 'object',
  icon: ThListIcon,
  fieldsets: [
    {name: 'eyebrow', title: 'Eyebrow', options: {collapsible: true, collapsed: true}},
    {name: 'headline', title: 'Headline', options: {collapsible: true, collapsed: false}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
    {name: 'pillars', title: 'Pillars', options: {collapsible: true, collapsed: false}},
  ],
  fields: [
    // ── Eyebrow ──────────────────────────────────────────────────────────────
    defineField({name: 'eyebrow', type: 'string', title: 'Text', fieldset: 'eyebrow'}),
    defineField({
      name: 'eyebrowColor',
      type: 'string',
      title: 'Color',
      fieldset: 'eyebrow',
      description: 'e.g. #9FD0C2',
    }),
    defineField({
      name: 'eyebrowFontSize',
      type: 'number',
      title: 'Font size',
      fieldset: 'eyebrow',
      description: 'In pixels.',
    }),

    // ── Headline ─────────────────────────────────────────────────────────────
    defineField({
      name: 'headline',
      type: 'string',
      title: 'Headline',
      fieldset: 'headline',
      description: 'The plain part of the title.',
    }),
    defineField({
      name: 'tagline',
      type: 'string',
      title: 'Gradient part',
      fieldset: 'headline',
      description:
        'Appended to the headline with gradient colour. Leave blank for a plain headline.',
    }),
    defineField({
      name: 'headlineColor',
      type: 'string',
      title: 'Color',
      fieldset: 'headline',
      description: 'e.g. #F4EFE5',
    }),
    defineField({
      name: 'headlineFontSize',
      type: 'number',
      title: 'Font size',
      fieldset: 'headline',
      description: 'In pixels.',
    }),
    defineField({
      name: 'taglineGradientFrom',
      title: 'Gradient — from',
      type: 'string',
      fieldset: 'headline',
      description: 'Start colour of the gradient text. e.g. #79B6A6',
    }),
    defineField({
      name: 'taglineGradientTo',
      title: 'Gradient — to',
      type: 'string',
      fieldset: 'headline',
      description: 'End colour of the gradient text. e.g. #C4BCFB',
    }),
    defineField({
      name: 'taglineGradientAngle',
      title: 'Gradient — angle (°)',
      type: 'number',
      fieldset: 'headline',
      initialValue: 105,
      description: '0 = top→bottom · 90 = left→right · 105 = diagonal',
    }),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      fieldset: 'headline',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'center',
    }),

    // ── Background ───────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundColor',
      title: 'Color',
      type: 'string',
      fieldset: 'background',
      description: 'Defaults to forest green. e.g. #02423F',
    }),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    backgroundImageField({fieldset: 'background', title: 'Image'}),

    // ── Layout & spacing ─────────────────────────────────────────────────────
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~118px.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~96px.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),

    // ── Pillars ──────────────────────────────────────────────────────────────
    defineField({
      name: 'pillars',
      title: 'Items',
      type: 'array',
      fieldset: 'pillars',
      validation: (rule) => rule.max(3).error('Maximum 3 pillars allowed.'),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              title: 'Title',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'body', type: 'text', title: 'Body', rows: 3}),
            defineField({name: 'image', type: 'image', title: 'Image', options: {hotspot: true}}),
            defineField({
              name: 'linkLabel',
              type: 'string',
              title: 'Link label',
              description: 'e.g. "Läs mer" — leave blank to hide the link.',
            }),
            {...linkTypeField},
            {...pageRefField},
            defineField({
              name: 'href',
              type: 'url',
              title: 'External URL',
              hidden: ({parent}: {parent?: {linkType?: string}}) => parent?.linkType !== 'external',
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'body', media: 'image'}},
        }),
      ],
    }),
    defineField({
      name: 'textColor',
      title: 'Body text color',
      type: 'string',
      fieldset: 'pillars',
      description: 'Card descriptions and strip text. e.g. rgba(255,255,255,0.74)',
    }),
    defineField({
      name: 'borderRadius',
      title: 'Card corner radius',
      type: 'number',
      fieldset: 'pillars',
      description: 'In pixels. Defaults to ~22px.',
    }),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Growing list'}),
  },
})
