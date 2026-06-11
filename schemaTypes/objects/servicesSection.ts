import {defineField, defineType, defineArrayMember} from 'sanity'
import {ThListIcon} from '@sanity/icons'

export const servicesSection = defineType({
  name: 'servicesSection',
  title: 'Services',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({name: 'headline', type: 'string', title: 'Headline'}),
    defineField({
      name: 'pillars',
      title: 'Pillars',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', title: 'Title', validation: (rule) => rule.required()}),
            defineField({name: 'body', type: 'text', title: 'Body', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'body'}},
        }),
      ],
    }),
    defineField({name: 'stripText', type: 'text', title: 'Experts Strip', rows: 4}),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Services'}),
  },
})
