// vue-i18n v10, Composition API only, messages precompiled by @intlify/unplugin-vue-i18n.
// All three locale files are bundled statically (ADAPTATIONS G); each instance only
// registers the messages of its own page locale.
import { createI18n } from 'vue-i18n'
import type { Locale } from '../content/types'
import es from './locales/es.json'
import ca from './locales/ca.json'
import en from './locales/en.json'

export const SUPPORTED_LOCALES: readonly Locale[] = ['es', 'ca', 'en']

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export type MessageSchema = typeof es

const messages: Record<Locale, MessageSchema> = { es, ca, en }

export function createPortfolioI18n(locale: Locale) {
  return createI18n({
    legacy: false,
    globalInjection: true,
    locale,
    fallbackLocale: false,
    missingWarn: import.meta.env.DEV,
    fallbackWarn: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: { [locale]: messages[locale] } as Record<string, any>,
  })
}

export type PortfolioI18n = ReturnType<typeof createPortfolioI18n>
