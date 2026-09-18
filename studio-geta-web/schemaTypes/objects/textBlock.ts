import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'
import {gradientField} from '../gradientField'
import {borderField} from '../borderField'

/**
 * Fields are grouped by the thing they configure rather than by
 * content-vs-style, so each fold holds everything affecting one element.
 * Fieldsets are presentation only — the stored shape is unchanged.
 */
export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  icon: DocumentTextIcon,
  fieldsets: [
    {name: 'text', title: 'Text', options: {collapsible: true, collapsed: false}},
    {name: 'sideImage', title: 'Side image', options: {collapsible: true, collapsed: true}},
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
    {name: 'layout', title: 'Layout & spacing', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // ── Text ─────────────────────────────────────────────────────────────────
    defineField({name: 'headline', title: 'Headline', type: 'string', fieldset: 'text'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 4, fieldset: 'text'}),
    defineField({
      name: 'alignment',
      title: 'Alignment',
      type: 'string',
      fieldset: 'text',
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
      name: 'textColor',
      title: 'Color',
      type: 'string',
      fieldset: 'text',
      description: 'e.g. #FFFFFF',
    }),

    // ── Side image ───────────────────────────────────────────────────────────
    defineField({
      name: 'sideImage',
      title: 'Image',
      type: 'image',
      fieldset: 'sideImage',
      description: 'Placed beside the text. Overrides text alignment when set.',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),
    defineField({
      name: 'sideImagePosition',
      title: 'Position',
      type: 'string',
      fieldset: 'sideImage',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'right',
      hidden: ({parent}) => !parent?.sideImage,
    }),
    defineField({
      name: 'borderRadius',
      title: 'Corner radius',
      type: 'number',
      fieldset: 'sideImage',
      description: 'In pixels. Defaults to 16px.',
      hidden: ({parent}) => !parent?.sideImage,
    }),

    // ── Background ───────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundColor',
      title: 'Color',
      type: 'string',
      fieldset: 'background',
      description: 'e.g. #02423F or rgba(0,0,0,0.5)',
    }),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    defineField({
      name: 'backgroundImage',
      title: 'Image',
      type: 'image',
      fieldset: 'background',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
    }),

    // ── Layout & spacing ─────────────────────────────────────────────────────
    defineField({
      name: 'contentLayout',
      title: 'Content width',
      type: 'string',
      fieldset: 'layout',
      options: {
        list: [
          {title: 'Contained (default)', value: 'contained'},
          {title: 'Full width', value: 'full'},
        ],
        layout: 'radio',
      },
      initialValue: 'contained',
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
      description: 'In pixels. Defaults to 80px.',
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Block padding bottom',
      type: 'number',
      fieldset: 'layout',
      description: 'In pixels. Defaults to 80px.',
    }),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),
  ],
  preview: {
    select: {title: 'headline'},
    prepare: ({title}: {title?: string}) => ({title: title || '—', subtitle: 'Text Block'}),
  },
})
