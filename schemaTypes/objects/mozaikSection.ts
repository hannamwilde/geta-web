import {defineField, defineType, defineArrayMember} from 'sanity'
import {SparklesIcon} from '@sanity/icons'
import {ICON_LIST} from '../iconList'

export const mozaikSection = defineType({
  name: 'mozaikSection',
  title: 'Mozaik — Ecosystem',
  type: 'object',
  icon: SparklesIcon,
  fields: [
    defineField({name: 'headline', type: 'string', title: 'Headline'}),
    defineField({name: 'subheadline', type: 'text', title: 'Subheadline', rows: 2}),
    defineField({
      name: 'components',
      title: 'Ecosystem Components',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', type: 'string', title: 'Label', validation: (rule) => rule.required()}),
            defineField({name: 'description', type: 'text', title: 'Description', rows: 2}),
            defineField({name: 'icon', type: 'string', title: 'Icon', options: {list: ICON_LIST}}),
          ],
          preview: {select: {title: 'label', subtitle: 'description'}},
        }),
      ],
      validation: (rule) => rule.max(12),
    }),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Mozaik'}),
  },
})
