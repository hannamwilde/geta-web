import sv from './sv'

const locales = { sv } as const

export type Locale = keyof typeof locales
export type Translations = typeof sv

export function getT(locale: Locale = 'sv'): Translations {
  return locales[locale] ?? locales.sv
}

/** Replace {placeholders} in a translated string. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  )
}
