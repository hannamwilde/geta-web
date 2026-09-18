/**
 * Icon artwork mirrored from the site's `components/ui/icon` so the Studio can
 * preview what an editor is picking. Generated from that file — when an icon is
 * added or redrawn there, regenerate rather than hand-editing.
 *
 * `inner` is the SVG body on a 24x24 viewBox; `filled` picks fill vs stroke.
 */
export type IconArt = {filled: boolean; inner: string}

export const ICON_ART: Record<string, IconArt> = {
  'arrow-right': {filled: false, inner: '<path d="M5 12h14M13 6l6 6-6 6" />'},
  'arrow-up-right': {filled: false, inner: '<path d="M7 17 17 7M9 7h8v8" />'},
  'arrow-down': {filled: false, inner: '<path d="M12 5v14M6 13l6 6 6-6" />'},
  'chevron-down': {filled: false, inner: '<path d="m6 9 6 6 6-6" />'},
  'chevron-left': {filled: false, inner: '<path d="m15 6-6 6 6 6" />'},
  'chevron-right': {filled: false, inner: '<path d="m9 6 6 6-6 6" />'},
  'plus': {filled: false, inner: '<path d="M12 5v14M5 12h14" />'},
  'minus': {filled: false, inner: '<path d="M5 12h14" />'},
  'check': {filled: false, inner: '<path d="m5 12 5 5L20 7" />'},
  'sparkle': {filled: false, inner: '<path d="M12 3v6M12 15v6M3 12h6M15 12h6M6.3 6.3l3 3M14.7 14.7l3 3M6.3 17.7l3-3M14.7 9.3l3-3" />'},
  'cart': {filled: false, inner: '<path d="M3 4h2l2.5 12h11l2-8H7" /><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />'},
  'box': {filled: false, inner: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9zM12 12l9-4.5M12 12v9M12 12 3 7.5" />'},
  'layers': {filled: false, inner: '<path d="M12 3 2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 18l10 5 10-5" />'},
  'plug': {filled: false, inner: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8zM12 18v4" />'},
  'code': {filled: false, inner: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" />'},
  'shield': {filled: false, inner: '<path d="M12 3 4 6v6c0 4.5 3.2 8.6 8 9 4.8-.4 8-4.5 8-9V6l-8-3z" /><path d="m9 12 2 2 4-4" />'},
  'cms': {filled: false, inner: '<rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 14h4M7 17h7" />'},
  'database': {filled: false, inner: '<ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6" />'},
  'orders': {filled: false, inner: '<path d="M9 3h6l1 3h4v15H4V6h4l1-3z" /><path d="M9 12h6M9 16h6" />'},
  'lifebuoy': {filled: false, inner: '<circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="m4.9 4.9 4.2 4.2M14.9 14.9l4.2 4.2M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2" />'},
  'rocket': {filled: false, inner: '<path d="M5 19s-2-7 7-14c4-3 7-3 7-3s0 3-3 7c-7 9-14 7-14 7l3 3z" /><path d="m9 15-4 4M14 10l2 2" />'},
  'mail': {filled: false, inner: '<rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />'},
  'calendar': {filled: false, inner: '<rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" />'},
  'play': {filled: true, inner: '<path d="M7 4v16l13-8L7 4z" />'},
  'menu': {filled: false, inner: '<path d="M4 7h16M4 12h16M4 17h16" />'},
  'close': {filled: false, inner: '<path d="M6 6l12 12M18 6 6 18" />'},
  'globe': {filled: false, inner: '<circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 4 6.7 4 9s-1.5 6-4 9c-2.5-3-4-6.7-4-9s1.5-6 4-9z" />'},
  'linkedin': {filled: true, inner: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4V9z"/>'},
  'shop': {filled: false, inner: '<path d="M3 8 5 4h14l2 4M3 8v12h18V8M3 8h18M8 12h8" />'},
  'spark': {filled: true, inner: '<path d="M12 1.5l2.2 6.4 6.8.5-5.2 4.4 1.7 6.7L12 16l-5.5 3.5 1.7-6.7L3 8.4l6.8-.5L12 1.5z"/>'},
  'star': {filled: true, inner: '<path d="M12 2 14.5 9 22 9.3l-6 4.7L18.2 22 12 17.8 5.8 22 8 14l-6-4.7L9.5 9z"/>'},
  'lightning': {filled: true, inner: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>'},
  'leaf': {filled: false, inner: '<path d="M20 4S10 4 6 8s-4 12-4 12 8 0 12-4 4-12 6-12z" /><path d="M2 22 14 10" />'},
  'eye': {filled: false, inner: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" />'},
  'circle-dot': {filled: false, inner: '<circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" fill="currentColor" />'},
  'sliders': {filled: false, inner: '<path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h7M15 18h5" /><circle cx="16" cy="6" r="2" /><circle cx="8" cy="12" r="2" /><circle cx="13" cy="18" r="2" />'},
  'user': {filled: false, inner: '<circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />'},
  'key': {filled: false, inner: '<circle cx="8" cy="8" r="4.5" /><path d="m11.2 11.2 8.3 8.3M16 16l2.5-2.5M14 18l2-2" />'},
  'bell': {filled: false, inner: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" />'},
  'link': {filled: false, inner: '<path d="M9 14a4 4 0 0 0 6 .5l2.5-2.5a4 4 0 0 0-5.7-5.7l-1.2 1.2" /><path d="M15 10a4 4 0 0 0-6-.5L6.5 12a4 4 0 0 0 5.7 5.7l1.2-1.2" />'},
  'heart': {filled: false, inner: '<path d="M12 20s-7-4.5-9.3-9C1.2 8.3 2.5 5 6 5c2 0 3.2 1.2 4 2.4C10.8 6.2 12 5 14 5c3.5 0 4.8 3.3 3.3 6-2.3 4.5-9.3 9-9.3 9z" />'},
  'search': {filled: false, inner: '<circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />'},
  'list': {filled: false, inner: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />'},
}
