import { cache } from 'react'
import { client } from '@/sanity/client'
import { translationsQuery } from '@/sanity/queries'
import { getT, type Translations } from './index'

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }

function merge(base: Translations, override: DeepPartial<Translations> | null): Translations {
  if (!override) return base
  return {
    general: { ...base.general, ...override.general },
    modal: { ...base.modal, ...override.modal },
  }
}

export const fetchTranslations = cache(async (): Promise<Translations> => {
  const data = await client.fetch<DeepPartial<Translations> | null>(translationsQuery)
  return merge(getT(), data)
})
