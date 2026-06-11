import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export const contactBannerSection = defineType({
  name: 'contactBannerSection',
  title: 'Contact Banner',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({name: 'headline', type: 'string', title: 'Headline'}),
    defineField({name: 'subheadline', type: 'text', title: 'Subheadline', rows: 2}),
    defineField({
      name: 'cta',
      title: 'CTA Button',
      type: 'object',
      fields: [
        defineField({name: 'label', type: 'string', title: 'Label'}),
        defineField({name: 'href', type: 'string', title: 'Link'}),
      ],
    }),
    defineField({
      name: 'backgroundImage',
      type: 'image',
      title: 'Background Image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Contact Banner'}),
  },
})
