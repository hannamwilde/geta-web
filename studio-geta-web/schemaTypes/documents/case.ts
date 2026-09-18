import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const caseType = defineType({
  name: 'case',
  title: 'Case',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'client',
      type: 'string',
      title: 'Client Name',
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
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      rows: 3,
      validation: (rule) => rule.max(200).warning('Keep under 200 characters for best display'),
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
          validation: (rule) => rule.required(),
        }),
      ],
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
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'testimonial',
      type: 'object',
      title: 'Testimonial',
      fields: [
        defineField({name: 'quote', type: 'text', title: 'Quote', rows: 3}),
        defineField({name: 'person', type: 'string', title: 'Name'}),
        defineField({name: 'role', type: 'string', title: 'Role & Company'}),
      ],
    }),
    defineField({
      name: 'publishedAt',
      type: 'date',
      title: 'Published Date',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'coverImage',
    },
  },
})
