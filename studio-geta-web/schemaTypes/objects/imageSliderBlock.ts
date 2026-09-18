import {defineField, defineType, defineArrayMember} from 'sanity'
import {ImagesIcon} from '@sanity/icons'
import {ctaFields} from '../ctaFields'
import {overlayFields} from '../backgroundMediaFields'
import {borderField} from '../borderField'

const color = (fieldset: string, name: string, title: string, description?: string) =>
  defineField({name, title, type: 'string', fieldset, description})

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 *
 * The title, text and button settings style every slide at once — per-slide
 * content lives in the Slides array.
 */
export const imageSliderBlock = defineType({
  name: 'imageSliderBlock',
  title: 'Image slider',
  type: 'object',
  icon: ImagesIcon,
  fieldsets: [
    {name: 'title', title: 'Title', options: {collapsible: true, collapsed: true}},
    {name: 'text', title: 'Text', options: {collapsible: true, collapsed: true}},
    {name: 'button', title: 'Button', options: {collapsible: true, collapsed: true}},
    {
      name: 'overlay',
      title: 'Overlay',
      description: 'Scrim drawn over each slide image so the text stays readable.',
      options: {collapsible: true, collapsed: true},
    },
    {name: 'behaviour', title: 'Behaviour', options: {collapsible: true, collapsed: true}},
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
    {name: 'slides', title: 'Slides', options: {collapsible: true, collapsed: false}},
  ],
  fields: [
    // ── Title ────────────────────────────────────────────────────────────────
    color('title', 'headlineColor', 'Color', 'e.g. #FFFFFF'),
    defineField({
      name: 'headlineFontSize',
      title: 'Font size',
      type: 'number',
      fieldset: 'title',
      description: 'In pixels. Defaults to a responsive 40–84px.',
    }),

    // ── Text ─────────────────────────────────────────────────────────────────
    color('text', 'textColor', 'Color', 'e.g. rgba(255,255,255,0.9)'),

    // ── Button ───────────────────────────────────────────────────────────────
    color('button', 'ctaBackground', 'Background', 'Defaults to dark forest green. e.g. #02423F'),
    color('button', 'ctaTextColor', 'Text color', 'e.g. #FFFFFF'),
    color('button', 'ctaHoverBackground', 'Hover background', 'e.g. #022E2C'),
    color('button', 'ctaHoverTextColor', 'Hover text color', 'e.g. #FFFFFF'),

    // ── Overlay ──────────────────────────────────────────────────────────────
    ...overlayFields({fieldset: 'overlay'}),

    // ── Behaviour ────────────────────────────────────────────────────────────
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'boolean',
      fieldset: 'behaviour',
      initialValue: true,
      description:
        'Advances slides on its own. Pauses while the visitor hovers, swipes or tabs into the slider, and is skipped entirely for visitors who prefer reduced motion.',
    }),
    defineField({
      name: 'autoplayInterval',
      title: 'Seconds per slide',
      type: 'number',
      fieldset: 'behaviour',
      initialValue: 6,
      validation: (rule) => rule.min(2).max(30),
      hidden: ({parent}: {parent?: {autoplay?: boolean}}) => parent?.autoplay === false,
    }),
    defineField({
      name: 'showArrows',
      title: 'Show arrows',
      type: 'boolean',
      fieldset: 'behaviour',
      initialValue: true,
      description: 'Arrows are always hidden on phones, where the slider is swipeable.',
    }),
    defineField({
      name: 'showDots',
      title: 'Show dots',
      type: 'boolean',
      fieldset: 'behaviour',
      initialValue: true,
    }),

    // ── Layout & spacing ─────────────────────────────────────────────────────
    defineField({
      name: 'alignment',
      title: 'Content alignment',
      description: 'Positions the content block within the slide.',
      type: 'string',
      fieldset: 'layout',
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
      name: 'textAlignment',
      title: 'Text alignment',
      description:
        'Aligns text within the content block. Defaults to Content Alignment if not set.',
      type: 'string',
      fieldset: 'layout',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'minHeight',
      title: 'Slide height',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Leave empty to hold a 16:9 shape, capped to the viewport.',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~168px so the content clears the navigation.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~112px, leaving room for the dots.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),

    // ── Slides ───────────────────────────────────────────────────────────────
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array',
      fieldset: 'slides',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'slide',
          title: 'Slide',
          fields: [
            defineField({
              name: 'backgroundImage',
              title: 'Background Image',
              type: 'image',
              options: {hotspot: true},
              validation: (rule) => rule.required(),
              fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
            }),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
            defineField({
              name: 'cta',
              title: 'CTA',
              type: 'object',
              fields: ctaFields('link'),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'text', media: 'backgroundImage'},
          },
        }),
      ],
    }),
  ],
  preview: {
    // Only the array is selected: adding a nested path under the same field makes
    // Sanity hand back a narrowed object instead of the array, so the count breaks.
    select: {slides: 'slides'},
    prepare: ({slides}) => {
      const list = Array.isArray(slides) ? slides : []
      const first = list[0]
      return {
        title: first?.title || 'Image slider',
        subtitle: `${list.length} slide${list.length === 1 ? '' : 's'}`,
        media: first?.backgroundImage,
      }
    },
  },
})
