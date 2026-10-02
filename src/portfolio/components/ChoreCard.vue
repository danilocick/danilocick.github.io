<script setup lang="ts">
// §6.2 / §7A — the signature card: A MANO → AUTOMÁTICO.
//
// State is a native radio pair (#mode-man / #mode-auto). CSS reads it with
// `.hero:has(#mode-auto:checked)` and draws everything (strikes, ticks, notes,
// dial, lamp, the H1 strike in HeroSection), so the card also works without JS,
// with arrow keys and with voice control. JS only decides WHEN the mode flips
// (autorun) and HOW FAST (.hero[data-speed], owned by HeroSection via `speed`).
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DialGlyph from './DialGlyph.vue'
import MarkerCheckbox from './MarkerCheckbox.vue'
import { prefersReducedMotion } from '../composables/useReducedMotion'
import { useUiState } from '../composables/useUiState'
import type { Chore } from '../content/types'
import { safeGet, safeSet, STORAGE_KEYS } from '../utils/storage'

type Mode = 'man' | 'auto'
/** .hero[data-speed]: normal = autorun timeline · fast = after a user toggle · instant = no transitions */
type HeroSpeed = 'normal' | 'fast' | 'instant'

defineProps<{ chores: Chore[] }>()

const emit = defineEmits<{
  /** HeroSection writes it to .hero[data-speed] */
  speed: [value: HeroSpeed]
  /** first user interaction → HeroSection sets .hero[data-user] */
  user: []
}>()

const { t } = useI18n()
const { announce } = useUiState()

/** SSR and hydration are always A MANO; the mode only changes on the client. */
const mode = ref<Mode>('man')
const cardEl = ref<HTMLElement | null>(null)

const RATIO = 0.5 // card ≥ 50% in view
const RATIO_EPS = 0.001 // IO may report 0.4999… when crossing exactly 0.5

let alive = true
let touched = false
let io: IntersectionObserver | null = null
let firstCallback = true
let lastRatio = 0
let armTimer: ReturnType<typeof setTimeout> | undefined
let announceTimer: ReturnType<typeof setTimeout> | undefined
let waitingVisible = false

const enoughInView = (ratio: number) => ratio >= RATIO - RATIO_EPS

/** --t-end in ms, mirroring the CSS (4 chores at ≥48rem, 2 below). Client only. */
function tEnd(speed: 'normal' | 'fast'): number {
  const n = window.matchMedia('(min-width: 48rem)').matches ? 4 : 2
  return speed === 'fast' ? n * 160 + 1120 : n * 420 + 1200
}

/** Announce the mode result in #live once the drawing has finished (--t-end). */
function announceAfter(next: Mode, speed: 'normal' | 'fast'): void {
  clearTimeout(announceTimer)
  announceTimer = setTimeout(() => {
    announce(t(next === 'auto' ? 'chores.announceAuto' : 'chores.announceMan'))
  }, tEnd(speed))
}

// ---- autorun (§7A JS steps 2–4, 6) ------------------------------------------

function stopAutorun(): void {
  clearTimeout(armTimer)
  armTimer = undefined
  io?.disconnect()
  io = null
  if (waitingVisible) {
    waitingVisible = false
    document.removeEventListener('visibilitychange', onVisibility)
  }
}

function run(): void {
  stopAutorun()
  if (!alive || touched) return
  emit('speed', 'normal')
  mode.value = 'auto'
  safeSet('session', STORAGE_KEYS.autorun, '1')
  announceAfter('auto', 'normal')
}

function onTimer(): void {
  armTimer = undefined
  if (!alive || touched) return
  if (document.visibilityState === 'visible') {
    run()
    return
  }
  // never play to a hidden tab: wait until the visitor is looking
  if (!waitingVisible) {
    waitingVisible = true
    document.addEventListener('visibilitychange', onVisibility)
  }
}

function onVisibility(): void {
  if (document.visibilityState !== 'visible') return
  waitingVisible = false
  document.removeEventListener('visibilitychange', onVisibility)
  // still ≥ 50% in view (or no IO at all) → play now; otherwise the IO re-arms it
  if (!io || enoughInView(lastRatio)) run()
}

