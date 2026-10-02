<script setup lang="ts">
// §6.4 #experiencia: "Quién está detrás". Photo, bio, one real CV-sourced case,
// testimonials, the Trayectoria ledger, Ficha rápida and "Para perfiles técnicos"
// (stack, guides, GitHub, CV).
//
// §11 graceful degradation (nothing renders a heading or leaves a gap when empty):
//   - testimonials: the whole block only when there is at least one real quote;
//   - experience: rows with confirmed:false never render (PortfolioPage already
//     filters; filtered again here so Oropelius can never leak);
//   - guides: a row only when it has a url; the heading only when one row remains;
//   - role / sector lines only when their keys exist.
//
// Layout: DOM order = the mobile order (photo → bio → caso → testimonials → ficha →
// trayectoria → técnicos → CV). From 768 the grid places blocks explicitly:
// row 1 photo | bio + case; row 2 Trayectoria | Ficha; row 3 técnicos (full width).
// Nothing here animates, so reduced motion needs nothing extra.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowIcon } from './icons'
import { CV_DOWNLOAD_NAME, links } from '../content/profile'
import { useLocale } from '../composables/useLocale'
import { formatMonth, isoMonth } from '../utils/dates'
import type {
  CaseStudy,
  Experience,
  Guide,
  QuickFact,
  StackGroup,
  StackItem,
  Testimonial,
} from '../content/types'

const props = defineProps<{
  caseStudy: CaseStudy
  experience: Experience[]
  facts: QuickFact[]
  stack: StackGroup[]
  guides: Guide[]
  testimonials: Testimonial[]
}>()

const { t } = useI18n()
const { locale } = useLocale()

interface JobRow {
  id: Experience['id']
  company: string
  roleKey?: string
  sectorKey?: string
  startIso: string
  startLabel: string
  /** null = still there ("actualidad"): no machine-readable end date */
  endIso: string | null
  endLabel: string
}

// Dates come from Intl (UTC) in the page locale. Node's ICU and the browser's may
// still spell a short month differently, so each <time> carries
// data-allow-mismatch="text": the client value wins without a hydration warning.
const jobs = computed<JobRow[]>(() =>
  props.experience
    .filter((e) => e.confirmed)
    .map((e) => ({
      id: e.id,
      company: e.company,
      roleKey: e.roleKey,
      sectorKey: e.sectorKey,
      startIso: isoMonth(e.start),
      startLabel: formatMonth(locale, e.start),
      endIso: e.end === 'present' ? null : isoMonth(e.end),
      endLabel: e.end === 'present' ? t('about.timeline.present') : formatMonth(locale, e.end),
    })),
)

const linkedGuides = computed(() => props.guides.filter((g): g is Guide & { url: string } => !!g.url))

/** string = proper noun, rendered as is; { key } = translatable phrase */
function stackLabel(item: StackItem): string {
  return typeof item === 'string' ? item : t(item.key)
}
function stackId(item: StackItem): string {
  return typeof item === 'string' ? item : item.key
}

/** "Role · Company" (each optional) for a testimonial caption */
function quoteSource(q: Testimonial): string {
  return [q.role, q.company].filter(Boolean).join(' · ')
}
</script>

