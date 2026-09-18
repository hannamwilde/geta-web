import {ICON_ART} from './iconArt'

type Props = {name: string; size?: number}

/** Renders one icon from the mirrored artwork. Unknown names fall back to a circle. */
export function IconPreview({name, size = 24}: Props) {
  const art = ICON_ART[name]
  const inner = art?.inner ?? '<circle cx="12" cy="12" r="9" />'
  const filled = art?.filled ?? false

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      // Artwork is authored in this repo, never user input.
      dangerouslySetInnerHTML={{__html: inner}}
    />
  )
}
