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
      name: 'blocks',
      title: 'Page Blocks',
      type: 'array',
      of: [
        defineArrayMember({type: 'heroBlock'}),
        defineArrayMember({type: 'trustBarBlock'}),
        defineArrayMember({type: 'mozaikBlock'}),
        defineArrayMember({type: 'growingListBlock'}),
        defineArrayMember({type: 'casesBlock'}),
        defineArrayMember({type: 'textBlock'}),
        defineArrayMember({type: 'listBlock'}),
        defineArrayMember({type: 'bannerBlock'}),
        defineArrayMember({type: 'imageSliderBlock'}),
        defineArrayMember({type: 'mozaikServicesBlock'}),
        defineArrayMember({type: 'mozaikPropsHeading'}),
        defineArrayMember({type: 'linkBlock'}),
        defineArrayMember({type: 'quoteBlock'}),
        defineArrayMember({type: 'accordionBlock'}),
      ],
    }),
  ],

  preview: {
    prepare: () => ({title: 'Home Page'}),
  },
})
