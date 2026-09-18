import {defineField, defineType, defineArrayMember} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                ],
                layout: 'radio',
              },
            }),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
          preview: {select: {title: 'platform', subtitle: 'url'}},
        }),
      ],
    }),
    defineField({
      name: 'columns',
      title: 'Link Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Column Title', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
                    defineField({name: 'href', title: 'URL', type: 'string'}),
                    defineField({name: 'external', title: 'Open in new tab', type: 'boolean', initialValue: false}),
                  ],
                  preview: {select: {title: 'label', subtitle: 'href'}},
                }),
              ],
            }),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({
      name: 'orgLine',
      title: 'Organisation Line',
      type: 'string',
      description: 'E.g. "Geta Digital AB — Org.nr: 556660-1149"',
    }),
  ],

  preview: {
    prepare: () => ({title: 'Footer'}),
  },
})
