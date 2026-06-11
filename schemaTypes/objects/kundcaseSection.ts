import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

export const kundcaseSection = defineType({
  name: 'kundcaseSection',
  title: 'Kundcase',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title'}),
    defineField({name: 'lede', type: 'text', title: 'Lede', rows: 2}),
    defineField({name: 'ctaText', type: 'string', title: 'CTA Text'}),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Kundcase'}),
  },
})
