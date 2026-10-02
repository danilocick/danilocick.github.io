<script setup lang="ts">
// §4 + §6.0 — site header.
//   ≥1024: sticky 64px bar. Dial logo + wordmark (→ #inicio) · centred nav "Qué resuelvo ·
//          Experiencia · Hablemos" (aria-current="location" from useActiveSection) ·
//          compact LangSwitch. The 1px bottom border turns --line once useUiState().scrolled.
//   480–1023: static 56px. Logo + wordmark (18px) · "Hablemos" · "Menú" text button.
//   <480: logo + wordmark (16px, ellipsis safety net) · 44×44 menu icon button (sr-only "Menú").
// "Hablemos" carries the marker ellipse (draws once, 1200ms after hydration) and a 16px tick
// slot that is always laid out and draws only after a successful send (contactDone).
// The menu is a native <dialog> (showModal): 3 section links as 56px rows, full LangSwitch,
// ThemeSwitch. A link closes it, scrolls to its section and focuses the section H2; focus
// returns to the trigger only on Esc or "Cerrar".
// Without JS (no dialog) the three section links are listed inline under the bar (<1024).
// Template note: "Hablemos" + its ellipse <svg> stay on ONE line inside .hdr-link-text, so no
// whitespace node widens the box the ellipse is sized from (keep it that way when formatting).
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DialGlyph from './DialGlyph.vue'
import LangSwitch from './LangSwitch.vue'
import ThemeSwitch from './ThemeSwitch.vue'
import { CloseIcon, MenuIcon } from './icons'
import { useActiveSection } from '../composables/useActiveSection'
import { prefersReducedMotion } from '../composables/useReducedMotion'
import { useUiState } from '../composables/useUiState'

type SectionId = 'que-resuelvo' | 'experiencia' | 'contacto'

const SECTIONS: readonly { id: SectionId; key: string }[] = [
  { id: 'que-resuelvo', key: 'nav.solve' },
  { id: 'experiencia', key: 'nav.experience' },
  { id: 'contacto', key: 'nav.talk' },
]
const TALK: SectionId = 'contacto'

/** §6.0: the ellipse around "Hablemos" draws once, this long after hydration. */
const ELLIPSE_DELAY_MS = 1200

const { t } = useI18n()
const { scrolled, contactDone, menuOpen } = useUiState()
// useActiveSection returns the FIRST id of the list that crosses the band
// ('-64px 0px -55% 0px'). Passed in reverse page order, that is the LOWEST section in the
// band, i.e. the one being read. In page order, a nav jump (scroll-padding-top 80px) left the
// previous section's last 16px inside the band and underlined the wrong link (checked in Chrome).
const { active } = useActiveSection(SECTIONS.map((s) => s.id).reverse())

// ---- marker ellipse ---------------------------------------------------------
const ellipseDrawn = ref(false) // SSR + hydration: not drawn (no-JS CSS shows it drawn)
let ellipseTimer: ReturnType<typeof setTimeout> | undefined

function drawEllipseLater(): void {
  clearTimeout(ellipseTimer)
  ellipseTimer = setTimeout(() => {
    ellipseDrawn.value = true
  }, ELLIPSE_DELAY_MS)
}

/** Nothing runs while the tab is hidden: start the countdown when it becomes visible. */
function onVisibility(): void {
  if (document.visibilityState !== 'visible') return
  document.removeEventListener('visibilitychange', onVisibility)
  drawEllipseLater()
}

// ---- menu dialog -----------------------------------------------------------
const menuEl = ref<HTMLDialogElement | null>(null)
const menuBtn = ref<HTMLButtonElement | null>(null)
/** true while a menu link is closing the dialog: focus goes to the section H2, not the trigger */
let navigating = false
let desktopMq: MediaQueryList | null = null

function openMenu(): void {
  const dialog = menuEl.value
  if (!dialog || dialog.open) return
  if (typeof dialog.showModal === 'function') dialog.showModal()
  else dialog.setAttribute('open', '')
  menuOpen.value = true
}

function closeMenu(): void {
  const dialog = menuEl.value
  if (!dialog || !dialog.open) return
  if (typeof dialog.close === 'function') {
    dialog.close() // → 'close' event → onMenuClose
  } else {
    dialog.removeAttribute('open')
    onMenuClose()
  }
}

