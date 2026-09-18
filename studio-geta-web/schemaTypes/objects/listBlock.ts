import {defineField, defineType, defineArrayMember} from 'sanity'
import {InlineElementIcon} from '@sanity/icons'
import {iconPicker} from '../iconField'
import {gradientField} from '../gradientField'
import {backgroundImageField} from '../backgroundMediaFields'
import {linkTypeField, pageRefField} from '../linkFields'
import {borderField} from '../borderField'

const isNotImage = ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'image'
const isNotIcon = ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'icon'

// Height only applies to the large (edge-bleeding) image — the small variant is a
// fixed-height inline logo.
const isNotLargeImage = ({parent}: {parent?: {visualType?: string; imageSize?: string}}) =>
  parent?.visualType !== 'image' || parent?.imageSize === 'small'

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 */
export const listBlock = defineType({
  name: 'listBlock',
  title: 'List Block',
  type: 'object',
  icon: InlineElementIcon,
  fieldsets: [
    {name: 'eyebrow', title: 'Eyebrow', options: {collapsible: true, collapsed: true}},
    {name: 'headline', title: 'Headline', options: {collapsible: true, collapsed: false}},
    {name: 'subheadline', title: 'Subheadline', options: {collapsible: true, collapsed: true}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {name: 'items', title: 'Items', options: {collapsible: true, collapsed: false}},
  ],
  fields: [
    // ── Eyebrow ──────────────────────────────────────────────────────────────
    defineField({name: 'eyebrow', title: 'Text', type: 'string', fieldset: 'eyebrow'}),
    defineField({
      name: 'eyebrowColor',
      title: 'Color',
      type: 'string',
      fieldset: 'eyebrow',
      description: 'e.g. #8B7DF7',
    }),
    defineField({
      name: 'eyebrowFontSize',
      title: 'Font size',
      type: 'number',
      fieldset: 'eyebrow',
      description: 'In pixels.',
    }),

    // ── Headline ─────────────────────────────────────────────────────────────
    defineField({name: 'headline', title: 'Text', type: 'string', fieldset: 'headline'}),
    defineField({
      name: 'headlineColor',
      title: 'Color',
      type: 'string',
      fieldset: 'headline',
      description: 'e.g. #02423F',
    }),
    defineField({
      name: 'headlineFontSize',
      title: 'Font size',
      type: 'number',
      fieldset: 'headline',
      description: 'In pixels.',
    }),

    // ── Subheadline ──────────────────────────────────────────────────────────
    defineField({
      name: 'subheadline',
      title: 'Text',
      type: 'text',
      rows: 2,
      fieldset: 'subheadline',
    }),
    defineField({
      name: 'subheadlineColor',
      title: 'Color',
      type: 'string',
      fieldset: 'subheadline',
      description: 'e.g. #02423F',
    }),
    defineField({
      name: 'subheadlineFontSize',
      title: 'Font size',
      type: 'number',
      fieldset: 'subheadline',
      description: 'In pixels.',
    }),
    defineField({
      name: 'subheadlineDivider',
      title: 'Show divider below',
      type: 'boolean',
      fieldset: 'subheadline',
      initialValue: false,
    }),

    // ── Background ───────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundColor',
      title: 'Color',
      type: 'string',
      fieldset: 'background',
      description: 'CSS color value for the block (e.g. #F4EFE5)',
    }),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    backgroundImageField({fieldset: 'background', title: 'Image'}),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),

    // ── Items ────────────────────────────────────────────────────────────────
    defineField({
      name: 'itemStyle',
      title: 'Style',
      type: 'string',
      fieldset: 'items',
      options: {
        list: [
          {title: 'Large (default)', value: 'large'},
          {title: 'Narrow (horizontal tile)', value: 'narrow'},
        ],
        layout: 'radio',
      },
      initialValue: 'large',
    }),
    defineField({
      name: 'borderRadius',
      title: 'Corner radius',
      type: 'number',
      fieldset: 'items',
      description: 'In pixels. Defaults to 16px.',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      fieldset: 'items',
      of: [
        defineArrayMember({
          type: 'object',
          // The item form is grouped the same way as the block itself.
          fieldsets: [
            {name: 'title', title: 'Title', options: {collapsible: true, collapsed: false}},
            {name: 'visual', title: 'Visual', options: {collapsible: true, collapsed: true}},
            {name: 'link', title: 'Link', options: {collapsible: true, collapsed: true}},
            {name: 'appearance', title: 'Appearance', options: {collapsible: true, collapsed: true}},
          ],
          fields: [
            // ── Title ──────────────────────────────────────────────────────
            defineField({name: 'title', title: 'Text', type: 'string', fieldset: 'title'}),
            defineField({
              name: 'titleFontSize',
              title: 'Font size',
              type: 'number',
              fieldset: 'title',
              description: 'In pixels.',
            }),

            defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),

            // ── Visual ─────────────────────────────────────────────────────
            defineField({
              name: 'visualType',
              title: 'Type',
              type: 'string',
              fieldset: 'visual',
              options: {
                list: [
                  {title: 'Icon', value: 'icon'},
                  {title: 'Image', value: 'image'},
                  {title: 'None', value: 'none'},
                ],
                layout: 'radio',
              },
              initialValue: 'icon',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              fieldset: 'visual',
              options: {hotspot: true},
              hidden: isNotImage,
              fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
            }),
            defineField({
              name: 'imageSize',
              title: 'Image size',
              type: 'string',
              fieldset: 'visual',
              hidden: isNotImage,
              options: {
                list: [
                  {title: 'Large', value: 'large'},
                  {title: 'Small', value: 'small'},
                ],
                layout: 'radio',
              },
              initialValue: 'large',
            }),
            defineField({
              name: 'imageHeight',
              title: 'Image height',
              type: 'string',
              fieldset: 'visual',
              hidden: isNotLargeImage,
              options: {
                list: [
                  {title: 'Short', value: 'short'},
                  {title: 'Medium (default)', value: 'medium'},
                  {title: 'Tall', value: 'tall'},
                  {title: 'Extra tall', value: 'xtall'},
                ],
                layout: 'radio',
              },
              initialValue: 'medium',
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              fieldset: 'visual',
              hidden: isNotIcon,
              ...iconPicker,
            }),
            defineField({
              name: 'iconBackgroundColor',
              title: 'Icon background color',
              type: 'string',
              fieldset: 'visual',
              hidden: isNotIcon,
              description: 'e.g. #8B7DF7',
            }),

            // ── Link ───────────────────────────────────────────────────────
            {...linkTypeField, fieldset: 'link'},
            {...pageRefField, fieldset: 'link'},
            defineField({
              name: 'href',
              title: 'Link URL',
              type: 'string',
              fieldset: 'link',
              hidden: ({parent}: {parent?: {linkType?: string}}) => parent?.linkType === 'internal',
            }),
            defineField({
              name: 'linkLabel',
              title: 'Link label',
              type: 'string',
              fieldset: 'link',
            }),

            // ── Appearance ─────────────────────────────────────────────────
            defineField({
              name: 'width',
              title: 'Width',
              type: 'string',
              fieldset: 'appearance',
              options: {
                list: [
                  {title: '1/4', value: '3'},
                  {title: '1/3', value: '4'},
                  {title: '1/2', value: '6'},
                  {title: '2/3', value: '8'},
                  {title: '3/4', value: '9'},
                  {title: 'Full', value: '12'},
                ],
                layout: 'radio',
              },
              initialValue: '4',
            }),
            defineField({
              name: 'textColor',
              title: 'Text color',
              type: 'string',
              fieldset: 'appearance',
              description: 'e.g. #02423F',
            }),
            defineField({
              name: 'backgroundColor',
              title: 'Background color',
              type: 'string',
              fieldset: 'appearance',
              description: 'Overrides the block-level item background. e.g. #F4EFE5',
            }),
            defineField({
              name: 'hoverBackgroundColor',
              title: 'Hover background color',
              type: 'string',
              fieldset: 'appearance',
              description: 'Only applied when the item has a link. e.g. #E8E2D8',
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'List Block'}),
  },
})
