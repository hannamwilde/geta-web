import {defineField} from 'sanity'
import {videoAssetSource} from '../assetSources/videoAssetSource'
import {gradientField} from './gradientField'
import type {FieldPlacement} from './fieldPlacement'

export const backgroundVideoField = (options: FieldPlacement & {title?: string} = {}) =>
  defineField({
    name: 'backgroundVideo',
    title: options.title ?? 'Background Video',
    type: 'file',
    group: options.group,
    fieldset: options.fieldset,
    description:
      'MP4 or WebM, played muted and looping behind the content. The Background Image is used as the poster frame and is shown instead on phones and for visitors who prefer reduced motion — set both. Keep the file under ~10 MB.',
    options: {accept: 'video/mp4,video/webm', sources: [videoAssetSource]},
  })

export const backgroundImageField = (options: FieldPlacement & {title?: string} = {}) =>
  defineField({
    name: 'backgroundImage',
    title: options.title ?? 'Background Image',
    type: 'image',
    group: options.group,
    fieldset: options.fieldset,
    options: {hotspot: true},
    description:
      'Fills the block, cropped to cover around the hotspot. Pair it with a Background Gradient using transparent stops to keep text readable.',
    fields: [defineField({name: 'alt', type: 'string', title: 'Alt text'})],
  })

type OverlayParent = {
  overlayColor?: string
  overlayGradient?: {from?: string; to?: string}
}

const hasOverlay = (parent?: OverlayParent) =>
  Boolean(parent?.overlayColor || (parent?.overlayGradient?.from && parent?.overlayGradient?.to))

export const overlayFields = (options: FieldPlacement & {gradient?: boolean} = {}) => [
  defineField({
    name: 'overlayColor',
    title: 'Overlay Color',
    type: 'string',
    group: options.group,
    fieldset: options.fieldset,
    description:
      'Tint drawn over the background image or video to keep text readable. Leave blank for no overlay. e.g. #02423F',
  }),
  ...(options.gradient
    ? [
        gradientField({
          group: options.group,
          fieldset: options.fieldset,
          name: 'overlayGradient',
          title: 'Overlay Gradient',
          description:
            'Overrides the solid overlay color when both colors are set. Use rgba() or transparent stops to fade the scrim across the block — e.g. from transparent to rgba(0,0,0,0.75).',
        }),
      ]
    : []),
  defineField({
    name: 'overlayOpacity',
    title: 'Overlay Opacity (%)',
    type: 'number',
    group: options.group,
    fieldset: options.fieldset,
    initialValue: 45,
    description: '0 = invisible · 100 = solid. Applies to whichever overlay is set.',
    validation: (Rule) => Rule.min(0).max(100),
    hidden: ({parent}: {parent?: OverlayParent}) => !hasOverlay(parent),
  }),
]
