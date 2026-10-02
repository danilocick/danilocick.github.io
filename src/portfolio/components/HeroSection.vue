<script setup lang="ts">
// §6.1 #inicio. DOM order = mobile visual order:
// byline → H1 (struck "a mano") → subline → CTA + note → ChoreCard → proof.
// Owns .hero[data-speed] / [data-user]: the §7A CSS timeline reads them,
// ChoreCard drives them. Registers the hero CTA for the StickyCta logic.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ChoreCard from './ChoreCard.vue'
import { ArrowIcon } from './icons'
import { chores } from '../content/profile'
import { useUiState } from '../composables/useUiState'

type HeroSpeed = 'normal' | 'fast' | 'instant'

const { t } = useI18n()
const ui = useUiState()
const { goToContact } = ui

const speed = ref<HeroSpeed>('normal')
const userTouched = ref(false)

const ctaEl = ref<HTMLAnchorElement | null>(null)
ui.track('heroCtaVisible', ctaEl)

// ---- H1 strike geometry ------------------------------------------------------
// The strike is drawn in a 200×12 design box stretched over "a mano"
// (preserveAspectRatio="none" + non-scaling-stroke). Chrome sizes pathLength
// dashes in user units but strokes non-scaling paths in screen pixels, so a
// stretched box draws about 2× too fast at 32px and stops short of the end
// once the box is wider than 200px (64px H1). After mount we re-express the
// same path in a box where 1 user unit = 1 CSS px: identical look, and an even
// 600ms draw in every engine. SSR keeps the spec's values (.no-js has a CSS
// fallback). Template: keep `}}<svg` touching, so the nowrap span ends at "mano".
const STRIKE_POINTS = [2, 7.2, 28, 4.6, 52, 8.8, 84, 6.4, 150, 4.2, 198, 6.8] as const

function strikePath(sx: number, sy: number): string {
  const p = STRIKE_POINTS.map((v, i) => Math.round(v * (i % 2 ? sy : sx) * 100) / 100)
  return `M${p[0]} ${p[1]}C${p[2]} ${p[3]} ${p[4]} ${p[5]} ${p[6]} ${p[7]}S${p[8]} ${p[9]} ${p[10]} ${p[11]}`
}

const strikeBox = ref('0 0 200 12')
const strikeD = ref(strikePath(1, 1)) // "M2 7.2C28 4.6 52 8.8 84 6.4S150 4.2 198 6.8"
const titleEl = ref<HTMLElement | null>(null)
const strikeSvg = ref<SVGSVGElement | null>(null)
let resizeObserver: ResizeObserver | undefined

function calibrateStrike(): void {
  const svg = strikeSvg.value
  if (!svg) return
  const { width, height } = svg.getBoundingClientRect()
  if (width < 1 || height < 1) return
  const w = Math.round(width * 100) / 100
  const h = Math.round(height * 100) / 100
  const box = `0 0 ${w} ${h}`
  if (box === strikeBox.value) return
  strikeBox.value = box
  strikeD.value = strikePath(w / 200, h / 12)
}

onMounted(() => {
  calibrateStrike()
  // the H1 and "a mano" change size with the font swap and the viewport
  void document.fonts?.ready.then(calibrateStrike)
  if (typeof ResizeObserver !== 'undefined' && titleEl.value) {
    resizeObserver = new ResizeObserver(calibrateStrike)
    resizeObserver.observe(titleEl.value)
  }
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <section
    id="inicio"
    class="hero"
    aria-labelledby="hero-title"
    :data-speed="speed"
    :data-user="userTouched ? '' : undefined"
  >
    <div class="wrap hero-grid">
      <div class="hero-byline">
        <picture class="hero-photo">
          <source type="image/avif" srcset="/img/dani-40.avif, /img/dani-80.avif 2x" />
          <source type="image/webp" srcset="/img/dani-40.webp, /img/dani-80.webp 2x" />
          <img
            src="/img/dani-40.jpg"
            srcset="/img/dani-40.jpg, /img/dani-80.jpg 2x"
            width="40"
            height="40"
            alt=""
            decoding="async"
          />
        </picture>
        <p class="hero-byline-text text-small">
          <span class="block">
            <strong class="text-ink">{{ t('hero.byline.name') }}</strong>
            <span class="text-muted"> · {{ t('hero.byline.place') }}</span>
          </span>
          <span class="block text-muted">{{ t('hero.byline.role') }}</span>
        </p>
      </div>

      <h1 id="hero-title" ref="titleEl" class="hero-title text-display">
        <i18n-t keypath="hero.h1" scope="global">
          <template #manual>
            <span class="h1-manual">{{ t('hero.h1Manual') }}<svg
                ref="strikeSvg"
                :viewBox="strikeBox"
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <path pathLength="1" :d="strikeD" />
              </svg></span>
          </template>
        </i18n-t>
      </h1>

      <p class="hero-sub text-lead">
        {{ t('hero.subLead') }} <span class="sub-examples max-md:hidden">{{ t('hero.subExamples') }}</span>
      </p>

      <div class="hero-cta">
        <a ref="ctaEl" href="#contacto" class="btn-primary hero-cta-btn" @click="goToContact">{{ t('hero.cta') }}<ArrowIcon /></a>
        <p class="hero-cta-note text-small text-muted">{{ t('hero.ctaNote') }}</p>
      </div>

      <ChoreCard class="hero-card" :chores="chores" @speed="speed = $event" @user="userTouched = true" />

      <ul class="hero-proof text-small text-muted" role="list">
        <li>{{ t('hero.proof.years') }}</li>
        <li>{{ t('hero.proof.apps') }}</li>
        <li>{{ t('hero.proof.solo') }}</li>
        <li>
          <i18n-t keypath="hero.proof.langs" scope="global">
            <template #ca><span lang="ca">{{ t('lang.inline.ca') }}</span></template>
            <template #en><span lang="en">{{ t('lang.inline.en') }}</span></template>
          </i18n-t>
        </li>
      </ul>
    </div>
  </section>
</template>

<style>
/* §6.1 hero + §7A H1 strike. Unscoped on purpose: `.hero` is the :has() root
   that ChoreCard's radios drive, and it carries the timeline variables. */
.hero {
  --n: 4; /* chores on screen */
  --t-end: calc(var(--n) * 420ms + 1200ms); /* swaps + announcement */
  padding-block: 16px 48px;
}
@media (width < 48rem) {
  .hero {
    --n: 2;
  }
}
.hero[data-speed="fast"] {
  --t-end: calc(var(--n) * 160ms + 1120ms);
}

/* ---- layout: one column; ≥1024 text in 7fr, card in 5fr ------------------------ */
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
.hero-byline {
  display: flex;
  align-items: center;
  gap: 12px;
}
.hero-photo {
  flex: none;
}
.hero-photo img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--surface-2);
}
.hero-byline-text {
  min-width: 0;
}
.hero-title {
  margin-top: 16px;
}
.hero-sub {
  margin-top: 12px;
  max-width: 46ch;
}
.hero-cta {
  margin-top: 20px;
}
.hero-cta-note {
  margin-top: 8px;
}
.hero-card {
  margin-top: 20px;
}
.hero-proof {
  display: grid;
  row-gap: 4px;
  margin-top: 24px;
}

