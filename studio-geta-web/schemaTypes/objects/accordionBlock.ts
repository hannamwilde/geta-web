import {defineField, defineType, defineArrayMember} from 'sanity'
import {ChevronDownIcon} from '@sanity/icons'
import {gradientField} from '../gradientField'
import {backgroundImageField} from '../backgroundMediaFields'
import {ctaFields} from '../ctaFields'
import {borderField} from '../borderField'

const color = (fieldset: string, name: string, title: string, description?: string) =>
  defineField({name, title, type: 'string', fieldset, description})

const size = (fieldset: string, name: string, title: string) =>
  defineField({name, title, type: 'number', fieldset, description: 'In pixels.'})

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 *
 * The question, answer, number and toggle settings style every item at once —
 * per-item content lives in the Items array.
 */
export const accordionBlock = defineType({
  name: 'accordionBlock',
  title: 'Accordion Block',
  type: 'object',
  icon: ChevronDownIcon,
  fieldsets: [
    {name: 'eyebrow', title: 'Eyebrow', options: {collapsible: true, collapsed: true}},
    {name: 'headline', title: 'Headline', options: {collapsible: true, collapsed: false}},
    {name: 'intro', title: 'Intro', options: {collapsible: true, collapsed: true}},
    {name: 'question', title: 'Question', options: {collapsible: true, collapsed: true}},
    {name: 'answer', title: 'Answer', options: {collapsible: true, collapsed: true}},
    {name: 'number', title: 'Number badge', options: {collapsible: true, collapsed: true}},
    {name: 'toggle', title: 'Toggle icon', options: {collapsible: true, collapsed: true}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
    {name: 'items', title: 'Items', options: {collapsible: true, collapsed: false}},
  ],
  fields: [
    // ── Eyebrow ──────────────────────────────────────────────────────────────
    defineField({name: 'eyebrow', type: 'string', title: 'Text', fieldset: 'eyebrow'}),
    color('eyebrow', 'eyebrowColor', 'Color'),
    size('eyebrow', 'eyebrowFontSize', 'Font size'),

    // ── Headline ─────────────────────────────────────────────────────────────
    defineField({name: 'headline', type: 'string', title: 'Block title', fieldset: 'headline'}),
    color('headline', 'headlineColor', 'Color', 'e.g. #ffffff'),
    size('headline', 'headlineFontSize', 'Font size'),

    // ── Intro ────────────────────────────────────────────────────────────────
    defineField({name: 'intro', type: 'text', title: 'Text', rows: 2, fieldset: 'intro'}),
    color('intro', 'introColor', 'Color', 'e.g. rgba(255,255,255,0.65)'),
    size('intro', 'introFontSize', 'Font size'),

    // ── Question ─────────────────────────────────────────────────────────────
    color('question', 'questionColor', 'Color', 'e.g. #ffffff'),
    size('question', 'questionFontSize', 'Font size'),

    // ── Answer ───────────────────────────────────────────────────────────────
    color('answer', 'answerColor', 'Color', 'e.g. rgba(255,255,255,0.72)'),
    size('answer', 'answerFontSize', 'Font size'),
    color('answer', 'linkColor', 'Link color', 'The optional link below each answer. e.g. #E0B49A'),

    // ── Number badge ─────────────────────────────────────────────────────────
    defineField({
      name: 'showNumbers',
      title: 'Show numbers',
      type: 'boolean',
      fieldset: 'number',
      initialValue: true,
      description: 'Numbered badge in front of each question.',
    }),
    color('number', 'numberBackgroundColor', 'Background color', 'e.g. #A32A22'),
    color('number', 'numberColor', 'Text color', 'e.g. #ffffff'),

    // ── Toggle icon ──────────────────────────────────────────────────────────
    defineField({
      name: 'toggleIcon',
      title: 'Style',
      type: 'string',
      fieldset: 'toggle',
      options: {
        list: [
          {title: 'Plus / minus', value: 'plusMinus'},
          {title: 'Chevron', value: 'chevron'},
        ],
        layout: 'radio',
      },
      initialValue: 'plusMinus',
    }),
    color('toggle', 'toggleColor', 'Color', 'The plus/minus or chevron. e.g. #ffffff'),

    // ── Background ───────────────────────────────────────────────────────────
    color('background', 'backgroundColor', 'Color', 'CSS color for the block (e.g. #26212B)'),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    backgroundImageField({fieldset: 'background', title: 'Image'}),

    // ── Layout & spacing ─────────────────────────────────────────────────────
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~128px.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to ~128px.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),

    // ── Items ────────────────────────────────────────────────────────────────
    defineField({
      name: 'accordionItems',
      title: 'Items',
      type: 'array',
      fieldset: 'items',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              title: 'Question',
              validation: (r) => r.required(),
            }),
            defineField({name: 'answer', type: 'text', title: 'Answer', rows: 4}),
            defineField({
              name: 'cta',
              title: 'Link',
              type: 'object',
              description: 'Optional link shown below the answer.',
              options: {collapsible: true, collapsed: true},
              fields: ctaFields('link'),
            }),
          ],
          preview: {select: {title: 'question', subtitle: 'answer'}},
        }),
      ],
    }),
    color('items', 'itemBackgroundColor', 'Background — closed', 'e.g. transparent'),
    color('items', 'itemOpenBackgroundColor', 'Background — open', 'e.g. #332C38'),
    color('items', 'itemBorderColor', 'Border — closed', 'e.g. rgba(255,255,255,0.14)'),
    color('items', 'itemOpenBorderColor', 'Border — open', 'e.g. #E0B49A'),
    defineField({
      name: 'borderRadius',
      title: 'Corner radius',
      type: 'number',
      fieldset: 'items',
      description: 'In pixels. Defaults to ~22px.',
    }),
    defineField({
      name: 'openFirstItem',
      title: 'Open first item by default',
      type: 'boolean',
      fieldset: 'items',
      initialValue: true,
    }),
    defineField({
      name: 'allowMultipleOpen',
      title: 'Allow several items open at once',
      type: 'boolean',
      fieldset: 'items',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'eyebrow', subtitle: 'headline'},
    prepare: ({title, subtitle}: {title?: string; subtitle?: string}) => ({
      title: subtitle || title || '—',
      subtitle: 'Accordion Block',
    }),
  },
})
