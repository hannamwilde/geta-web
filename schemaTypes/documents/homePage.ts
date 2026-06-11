import {defineField, defineType, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  fields: [
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
    prepare: () => ({title: 'Home Page'}),
  },
})