/** Fires for every close: Esc, "Cerrar", a menu link, or growing past 1024. */
function onMenuClose(): void {
  menuOpen.value = false
  if (navigating) {
    navigating = false
    return
  }
  // Esc or "Cerrar": back to the trigger (browsers restore it too; this makes it certain)
  menuBtn.value?.focus()
}

/** §4: preventDefault, close, scroll to the section, focus its H2 (tabindex="-1") without scrolling. */
function onMenuLink(event: MouseEvent, id: SectionId): void {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const target = document.getElementById(id)
  navigating = !!menuEl.value?.open
  if (!target) {
    closeMenu() // let the native jump happen
    return
  }
  event.preventDefault()
  closeMenu()
  try {
    // keep the URL in step with a native anchor jump (LangSwitch carries the hash)
    if (window.location.hash !== `#${id}`) history.pushState(null, '', `#${id}`)
  } catch {
    /* sandboxed contexts: the scroll still happens */
  }
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
}

/** The trigger disappears at ≥1024: never leave the modal open there. */
function onDesktopChange(event: MediaQueryListEvent): void {
  if (event.matches) closeMenu()
}

onMounted(() => {
  if (typeof window.matchMedia === 'function') {
    desktopMq = window.matchMedia('(min-width: 64rem)')
    desktopMq.addEventListener?.('change', onDesktopChange)
  }

  if (prefersReducedMotion()) ellipseDrawn.value = true // final state, no drawing
  else if (document.visibilityState === 'visible') drawEllipseLater()
  else document.addEventListener('visibilitychange', onVisibility)
})

onBeforeUnmount(() => {
  desktopMq?.removeEventListener?.('change', onDesktopChange)
  document.removeEventListener('visibilitychange', onVisibility)
  clearTimeout(ellipseTimer)
  menuOpen.value = false
})
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="wrap hdr-bar">
      <a class="hdr-brand hdr-logo" href="#inicio" :aria-label="t('header.home')">
        <DialGlyph fixed="auto" :size="24" />
        <span class="hdr-wordmark face-display">{{ t('header.wordmark') }}</span>
      </a>

      <nav class="hdr-nav" :aria-label="t('nav.label')">
        <ul class="hdr-nav-list">
          <li
            v-for="s in SECTIONS"
            :key="s.id"
            class="hdr-nav-item"
            :class="{ 'hdr-nav-item--talk': s.id === TALK }"
          >
            <a
              :href="`#${s.id}`"
              class="hdr-link"
              :class="{ 'hdr-talk': s.id === TALK }"
              :aria-current="active === s.id ? 'location' : undefined"
            >
              <span v-if="s.id === TALK" class="hdr-tick" :class="{ 'is-done': contactDone }" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="16" height="16" focusable="false">
                  <path
                    class="tick"
                    pathLength="1"
                    stroke-width="2"
                    d="M2.4 8.7C3.8 9.8 5.1 11.3 6.1 12.9C8.2 8.9 10.8 5.6 14.4 2.6"
                  />
                </svg>
              </span>
              <span class="hdr-link-text">{{ t(s.key) }}<svg v-if="s.id === TALK" class="hdr-ellipse" :class="{ 'is-drawn': ellipseDrawn }" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path pathLength="1" d="M83 4.2C66 .6 30 .8 12 6.6C1.5 10-1 19.5 6.5 25.5C16 32.6 48 34.2 74 31.4C92 29.4 101.5 22.5 98.6 13.8C96.4 7.4 86 3.2 70 2.4" /></svg></span>
            </a>
          </li>
        </ul>
      </nav>

      <LangSwitch variant="compact" class="hdr-lang" />

      <button
        ref="menuBtn"
        type="button"
        class="hdr-btn hdr-menu-trigger"
        aria-haspopup="dialog"
        aria-controls="site-menu"
        data-js-only
        @click="openMenu"
      >
        <MenuIcon class="hdr-btn-icon" />
        <span class="hdr-btn-text">{{ t('nav.menu') }}</span>
      </button>
    </div>

    <!-- No JS → no menu dialog: below 1024 the three section links sit inline under the bar -->
    <nav class="wrap hdr-nojs" :aria-label="t('nav.label')" data-no-js-only>
      <ul class="hdr-nojs-list">
        <li v-for="s in SECTIONS" :key="s.id">
          <a :href="`#${s.id}`" class="hdr-link">
            <span class="hdr-link-text">{{ t(s.key) }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <dialog id="site-menu" ref="menuEl" class="hdr-menu" :aria-label="t('nav.menu')" @close="onMenuClose">
      <div class="wrap hdr-menu-top">
        <span class="hdr-brand" aria-hidden="true">
          <DialGlyph fixed="auto" :size="24" />
          <span class="hdr-wordmark face-display">{{ t('header.wordmark') }}</span>
        </span>
        <button type="button" class="hdr-btn" @click="closeMenu">
          <CloseIcon class="hdr-btn-icon" />
          <span class="hdr-btn-text">{{ t('nav.close') }}</span>
        </button>
      </div>

      <div class="wrap hdr-menu-body">
        <nav :aria-label="t('nav.label')">
          <ul class="hdr-menu-links">
            <li v-for="s in SECTIONS" :key="s.id">
              <a :href="`#${s.id}`" class="hdr-menu-link" @click="onMenuLink($event, s.id)">{{ t(s.key) }}</a>
            </li>
          </ul>
        </nav>

        <div class="hdr-menu-group">
          <p id="site-menu-lang" class="label hdr-menu-label">{{ t('lang.label') }}</p>
          <LangSwitch variant="full" aria-labelledby="site-menu-lang" />
        </div>

        <ThemeSwitch name="theme-menu" show-legend class="hdr-menu-group" />
      </div>
    </dialog>
  </header>
</template>

<style>
/* ---- bar ------------------------------------------------------------------ */
/* Below 1024: in the flow (never covers content), 55px + 1px border = 56px. */
.site-header {
  position: relative;
  z-index: 40;
  background: var(--bg);
  border-bottom: 1px solid transparent;
}
.hdr-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 55px;
}
/* ≥1024: sticky, 63px + 1px border = 64px; only the border colour changes on scroll */
@media (min-width: 64rem) {
  .site-header {
    position: sticky;
    top: 0;
  }
  .site-header.is-scrolled {
    border-bottom-color: var(--line);
  }
  .hdr-bar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    column-gap: 24px;
    height: 63px;
  }
}
/* landscape phones, desktop at 200–400% zoom */
@media (max-height: 32rem) {
  .site-header {
    position: static;
  }
}

