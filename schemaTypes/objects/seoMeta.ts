import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons'

export const seoMeta = defineType({
  name: 'seoMeta',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown in search results and browser tab. Defaults to the site title if left empty.',
      validation: (rule) => rule.max(60).warning('Keep under 60 characters for best results'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Shown in search results below the title.',
      validation: (rule) => rule.max(160).warning('Keep under 160 characters for best results'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Used when shared on LinkedIn, Facebook, X etc. Recommended size: 1200×630.',
      options: {hotspot: true},
    }),
  ],
})
