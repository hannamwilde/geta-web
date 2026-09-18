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
      name: 'navTheme',
      title: 'Nav theme',
      type: 'string',
      description: 'Forces the navigation bar into a specific colour scheme on this page.',
      options: {
        list: [
          {title: 'Default (dark green)', value: 'default'},
          {title: 'Purple (Mozaik)', value: 'purple'},
        ],
        layout: 'radio',
      },
      initialValue: 'default',
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
        defineArrayMember({type: 'GridList'}),
        defineArrayMember({type: 'eventsBlock'}),
      ],
    }),
  ],

  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
    prepare: ({title, subtitle}) => ({title, subtitle: subtitle ? `#/${subtitle}` : ''}),
  },
})
