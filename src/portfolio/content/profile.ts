// Page content: only ids, i18n keys, dates, URLs and proper-noun tech names.
// All copy lives in i18n/locales/*.json.
import type {
  CaseStudy,
  Chore,
  Experience,
  Guide,
  Links,
  Problem,
  ProblemId,
  QuickFact,
  StackGroup,
  Testimonial,
} from './types'

/** Hero card chores (§6.2). `compact` ones also show below 768px. */
export const chores: Chore[] = [
  { id: 'pedidos', textKey: 'chores.items.pedidos.text', noteKey: 'chores.items.pedidos.note', tilt: -0.8, compact: true },
  { id: 'informe', textKey: 'chores.items.informe.text', noteKey: 'chores.items.informe.note', tilt: 0.6, compact: true },
  { id: 'version', textKey: 'chores.items.version.text', noteKey: 'chores.items.version.note', tilt: -0.5, compact: false },
  { id: 'copiar', textKey: 'chores.items.copiar.text', noteKey: 'chores.items.copiar.note', tilt: 0.7, compact: false },
]

/** Picker rows (§6.3), in display order. This order is also the order of the selection. */
export const PROBLEM_IDS: readonly ProblemId[] = ['copiar-datos', 'informe', 'pedidos', 'conectar', 'renovar', 'excel']

export const problems: Problem[] = PROBLEM_IDS.map((id) => ({
  id,
  painKey: `problems.${id}.pain`,
  answerKey: `problems.${id}.answer`,
  techKey: `problems.${id}.tech`,
  shortKey: `problems.${id}.short`,
  messageKey: `problems.${id}.message`,
  // caseUrl: TODO(Dani) — only real case pages; no link while undefined
}))

/** "Un caso real" (§6.4), sourced from public/cv.pdf */
export const caseStudy: CaseStudy = {
  id: 'unex',
  titleKey: 'about.case.title',
  bodyKey: 'about.case.body',
  noteKey: 'about.case.note',
  points: [
    { termKey: 'about.case.points.apps.term', valueKey: 'about.case.points.apps.value' },
    { termKey: 'about.case.points.connections.term', valueKey: 'about.case.points.connections.value' },
    { termKey: 'about.case.points.data.term', valueKey: 'about.case.points.data.value' },
  ],
  source: 'public/cv.pdf',
}

/** Trayectoria (§6.4). Rows with confirmed:false are never rendered. */
export const experience: Experience[] = [
  {
    id: 'unex',
    company: 'Unex Aparellaje Eléctrico S.L.',
    roleKey: 'experience.unex.role',
    sectorKey: 'experience.unex.sector',
    start: '2021-09',
    end: 'present',
    confirmed: true,
  },
  {
    id: 'avp',
    company: 'AVP Sistemas Informáticos',
    roleKey: 'experience.avp.role',
    start: '2021-01',
    end: '2021-05',
    confirmed: true,
  },
  {
    // TODO(Dani): add role, sector and real dates, put it on the CV, then set confirmed: true.
    id: 'oropelius',
    company: 'Oropelius',
    start: '2020-01',
    end: '2020-12',
    confirmed: false,
  },
]

/** Ficha rápida (§6.4) — a <dl>; terms in label style */
export const quickFacts: QuickFact[] = (
  ['role', 'experience', 'base', 'mode', 'langs', 'education', 'interest'] as const
).map((id) => ({ id, termKey: `about.facts.${id}.term`, valueKey: `about.facts.${id}.value` }))

/** Para perfiles técnicos (§6.4) */
export const stack: StackGroup[] = [
  {
    id: 'front',
    labelKey: 'stack.groups.front',
    items: ['Vue 3', 'Vite', 'TypeScript', 'Module Federation (micro-frontends)', 'Tailwind CSS', 'CSS3'],
  },
  {
    id: 'back',
    labelKey: 'stack.groups.back',
    items: ['ASP.NET Core 10', 'C#', 'Entity Framework Core', { key: 'stack.items.layeredApis' }],
  },
  {
    id: 'data',
    labelKey: 'stack.groups.data',
    items: ['SQL Server', 'PostgreSQL', { key: 'stack.items.dataMigration' }, 'Power BI', 'Tableau'],
  },
  {
    id: 'cloud',
    labelKey: 'stack.groups.cloud',
    items: ['Azure (Key Vault)', 'Git', 'CI/CD'],
  },
]

const GUIDES_BASE = 'https://github.com/danilocick/danilocick.github.io/blob/main/guides/'

/** Guías que he escrito — all three are written in Spanish */
export const guides: Guide[] = [
  { id: 'efcore', titleKey: 'guides.items.efcore', url: `${GUIDES_BASE}ef-core-migrations.md`, lang: 'es' },
  { id: 'aspnet', titleKey: 'guides.items.aspnet', url: `${GUIDES_BASE}aspnet-core-api.md`, lang: 'es' },
  { id: 'keyvault', titleKey: 'guides.items.keyvault', url: `${GUIDES_BASE}azure-key-vault.md`, lang: 'es' },
]

/** TODO(Dani, priority 1): paste 2 real LinkedIn recommendations verbatim, with url. */
export const testimonials: Testimonial[] = []

export const links: Links = {
  email: 'danidevhdez@gmail.com',
  linkedin: 'https://www.linkedin.com/in/daniel-hernandez-martin/',
  github: 'https://github.com/danilocick',
  cv: '/cv.pdf',
}

/** Download filename for the CV button */
export const CV_DOWNLOAD_NAME = 'CV-Daniel-Hernandez.pdf'
