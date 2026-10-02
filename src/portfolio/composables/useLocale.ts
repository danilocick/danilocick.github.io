import { useI18n } from 'vue-i18n'
import type { Locale } from '../content/types'
import { SUPPORTED_LOCALES } from '../i18n'

export const SUPPORTED: readonly Locale[] = SUPPORTED_LOCALES

/** Page URL of a locale: '/', '/ca/', '/en/'. */
export function hrefFor(l: Locale): string {
  return l === 'es' ? '/' : `/${l}/`
}

/**
 * The page locale. The URL decides (§9): it is the locale the i18n instance was
 * created with (= `<html lang>` of the prerendered page), identical in SSR and client.
 * Call inside setup().
 */
export function useLocale(): { locale: Locale; SUPPORTED: readonly Locale[]; hrefFor: (l: Locale) => string } {
  const { locale } = useI18n({ useScope: 'global' })
  return { locale: locale.value as Locale, SUPPORTED, hrefFor }
}