<template>
  <section id="experiencia" class="about-section section" aria-labelledby="about-h2">
    <div class="wrap">
      <p class="eyebrow">{{ t('about.eyebrow') }}</p>
      <h2 id="about-h2" class="text-h2" tabindex="-1">{{ t('about.h2') }}</h2>

      <div class="about-grid page-grid section-body">
        <div class="about-photo">
          <picture>
            <source
              type="image/avif"
              srcset="/img/dani-360.avif 360w, /img/dani-720.avif 720w"
              sizes="(min-width: 1024px) 360px, 240px"
            />
            <source
              type="image/webp"
              srcset="/img/dani-360.webp 360w, /img/dani-720.webp 720w"
              sizes="(min-width: 1024px) 360px, 240px"
            />
            <img
              src="/img/dani-720.jpg"
              width="360"
              height="450"
              :alt="t('about.photoAlt')"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

        <div class="about-main">
          <div class="about-bio">
            <p class="text-lead measure">{{ t('about.bio1') }}</p>
            <p class="text-lead measure">{{ t('about.bio2') }}</p>
          </div>

          <div class="about-case">
            <h3 class="text-h3">{{ t(caseStudy.titleKey) }}</h3>
            <p class="about-case-body measure">{{ t(caseStudy.bodyKey) }}</p>
            <dl class="about-points">
              <div v-for="p in caseStudy.points" :key="p.termKey" class="about-point">
                <dt>{{ t(p.termKey) }}</dt>
                <dd>{{ t(p.valueKey) }}</dd>
              </div>
            </dl>
            <p class="about-case-note text-small text-muted measure">{{ t(caseStudy.noteKey) }}</p>
          </div>

          <div v-if="testimonials.length > 0" class="about-quotes">
            <h3 class="text-h3">{{ t('about.testimonials') }}</h3>
            <figure v-for="(q, i) in testimonials" :key="`${q.author}-${i}`" class="about-quote">
              <blockquote :lang="q.lang" class="about-quote-text measure">
                <p>{{ q.text }}</p>
              </blockquote>
              <figcaption class="about-quote-by">
                <cite>
                  <a v-if="q.url" class="link" :href="q.url" target="_blank" rel="noopener"
                    >{{ q.author }}<span class="sr-only">{{ ' ' + t('a11y.newTab') }}</span></a
                  ><template v-else>{{ q.author }}</template
                  ><span v-if="quoteSource(q)" class="about-quote-source" :lang="q.lang"> · {{ quoteSource(q) }}</span>
                </cite>
              </figcaption>
            </figure>
          </div>
        </div>

        <div v-if="facts.length > 0" class="about-facts">
          <h3 class="text-h3">{{ t('about.facts.title') }}</h3>
          <dl class="about-facts-list">
            <div v-for="f in facts" :key="f.id" class="about-fact">
              <dt class="label text-muted">{{ t(f.termKey) }}</dt>
              <i18n-t v-if="f.id === 'langs'" :keypath="f.valueKey" tag="dd" scope="global">
                <template #ca>
                  <span lang="ca">{{ t('lang.inline.ca') }}</span>
                </template>
                <template #en>
                  <span lang="en">{{ t('lang.inline.en') }}</span>
                </template>
              </i18n-t>
              <i18n-t v-else-if="f.id === 'education'" :keypath="f.valueKey" tag="dd" scope="global">
                <template #dam>
                  <abbr :title="t('about.facts.education.damTitle')">{{ t('about.facts.education.dam') }}</abbr>
                </template>
                <template #asir>
                  <abbr :title="t('about.facts.education.asirTitle')">{{ t('about.facts.education.asir') }}</abbr>
                </template>
              </i18n-t>
              <dd v-else>{{ t(f.valueKey) }}</dd>
            </div>
          </dl>
        </div>

        <div v-if="jobs.length > 0" class="about-timeline">
          <h3 class="text-h3">{{ t('about.timeline.title') }}</h3>
          <ol class="about-jobs" role="list">
            <li v-for="j in jobs" :key="j.id" class="about-job">
              <p class="about-job-company">{{ j.company }}</p>
              <p v-if="j.roleKey" class="about-job-role">{{ t(j.roleKey) }}</p>
              <p v-if="j.sectorKey" class="about-job-sector">{{ t(j.sectorKey) }}</p>
              <p class="about-job-dates">
                <time :datetime="j.startIso" data-allow-mismatch="text">{{ j.startLabel }}</time>
                –
                <time v-if="j.endIso" :datetime="j.endIso" data-allow-mismatch="text">{{ j.endLabel }}</time>
                <span v-else>{{ j.endLabel }}</span>
              </p>
            </li>
          </ol>
        </div>

        <div class="about-tech">
          <h3 class="text-h3">{{ t('stack.title') }}</h3>
          <p class="about-tech-intro text-muted measure">{{ t('stack.intro') }}</p>

          <dl v-if="stack.length > 0" class="about-stack">
            <div v-for="g in stack" :key="g.id" class="about-stack-group">
              <dt class="label text-muted">{{ t(g.labelKey) }}</dt>
              <dd>
                <ul class="about-stack-items" role="list">
                  <li v-for="(item, k) in g.items" :key="stackId(item)"
                    >{{ stackLabel(item)
                    }}<span v-if="k < g.items.length - 1" class="about-sep" aria-hidden="true">&nbsp;· </span></li
                  >
                </ul>
              </dd>
            </div>
          </dl>

          <div class="about-tech-foot">
            <div v-if="linkedGuides.length > 0" class="about-guides">
              <h4 class="label text-muted">{{ t('guides.title') }}</h4>
              <ul class="about-guides-list" role="list">
                <li v-for="g in linkedGuides" :key="g.id">
                  <a class="link" :href="g.url" :hreflang="g.lang" target="_blank" rel="noopener"
                    >{{ t(g.titleKey) }}<span class="sr-only">{{ ' ' + t('a11y.newTab') }}</span></a
                  >
                </li>
              </ul>
            </div>

            <div class="about-actions">
              <a class="link about-github" :href="links.github" target="_blank" rel="noopener"
                >{{ t('about.github') }}<ArrowIcon /><span class="sr-only">{{ ' ' + t('a11y.newTab') }}</span></a
              >
              <a class="btn-secondary about-cv" :href="links.cv" :download="CV_DOWNLOAD_NAME" type="application/pdf">{{
                t('about.cv')
              }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* ---- Grid placement ----------------------------------------------------
   Below 768: one column in DOM order. 768–1023 (8 cols): photo 1–3 | main 4–8,
   then Trayectoria 1–4 | Ficha 5–8. ≥1024 (12 cols, §6.4): photo 1–4 | main 6–12,
   then Trayectoria 1–6 | Ficha 7–12, then técnicos full width. */
.about-grid {
  row-gap: 48px;
}
.about-grid > * {
  grid-column: 1 / -1;
  min-width: 0;
}
@media (width >= 48rem) {
  .about-grid {
    row-gap: 64px;
  }
  .about-photo {
    grid-column: 1 / span 3;
    grid-row: 1;
  }
  .about-main {
    grid-column: 4 / span 5;
    grid-row: 1;
  }
  .about-timeline {
    grid-column: 1 / span 4;
    grid-row: 2;
  }
  .about-facts {
    grid-column: 5 / span 4;
    grid-row: 2;
  }
  .about-tech {
    grid-column: 1 / -1;
    grid-row: 3;
  }
}
@media (width >= 64rem) {
  .about-photo {
    grid-column: 1 / span 4;
  }
  .about-main {
    grid-column: 6 / span 7;
  }
  .about-timeline {
    grid-column: 1 / span 6;
  }
  .about-facts {
    grid-column: 7 / span 6;
  }
}

/* ---- Photo: 4:5, 6px radius, no overlay. Size reserved by width/height +
   aspect-ratio, so the lazy load never shifts layout. */
.about-photo picture {
  display: block;
}
.about-photo img {
  display: block;
  width: 240px;
  max-width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: var(--radius);
  background: var(--surface-2);
}
@media (width >= 64rem) {
  .about-photo img {
    width: 100%;
    max-width: 360px;
  }
}

/* ---- Main column: bio → case → testimonials ------------------------------ */
.about-main > * + * {
  margin-top: 48px;
}
.about-bio > p + p {
  margin-top: 16px;
}
.about-case-body {
  margin-top: 16px;
}
.about-case-note {
  margin-top: 16px;
}

/* Shared ledger rows (case points, ficha, trayectoria): 1px --line dividers.
   Each list is an inline-size container, so rows switch to two columns when
   their own column is wide enough, whatever the viewport. */
.about-points,
.about-facts-list,
.about-jobs {
  container-type: inline-size;
  border-bottom: 1px solid var(--line);
}
.about-point,
.about-fact,
.about-job {
  border-top: 1px solid var(--line);
}

/* Case points */
.about-points {
  margin-top: 24px;
}
.about-point {
  padding-block: 12px;
}
.about-point dt {
  font-weight: 700;
}
.about-point dd {
  margin-top: 2px;
}
@container (width >= 34rem) {
  .about-point {
    display: grid;
    grid-template-columns: minmax(0, 13rem) minmax(0, 1fr);
    column-gap: 24px;
    align-items: baseline;
  }
  .about-point dd {
    margin-top: 0;
  }
}

/* Testimonials (only when real ones exist) */
.about-quote {
  margin-top: 24px;
}
.about-quote-text {
  padding-inline-start: 16px;
  border-inline-start: 2px solid var(--line-strong);
  font-size: var(--text-lead);
  line-height: 1.5;
}
.about-quote-text p {
  white-space: pre-line;
}
.about-quote-by {
  margin-top: 8px;
  padding-inline-start: 18px;
  font-size: var(--text-small);
  line-height: 1.4;
  font-weight: 700;
}
.about-quote-source {
  font-weight: 400;
  color: var(--muted);
}

/* ---- Ficha rápida: terms in label style ----------------------------------- */
.about-facts-list {
  margin-top: 16px;
}
.about-fact {
  padding-block: 12px;
}
.about-fact dd {
  margin-top: 4px;
}
.about-fact abbr[title] {
  cursor: help;
  text-underline-offset: 0.18em;
}
@container (width >= 28rem) {
  .about-fact {
    display: grid;
    grid-template-columns: minmax(0, 11rem) minmax(0, 1fr);
    column-gap: 16px;
    align-items: baseline;
  }
  .about-fact dd {
    margin-top: 0;
  }
}

/* ---- Trayectoria ledger: company (700), role, sector, dates --------------- */
.about-jobs {
  margin-top: 16px;
}
.about-job {
  padding-block: 16px;
}
.about-job-company {
  font-weight: 700;
}
.about-job-sector,
.about-job-dates {
  font-size: var(--text-small);
  line-height: 1.4;
  color: var(--muted);
}
.about-job-dates {
  margin-top: 4px;
  white-space: nowrap;
}
/* wide column: dates move to the top-right of the row */
@container (width >= 30rem) {
  .about-job {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    column-gap: 24px;
    align-items: baseline;
  }
  .about-job > * {
    grid-column: 1 / -1;
  }
  .about-job-company {
    grid-column: 1;
    grid-row: 1;
  }
  .about-job-dates {
    grid-column: 2;
    grid-row: 1;
    margin-top: 0;
    text-align: end;
  }
}

/* ---- Para perfiles técnicos ----------------------------------------------- */
.about-tech-intro {
  margin-top: 8px;
}
/* 1 col → 2 (≥640) → 4 (≥1024); gaps match .page-grid so groups sit on its columns */
.about-stack {
  display: grid;
  gap: 24px 16px;
  margin-top: 32px;
}
@media (width >= 40rem) {
  .about-stack {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (width >= 48rem) {
  .about-stack {
    column-gap: 24px;
  }
}
@media (width >= 64rem) {
  .about-stack {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.about-stack-group {
  padding-top: 12px;
  border-top: 1px solid var(--line);
}
.about-stack-group dd {
  margin-top: 8px;
}
.about-stack-items li {
  display: inline;
}

/* Links row: guides, then GitHub + CV. Mobile: stacked, CV full width last. */
.about-tech-foot {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: 48px;
}
@media (width >= 64rem) {
  .about-tech-foot {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 48px;
  }
}
.about-guides-list {
  display: flex;
  flex-direction: column;
  margin-top: 4px;
}
@media (width >= 40rem) {
  .about-guides-list {
    flex-flow: row wrap;
    column-gap: 24px;
  }
}
.about-guides-list a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.about-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 16px;
}
@media (width >= 48rem) {
  .about-actions {
    flex: none;
    flex-direction: row;
    align-items: center;
    gap: 32px;
  }
}
.about-github {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  font-weight: 700;
}
@media (width >= 48rem) {
  .about-github {
    align-self: auto;
  }
}
</style>
