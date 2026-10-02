import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  type ComponentPublicInstance,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

export interface InViewOptions {
  /** IntersectionObserver threshold(s). Default 0. */
  threshold?: number | number[]
  /** IntersectionObserver rootMargin. Default '0px'. */
  rootMargin?: string
  /** Stop observing after the first time the target intersects. Default false. */
  once?: boolean
  /** Value of `inView` before the first IO callback (and during SSR). Default false. */
  initial?: boolean
}

type Target = Element | ComponentPublicInstance | null | undefined
type Listener = (entry: IntersectionObserverEntry) => void

interface Shared {
  io: IntersectionObserver
  listeners: Map<Element, Set<Listener>>
}

// One shared observer per options key.
const observers = new Map<string, Shared>()

function keyOf(threshold: number | number[], rootMargin: string): string {
  return `${Array.isArray(threshold) ? threshold.join(',') : threshold}|${rootMargin}`
}

function getShared(threshold: number | number[], rootMargin: string): Shared {
  const key = keyOf(threshold, rootMargin)
  let shared = observers.get(key)
  if (!shared) {
    const listeners = new Map<Element, Set<Listener>>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) listeners.get(entry.target)?.forEach((fn) => fn(entry))
      },
      { threshold, rootMargin },
    )
    shared = { io, listeners }
    observers.set(key, shared)
  }
  return shared
}

function toElement(t: Target): Element | null {
  if (!t) return null
  if (t instanceof Element) return t
  const el = (t as ComponentPublicInstance).$el as unknown
  return el instanceof Element ? el : null
}

/**
 * Observe an element (template ref, component ref or getter). SSR-safe: observes
 * in onMounted, unobserves on unmount. If IntersectionObserver is unsupported,
 * `inView` becomes true and `ratio` 1 on mount.
 */
export function useInView(
  target: MaybeRefOrGetter<Target>,
  options: InViewOptions = {},
): { inView: Ref<boolean>; ratio: Ref<number>; stop: () => void } {
  const { threshold = 0, rootMargin = '0px', once = false, initial = false } = options
  const inView = ref(initial)
  const ratio = ref(initial ? 1 : 0)
  let stop = () => {}

  if (getCurrentInstance()) {
    onMounted(() => {
      const el = toElement(toValue(target))
      if (!el) return
      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        inView.value = true
        ratio.value = 1
        return
      }
      const shared = getShared(threshold, rootMargin)
      const listener: Listener = (entry) => {
        inView.value = entry.isIntersecting
        ratio.value = entry.intersectionRatio
        if (once && entry.isIntersecting) stop()
      }
      let set = shared.listeners.get(el)
      if (!set) {
        set = new Set()
        shared.listeners.set(el, set)
      } else {
        // already observed for another listener: re-observe so the new one gets the initial callback
        shared.io.unobserve(el)
      }
      set.add(listener)
      shared.io.observe(el)
      stop = () => {
        const s = shared.listeners.get(el)
        if (!s) return
        s.delete(listener)
        if (s.size === 0) {
          shared.listeners.delete(el)
          shared.io.unobserve(el)
        }
        stop = () => {}
      }
    })
    onBeforeUnmount(() => stop())
  }

  return { inView, ratio, stop: () => stop() }
}
