import {defineField, defineType} from 'sanity'
import {BlockquoteIcon} from '@sanity/icons'
import {ICON_LIST} from '../iconList'

const ctaFields = (defaultAction: string) => [
  defineField({name: 'label', title: 'Label', type: 'string'}),
  defineField({
    name: 'action',
    title: 'Action',
    type: 'string',
    options: {
      list: [
        {title: 'Open contact form', value: 'openContact'},
        {title: 'Open booking', value: 'openBook'},
        {title: 'Link to URL', value: 'link'},
      ],
      layout: 'radio',
    },
    initialValue: defaultAction,
  }),
  defineField({
    name: 'href',
    title: 'URL',
    type: 'string',
    hidden: ({parent}: {parent?: {action?: string}}) => parent?.action !== 'link',
  }),
]

const color = (name: string, title: string, description?: string) =>
  defineField({name, title, type: 'string', group: 'content', description})

const size = (name: string, title: string) =>
  defineField({name, title, type: 'number', group: 'content', description: 'In pixels.'})

export const bannerBlock = defineType({
  name: 'bannerBlock',
  title: 'Banner',
  type: 'object',
  icon: BlockquoteIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'visual', title: 'Visual'},
    {name: 'layout', title: 'Layout'},
  ],
  fields: [
    // ── Block background ─────────────────────────────────────────────────────
    color('backgroundColor', 'Background Color', 'Defaults to dark forest green. e.g. #02423F'),

    // ── Eyebrow ──────────────────────────────────────────────────────────────
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'content'}),
    size('eyebrowFontSize', 'Eyebrow Font Size'),
    color('textColor', 'Eyebrow & Intro Color', 'e.g. #F4EFE5'),

    // ── Headline ─────────────────────────────────────────────────────────────
    defineField({name: 'headline', title: 'Headline', type: 'string', group: 'content'}),
    size('headlineFontSize', 'Headline Font Size'),
    color('headlineColor', 'Headline Color', 'e.g. #F4EFE5'),

    // ── Tagline ──────────────────────────────────────────────────────────────
    defineField({name: 'tagline', title: 'Tagline', type: 'string', group: 'content'}),
    size('taglineFontSize', 'Tagline Font Size'),
    color('taglineColor', 'Tagline Color', 'Also sets the eyebrow accent dot. e.g. #A8DADB'),

    // ── Intro ────────────────────────────────────────────────────────────────
    defineField({name: 'intro', title: 'Intro Text', type: 'text', rows: 3, group: 'content'}),
    size('introFontSize', 'Intro Font Size'),

    // ── Primary CTA ──────────────────────────────────────────────────────────
    defineField({
      name: 'ctaPrimary',
      title: 'Primary CTA',
      type: 'object',
      group: 'content',
      fields: ctaFields('openContact'),
    }),
    color('ctaPrimaryBackground', 'Primary Button — Background', 'e.g. #F4EFE5'),
    color('ctaPrimaryTextColor', 'Primary Button — Text', 'e.g. #02423F'),
    color('ctaPrimaryHoverBackground', 'Primary Button — Hover Background', 'e.g. #E8E2D8'),
    color('ctaPrimaryHoverTextColor', 'Primary Button — Hover Text', 'e.g. #02423F'),

    // ── Secondary CTA ────────────────────────────────────────────────────────
    defineField({
      name: 'ctaSecondary',
      title: 'Secondary CTA',
      type: 'object',
      group: 'content',
      fields: ctaFields('openBook'),
    }),
    color('ctaSecondaryColor', 'Secondary Button — Text & Border', 'e.g. #F4EFE5'),
    color('ctaSecondaryHoverBackground', 'Secondary Button — Hover Background', 'e.g. #F4EFE5'),
    color('ctaSecondaryHoverColor', 'Secondary Button — Hover Text & Border', 'e.g. #02423F'),

    // ── Visual ───────────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      group: 'visual',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
    defineField({
      name: 'visualType',
      title: 'Right Side Visual',
      type: 'string',
      group: 'visual',
      options: {
        list: [
          {title: 'Icon + Stat', value: 'icon'},
          {title: 'Photo', value: 'photo'},
          {title: 'None', value: 'none'},
        ],
        layout: 'radio',
      },
      initialValue: 'icon',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      group: 'visual',
      options: {hotspot: true},
      hidden: ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'photo',
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      group: 'visual',
      hidden: ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'icon',
      options: {list: ICON_LIST},
    }),
    defineField({
      name: 'statValue',
      title: 'Stat Value',
      type: 'string',
      group: 'visual',
      description: 'e.g. "40%"',
      hidden: ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'icon',
    }),
    defineField({
      name: 'statLabel',
      title: 'Stat Label',
      type: 'string',
      group: 'visual',
      description: 'e.g. "Faster load times"',
      hidden: ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'icon',
    }),

    // ── Layout ───────────────────────────────────────────────────────────────
    defineField({
      name: 'contentLayout',
      title: 'Content Layout',
      type: 'string',
      group: 'layout',
      options: {
        list: [
          {title: 'Stacked', value: 'stacked'},
          {title: 'Inline — text left, buttons right', value: 'inline'},
        ],
        layout: 'radio',
      },
      initialValue: 'stacked',
    }),
    defineField({
      name: 'alignment',
      title: 'Content Alignment',
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
      description: 'In pixels. Defaults to ~128px.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      group: 'layout',
      description: 'In pixels. Defaults to ~80px.',
    }),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Banner'}),
  },
})
