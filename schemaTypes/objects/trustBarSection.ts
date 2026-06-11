import {defineField, defineType, defineArrayMember} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const trustBarSection = defineType({
  name: 'trustBarSection',
  title: 'Trust Bar',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'logos',
      title: 'Client Logos',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'clientLogo'}]})],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Trust Bar', subtitle: 'Trust Bar'}),
  },
})
