import {defineField} from 'sanity'
import {linkTypeField, pageRefField} from './linkFields'

/**
 * The CTA option set shared by blocks that render a primary/secondary button.
 * `defaultAction` seeds new CTAs; the link fields only surface once the action
 * is set to "link", so editors aren't shown URL inputs for modal buttons.
 */
export const ctaFields = (defaultAction: string) => [
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
  {
    ...linkTypeField,
    hidden: ({parent}: {parent?: {action?: string}}) => parent?.action !== 'link',
  },
  {
    ...pageRefField,
    hidden: ({parent}: {parent?: {action?: string; linkType?: string}}) =>
      parent?.action !== 'link' || parent?.linkType !== 'internal',
  },
  defineField({
    name: 'href',
    title: 'URL',
    type: 'string',
    hidden: ({parent}: {parent?: {action?: string; linkType?: string}}) =>
      parent?.action !== 'link' || parent?.linkType === 'internal',
  }),
]