@media (width < 48rem) {
  .hero-cta-btn {
    width: 100%;
  }
}

@media (width >= 48rem) {
  .hero {
    padding-block: 40px 80px;
  }
  .hero-title {
    margin-top: 24px;
  }
  .hero-sub {
    margin-top: 20px;
  }
  .hero-cta {
    margin-top: 32px;
  }
  .hero-card {
    margin-top: 48px;
    max-width: 560px;
  }
  /* inline items with 1px --line dividers; the divider that would start a
     line sits outside the list and is clipped */
  .hero-proof {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 25px;
    margin-top: 32px;
    overflow: hidden;
  }
  .hero-proof > li {
    position: relative;
  }
  .hero-proof > li::before {
    content: "";
    position: absolute;
    left: -13px;
    top: 0.25em;
    bottom: 0.25em;
    width: 1px;
    background-color: var(--line);
  }
}

@media (width >= 64rem) {
  .hero {
    padding-block: 48px 96px;
  }
  .hero-grid {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    grid-template-rows: auto auto auto auto 1fr;
    column-gap: 24px;
  }
  .hero-byline {
    grid-area: 1 / 1;
  }
  .hero-title {
    grid-area: 2 / 1;
  }
  .hero-sub {
    grid-area: 3 / 1;
  }
  .hero-cta {
    grid-area: 4 / 1;
  }
  .hero-proof {
    grid-area: 5 / 1;
    align-self: start;
  }
  .hero-card {
    grid-column: 2;
    grid-row: 1 / -1;
    align-self: center;
    justify-self: end;
    width: 100%;
    max-width: 460px;
    margin-top: 0;
  }
}

/* ---- §7A: the last stroke crosses out "a mano" in the H1 ----------------------
   The text is never animated and stays --ink; the stroke is an aria-hidden overlay. */
.h1-manual {
  position: relative;
  white-space: nowrap;
}
.h1-manual svg {
  position: absolute;
  left: -0.06em;
  top: 50%;
  width: calc(100% + 0.12em);
  height: 0.32em;
  overflow: visible;
  pointer-events: none;
}
.h1-manual path {
  fill: none;
  stroke: var(--accent-ink);
  stroke-width: max(3.5px, 0.08em);
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  /* hidden: `1 2` / 1.001, not `1` / 1 (a round cap would leave a dot) */
  stroke-dasharray: 1 2;
  stroke-dashoffset: 1.001;
  /* 2280–2880 (4 chores) · 1440–2040 (2 chores) */
  transition: stroke-dashoffset 600ms var(--ease-draw) calc(var(--n) * 420ms + 600ms);
}
.hero[data-speed="fast"] .h1-manual path {
  transition-delay: calc(var(--n) * 160ms + 520ms);
}
/* Without JS the box is never calibrated, and Chrome would end a `1`-long dash
   short of a stretched path wider than 200px (64px H1). A 1.5 dash covers the
   whole stroke in every engine and still hides completely at 1.501. */
.no-js .h1-manual path {
  stroke-dasharray: 1.5 3;
  stroke-dashoffset: 1.501;
}
.hero:has(#mode-auto:checked) .h1-manual path {
  stroke-dashoffset: 0;
}
/* rewind with the card: at once, 200ms (gated so reduced motion stays instant) */
@media (prefers-reduced-motion: no-preference) {
  .hero:not(:has(#mode-auto:checked)) .h1-manual path {
    transition-delay: 0s !important;
    transition-duration: 200ms !important;
  }
}
.hero[data-speed="instant"] .h1-manual path {
  transition: none !important;
}
@media (prefers-reduced-motion: reduce) {
  .hero .h1-manual path {
    transition: none !important;
  }
}
@media (forced-colors: active) {
  .h1-manual path {
    stroke: CanvasText;
  }
}
</style>
