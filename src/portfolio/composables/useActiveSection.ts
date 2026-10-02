import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const DESKTOP = '(min-width: 64rem)'
const ROOT_MARGIN = '-64px 0px -55% 0px'

/**
 * Active section for the desktop nav (§4): one IntersectionObserver with
 * rootMargin '-64px 0px -55% 0px', only at ≥1024px. `active` is the first id
 * (in the given order) whose section crosses the band, or null (SSR, mobile,
 * hero area, IO unsupported). Call inside setup().
 */
export function useActiveSection(ids: readonly string[]): { active: Ref<string | null> } {
  const active = ref<string | null>(null)
  const visible = new Set<string>()
  let io: IntersectionObserver | null = null
  let mq: MediaQueryList | null = null

  const recompute = () => {
    active.value = ids.find((id) => visible.has(id)) ?? null
  }

  function start(): void {
    if (io || !('IntersectionObserver' in window)) return
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        recompute()
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
  }

  function stop(): void {
    io?.disconnect()
    io = null
    visible.clear()
    active.value = null
  }

  const onChange = () => (mq?.matches ? start() : stop())

  onMounted(() => {
    if (typeof window.matchMedia !== 'function') return
    mq = window.matchMedia(DESKTOP)
    onChange()
    mq.addEventListener?.('change', onChange)
  })
  onBeforeUnmount(() => {
    mq?.removeEventListener?.('change', onChange)
    stop()
  })

  return { active }
}