/* ---- logo: dial (AUTOMÁTICO) + wordmark ------------------------------------ */
.hdr-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--ink);
}
.hdr-logo {
  min-height: 44px;
  margin-right: auto; /* below 1024: everything after the logo sits on the right */
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
.hdr-wordmark {
  min-width: 0;
  overflow: hidden;
  font-size: 1rem;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
}
@media (min-width: 30rem) {
  .hdr-brand {
    gap: 10px;
  }
  .hdr-wordmark {
    font-size: 1.125rem;
  }
}
@media (min-width: 64rem) {
  .hdr-logo {
    justify-self: start;
    margin-right: 0;
  }
}

/* ---- nav ------------------------------------------------------------------- */
.hdr-nav {
  display: none; /* <480: everything is in the menu */
}
@media (min-width: 30rem) {
  .hdr-nav {
    display: block;
    margin-right: 6px; /* room for the ellipse before the Menú button */
  }
}
@media (min-width: 64rem) {
  .hdr-nav {
    justify-self: center;
    margin-right: 0;
  }
}
.hdr-nav-list {
  display: flex;
  align-items: center;
  gap: 28px;
  margin: 0;
  padding: 0;
  list-style: none;
}
/* 480–1023: only "Hablemos" stays in the bar */
@media (max-width: 63.99rem) {
  .hdr-nav-item:not(.hdr-nav-item--talk) {
    display: none;
  }
}

/* plain ink text links; aria-current="location" → 2px ink underline */
.hdr-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--ink);
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.25;
  white-space: nowrap;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}
.hdr-link-text {
  text-underline-offset: 0.25em;
}
.hdr-link:hover .hdr-link-text {
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
}
.hdr-link[aria-current="location"] .hdr-link-text {
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
}

