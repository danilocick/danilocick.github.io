import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { prefersReducedMotion } from './useReducedMotion'
import { useInView } from './useInView'

/**
 * Hooks the contact form registers so goToContact() (§6.3) can sync the message
 * and focus the form without the caller knowing the form.
 */
export interface ContactHooks {
  /** §7B: if the message is not dirty, write composeMessage() into it. */
  syncMessage?: () => void
  /**
   * Focus the first EMPTY required field (name → email → message) with
   * { preventScroll: true }. Return true if something was focused; when it
   * returns false (or no hook is registered) the contact H2 is focused instead.
   */
  focusFirstEmpty?: () => boolean
}

// ---- shared page state (module singletons; never mutated during SSR) -------
const heroCtaVisible = ref(true) // SSR/hydration: the hero CTA is on screen
const contactVisible = ref(false)
const menuOpen = ref(false)
const fieldFocused = ref(false)
const contactDone = ref(false)
const scrolled = ref(false)
const liveMessage = ref('')

/** StickyCta (§4): shown only when every condition holds. */
const stickyVisible = computed(
  () => !heroCtaVisible.value && !contactVisible.value && !fieldFocused.value && !contactDone.value && !menuOpen.value,
)

let hooks: ContactHooks = {}
let focusTrackingInstalled = false
let liveTimer: ReturnType<typeof setTimeout> | undefined

// Text-entry controls that open a virtual keyboard (checkboxes/radios do not hide the bar).
const TEXT_FIELD =
  'textarea, select, input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="hidden"])'

function installFocusTracking(): void {
  if (focusTrackingInstalled || typeof document === 'undefined') return
  focusTrackingInstalled = true
  document.addEventListener('focusin', (e) => {
    fieldFocused.value = e.target instanceof Element && e.target.matches(TEXT_FIELD)
  })
  document.addEventListener('focusout', (e) => {
    const next = e.relatedTarget
    fieldFocused.value = next instanceof Element && next.matches(TEXT_FIELD)
  })
}

/**
 * Announce text in the global #live region (role="status", polite).
 * `delay` (ms) debounces: a newer announce() cancels a pending one.
 * The region is cleared first so an identical message is announced again.
 */
function announce(text: string, delay = 0): void {
  if (typeof window === 'undefined') return
  clearTimeout(liveTimer)
  liveTimer = setTimeout(() => {
    liveMessage.value = ''
    liveTimer = setTimeout(() => {
      liveMessage.value = text
    }, 40)
  }, delay)
}

function registerContactHooks(h: ContactHooks): () => void {
  hooks = { ...h }
  const unregister = () => {
    if (hooks.syncMessage === h.syncMessage && hooks.focusFirstEmpty === h.focusFirstEmpty) hooks = {}
  }
  if (getCurrentInstance()) onBeforeUnmount(unregister)
  return unregister
}

function markContactDone(): void {
  contactDone.value = true
}

function focusContactFallback(): void {
  const h = document.querySelector<HTMLElement>('#contacto h2')
  h?.focus({ preventScroll: true })
}

export interface UiState {
  heroCtaVisible: Ref<boolean>
  contactVisible: Ref<boolean>
  menuOpen: Ref<boolean>
  fieldFocused: Ref<boolean>
  contactDone: Ref<boolean>
  scrolled: Ref<boolean>
  liveMessage: Ref<string>
  stickyVisible: ComputedRef<boolean>
  goToContact: (event?: Event) => void
  announce: (text: string, delay?: number) => void
  registerContactHooks: (h: ContactHooks) => () => void
  markContactDone: () => void
  track: (flag: 'heroCtaVisible' | 'contactVisible', target: MaybeRefOrGetter<Element | null | undefined>) => void
}

/**
 * Shared UI state and page-level actions. Call inside setup() (it installs the
 * document focusin/focusout tracking on mount and captures `t` for goToContact).
 */
export function useUiState(): UiState {
  const inSetup = !!getCurrentInstance()
  const t = inSetup ? useI18n().t : null
  if (inSetup) onMounted(installFocusTracking)

  /**
   * §6.3 goToContact(): 1. sync the message, 2. scroll to #contacto (smooth unless
   * reduced motion), 3. on scrollend (or a fallback timer) focus the first empty
   * required field with preventScroll, 4. announce picker.goAnnounce.
   * Pass the click event to cancel the native #contacto jump: @click="goToContact".
   */
  function goToContact(event?: Event): void {
    if (typeof document === 'undefined') return
    const target = document.getElementById('contacto')
    if (!target) return
    event?.preventDefault()

    hooks.syncMessage?.()

    const reduced = prefersReducedMotion()
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })

    const supportsScrollEnd = 'onscrollend' in window
    let done = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(timer)
      window.removeEventListener('scrollend', finish)
      const focused = hooks.focusFirstEmpty?.() === true
      if (!focused) focusContactFallback()
    }
    if (supportsScrollEnd) window.addEventListener('scrollend', finish, { once: true })
    // 600ms fallback without scrollend; safety net (e.g. no scroll needed) with it
    timer = setTimeout(finish, reduced ? 50 : supportsScrollEnd ? 1000 : 600)

    if (t) announce(t('picker.goAnnounce'))
  }

  function track(flag: 'heroCtaVisible' | 'contactVisible', target: MaybeRefOrGetter<Element | null | undefined>): void {
    const state = flag === 'heroCtaVisible' ? heroCtaVisible : contactVisible
    const { inView } = useInView(target, { initial: state.value })
    watch(inView, (v) => {
      state.value = v
    })
  }

  return {
    heroCtaVisible,
    contactVisible,
    menuOpen,
    fieldFocused,
    contactDone,
    scrolled,
    liveMessage,
    stickyVisible,
    goToContact,
    announce,
    registerContactHooks,
    markContactDone,
    track,
  }
}
