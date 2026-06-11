import {defineField, defineType} from 'sanity'
import {BlockquoteIcon} from '@sanity/icons'

export const quoteBlock = defineType({
  name: 'quoteBlock',
  title: 'Quote Block',
  type: 'object',
  icon: BlockquoteIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'colors', title: 'Colors'},
    {name: 'layout', title: 'Layout'},
  ],
  fields: [
    // ── Content ──────────────────────────────────────────────────────────────
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'author', title: 'Author', type: 'string', group: 'content'}),
    defineField({name: 'companyRole', title: 'Company / Role', type: 'string', group: 'content'}),

    // ── Colors ───────────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      group: 'colors',
      description: 'e.g. #F4EFE5',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'string',
      group: 'colors',
      description: 'e.g. #02423F',
    }),
    // ── Layout ───────────────────────────────────────────────────────────────
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      group: 'layout',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'number',
      group: 'layout',
      description: 'In pixels.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      group: 'layout',
      description: 'In pixels.',
    }),
  ],
  preview: {
    select: {title: 'quote', subtitle: 'author'},
    prepare: ({title, subtitle}: {title?: string; subtitle?: string}) => ({
      title: title ? `"${title.slice(0, 60)}${title.length > 60 ? '…' : ''}"` : '—',
      subtitle: subtitle || 'Quote Block',
    }),
  },
})
