import {defineField} from 'sanity'
import type {FieldPlacement} from './fieldPlacement'

/**
 * Top/bottom edge borders shared by every block. Width and color apply to both
 * edges; each edge is switched on independently.
 */
export const borderField = (options: FieldPlacement & {title?: string} = {}) =>
  defineField({
    name: 'border',
    title: options.title ?? 'Borders',
    type: 'object',
    group: options.group,
    fieldset: options.fieldset,
    options: {collapsible: true, collapsed: true},
    fields: [
      defineField({name: 'top', title: 'Top border', type: 'boolean', initialValue: false}),
      defineField({name: 'bottom', title: 'Bottom border', type: 'boolean', initialValue: false}),
      defineField({
        name: 'color',
        title: 'Border Color',
        type: 'string',
        description: 'e.g. #E0DBD3 · Defaults to a subtle line.',
      }),
      defineField({
        name: 'width',
        title: 'Border Width',
        type: 'number',
        description: 'In pixels. Defaults to 1.',
      }),
    ],
  })
