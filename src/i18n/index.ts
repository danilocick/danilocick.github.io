import { createI18n } from 'vue-i18n'
import es from './locales/es'
import en from './locales/en'
import ca from './locales/ca'

export type LocaleCode = 'es' | 'en' | 'ca'

export const SUPPORTED_LOCALES: { code: LocaleCode; label: string; short: string }[] = [
    { code: 'es', label: 'Español', short: 'ES' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'ca', label: 'Català', short: 'CA' },
]

function getInitialLocale(): LocaleCode {
    try {
        const stored = localStorage.getItem('locale') as LocaleCode | null
        if (stored && SUPPORTED_LOCALES.some((l) => l.code === stored)) return stored
        const nav = navigator.language.slice(0, 2)
        if (nav === 'en') return 'en'
        if (nav === 'ca') return 'ca'
    } catch (e) {
        /* ignore */
    }
    return 'es'
}

const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: getInitialLocale(),
    fallbackLocale: 'es',
    messages: { es, en, ca },
})

// Keep <html lang> in sync on first load
document.documentElement.setAttribute('lang', i18n.global.locale.value)

export function setLocale(code: LocaleCode) {
    i18n.global.locale.value = code
    try {
        localStorage.setItem('locale', code)
    } catch (e) {
        /* ignore */
    }
    document.documentElement.setAttribute('lang', code)
}

export default i18n
