import {defineField, defineType} from 'sanity'
import {CalendarIcon} from '@sanity/icons'
import {borderField} from '../borderField'

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 *
 * The events themselves come from `event` documents; this block only labels
 * the four sections and styles the cards.
 */
export const eventsBlock = defineType({
  name: 'eventsBlock',
  title: 'Events',
  type: 'object',
  icon: CalendarIcon,
  fieldsets: [
    {
      name: 'labels',
      title: 'Section labels',
      description: 'Headings above each of the four lists. Empty sections are not rendered.',
      options: {collapsible: true, collapsed: false},
    },
    {name: 'cards', title: 'Cards', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // ── Section labels ───────────────────────────────────────────────────────
    defineField({
      name: 'upcomingLabel',
      title: 'Upcoming events',
      type: 'string',
      fieldset: 'labels',
      placeholder: 'Kommande evenemang',
    }),
    defineField({
      name: 'upcomingWebinarLabel',
      title: 'Upcoming webinars',
      type: 'string',
      fieldset: 'labels',
      placeholder: 'Kommande webinar',
    }),
    defineField({
      name: 'pastLabel',
      title: 'Past events',
      type: 'string',
      fieldset: 'labels',
      placeholder: 'Tidigare evenemang',
    }),
    defineField({
      name: 'pastWebinarLabel',
      title: 'Past webinars',
      type: 'string',
      fieldset: 'labels',
      placeholder: 'Tidigare webinar',
    }),

    // ── Cards ────────────────────────────────────────────────────────────────
    defineField({
      name: 'registerLabel',
      title: 'Register button label',
      type: 'string',
      fieldset: 'cards',
      placeholder: 'Anmäl dig',
      description: 'Shown on upcoming events that have a registration link.',
    }),
    defineField({
      name: 'borderRadius',
      title: 'Corner radius',
      type: 'number',
      fieldset: 'cards',
      description: 'In pixels. Defaults to ~22px.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),
  ],
  preview: {
    prepare: () => ({title: 'Events'}),
  },
})
