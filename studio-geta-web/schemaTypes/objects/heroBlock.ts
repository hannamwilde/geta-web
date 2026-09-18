import {defineField, defineType} from 'sanity'
import {SparklesIcon} from '@sanity/icons'
import {gradientField} from '../gradientField'
import {ctaFields} from '../ctaFields'
import {backgroundVideoField, overlayFields} from '../backgroundMediaFields'
import {borderField} from '../borderField'

/**
 * Fields are grouped by the thing they configure, not by content-vs-style, so
 * everything that affects the eyebrow sits in one place instead of being split
 * across tabs. Fieldsets are presentation only — the stored shape is unchanged.
 */
export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero',
  type: 'object',
  icon: SparklesIcon,
  fieldsets: [
    {name: 'eyebrow', title: 'Eyebrow', options: {collapsible: true, collapsed: true}},
    {name: 'headline', title: 'Headline', options: {collapsible: true, collapsed: false}},
    {name: 'subheadline', title: 'Subheadline', options: {collapsible: true, collapsed: true}},
    {name: 'mark', title: 'Mark image', options: {collapsible: true, collapsed: true}},
    {name: 'ctas', title: 'Call to action', options: {collapsible: true, collapsed: true}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // ── Eyebrow ──────────────────────────────────────────────────────────────
    defineField({name: 'eyebrow', title: 'Text', type: 'string', fieldset: 'eyebrow'}),
    defineField({
      name: 'eyebrowStyle',
      title: 'Style',
      type: 'string',
      fieldset: 'eyebrow',
      options: {
        list: [
          {title: 'Badge — pill with frosted background', value: 'badge'},
          {title: 'Tag — dot + uppercase text', value: 'tag'},
        ],
        layout: 'radio',
      },
      initialValue: 'badge',
    }),
    defineField({
      name: 'eyebrowColor',
      title: 'Color',
      type: 'string',
      fieldset: 'eyebrow',
      description: 'e.g. rgba(255,255,255,0.8)',
    }),
    defineField({
      name: 'eyebrowFontSize',
      title: 'Font size (px)',
      type: 'number',
      fieldset: 'eyebrow',
    }),

    // ── Headline ─────────────────────────────────────────────────────────────
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      fieldset: 'headline',
      description: 'The non-gradient part of the title.',
    }),
    defineField({
      name: 'tagline',
      title: 'Gradient part',
      type: 'string',
      fieldset: 'headline',
      description:
        'Appended to the headline with gradient colour. Leave blank for a plain headline.',
    }),
    defineField({
      name: 'headlineFontSize',
      title: 'Font size (px)',
      type: 'number',
      fieldset: 'headline',
      description: 'Applies to both the headline and the gradient part.',
    }),
    defineField({
      name: 'headlineColor',
      title: 'Color',
      type: 'string',
      fieldset: 'headline',
      description: 'e.g. #fff',
    }),
    defineField({
      name: 'taglineGradientFrom',
      title: 'Gradient — from',
      type: 'string',
      fieldset: 'headline',
      description: 'Start colour of the gradient text. e.g. #C4BCFB',
    }),
    defineField({
      name: 'taglineGradientTo',
      title: 'Gradient — to',
      type: 'string',
      fieldset: 'headline',
      description: 'End colour of the gradient text. e.g. #C77DF0',
    }),
    defineField({
      name: 'taglineGradientAngle',
      title: 'Gradient — angle (°)',
      type: 'number',
      fieldset: 'headline',
      initialValue: 105,
      description: '0 = top→bottom · 90 = left→right · 105 = diagonal',
    }),

    // ── Subheadline ──────────────────────────────────────────────────────────
    defineField({
      name: 'subheadline',
      title: 'Text',
      type: 'text',
      rows: 2,
      fieldset: 'subheadline',
    }),
    defineField({
      name: 'subheadlineFontSize',
      title: 'Font size (px)',
      type: 'number',
      fieldset: 'subheadline',
    }),
    defineField({
      name: 'textColor',
      title: 'Color',
      type: 'string',
      fieldset: 'subheadline',
      description: 'Subheadline and body text. e.g. rgba(255,255,255,0.78)',
    }),

    // ── Mark image ───────────────────────────────────────────────────────────
    defineField({
      name: 'markImage',
      title: 'Image',
      type: 'image',
      fieldset: 'mark',
      description: 'Optional logo/symbol displayed above the headline.',
      options: {hotspot: false},
    }),
    defineField({
      name: 'markWidth',
      title: 'Width (px)',
      type: 'number',
      fieldset: 'mark',
      description: 'Leave empty for the default responsive width (52–80px).',
      hidden: ({parent}) => !parent?.markImage,
      validation: (rule) => rule.min(16).max(600),
    }),

    // ── Call to action ───────────────────────────────────────────────────────
    defineField({
      name: 'ctaPrimary',
      title: 'Primary CTA',
      type: 'object',
      fieldset: 'ctas',
      fields: ctaFields('openBook'),
    }),
    defineField({
      name: 'ctaSecondary',
      title: 'Secondary CTA',
      type: 'object',
      fieldset: 'ctas',
      fields: ctaFields('openContact'),
    }),

    // ── Background ───────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundColor',
      title: 'Color',
      type: 'string',
      fieldset: 'background',
      description: 'e.g. #02423F',
    }),
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
      name: 'alignment',
      title: 'Content Alignment',
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
      title: 'Text Alignment',
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
    defineField({name: 'paddingTop', title: 'Padding Top (px)', type: 'number', fieldset: 'layout'}),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom (px)',
      type: 'number',
      fieldset: 'layout',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),
  ],
  preview: {
    select: {title: 'headline', subtitle: 'tagline'},
    prepare: ({title, subtitle}: {title?: string; subtitle?: string}) => ({
      title: [title, subtitle].filter(Boolean).join(' ') || '—',
      subtitle: 'Hero',
    }),
  },
})
