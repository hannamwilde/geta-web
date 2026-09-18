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
    // The Studio only injects its own "All fields" tab when the schema doesn't
    // already declare a group by that name — declaring it hidden removes the tab.
    {name: 'all-fields', title: 'All fields', hidden: true},
  ],
  fields: [
    // ── Book modal ────────────────────────────────────────────────────────────
    defineField({name: 'bookEyebrow',        title: 'Eyebrow',         type: 'string', description: 'Small label above the title. e.g. "Boka"', initialValue: 'Boka', group: 'book'}),
    defineField({name: 'bookTitle',          title: 'Title',           type: 'string',                          group: 'book'}),
    defineField({name: 'bookSubtitle',       title: 'Subtitle',        type: 'string',                          group: 'book'}),
    defineField({name: 'bookFooterNote',     title: 'Footer note',     type: 'string', description: 'e.g. "Alla tider i CET · 30 minuter · Videosamtal"', group: 'book'}),
    defineField({name: 'bookSuccessTitle',   title: 'Success title',   type: 'string',                          group: 'book'}),
    defineField({name: 'bookSuccessMessage', title: 'Success message', type: 'text', rows: 3,                   group: 'book'}),
    defineField({
      name: 'bookCalendarUrl',
      title: 'Google Calendar scheduling URL',
      // Deliberately `string`, not `url`: editors paste the whole <iframe>
      // snippet, which the built-in url format check would reject even though
      // the site extracts the URL from it fine. Validated below instead.
      type: 'string',
      group: 'book',
      description:
        'Paste the booking page link from Google Calendar → your appointment schedule → "Share" → "Book an appointment". Pasting the whole <iframe> embed code works too — only the URL is kept. Required — this is what the Book a call modal shows.',
      validation: (Rule) =>
        Rule.required().custom((value?: string) => {
          if (!value?.trim()) return true // handled by required()
          // Mirrors resolveSchedulingUrl() on the web side: editors often paste
          // the full <iframe> snippet, so validate the URL inside it.
          const iframeSrc = value.match(/src\s*=\s*["']([^"']+)["']/i)
          const candidate = (iframeSrc ? iframeSrc[1] : value).trim().split(/["'\s]/)[0]
          try {
            const {protocol, hostname, pathname} = new URL(candidate)
            if (protocol !== 'https:') return 'Must be an https link.'
            if (hostname !== 'calendar.google.com') {
              return 'Must be a calendar.google.com link — other hosts are not embedded.'
            }
            if (!pathname.includes('/appointments/schedules/')) {
              return 'This looks like a regular Google Calendar link, not an appointment schedule booking page.'
            }
            return true
          } catch {
            return 'Not a valid URL.'
          }
        }),
    }),

    // ── Contact modal ─────────────────────────────────────────────────────────
    defineField({name: 'contactEyebrow',        title: 'Eyebrow',         type: 'string', description: 'Small label above the title. e.g. "Kontakt"', initialValue: 'Kontakt', group: 'contact'}),
    defineField({name: 'contactTitle',          title: 'Title',           type: 'string',      group: 'contact'}),
    defineField({name: 'contactSubtitle',       title: 'Subtitle',        type: 'string',      group: 'contact'}),
    defineField({name: 'contactFooterNote',     title: 'Footer note',     type: 'string',      group: 'contact'}),
    defineField({name: 'contactSuccessTitle',   title: 'Success title',   type: 'string',      group: 'contact'}),
    defineField({name: 'contactSuccessMessage', title: 'Success message', type: 'text', rows: 2, group: 'contact'}),
    defineField({
      name: 'contactRecipientEmail',
      title: 'Recipient email',
      type: 'string',
      group: 'contact',
      description:
        'Where submissions from the contact form are sent. Only used server-side — it is never exposed on the website.',
      validation: (Rule) => Rule.required().email(),
    }),
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
