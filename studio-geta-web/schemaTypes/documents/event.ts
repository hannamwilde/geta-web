import {defineField, defineType, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'page', title: 'Event page'},
  ],
  fields: [
    // ─── Basics ──────────────────────────────────────────────────────
    defineField({
      name: 'eventType',
      title: 'Type',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          {value: 'event', title: 'Evenemang'},
          {value: 'webinar', title: 'Webinar'},
        ],
        layout: 'radio',
      },
      initialValue: 'event',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basics',
      description: 'URL for the event page — e.g. "pim-webinar" → /evenemang/pim-webinar. Leave empty to skip creating a page.',
      options: {source: 'title'},
    }),
    defineField({
      name: 'date',
      title: 'Start date & time',
      type: 'datetime',
      group: 'basics',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End date & time',
      type: 'datetime',
      group: 'basics',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'basics',
    }),
    defineField({
      name: 'excerpt',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'basics',
      description: 'Shown on the events list card.',
    }),
    defineField({
      name: 'image',
      title: 'Card image',
      type: 'image',
      group: 'basics',
      options: {hotspot: true},
      description: 'Shown on the events list card.',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text'}),
      ],
    }),
    defineField({
      name: 'registrationUrl',
      title: 'Registration URL',
      type: 'url',
      group: 'basics',
    }),

    // ─── Event page ──────────────────────────────────────────────────
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'page',
      description: 'Short line under the title, e.g. "Insikter, trender och best practices".',
    }),
    defineField({
      name: 'lead',
      title: 'Lead paragraph',
      type: 'text',
      rows: 4,
      group: 'page',
      description: 'Longer intro shown in the hero.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero / banner image',
      type: 'image',
      group: 'page',
      options: {hotspot: true},
      description: 'Wide image shown below the hero (speaker photo, event banner, etc.)',
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text'}),
      ],
    }),
    defineField({
      name: 'takeawaysHeadline',
      title: 'Takeaways headline',
      type: 'string',
      group: 'page',
    }),
    defineField({
      name: 'takeawaysBody',
      title: 'Takeaways body',
      type: 'text',
      rows: 3,
      group: 'page',
    }),
    defineField({
      name: 'takeaways',
      title: 'Takeaway points',
      type: 'array',
      group: 'page',
      of: [{type: 'string'}],
      options: {layout: 'list'},
    }),
    defineField({
      name: 'agendaTitle',
      title: 'Agenda section title',
      type: 'string',
      group: 'page',
      initialValue: 'Agenda',
    }),
    defineField({
      name: 'agendaSub',
      title: 'Agenda section subtitle',
      type: 'string',
      group: 'page',
    }),
    defineField({
      name: 'agenda',
      title: 'Agenda items',
      type: 'array',
      group: 'page',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', type: 'string', title: 'Title', validation: (r) => r.required()}),
            defineField({name: 'sub', type: 'string', title: 'Subtitle'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'sub'},
          },
        }),
      ],
    }),
    defineField({
      name: 'speakersTitle',
      title: 'Speakers section title',
      type: 'string',
      group: 'page',
      initialValue: 'Medverkande',
    }),
    defineField({
      name: 'speakers',
      title: 'Speakers',
      type: 'array',
      group: 'page',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'name', type: 'string', title: 'Name', validation: (r) => r.required()}),
            defineField({name: 'role', type: 'string', title: 'Role & Company'}),
            defineField({name: 'bio', type: 'text', title: 'Bio', rows: 4}),
            defineField({
              name: 'photo',
              type: 'image',
              title: 'Photo',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
            }),
          ],
          preview: {
            select: {title: 'name', subtitle: 'role', media: 'photo'},
          },
        }),
      ],
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Hero — register button label',
      type: 'string',
      group: 'page',
      placeholder: 'Anmäl dig nu',
    }),
    defineField({
      name: 'takeawaysEyebrow',
      title: 'Takeaways — eyebrow label',
      type: 'string',
      group: 'page',
      placeholder: 'Vad du får med dig',
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA title',
      type: 'string',
      group: 'page',
      placeholder: 'Anmäl dig nu',
    }),
    defineField({
      name: 'ctaBody',
      title: 'CTA body',
      type: 'text',
      rows: 3,
      group: 'page',
    }),
    defineField({
      name: 'ctaButtonLabel',
      title: 'CTA — button label',
      type: 'string',
      group: 'page',
      placeholder: 'Anmäl dig nu',
    }),
  ],

  orderings: [
    {
      title: 'Date, newest first',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Date, oldest first',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],

  preview: {
    select: {title: 'title', subtitle: 'date', location: 'location'},
    prepare: ({title, subtitle, location}) => ({
      title,
      subtitle: [
        subtitle ? new Date(subtitle).toLocaleDateString('sv-SE') : 'No date',
        location,
      ].filter(Boolean).join(' · '),
    }),
  },
})