/* "Hablemos": tick slot (always laid out) + text inside the marker ellipse */
.hdr-talk {
  gap: 12px;
}
.hdr-tick {
  display: block;
  flex: none;
  width: 16px;
  height: 16px;
}
.hdr-tick svg {
  display: block;
  overflow: visible;
}
.hdr-tick.is-done .tick {
  stroke-dashoffset: 0;
}
.hdr-talk .hdr-link-text {
  position: relative;
  display: inline-block;
}
.hdr-ellipse {
  position: absolute;
  top: -0.45em;
  left: -0.55em;
  width: calc(100% + 1.1em);
  height: calc(100% + 0.9em);
  overflow: visible;
  pointer-events: none;
}
/* hidden = dasharray 1 2 / offset 1.001 (round caps leave no stray dot), drawn = 0 */
.hdr-ellipse path {
  fill: none;
  stroke: var(--accent-ink);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1 2;
  stroke-dashoffset: 1.001;
  transition: stroke-dashoffset var(--dur-h1) var(--ease-draw);
}
.hdr-ellipse.is-drawn path,
.no-js .hdr-ellipse path {
  stroke-dashoffset: 0;
}

/* compact language links: right column at ≥1024 only */
.hdr-bar .hdr-lang {
  display: none;
}
@media (min-width: 64rem) {
  .hdr-bar .hdr-lang {
    display: flex;
    flex-wrap: nowrap;
    justify-self: end;
    margin-right: -8px; /* optical: the last code lines up with the gutter */
  }
}

/* ---- Menú / Cerrar buttons -------------------------------------------------- */
.hdr-btn {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0 14px;
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.25;
  white-space: nowrap;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.hdr-btn:hover {
  border-color: var(--ink);
}
.hdr-btn:active {
  translate: 0 1px;
}
.hdr-btn-icon {
  display: none;
}
/* <480: 44×44 icon button, the text stays as its sr-only name */
@media (max-width: 29.99rem) {
  .hdr-btn {
    width: 44px;
    height: 44px;
    padding: 0;
  }
  .hdr-btn-icon {
    display: block;
    width: 24px;
    height: 24px;
  }
  .hdr-btn-text {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
}
@media (min-width: 64rem) {
  .hdr-menu-trigger {
    display: none;
  }
}

/* ---- no-JS section links (<1024) ------------------------------------------- */
.hdr-nojs {
  display: none;
}
@media (max-width: 63.99rem) {
  .no-js .hdr-nav {
    display: none;
  }
  .no-js .hdr-nojs {
    display: block;
  }
}
.hdr-nojs-list {
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px;
  margin: 0;
  padding: 0 0 4px;
  list-style: none;
}

/* ---- menu dialog (<1024) ---------------------------------------------------- */
.hdr-menu {
  position: fixed;
  inset: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  max-height: 100dvh;
  margin: 0;
  padding: env(safe-area-inset-top) 0 max(32px, env(safe-area-inset-bottom));
  border: 0;
  background: var(--bg);
  color: var(--ink);
  overflow-y: auto;
  overscroll-behavior: contain;
}
.hdr-menu[open] {
  animation: hdr-menu-fade 160ms var(--ease-out);
}
.hdr-menu::backdrop {
  background: transparent;
}
@keyframes hdr-menu-fade {
  from {
    opacity: 0;
  }
}
/* mirrors the bar: brand left, "Cerrar" where "Menú" was */
.hdr-menu-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 55px;
  margin-bottom: 1px;
}
.hdr-menu-body {
  padding-top: 8px;
}
.hdr-menu-links {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}
.hdr-menu-links > li {
  border-bottom: 1px solid var(--line);
}
.hdr-menu-link {
  display: flex;
  align-items: center;
  min-height: 56px;
  color: var(--ink);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.25;
  text-decoration: none;
  text-underline-offset: 0.2em;
  -webkit-tap-highlight-color: transparent;
}
.hdr-menu-link:hover {
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
}
.hdr-menu-body .hdr-menu-group {
  margin-top: 32px;
}
.hdr-menu-label {
  color: var(--muted);
}

@media (forced-colors: active) {
  .hdr-ellipse path {
    stroke: CanvasText;
  }
}
</style>
