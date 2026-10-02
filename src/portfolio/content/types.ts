// Content data model (spec §10, adapted per ADAPTATIONS A/B/C/D).

export type Locale = 'es' | 'ca' | 'en'
export type YearMonth = `${number}-${'01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'}`
export type ChoreId = 'pedidos' | 'informe' | 'version' | 'copiar'
export type ProblemId = 'copiar-datos' | 'informe' | 'pedidos' | 'conectar' | 'renovar' | 'excel'

/** compact → also shown below md (the mobile card shows 2 chores) */
export interface Chore {
  id: ChoreId
  textKey: string
  noteKey: string
  tilt: number
  compact: boolean
}

export interface Problem {
  id: ProblemId
  painKey: string
  answerKey: string
  techKey: string
  shortKey: string
  messageKey: string
  /** TODO(Dani): real case pages only; the "Ver un caso real" link is hidden when undefined */
  caseUrl?: string
}

export interface CaseStudy {
  id: 'unex'
  titleKey: string
  bodyKey: string
  noteKey: string
  points: { termKey: string; valueKey: string }[]
  /** every claim traceable to the CV */
  source: 'public/cv.pdf'
}

export interface Experience {
  id: 'unex' | 'avp' | 'oropelius'
  /** proper noun, not translated */
  company: string
  /** undefined → no role line */
  roleKey?: string
  /** undefined → no sector line */
  sectorKey?: string
  start: YearMonth
  end: YearMonth | 'present'
  /** false → row not rendered anywhere (oropelius: false) */
  confirmed: boolean
}

export type QuickFactId = 'role' | 'experience' | 'base' | 'mode' | 'langs' | 'education' | 'interest'
export interface QuickFact {
  id: QuickFactId
  termKey: string
  valueKey: string
}

/** string = proper noun (rendered as is); { key } = translatable phrase (i18n key) */
export type StackItem = string | { key: string }
export interface StackGroup {
  id: 'front' | 'back' | 'data' | 'cloud'
  labelKey: string
  items: StackItem[]
}

/** row hidden when url is undefined; heading hidden when all are undefined */
export interface Guide {
  id: 'efcore' | 'aspnet' | 'keyvault'
  titleKey: string
  url?: string
  /** language of the guide itself → hreflang on the link */
  lang: Locale
}

/** real quotes only, original language, never machine-translated */
export interface Testimonial {
  text: string
  lang: Locale
  author: string
  role?: string
  company?: string
  url?: string
}

export interface Links {
  email: 'danidevhdez@gmail.com'
  linkedin: 'https://www.linkedin.com/in/daniel-hernandez-martin/'
  github: 'https://github.com/danilocick'
  cv: '/cv.pdf'
}

export type ContactMode = 'web3forms' | 'mailto'

/** config/site.ts (replaces the spec's decisions.json — ADAPTATIONS B) */
export interface SiteConfig {
  siteUrl: 'https://danilocick.github.io/'
  /** import.meta.env.VITE_WEB3FORMS_KEY ?? '' (optional; invalid → mailto mode) */
  web3formsKey: string
  contactMode: ContactMode
  /** true: availability line, "Qué pasa después", item "Hablar con Dani sobre tu proyecto" */
  clientWork: boolean
  /** E.164 digits (e.g. "34XXXXXXXXX") or false = no WhatsApp row */
  whatsapp: string | false
  /** rendered in the legal notice ONLY when non-empty */
  legal: { nif: string; address: string }
}

export interface ContactFields {
  name: string
  email: string
  company: string
  message: string
  botcheck: boolean
}
export type ContactStatus = 'idle' | 'invalid' | 'sending' | 'success' | 'error' | 'handoff'

export interface HeadData {
  lang: Locale
  title: string
  description: string
  canonical: string
  ogTitle: string
  ogLocale: 'es_ES' | 'ca_ES' | 'en_GB'
  ogLocaleAlternates: ('es_ES' | 'ca_ES' | 'en_GB')[]
  ogImage: string
  ogImageAlt: string
  alternates: { hreflang: Locale | 'x-default'; href: string }[]
  jsonLd: Record<string, unknown>
}

/** content/review.ts — report-only list of 🔶 keys (ADAPTATIONS A) */
export interface ReviewItem {
  /** i18n key or key pattern (e.g. "problems.*.answer") */
  key: string
  reason: string
}
