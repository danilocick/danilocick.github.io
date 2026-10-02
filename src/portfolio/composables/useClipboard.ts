import { getCurrentInstance, onBeforeUnmount, ref, type Ref } from 'vue'

/** execCommand fallback: select a temporary read-only input. */
function legacyCopy(text: string): boolean {
  try {
    const active = document.activeElement as HTMLElement | null
    const el = document.createElement('input')
    el.value = text
    el.readOnly = true
    el.tabIndex = -1
    el.setAttribute('aria-hidden', 'true')
    el.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none'
    document.body.appendChild(el)
    el.select()
    el.setSelectionRange(0, text.length)
    const ok = document.execCommand('copy')
    el.remove()
    active?.focus?.({ preventScroll: true })
    return ok
  } catch {
    return false
  }
}

/**
 * Copy text to the clipboard (navigator.clipboard, then execCommand fallback).
 * `copied` is true for `resetMs` (default 2000) after a successful copy.
 * Announcing (contact.copiedLive) is the caller's job via useUiState().announce.
 */
export function useClipboard(resetMs = 2000): { copy: (text: string) => Promise<boolean>; copied: Ref<boolean> } {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(text: string): Promise<boolean> {
    if (typeof document === 'undefined') return false
    let ok = false
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        ok = true
      }
    } catch {
      ok = false
    }
    if (!ok) ok = legacyCopy(text)
    if (ok) {
      copied.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        copied.value = false
      }, resetMs)
    }
    return ok
  }

  if (getCurrentInstance()) onBeforeUnmount(() => clearTimeout(timer))
  return { copy, copied }
}
