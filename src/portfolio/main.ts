// Client entry (§9 Boot). Always hydrates the prerendered page; in dev (empty
// #app) it mounts from scratch.
import './styles/portfolio.css'
import { createPortfolioApp } from './createApp'
import { isLocale } from './i18n'
import type { Locale } from './content/types'

const requested = import.meta.env.DEV
  ? (location.pathname.match(/^\/(ca|en)\//)?.[1] ?? 'es')
  : document.documentElement.lang
const locale: Locale = isLocale(requested) ? requested : 'es'

const prerendered = !!document.getElementById('app')!.firstElementChild
const { app, i18n } = createPortfolioApp({ ssr: prerendered, locale })

if (import.meta.env.DEV) {
  // the dev template is not prerendered: mirror what the prerender writes
  document.documentElement.lang = locale
  document.title = i18n.global.t('meta.title')
}

app.mount('#app')
