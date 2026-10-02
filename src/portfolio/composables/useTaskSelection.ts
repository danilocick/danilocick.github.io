import { computed, effectScope, getCurrentInstance, onMounted, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PROBLEM_IDS } from '../content/profile'
import type { ProblemId } from '../content/types'
import { safeGetJSON, safeSetJSON, STORAGE_KEYS } from '../utils/storage'

/** Minimum trimmed length of the "Otra" text that auto-checks its box (§6.3). */
export const OTHER_MIN = 3
export const OTHER_MAX = 120

interface Persisted {
  ids: ProblemId[]
  other: string
  otherOn: boolean
}

// Shared page state (picker rows, ticket, sticky CTA and contact form all read it).
const selected = ref<ProblemId[]>([])
const other = ref('')
const otherOn = ref(false)
let restored = false

const isProblemId = (v: unknown): v is ProblemId => typeof v === 'string' && (PROBLEM_IDS as readonly string[]).includes(v)

/** Keep `problems` order. */
function ordered(ids: ProblemId[]): ProblemId[] {
  return PROBLEM_IDS.filter((id) => ids.includes(id))
}

function restoreOnce(): void {
  if (restored) return
  restored = true
  const data = safeGetJSON<Partial<Persisted>>('session', STORAGE_KEYS.tasks)
  if (data) {
    if (Array.isArray(data.ids)) selected.value = ordered(data.ids.filter(isProblemId))
    if (typeof data.other === 'string') other.value = data.other.slice(0, OTHER_MAX)
    otherOn.value = data.otherOn === true && other.value.trim().length > 0
  }
  // persist from now on (detached scope: lives as long as the page)
  effectScope(true).run(() => {
    watch(
      [selected, other, otherOn],
      () => {
        safeSetJSON('session', STORAGE_KEYS.tasks, {
          ids: selected.value,
          other: other.value,
          otherOn: otherOn.value,
        } satisfies Persisted)
      },
      { deep: true },
    )
  })
}

export interface TaskSelection {
  /** Selected problem ids, always in `problems` order. */
  selected: Ref<ProblemId[]>
  /** Text of the "Otra" row (max 120 chars). */
  other: Ref<string>
  /** State of the "Otra" checkbox. */
  otherOn: Ref<boolean>
  /** true when "Otra" is checked AND has text → counts as a task and enters the message. */
  otherActive: ComputedRef<boolean>
  /** selected.length + (otherActive ? 1 : 0) */
  count: ComputedRef<number>
  /** `problems.<id>.short` keys of the selected rows (for the ticket list). */
  shortKeys: ComputedRef<string[]>
  isSelected: (id: ProblemId) => boolean
  toggle: (id: ProblemId) => void
  set: (id: ProblemId, on: boolean) => void
  /** Sets the "Otra" text: ≥3 chars checks the box, empty text unchecks it. */
  setOther: (text: string) => void
  setOtherOn: (on: boolean) => void
  clear: () => void
  /** `contact.prefill` with the selected messages joined by Intl.ListFormat; '' when nothing is selected. */
  composeMessage: () => string
  /** `problems.<first>.short` or null (→ contact.subjectFallback). */
  firstShortKey: () => string | null
}

/**
 * §7B selection state. Persisted to sessionStorage['dh:tasks'] = { ids, other, otherOn },
 * restored once in onMounted (the prerendered HTML is always empty).
 * Call inside setup() (uses useI18n for composeMessage).
 */
export function useTaskSelection(): TaskSelection {
  const { t, locale } = useI18n()
  if (getCurrentInstance()) onMounted(restoreOnce)

  const otherActive = computed(() => otherOn.value && other.value.trim().length > 0)
  const count = computed(() => selected.value.length + (otherActive.value ? 1 : 0))
  const shortKeys = computed(() => selected.value.map((id) => `problems.${id}.short`))

  const isSelected = (id: ProblemId) => selected.value.includes(id)

  function set(id: ProblemId, on: boolean): void {
    const has = selected.value.includes(id)
    if (on && !has) selected.value = ordered([...selected.value, id])
    else if (!on && has) selected.value = selected.value.filter((x) => x !== id)
  }

  const toggle = (id: ProblemId) => set(id, !isSelected(id))

  function setOther(text: string): void {
    other.value = text.slice(0, OTHER_MAX)
    const len = other.value.trim().length
    if (len >= OTHER_MIN) otherOn.value = true
    else if (len === 0) otherOn.value = false
  }

  const setOtherOn = (on: boolean) => {
    otherOn.value = on
  }

  function clear(): void {
    selected.value = []
    other.value = ''
    otherOn.value = false
  }

  function composeMessage(): string {
    const fragments = [
      ...selected.value.map((id) => t(`problems.${id}.message`)),
      ...(otherActive.value ? [other.value.trim()] : []),
    ]
    if (!fragments.length) return ''
    const tasks = new Intl.ListFormat(locale.value, { style: 'long', type: 'conjunction' }).format(fragments)
    return t('contact.prefill', { tasks })
  }

  const firstShortKey = () => (selected.value.length ? `problems.${selected.value[0]}.short` : null)

  return {
    selected,
    other,
    otherOn,
    otherActive,
    count,
    shortKeys,
    isSelected,
    toggle,
    set,
    setOther,
    setOtherOn,
    clear,
    composeMessage,
    firstShortKey,
  }
}
