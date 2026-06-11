import {defineField, defineType, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      description: 'The URL path for this page, e.g. "om-oss" becomes #/om-oss',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoMeta',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: [
        defineArrayMember({type: 'heroSection'}),
        defineArrayMember({type: 'trustBarSection'}),
        defineArrayMember({type: 'mozaikSection'}),
        defineArrayMember({type: 'servicesSection'}),
        defineArrayMember({type: 'kundcaseSection'}),
        defineArrayMember({type: 'contactBannerSection'}),
        defineArrayMember({type: 'textBlock'}),
        defineArrayMember({type: 'listBlock'}),
        defineArrayMember({type: 'bannerBlock'}),
        defineArrayMember({type: 'linkBlock'}),
        defineArrayMember({type: 'quoteBlock'}),
      ],
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
    prepare: ({title, subtitle}) => ({title, subtitle: subtitle ? `#/${subtitle}` : ''}),
  },
})
