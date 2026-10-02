import { getCurrentInstance, onMounted, readonly, ref, type Ref } from 'vue'

// One shared, live matchMedia for the whole page. SSR value: false.
const reduced = ref(false)
let installed = false

function install(): void {
  if (installed || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
  installed = true
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = mq.matches
  mq.addEventListener?.('change', (e) => {
    reduced.value = e.matches
  })
}

/**
 * `reduced` is false during SSR and hydration, then follows
 * `prefers-reduced-motion: reduce` live after mount.
 */
export function useReducedMotion(): { reduced: Readonly<Ref<boolean>> } {
  if (getCurrentInstance()) onMounted(install)
  return { reduced: readonly(reduced) }
}

/** Synchronous read for event handlers / onMounted code (client only; false on the server). */
export function prefersReducedMotion(): boolean {
  install()
  return reduced.value
}
