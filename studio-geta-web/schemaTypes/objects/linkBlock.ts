import {defineField, defineType, defineArrayMember} from 'sanity'
import {LinkIcon} from '@sanity/icons'
import {iconPicker} from '../iconField'
import {gradientField} from '../gradientField'
import {backgroundImageField} from '../backgroundMediaFields'
import {linkTypeField, pageRefField} from '../linkFields'
import {borderField} from '../borderField'

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 */
export const linkBlock = defineType({
  name: 'linkBlock',
  title: 'Link Block',
  type: 'object',
  icon: LinkIcon,
  fieldsets: [
    {name: 'title', title: 'Title', options: {collapsible: true, collapsed: false}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {
      name: 'rules',
      title: 'Content area rules',
      description:
        'Thin lines drawn above and below the content. Separate from the Borders below, which draw on the block edges.',
      options: {collapsible: true, collapsed: true},
    },
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
    {name: 'links', title: 'Links', options: {collapsible: true, collapsed: false}},
  ],
  fields: [
    // ── Title ────────────────────────────────────────────────────────────────
    defineField({name: 'title', title: 'Text', type: 'string', fieldset: 'title'}),
    // Drives both the title and link-style items, so it keeps an explicit title.
    defineField({
      name: 'textColor',
      title: 'Title & link color',
      type: 'string',
      fieldset: 'title',
      description: 'Colors the title and link-style items. e.g. #02423F',
    }),

    // ── Background ───────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundColor',
      title: 'Color',
      type: 'string',
      fieldset: 'background',
      description: 'CSS color for the block. e.g. #F4EFE5',
    }),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    backgroundImageField({fieldset: 'background', title: 'Image'}),

    // ── Content area rules ───────────────────────────────────────────────────
    defineField({
      name: 'borderScope',
      title: 'Width',
      type: 'string',
      fieldset: 'rules',
      options: {
        list: [
          {title: 'Full width', value: 'full'},
          {title: 'Content width', value: 'content'},
        ],
        layout: 'radio',
      },
      initialValue: 'content',
    }),
    defineField({
      name: 'borderTopColor',
      title: 'Top line color',
      type: 'string',
      fieldset: 'rules',
      description: 'Adds a 1px line above the content. e.g. #E0DBD3',
    }),
    defineField({
      name: 'borderBottomColor',
      title: 'Bottom line color',
      type: 'string',
      fieldset: 'rules',
      description: 'Adds a 1px line below the content. e.g. #E0DBD3',
    }),

    // ── Layout & spacing ─────────────────────────────────────────────────────
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      fieldset: 'layout',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~48px.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~48px.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),

    // ── Links ────────────────────────────────────────────────────────────────
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      fieldset: 'links',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            linkTypeField,
            pageRefField,
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              hidden: ({parent}: {parent?: {linkType?: string}}) => parent?.linkType === 'internal',
            }),
            defineField({
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Link', value: 'link'},
                  {title: 'Button', value: 'button'},
                  {title: 'Image', value: 'image'},
                ],
                layout: 'radio',
              },
              initialValue: 'link',
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              hidden: ({parent}: {parent?: {style?: string}}) => parent?.style !== 'image',
              fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Optional icon shown before the label',
              ...iconPicker,
            }),
          ],
          preview: {
            select: {title: 'label', subtitle: 'href'},
            prepare: ({title, subtitle}: {title?: string; subtitle?: string}) => ({
              title: title || '—',
              subtitle: subtitle || '',
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'linksLayout',
      title: 'Layout',
      type: 'string',
      fieldset: 'links',
      options: {
        list: [
          {title: 'Stacked', value: 'stacked'},
          {title: 'Inline', value: 'inline'},
        ],
        layout: 'radio',
      },
      initialValue: 'inline',
    }),
    defineField({
      name: 'buttonBackgroundColor',
      title: 'Button background',
      type: 'string',
      fieldset: 'links',
      description: 'Background for button-style items. e.g. #02423F',
    }),
    defineField({
      name: 'buttonTextColor',
      title: 'Button text color',
      type: 'string',
      fieldset: 'links',
      description: 'Text color for button-style items. e.g. #F4EFE5',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Link Block'}),
  },
})
