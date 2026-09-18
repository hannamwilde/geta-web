import {defineField} from 'sanity'

export const linkTypeField = defineField({
  name: 'linkType',
  title: 'Link type',
  type: 'string',
  options: {
    list: [
      {title: 'Internal page', value: 'internal'},
      {title: 'External URL', value: 'external'},
    ],
    layout: 'radio',
  },
  initialValue: 'external',
})

export const pageRefField = defineField({
  name: 'pageRef',
  title: 'Page',
  type: 'reference',
  to: [{type: 'page'}],
  hidden: ({parent}: {parent?: {linkType?: string}}) => parent?.linkType !== 'internal',
})
