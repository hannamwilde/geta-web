import {defineField, defineType} from 'sanity'
import {SparklesIcon} from '@sanity/icons'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: SparklesIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Category',
      options: {
        list: [
          {title: 'Strategi', value: 'strategi'},
          {title: 'Teknik', value: 'teknik'},
          {title: 'Design', value: 'design'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'shortDescription',
      type: 'text',
      title: 'Short Description',
      rows: 2,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
        },
      ],
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
})
