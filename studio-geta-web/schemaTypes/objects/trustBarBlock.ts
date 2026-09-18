import {defineField, defineType, defineArrayMember} from 'sanity'
import {ImagesIcon} from '@sanity/icons'
import {gradientField} from '../gradientField'
import {backgroundImageField} from '../backgroundMediaFields'
import {borderField} from '../borderField'

/**
 * Only the background settings are numerous enough to fold away; the logo list
 * is the whole point of the block, so it stays in view.
 */
export const trustBarBlock = defineType({
  name: 'trustBarBlock',
  title: 'Trust Bar',
  type: 'object',
  icon: ImagesIcon,
  fieldsets: [
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // ── Background ───────────────────────────────────────────────────────────
    defineField({
      name: 'backgroundColor',
      title: 'Color',
      type: 'string',
      fieldset: 'background',
      description: 'CSS color value. Defaults to dark forest green.',
    }),
    gradientField({fieldset: 'background', title: 'Gradient'}),
    backgroundImageField({fieldset: 'background', title: 'Image'}),

    // Already renders as its own collapsible object, so it stays top level
    // rather than nesting a fold inside a fold.
    borderField(),

    defineField({
      name: 'logos',
      title: 'Client Logos',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'clientLogo'}]})],
    }),
  ],
  preview: {
    prepare: () => ({title: 'Trust Bar', subtitle: 'Trust Bar'}),
  },
})
