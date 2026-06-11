import {defineField, defineType, defineArrayMember} from 'sanity'
import {InlineElementIcon} from '@sanity/icons'
import {ICON_LIST} from '../iconList'

export const listBlock = defineType({
  name: 'listBlock',
  title: 'List Block',
  type: 'object',
  icon: InlineElementIcon,
  fields: [
    defineField({name: 'headline', title: 'Headline', type: 'string'}),
    defineField({name: 'subheadline', title: 'Subheadline', type: 'text', rows: 2}),
    defineField({
      name: 'subheadlineDivider',
      title: 'Show divider after subheadline',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'CSS color value for the section (e.g. #F4EFE5)',
    }),
    defineField({
      name: 'headlineColor',
      title: 'Headline Color',
      type: 'string',
      description: 'e.g. #02423F',
    }),
    defineField({
      name: 'headlineFontSize',
      title: 'Headline Font Size',
      type: 'number',
      description: 'In pixels.',
    }),
    defineField({
      name: 'subheadlineColor',
      title: 'Subheadline Color',
      type: 'string',
      description: 'e.g. #02423F',
    }),
    defineField({
      name: 'subheadlineFontSize',
      title: 'Subheadline Font Size',
      type: 'number',
      description: 'In pixels.',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({
              name: 'titleFontSize',
              title: 'Title Font Size',
              type: 'number',
              description: 'In pixels.',
            }),
            defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
            defineField({
              name: 'visualType',
              title: 'Visual',
              type: 'string',
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
              options: {hotspot: true},
              hidden: ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'image',
              fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
            }),
            defineField({
              name: 'imageSize',
              title: 'Image Size',
              type: 'string',
              hidden: ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'image',
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
              name: 'icon',
              title: 'Icon',
              type: 'string',
              hidden: ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'icon',
              options: {list: ICON_LIST},
            }),
            defineField({
              name: 'width',
              title: 'Width',
              type: 'string',
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
            defineField({name: 'href', title: 'Link URL', type: 'string'}),
            defineField({name: 'linkLabel', title: 'Link Label', type: 'string'}),
            defineField({
              name: 'textColor',
              title: 'Text Color',
              type: 'string',
              description: 'e.g. #02423F',
            }),
            defineField({
              name: 'backgroundColor',
              title: 'Background Color',
              type: 'string',
              description: 'Overrides the block-level item background. e.g. #F4EFE5',
            }),
            defineField({
              name: 'hoverBackgroundColor',
              title: 'Hover Background Color',
              type: 'string',
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
