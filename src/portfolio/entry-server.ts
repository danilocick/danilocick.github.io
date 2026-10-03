// SSR entry, used by scripts/prerender.mjs after `vite build --ssr src/portfolio/entry-server.ts --outDir .ssr`.
import { renderToString } from 'vue/server-renderer'
import { createPortfolioApp } from './createApp'
import { siteUrl } from './config/site'
import { links } from './content/profile'
import type { HeadData, Locale } from './content/types'
import { SUPPORTED_LOCALES } from './i18n'

const OG_LOCALE = { es: 'es_ES', ca: 'ca_ES', en: 'en_GB' } as const

const pageUrl = (l: Locale) => (l === 'es' ? siteUrl : `${siteUrl}${l}/`)

const escAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** §6.8 Person. Names are proper nouns (identical in every locale file). */
function personJsonLd(t: (key: string) => string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: t('brand.fullName'), // "Daniel Hernández Martín"
    alternateName: t('brand.name'), // "Dani Hernández"
    jobTitle: 'Full Stack Developer',
    url: siteUrl,
    image: `${siteUrl}img/dani-720.jpg`,
    email: `mailto:${links.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Santa Coloma de Gramenet',
      addressRegion: 'Barcelona',
      addressCountry: 'ES',
    },
    knowsLanguage: ['es', 'ca', 'en'],
    knowsAbout: [
      'Vue 3',
      'TypeScript',
      'Module Federation',
      'ASP.NET Core',
      'C#',
      'Entity Framework Core',
      'SQL Server',
      'PostgreSQL',
      'Azure',
      'Power BI',
      'Tableau',
    ],
    sameAs: [links.linkedin, links.github],
  }
}

/**
 * Head tags in §6.8 order, from <title> to the JSON-LD (no twitter:* tags — ADAPTATIONS E).
 * The template already holds charset, viewport, theme-color, color-scheme and the
 * no-flash script; the prerender inserts this at <!--head-->, removes the template's
 * dev <title>, and adds the inlined <style> right before the JSON-LD (after the
 * Archivo preload, the only font preload — ADAPTATIONS F).
 */
export function headToHtml(head: HeadData): string {
  const tags: string[] = [
    `<title>${escText(head.title)}</title>`,
    `<meta name="description" content="${escAttr(head.description)}">`,
    `<link rel="canonical" href="${escAttr(head.canonical)}">`,
    ...head.alternates.map(
      (a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${escAttr(a.href)}">`,
    ),
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${escAttr(head.canonical)}">`,
    `<meta property="og:title" content="${escAttr(head.ogTitle)}">`,
    `<meta property="og:description" content="${escAttr(head.description)}">`,
    `<meta property="og:image" content="${escAttr(head.ogImage)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${escAttr(head.ogImageAlt)}">`,
    `<meta property="og:locale" content="${head.ogLocale}">`,
    ...head.ogLocaleAlternates.map((l) => `<meta property="og:locale:alternate" content="${l}">`),
    `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`,
    `<link rel="icon" href="/favicon-32.png" sizes="32x32">`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`,
    `<link rel="preload" href="/fonts/archivo.woff2" as="font" type="font/woff2" crossorigin>`,
    `<script type="application/ld+json">${JSON.stringify(head.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ]
  return tags.join('\n    ')
}

export async function render(
  locale: Locale,
): Promise<{ html: string; head: HeadData; headHtml: string }> {
  const { app, i18n } = createPortfolioApp({ ssr: true, locale })
  const html = await renderToString(app)
  const t = i18n.global.t

  const head: HeadData = {
    lang: locale,
    title: t('meta.title'),
    description: t('meta.description'),
    canonical: pageUrl(locale),
    ogTitle: t('meta.ogTitle'),
    ogLocale: OG_LOCALE[locale],
    ogLocaleAlternates: SUPPORTED_LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    ogImage: `${siteUrl}img/og-${locale}.png`,
    ogImageAlt: t('meta.ogImageAlt'),
    alternates: [
      ...SUPPORTED_LOCALES.map((l) => ({ hreflang: l, href: pageUrl(l) })),
      { hreflang: 'x-default' as const, href: pageUrl('es') },
    ],
    jsonLd: personJsonLd((key) => t(key)),
  }

  return { html, head, headHtml: headToHtml(head) }
}

export { SUPPORTED_LOCALES }