function arm(ms: number): void {
  clearTimeout(armTimer)
  armTimer = setTimeout(onTimer, ms)
}

function onIntersect(entries: IntersectionObserverEntry[]): void {
  const entry = entries[entries.length - 1]
  if (!entry) return
  lastRatio = entry.isIntersecting ? entry.intersectionRatio : 0
  const enough = enoughInView(lastRatio)
  if (firstCallback) {
    // the first callback reports the state at load: already in view → 400ms
    firstCallback = false
    if (enough) arm(400)
    return
  }
  if (!enough) {
    clearTimeout(armTimer)
    armTimer = undefined
  } else if (armTimer === undefined && !waitingVisible) {
    arm(600)
  }
}

function watchCard(): void {
  if (!alive || touched || !cardEl.value) return
  if (typeof IntersectionObserver === 'undefined') {
    arm(1000) // step 6: no IO → play 1000ms after fonts.ready
    return
  }
  firstCallback = true
  io = new IntersectionObserver(onIntersect, { threshold: [0, RATIO] })
  io.observe(cardEl.value)
}

// ---- user input (§7A JS step 5) -------------------------------------------

function markTouched(): void {
  touched = true
  stopAutorun()
  emit('speed', 'fast')
  emit('user')
}

/** Pointer on the knob or the list: flip the mode (the radios stay the source of truth). */
function userToggle(event: MouseEvent): void {
  if (event.detail > 1) return // 2nd click of a double-click: toggle once, not twice
  if (window.getSelection()?.isCollapsed === false) return // selecting text, not toggling
  markTouched()
  mode.value = mode.value === 'auto' ? 'man' : 'auto'
  announceAfter(mode.value, 'fast')
}

/** Native radio change (label click, arrow keys, voice control). v-model already set `mode`. */
function onUserChange(event: Event): void {
  if (!event.isTrusted) return
  markTouched()
  announceAfter((event.target as HTMLInputElement).value === 'auto' ? 'auto' : 'man', 'fast')
}

onMounted(() => {
  // step 1: reduced motion, or already played this session → final state, no announcement
  if (prefersReducedMotion() || safeGet('session', STORAGE_KEYS.autorun) === '1') {
    emit('speed', 'instant')
    mode.value = 'auto'
    return
  }
  // step 2: nothing starts before the final fonts are in (it can never touch LCP)
  const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve()
  fontsReady.then(watchCard, watchCard)
})

onBeforeUnmount(() => {
  alive = false
  stopAutorun()
  clearTimeout(announceTimer)
})
</script>

<template>
  <figure class="chores">
    <div ref="cardEl" class="chores-card card">
      <div class="chores-head">
        <p class="chores-title label max-md:sr-only">{{ t('chores.title') }}</p>
        <fieldset class="dial">
          <legend class="sr-only">{{ t('chores.legend') }}</legend>
          <input
            id="mode-man"
            v-model="mode"
            class="sr-only"
            type="radio"
            name="chores-mode"
            value="man"
            @change="onUserChange"
          />
          <label for="mode-man" class="dial-label label">{{ t('chores.man') }}</label>
          <span class="knob" aria-hidden="true" @click="userToggle"><DialGlyph :size="56" /></span>
          <input
            id="mode-auto"
            v-model="mode"
            class="sr-only"
            type="radio"
            name="chores-mode"
            value="auto"
            @change="onUserChange"
          />
          <label for="mode-auto" class="dial-label label">{{ t('chores.auto') }}<span class="lamp" aria-hidden="true"></span></label>
        </fieldset>
      </div>

      <ol class="chores-list paper" role="list" @click="userToggle">
        <li
          v-for="(c, i) in chores"
          :key="c.id"
          class="text-chore font-bold"
          :class="{ 'max-md:hidden': !c.compact }"
          :style="{ '--i': i, '--tilt': `${c.tilt}deg` }"
        >
          <MarkerCheckbox :size="22" />
          <span class="chore-text"><span class="strike">{{ t(c.textKey) }}</span></span>
          <span class="note"><span class="sr-only">{{ t('chores.srSolution') }}{{ ' ' }}</span>{{ t(c.noteKey) }}</span>
        </li>
      </ol>

      <div class="chores-foot max-md:hidden">
        <p class="swap status">
          <span class="is-man">{{ t('chores.status.man', 4) }}</span>
          <span class="is-auto">{{ t('chores.status.auto') }}</span>
        </p>
        <p class="swap hint">
          <span class="is-man">{{ t('chores.hint.man') }}</span>
          <span class="is-auto">{{ t('chores.hint.auto') }}</span>
        </p>
      </div>
    </div>
    <figcaption class="chores-caption">{{ t('chores.caption') }}</figcaption>
  </figure>
