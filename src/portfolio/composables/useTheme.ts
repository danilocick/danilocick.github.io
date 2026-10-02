import { getCurrentInstance, onMounted, readonly, ref, type Ref } from 'vue'
import { safeRemove, safeSet, STORAGE_KEYS } from '../utils/storage'
import { prefersReducedMotion } from './useReducedMotion'

export type ThemePreference = 'system' | 'light' | 'dark'
export type ThemeEffective = 'light' | 'dark'

const THEME_COLOR: Record<ThemeEffective, string> = { light: '#F3F2EE', dark: '#14130F' }

// Shared across every ThemeSwitch instance (menu + footer stay in sync).
// SSR / hydration value is always 'system' / 'light'; the real state is read in onMounted.
const preference = ref<ThemePreference>('system')
const effective = ref<ThemeEffective>('light')
let installed = false

function systemDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

function resolve(p: ThemePreference): ThemeEffective {
  return p === 'system' ? (systemDark() ? 'dark' : 'light') : p
}

/** Writes data-theme-pref / data-theme and both theme-color metas (§9). */
function apply(p: ThemePreference): void {
  const root = document.documentElement
  const e = resolve(p)
  root.setAttribute('data-theme-pref', p)
  root.setAttribute('data-theme', e)
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((m) => {
    if (p === 'system') {
      // restore the media-specific values
      m.content = (m.getAttribute('media') ?? '').includes('dark') ? THEME_COLOR.dark : THEME_COLOR.light
    } else {
      m.content = THEME_COLOR[e]
    }
  })
  preference.value = p
  effective.value = e
}

function install(): void {
  if (installed || typeof document === 'undefined') return
  installed = true
  const root = document.documentElement
  const p = root.getAttribute('data-theme-pref')
  preference.value = p === 'light' || p === 'dark' ? p : 'system'
  const e = root.getAttribute('data-theme')
  effective.value = e === 'light' || e === 'dark' ? e : resolve(preference.value)
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (preference.value === 'system') apply('system')
    })
  } catch {
    /* old browsers: no live update */
  }
}

/**
 * Theme preference (§9). `preference` drives the ThemeSwitch radios; `effective`
 * is the applied theme. `setPreference` persists to localStorage['theme']
 * ('light' | 'dark' | removed for system) and crossfades with a 200ms view
 * transition when supported and motion is allowed.
 */
export function useTheme(): {
  preference: Readonly<Ref<ThemePreference>>
  effective: Readonly<Ref<ThemeEffective>>
  setPreference: (p: ThemePreference) => void
} {
  if (getCurrentInstance()) onMounted(install)

  function setPreference(p: ThemePreference): void {
    if (typeof document === 'undefined') return
    install()
    if (p === 'system') safeRemove('local', STORAGE_KEYS.theme)
    else safeSet('local', STORAGE_KEYS.theme, p)

    const changesLook = resolve(p) !== effective.value
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    if (changesLook && typeof doc.startViewTransition === 'function' && !prefersReducedMotion()) {
      doc.startViewTransition(() => apply(p))
    } else {
      apply(p)
    }
  }

  return { preference: readonly(preference), effective: readonly(effective), setPreference }
}
