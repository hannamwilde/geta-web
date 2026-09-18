import {defineField, defineType} from 'sanity'
import {BlockquoteIcon} from '@sanity/icons'
import {gradientField} from '../gradientField'
import {backgroundImageField} from '../backgroundMediaFields'
import {borderField} from '../borderField'

/**
 * A customer-case strip: intro copy on the left, a portrait in the middle and
 * the pull quote on the right.
 *
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 */
export const quoteBlock = defineType({
  name: 'quoteBlock',
  title: 'Quote Block',
  type: 'object',
  icon: BlockquoteIcon,
  fieldsets: [
    {name: 'intro', title: 'Intro', options: {collapsible: true, collapsed: false}},
    {name: 'image', title: 'Image', options: {collapsible: true, collapsed: false}},
    {name: 'quote', title: 'Quote', options: {collapsible: true, collapsed: false}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // ── Intro ────────────────────────────────────────────────────────────────
    defineField({name: 'title', title: 'Title', type: 'string', fieldset: 'intro'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 3, fieldset: 'intro'}),
    // Set on the block, so it cascades to every piece of text in it.
    defineField({
      name: 'textColor',
      title: 'Text color',
      type: 'string',
      fieldset: 'intro',
      description: 'Applies to all text in the block. e.g. #F4EFE5',
    }),

    // ── Image ────────────────────────────────────────────────────────────────
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      fieldset: 'image',
      options: {hotspot: true},
      description: 'Leave empty to drop the image column.',
      fields: [defineField({name: 'alt', title: 'Alt Text', type: 'string'})],
    }),
    defineField({
      name: 'borderRadius',
      title: 'Corner radius',
      type: 'number',
      fieldset: 'image',
      description: 'In pixels. Defaults to 14px.',
    }),

    // ── Quote ────────────────────────────────────────────────────────────────
    defineField({
      name: 'quote',
      title: 'Text',
      type: 'text',
      rows: 4,
      fieldset: 'quote',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'author', title: 'Author', type: 'string', fieldset: 'quote'}),
    defineField({name: 'role', title: 'Role', type: 'string', fieldset: 'quote'}),

    // ── Background ───────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundColor',
      title: 'Color',
      type: 'string',
      fieldset: 'background',
      description: 'e.g. #02423F',
    }),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    backgroundImageField({fieldset: 'background', title: 'Image'}),

    // ── Layout & spacing ─────────────────────────────────────────────────────
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),
  ],
  preview: {
    select: {title: 'title', quote: 'quote', author: 'author', media: 'image'},
    prepare: ({title, quote, author, media}) => ({
      title: title || (quote ? `"${quote.slice(0, 60)}${quote.length > 60 ? '…' : ''}"` : '—'),
      subtitle: author || 'Quote Block',
      media,
    }),
  },
})