</template>

<style>
/* §6.2 + §7A. Unscoped on purpose: the radios inside this card drive
   `.hero:has(#mode-auto:checked)` (HeroSection's root), which also strikes the H1.
   Animated: rotate, opacity, translate, background-size, stroke-dashoffset,
   stroke, visibility, background-color — never layout, so every state is laid
   out at all times (CLS 0). */

/* ---- card ---------------------------------------------------------------- */
.chores-card {
  position: relative;
  padding: 12px 14px;
}
.chores-head {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chores-title {
  color: var(--muted);
}

/* ---- the dial: native radio pair + knob + lamp ------------------------------ */
.chores .dial {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.chores .dial-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px; /* hit area ≥ 44×44 together with the knob */
  padding-inline: 2px;
  border-radius: 4px;
  color: var(--muted); /* inactive */
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.chores .dial-label:hover {
  color: var(--ink);
}
#mode-man:checked + .dial-label,
#mode-auto:checked + .dial-label {
  color: var(--ink); /* active */
}
.chores .dial input:focus-visible + .dial-label {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
  border-radius: 4px;
}
.chores .knob {
  display: inline-flex;
  flex: none;
  color: var(--ink);
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
/* 48px knob below 768, 56px above (overrides DialGlyph's size attributes) */
.chores .knob .dial-glyph {
  width: 48px;
  height: 48px;
}
/* pointer affordance only when the click handlers exist */
.js .chores .knob,
.js .chores-list {
  cursor: pointer;
}
.chores .dial .handle {
  rotate: -45deg; /* A MANO */
  transform-box: fill-box;
  transform-origin: 50% 50%;
  transition: rotate 320ms var(--ease-snap);
}
.chores .lamp {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
  background-color: transparent;
  transition:
    background-color 120ms linear 320ms,
    border-color 120ms linear 320ms;
}

/* ---- the list (cuadrícula strip, full card width) ----------------------------- */
.chores-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  /* bleed to the card edges: the text keeps the full 285px (375) / 270px (360) */
  margin: 6px -14px -12px;
  padding: 8px 14px 10px;
  border-top: 1px solid var(--line);
  border-radius: 0 0 5px 5px;
  background-position: 50% -1px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.chores li {
  --d: calc(var(--i) * 420ms + 360ms);
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  column-gap: 8px;
  align-items: start;
  rotate: var(--tilt); /* A MANO = slightly tilted and pending */
  transition: rotate 240ms var(--ease-out) calc(var(--d) + 480ms);
}
.hero[data-speed="fast"] .chores li {
  --d: calc(var(--i) * 160ms + 120ms);
}
/* `max-md:hidden` is a (layered) utility; this unlayered display:grid would beat it */
@media (width < 48rem) {
  .chores .max-md\:hidden {
    display: none;
  }
}
/* box centred on the first text line, whichever is taller */
.chores li > .mbox {
  grid-area: 1 / 1;
  margin-top: max(0px, (1lh - 22px) / 2);
}
.chores .chore-text {
  grid-area: 1 / 2;
  min-width: 0;
  padding-top: max(0px, (22px - 1lh) / 2);
}
/* inline, so a wrapped chore gets one strike per line */
.chores .strike {
  background: var(--strike-img) no-repeat 0 58% / 0% 0.42em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  overflow-wrap: anywhere; /* presu_v7_FINAL(2).xlsx */
  transition:
    background-size 480ms var(--ease-draw) var(--d),
    color 200ms linear calc(var(--d) + 300ms);
}
.chores .note {
  grid-area: 2 / 2;
  opacity: 0;
  translate: 0 4px;
  transition:
    opacity 240ms var(--ease-out) calc(var(--d) + 480ms),
    translate 240ms var(--ease-out) calc(var(--d) + 480ms);
}
.chores .tick {
  transition: stroke-dashoffset 240ms var(--ease-draw) calc(var(--d) + 420ms);
}
.chores .mbox-box {
  transition: stroke 120ms linear calc(var(--d) + 420ms);
}

/* ---- foot (≥768): status + hint swaps ---------------------------------------- */
.chores-foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
  margin-top: 16px;
  font-size: var(--text-label);
  line-height: 1.3;
}
.chores-foot .status {
  font-weight: 700;
  color: var(--ink);
}
.chores-foot .hint {
  color: var(--muted);
}
.chores .swap > .is-auto {
  visibility: hidden;
  transition: visibility 0s linear 0s;
}

.chores-caption {
  margin-top: 6px;
  font-size: var(--text-label);
  line-height: 1.4;
  color: var(--muted);
}

@media (width >= 48rem) {
  .chores-card {
    padding: 24px;
  }
  .chores .knob .dial-glyph {
    width: 56px;
    height: 56px;
  }
  .chores-list {
    gap: 12px;
    margin: 16px -24px 0;
    padding: 16px 24px;
    border-bottom: 1px solid var(--line);
    border-radius: 0;
  }
  .chores-caption {
    margin-top: 8px;
  }
}

/* ---- AUTOMÁTICO: aligned and ticked ---------------------------------------------
   Timeline from the switch (4 chores / 2 chores): handle 0–320 · chore i strike at
   360 + 420i, tick +420, straighten + note +480 · swaps at --t-end (2880 / 2040). */
.hero:has(#mode-auto:checked) .chores li {
  rotate: 0deg;
}
.hero:has(#mode-auto:checked) .chores .strike {
  background-size: 100% 0.42em;
  color: var(--muted);
}
.hero:has(#mode-auto:checked) .chores .note {
  opacity: 1;
  translate: 0 0;
}
.hero:has(#mode-auto:checked) .chores .tick {
  stroke-dashoffset: 0;
}
.hero:has(#mode-auto:checked) .chores .mbox-box {
  stroke: var(--ink);
}
.hero:has(#mode-auto:checked) .chores .dial .handle {
  rotate: 45deg;
}
.hero:has(#mode-auto:checked) .chores .lamp {
  background-color: var(--accent-ink);
  border-color: var(--accent-ink);
}
.hero:has(#mode-auto:checked) .chores .swap > .is-auto {
  visibility: visible;
  transition-delay: var(--t-end);
}
.hero:has(#mode-auto:checked) .chores .swap > .is-man {
  visibility: hidden;
  transition: visibility 0s linear var(--t-end);
}

/* Rewind to A MANO: everything at once, 200ms. Limited to the drawn nodes, so
   colours, focus rings and the swaps stay instant (the two swap layers never
   show together). Gated on no-preference: these !important rules would
   otherwise beat the global reduced-motion reset. */
@media (prefers-reduced-motion: no-preference) {
  .hero:not(:has(#mode-auto:checked))
    :is(.chores li, .chores .strike, .chores .note, .chores .tick, .chores .mbox-box, .chores .handle, .chores .lamp) {
    transition-delay: 0s !important;
    transition-duration: 200ms !important;
  }
}
/* already played this session / reduced motion at load: final state, no motion */
.hero[data-speed="instant"] .chores * {
  transition: none !important;
}
@media (prefers-reduced-motion: reduce) {
  .hero .chores * {
    transition: none !important;
  }
}

@media (forced-colors: active) {
  .chores .tick {
    stroke: CanvasText;
  }
  .chores .lamp {
    forced-color-adjust: none;
    border-color: CanvasText;
    background-color: Canvas;
  }
  .hero:has(#mode-auto:checked) .chores .lamp {
    border-color: Highlight;
    background-color: Highlight;
  }
  .hero:has(#mode-auto:checked) .chores .strike {
    background: none;
    text-decoration: line-through;
  }
  /* colour can't tell the active label apart here */
  #mode-man:checked + .dial-label,
  #mode-auto:checked + .dial-label {
    text-decoration: underline 2px;
    text-underline-offset: 0.25em;
  }
}
</style>
