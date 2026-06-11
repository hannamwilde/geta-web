import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const clientLogo = defineType({
  name: 'clientLogo',
  title: 'Client Logo',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Client Name',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      type: 'image',
      title: 'Logo',
      options: {hotspot: false},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          initialValue: ({parent}: {parent: {name?: string}}) => parent?.name ?? '',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'website',
      type: 'url',
      title: 'Website',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).error('Must be a valid URL'),
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
