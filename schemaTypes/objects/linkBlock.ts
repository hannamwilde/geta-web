import {defineField, defineType, defineArrayMember} from 'sanity'
import {LinkIcon} from '@sanity/icons'
import {ICON_LIST} from '../iconList'

export const linkBlock = defineType({
  name: 'linkBlock',
  title: 'Link Block',
  type: 'object',
  icon: LinkIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'colors', title: 'Colors'},
    {name: 'layout', title: 'Layout'},
  ],
  fields: [
    // ── Content ──────────────────────────────────────────────────────────────
    defineField({name: 'title', title: 'Title', type: 'string', group: 'content'}),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'href', title: 'URL', type: 'string'}),
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
              options: {list: ICON_LIST},
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

    // ── Colors ───────────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      group: 'colors',
      description: 'CSS color for the block. e.g. #F4EFE5',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      group: 'colors',
      description: 'Color for the title and link-style items. e.g. #02423F',
    }),
    defineField({
      name: 'buttonBackgroundColor',
      title: 'Button Background',
      type: 'string',
      group: 'colors',
      description: 'Background for button-style items. e.g. #02423F',
    }),
    defineField({
      name: 'buttonTextColor',
      title: 'Button Text Color',
      type: 'string',
      group: 'colors',
      description: 'Text color for button-style items. e.g. #F4EFE5',
    }),
    defineField({
      name: 'borderScope',
      title: 'Border Width',
      type: 'string',
      group: 'colors',
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
      title: 'Border Top Color',
      type: 'string',
      group: 'colors',
      description: 'Adds a 1px top border on the content area. e.g. #E0DBD3',
    }),
    defineField({
      name: 'borderBottomColor',
      title: 'Border Bottom Color',
      type: 'string',
      group: 'colors',
      description: 'Adds a 1px bottom border on the content area. e.g. #E0DBD3',
    }),

    // ── Layout ───────────────────────────────────────────────────────────────
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      group: 'layout',
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
      name: 'linksLayout',
      title: 'Links Layout',
      type: 'string',
      group: 'layout',
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
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'number',
      group: 'layout',
      description: 'In pixels. Defaults to ~48px.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      group: 'layout',
      description: 'In pixels. Defaults to ~48px.',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Link Block'}),
  },
})
