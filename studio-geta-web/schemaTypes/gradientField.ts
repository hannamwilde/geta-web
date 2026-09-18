import {defineField} from 'sanity'
import type {FieldPlacement} from './fieldPlacement'

type GradientFieldOptions = FieldPlacement & {
  name?: string
  title?: string
  description?: string
}

/** Defaults to the block background gradient; pass options to reuse it elsewhere. */
export const gradientField = (options: GradientFieldOptions = {}) =>
  defineField({
    name: options.name ?? 'backgroundGradient',
    title: options.title ?? 'Background Gradient',
    type: 'object',
    group: options.group,
    fieldset: options.fieldset,
    description:
      options.description ?? 'Overrides the solid background color when both colors are set.',
    fields: [
      defineField({
        name: 'type',
        title: 'Type',
        type: 'string',
        options: {
          list: [
            {title: 'Linear', value: 'linear'},
            {title: 'Radial', value: 'radial'},
          ],
          layout: 'radio',
        },
        initialValue: 'linear',
      }),
      defineField({name: 'from', title: 'From', type: 'string', description: 'e.g. #0B0D2A'}),
      defineField({name: 'to', title: 'To', type: 'string', description: 'e.g. #02423F'}),
      defineField({
        name: 'angle',
        title: 'Angle (°)',
        type: 'number',
        initialValue: 135,
        description: '0 = top→bottom · 90 = left→right · 135 = diagonal',
        hidden: ({parent}: {parent?: {type?: string}}) => parent?.type === 'radial',
      }),
      defineField({
        name: 'start',
        title: 'Start (%)',
        type: 'number',
        description:
          'Where the "From" color stops being solid — 50 with a 180° angle keeps the top half flat and fades over the bottom half. Leave empty for an even fade.',
        validation: (Rule) => Rule.min(0).max(100),
        hidden: ({parent}: {parent?: {type?: string}}) => parent?.type === 'radial',
      }),
      defineField({
        name: 'position',
        title: 'Position',
        type: 'string',
        initialValue: 'center',
        description: 'e.g. center · top left · 50% 20%',
        hidden: ({parent}: {parent?: {type?: string}}) => parent?.type !== 'radial',
      }),
    ],
  })
