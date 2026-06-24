import sv from './sv'

const locales = { sv } as const

export type Locale = keyof typeof locales
export type Translations = typeof sv

export function getT(locale: Locale = 'sv'): Translations {
  return locales[locale] ?? locales.sv
}
