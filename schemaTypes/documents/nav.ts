import {defineField, defineType, defineArrayMember} from 'sanity'
import {MenuIcon} from '@sanity/icons'

const linkFields = [
  defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
  defineField({name: 'href', title: 'URL', type: 'string'}),
]

export const nav = defineType({
  name: 'nav',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Leave empty to use the default Geta logo',
    }),

    defineField({
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'href', title: 'URL', type: 'string', description: 'Used when there is no mega menu'}),
            defineField({
              name: 'megaColumns',
              title: 'Mega Menu Columns',
              description: 'Add columns to turn this item into a dropdown. Leave empty for a plain link.',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'links',
                      title: 'Links',
                      type: 'array',
                      of: [defineArrayMember({type: 'object', fields: linkFields, preview: {select: {title: 'label', subtitle: 'href'}}})],
                    }),
                  ],
                  preview: {
                    select: {links: 'links'},
                    prepare: ({links}) => ({title: `Column (${(links || []).length} links)`}),
                  },
                }),
              ],
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        }),
      ],
    }),

    defineField({
      name: 'rightLinks',
      title: 'Right Links',
      description: 'Buttons and links shown on the right side of the nav bar',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'style',
              title: 'Style',
              type: 'string',
              options: {
                list: [
                  {title: 'Subtle link', value: 'link'},
                  {title: 'CTA button', value: 'cta'},
                ],
                layout: 'radio',
              },
              initialValue: 'link',
            }),
            defineField({
              name: 'action',
              title: 'Action',
              type: 'string',
              options: {
                list: [
                  {title: 'Go to URL', value: 'link'},
                  {title: 'Open contact modal', value: 'openContact'},
                  {title: 'Open booking modal', value: 'openBook'},
                ],
                layout: 'radio',
              },
              initialValue: 'link',
            }),
            defineField({
              name: 'href',
              title: 'URL',
              type: 'string',
              hidden: ({parent}) => parent?.action !== 'link',
            }),
            defineField({
              name: 'external',
              title: 'Open in new tab',
              type: 'boolean',
              initialValue: false,
              hidden: ({parent}) => parent?.action !== 'link',
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'style'}},
        }),
      ],
    }),
  ],

  preview: {
    prepare: () => ({title: 'Navigation'}),
  },
})
