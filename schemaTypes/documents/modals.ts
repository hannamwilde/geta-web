import {defineField, defineType, defineArrayMember} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons'

export const modals = defineType({
  name: 'modals',
  title: 'Modals',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    {name: 'book', title: 'Book a call', default: true},
    {name: 'contact', title: 'Contact'},
  ],
  fields: [
    // ── Book modal ────────────────────────────────────────────────────────────
    defineField({name: 'bookTitle',          title: 'Title',           type: 'string',                          group: 'book'}),
    defineField({name: 'bookSubtitle',       title: 'Subtitle',        type: 'string',                          group: 'book'}),
    defineField({name: 'bookFooterNote',     title: 'Footer note',     type: 'string', description: 'e.g. "Alla tider i CET · 30 minuter · Videosamtal"', group: 'book'}),
    defineField({name: 'bookSuccessTitle',   title: 'Success title',   type: 'string',                          group: 'book'}),
    defineField({name: 'bookSuccessMessage', title: 'Success message', type: 'text', rows: 3,                   group: 'book'}),
    defineField({
      name: 'bookTopics',
      title: 'Topic options',
      type: 'array',
      group: 'book',
      of: [defineArrayMember({type: 'string'})],
      description: 'Options shown in the "What do you want to talk about?" dropdown.',
    }),

    // ── Contact modal ─────────────────────────────────────────────────────────
    defineField({name: 'contactTitle',          title: 'Title',           type: 'string',      group: 'contact'}),
    defineField({name: 'contactSubtitle',       title: 'Subtitle',        type: 'string',      group: 'contact'}),
    defineField({name: 'contactFooterNote',     title: 'Footer note',     type: 'string',      group: 'contact'}),
    defineField({name: 'contactSuccessTitle',   title: 'Success title',   type: 'string',      group: 'contact'}),
    defineField({name: 'contactSuccessMessage', title: 'Success message', type: 'text', rows: 2, group: 'contact'}),
    defineField({
      name: 'contactTopics',
      title: 'Topic options',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({type: 'string'})],
      description: 'Options shown in the "What is this about?" dropdown.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Modals', subtitle: 'Book a call & Contact'}),
  },
})
