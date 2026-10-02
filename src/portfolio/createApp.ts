import { createApp, createSSRApp, type App } from 'vue'
import PortfolioPage from './PortfolioPage.vue'
import type { Locale } from './content/types'
import { createPortfolioI18n, type PortfolioI18n } from './i18n'

export interface CreateOptions {
  /** true → createSSRApp (server render, or client hydration of prerendered HTML) */
  ssr: boolean
  locale: Locale
}

/** Shared by entry-server.ts (render) and main.ts (hydrate / dev mount). */
export function createPortfolioApp({ ssr, locale }: CreateOptions): { app: App; i18n: PortfolioI18n } {
  const app = ssr ? createSSRApp(PortfolioPage) : createApp(PortfolioPage)
  const i18n = createPortfolioI18n(locale)
  app.use(i18n)
  return { app, i18n }
}
