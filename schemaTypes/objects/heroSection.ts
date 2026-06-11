import {defineField, defineType} from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaPrimary',
      title: 'Primary CTA',
      type: 'object',
      fields: [defineField({name: 'label', type: 'string', title: 'Label'})],
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'Secondary CTA',
      type: 'object',
      fields: [defineField({name: 'label', type: 'string', title: 'Label'})],
    }),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Hero'}),
  },
})
