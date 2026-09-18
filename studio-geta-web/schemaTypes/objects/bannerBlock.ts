import {defineField, defineType} from 'sanity'
import {BlockquoteIcon} from '@sanity/icons'
import {iconPicker} from '../iconField'
import {gradientField} from '../gradientField'
import {ctaFields} from '../ctaFields'
import {backgroundVideoField, overlayFields} from '../backgroundMediaFields'
import {borderField} from '../borderField'

const color = (fieldset: string, name: string, title: string, description?: string) =>
  defineField({name, title, type: 'string', fieldset, description})

const size = (fieldset: string, name: string, title: string) =>
  defineField({name, title, type: 'number', fieldset, description: 'In pixels.'})

const isNotIcon = ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'icon'
const isNotPhoto = ({parent}: {parent?: {visualType?: string}}) => parent?.visualType !== 'photo'
const isNoVisual = ({parent}: {parent?: {visualType?: string}}) => parent?.visualType === 'none'

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 */
export const bannerBlock = defineType({
  name: 'bannerBlock',
  title: 'Banner',
  type: 'object',
  icon: BlockquoteIcon,
  fieldsets: [
    {name: 'eyebrow', title: 'Eyebrow', options: {collapsible: true, collapsed: true}},
    {name: 'headline', title: 'Headline', options: {collapsible: true, collapsed: false}},
    {name: 'tagline', title: 'Tagline', options: {collapsible: true, collapsed: true}},
    {name: 'intro', title: 'Intro', options: {collapsible: true, collapsed: true}},
    {name: 'primaryCta', title: 'Primary button', options: {collapsible: true, collapsed: true}},
    {name: 'secondaryCta', title: 'Secondary button', options: {collapsible: true, collapsed: true}},
    {name: 'visual', title: 'Side visual', options: {collapsible: true, collapsed: true}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // ── Eyebrow ──────────────────────────────────────────────────────────────
    defineField({name: 'eyebrow', title: 'Text', type: 'string', fieldset: 'eyebrow'}),
    size('eyebrow', 'eyebrowFontSize', 'Font size'),
    // Drives both the eyebrow and the intro, so it keeps an explicit title.
    color('eyebrow', 'textColor', 'Eyebrow & intro color', 'e.g. #F4EFE5'),

    // ── Headline ─────────────────────────────────────────────────────────────
    defineField({name: 'headline', title: 'Text', type: 'string', fieldset: 'headline'}),
    size('headline', 'headlineFontSize', 'Font size'),
    color('headline', 'headlineColor', 'Color', 'e.g. #F4EFE5'),

    // ── Tagline ──────────────────────────────────────────────────────────────
    defineField({name: 'tagline', title: 'Text', type: 'string', fieldset: 'tagline'}),
    size('tagline', 'taglineFontSize', 'Font size'),
    color(
      'tagline',
      'taglineColor',
      'Tagline & eyebrow dot color',
      'Also sets the eyebrow accent dot. e.g. #A8DADB',
    ),

    // ── Intro ────────────────────────────────────────────────────────────────
    defineField({name: 'intro', title: 'Text', type: 'text', rows: 3, fieldset: 'intro'}),
    size('intro', 'introFontSize', 'Font size'),

    // ── Primary button ───────────────────────────────────────────────────────
    defineField({
      name: 'ctaPrimary',
      title: 'Button',
      type: 'object',
      fieldset: 'primaryCta',
      fields: ctaFields('openContact'),
    }),
    color('primaryCta', 'ctaPrimaryBackground', 'Background', 'e.g. #F4EFE5'),
    color('primaryCta', 'ctaPrimaryTextColor', 'Text color', 'e.g. #02423F'),
    color('primaryCta', 'ctaPrimaryHoverBackground', 'Hover background', 'e.g. #E8E2D8'),
    color('primaryCta', 'ctaPrimaryHoverTextColor', 'Hover text color', 'e.g. #02423F'),

    // ── Secondary button ─────────────────────────────────────────────────────
    defineField({
      name: 'ctaSecondary',
      title: 'Button',
      type: 'object',
      fieldset: 'secondaryCta',
      fields: ctaFields('openBook'),
    }),
    color('secondaryCta', 'ctaSecondaryColor', 'Text & border color', 'e.g. #F4EFE5'),
    color('secondaryCta', 'ctaSecondaryHoverBackground', 'Hover background', 'e.g. #F4EFE5'),
    color('secondaryCta', 'ctaSecondaryHoverColor', 'Hover text & border color', 'e.g. #02423F'),

    // ── Side visual ──────────────────────────────────────────────────────────
    defineField({
      name: 'visualType',
      title: 'Type',
      type: 'string',
      fieldset: 'visual',
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
      name: 'visualPosition',
      title: 'Position',
      type: 'string',
      fieldset: 'visual',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'right',
      hidden: isNoVisual,
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      fieldset: 'visual',
      options: {hotspot: true},
      hidden: isNotPhoto,
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      fieldset: 'visual',
      hidden: isNotIcon,
      ...iconPicker,
    }),
    defineField({
      name: 'statValue',
      title: 'Stat value',
      type: 'string',
      fieldset: 'visual',
      description: 'e.g. "40%"',
      hidden: isNotIcon,
    }),
    defineField({
      name: 'statLabel',
      title: 'Stat label',
      type: 'string',
      fieldset: 'visual',
      description: 'e.g. "Faster load times"',
      hidden: isNotIcon,
    }),
    defineField({
      name: 'borderRadius',
      title: 'Panel corner radius',
      type: 'number',
      fieldset: 'visual',
      description: 'In pixels. Defaults to ~32px.',
    }),

    // ── Background ───────────────────────────────────────────────────────────
    color('background', 'backgroundColor', 'Color', 'Defaults to dark forest green. e.g. #02423F'),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    defineField({
      name: 'backgroundImage',
      title: 'Image',
      type: 'image',
      fieldset: 'background',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
    backgroundVideoField({fieldset: 'background', title: 'Video'}),
    ...overlayFields({gradient: true, fieldset: 'background'}),

    // ── Layout & spacing ─────────────────────────────────────────────────────
    defineField({
      name: 'contentLayout',
      title: 'Content layout',
      type: 'string',
      fieldset: 'layout',
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
      title: 'Content alignment',
      description: 'Positions the content within the block.',
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
      name: 'maxWidth',
      title: 'Max width',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Caps the content and centres it. Empty uses the default container width.',
    }),
    defineField({
      name: 'contentBackgroundColor',
      title: 'Content background color',
      type: 'string',
      fieldset: 'layout',
      description: 'Fills the area behind the content. e.g. rgba(0, 0, 0, 0.4)',
    }),
    defineField({
      name: 'contentBorderRadius',
      title: 'Content corner radius',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels.',
    }),
    defineField({
      name: 'contentPadding',
      title: 'Content padding',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Inset between the content background edge and the content.',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Block padding top',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~128px.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Block padding bottom',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~80px.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Banner'}),
  },
})
