// useContactForm: the form behind ContactFinale.vue.
//   §12  fields, localised validation, Web3Forms / mailto submit, draft in sessionStorage
//   §7B  the picker writes the message (mirror while not dirty, regenerate)
//   §7C  crossed out on send (status 'success' → ui.markContactDone())
// ADAPTATIONS C: mailto is a legitimate production mode (no key → "Escribir desde mi correo").
//
// State is per instance: ContactFinale is the only caller. Page-wide state goes through
// useUiState (contactDone, goToContact hooks, #live) and useTaskSelection (selected tasks).
// SSR-safe: no window / document / storage access outside lifecycle hooks and handlers.
import {
  computed,
  onBeforeMount,
  onMounted,
  reactive,
  ref,
  watch,
  type ComputedRef,
  type Ref,
  type WatchStopHandle,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { contactMode, web3formsKey, WEB3FORMS_ENDPOINT } from '../config/site'
import { links } from '../content/profile'
import type { ContactFields, ContactMode, ContactStatus } from '../content/types'
import { safeGetJSON, safeRemove, safeSetJSON, STORAGE_KEYS } from '../utils/storage'
import { useTaskSelection } from './useTaskSelection'
import { useUiState } from './useUiState'

export type TextFieldName = Exclude<keyof ContactFields, 'botcheck'> // name | email | company | message
export type RequiredFieldName = Exclude<TextFieldName, 'company'> // name | email | message

const TEXT_FIELDS: readonly TextFieldName[] = ['name', 'email', 'company', 'message']
/** Validation and goToContact focus order (§6.3: name → email → message). */
const REQUIRED: readonly RequiredFieldName[] = ['name', 'email', 'message']

/** DOM ids of the controls (labels use them; hydration reads them). */
export const FIELD_IDS: Readonly<Record<TextFieldName, string>> = {
  name: 'contact-name',
  email: 'contact-email',
  company: 'contact-company',
  message: 'contact-message',
}
/** §12: each error is a `<p id="err-<field>">` linked with aria-describedby. */
export const ERROR_IDS: Readonly<Record<RequiredFieldName, string>> = {
  name: 'err-name',
  email: 'err-email',
  message: 'err-message',
}
/** §12 maxlength per field. */
export const FIELD_MAX: Readonly<Record<TextFieldName, number>> = { name: 100, email: 254, company: 120, message: 2000 }
export const NAME_MIN = 2
export const MESSAGE_MIN = 10
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Sender name of the notification email Dani receives (API field, not page copy). */
export const FROM_NAME = 'Portfolio — Dani Hernández'
/** A send that hangs is reported as an error instead of spinning forever. */
const SEND_TIMEOUT_MS = 15_000

/** sessionStorage['dh:draft'] */
interface Draft {
  name: string
  email: string
  company: string
  message: string
  messageDirty: boolean
}

/** The i18n key of the field's error, or null when the value is valid (§12 table). */
export function validateField(field: RequiredFieldName, raw: string): string | null {
  const v = raw.trim()
  if (field === 'name') return v.length >= NAME_MIN ? null : 'contact.v.name'
  if (field === 'email') return !v ? 'contact.v.emailMissing' : EMAIL_RE.test(v) ? null : 'contact.v.emailInvalid'
  return v.length >= MESSAGE_MIN ? null : 'contact.v.message'
}

export interface ContactElements {
  form: Ref<HTMLFormElement | null>
  name: Ref<HTMLInputElement | null>
  email: Ref<HTMLInputElement | null>
  company: Ref<HTMLInputElement | null>
  message: Ref<HTMLTextAreaElement | null>
}

export interface ContactForm {
  /** 'web3forms' with a valid key, otherwise 'mailto' (config/site.ts). */
  mode: ContactMode
  /** Dani's address: mailto target and the visible email. */
  recipient: string
  fields: ContactFields
  /** Error i18n keys per required field (render with t()). */
  errors: Partial<Record<RequiredFieldName, string>>
  status: Ref<ContactStatus>
  /** true after a successful send: computed from useUiState().contactDone (shared with header, ticket, sticky). */
  done: ComputedRef<boolean>
  /** status === 'sending' */
  busy: ComputedRef<boolean>
  /** §7B: the visitor has typed in the message; it no longer mirrors the selection. */
  messageDirty: Ref<boolean>
  /** §6.5: show contact.regenerate (dirty AND selection > 0). */
  canRegenerate: ComputedRef<boolean>
  /**
   * The message area opens on the first submit (a click or Enter, so the expansion is
   * user-initiated and CLS-exempt). From then on its .swap height is reserved for the
   * tallest variant, so the async sending → success / error swap never shifts layout.
   */
  messageAreaOpen: Ref<boolean>
  /** contact.subject with the first selected task, or contact.subjectFallback. */
  subject: ComputedRef<string>
  /** No-JS form action: the Web3Forms endpoint, or mailto: with the subject. */
  formAction: ComputedRef<string>
  /** Template refs; ContactFinale binds them. */
  els: ContactElements
  submit: () => Promise<void>
  /** contact.tryMail (error state) → mailto handoff. */
  tryMail: () => void
  /** contact.regenerate → rewrite the message from the selection, dirty = false. */
  regenerate: () => void
  /** Bind to each field's @input. */
  onInput: (field: TextFieldName, event?: Event) => void
  /** goToContact hook: if the message is not dirty, mirror the selection. */
  syncMessage: () => void
  /** goToContact hook: focus the first empty required field (preventScroll); true if focused. */
  focusFirstEmpty: () => boolean
}

export function useContactForm(recipient: string = links.email): ContactForm {
  const { t, locale } = useI18n()
  const ui = useUiState()
  // Registers the selection restore (onMounted) before ours below, so the draft
  // restore always sees the restored selection.
  const selection = useTaskSelection()

  const fields = reactive<ContactFields>({ name: '', email: '', company: '', message: '', botcheck: false })
  const errors = reactive<Partial<Record<RequiredFieldName, string>>>({})
  const status = ref<ContactStatus>('idle')
  const messageDirty = ref(false)
  const messageAreaOpen = ref(false)

  const done = computed(() => ui.contactDone.value)
  const busy = computed(() => status.value === 'sending')
  const canRegenerate = computed(
    () => messageDirty.value && selection.count.value > 0 && !done.value && !busy.value,
  )

  const els: ContactElements = {
    form: ref<HTMLFormElement | null>(null),
    name: ref<HTMLInputElement | null>(null),
    email: ref<HTMLInputElement | null>(null),
    company: ref<HTMLInputElement | null>(null),
    message: ref<HTMLTextAreaElement | null>(null),
  }

  const subject = computed(() => {
    const key = selection.firstShortKey()
    return key ? t('contact.subject', { first: t(key) }) : t('contact.subjectFallback')
  })

  const formAction = computed(() =>
    contactMode === 'web3forms'
      ? WEB3FORMS_ENDPOINT
      : `mailto:${recipient}?subject=${encodeURIComponent(subject.value)}`,
  )

  // ---- §7B: the picker writes the message ------------------------------------
  function syncMessage(): void {
    if (messageDirty.value || done.value || busy.value) return
    fields.message = selection.composeMessage()
  }
  // While not dirty, the textarea mirrors the selection (and the page language).
  watch(() => selection.composeMessage(), syncMessage)

  function regenerate(): void {
    if (done.value || busy.value) return
    fields.message = selection.composeMessage()
    messageDirty.value = false
    if (errors.message) revalidate('message', fields.message)
    // The button hides itself now; keep focus on the text it just rewrote.
    els.message.value?.focus()
  }

  // ---- validation ------------------------------------------------------------
  function revalidate(field: RequiredFieldName, value: string): void {
    const err = validateField(field, value)
    if (err) errors[field] = err
    else delete errors[field]
    if (status.value === 'invalid' && Object.keys(errors).length === 0) status.value = 'idle'
  }

  function onInput(field: TextFieldName, event?: Event): void {
    if (field === 'message' && event?.isTrusted) messageDirty.value = true
    // Errors only appear on submit; once shown, they update (and clear) as the visitor types.
    if (field !== 'company' && errors[field]) {
      const target = event?.target
      const value =
        target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement ? target.value : fields[field]
      revalidate(field, value)
    }
  }

  function validateAll(): RequiredFieldName[] {
    const invalid: RequiredFieldName[] = []
    for (const field of REQUIRED) {
      const err = validateField(field, fields[field])
      if (err) {
        errors[field] = err
        invalid.push(field)
      } else {
        delete errors[field]
      }
    }
    return invalid
  }

  function failValidation(invalid: RequiredFieldName[]): void {
    status.value = 'invalid'
    const first = invalid[0]
    if (first) els[first].value?.focus()
    ui.announce(t('contact.v.summary'))
  }

  // ---- outcomes --------------------------------------------------------------
  let stopDraft: WatchStopHandle | undefined

  /** §7C: H2 struck + ticked, header tick, ticket item struck, StickyCta hidden for the session. */
  function succeed(): void {
    status.value = 'success'
    ui.markContactDone()
    stopDraft?.()
    stopDraft = undefined
    safeRemove('session', STORAGE_KEYS.draft)
  }

  /** §12 step 3: open the visitor's mail app with the message written. Nothing is crossed out. */
  function openMail(): void {
    const name = fields.name.trim()
    const email = fields.email.trim()
    const company = fields.company.trim()
    // RFC 6068: line breaks in a mailto body are CRLF.
    const body = `${fields.message.trim()}\n\n— ${name}${company ? ` · ${company}` : ''}\n${email}`.replace(
      /\r?\n/g,
      '\r\n',
    )
    const href = `mailto:${recipient}?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(body)}`
    messageAreaOpen.value = true
    status.value = 'handoff'
    try {
      window.location.href = href
    } catch {
      /* no mail handler: the handoff message offers the address + Copiar */
    }
  }

  /** §12 step 2: Web3Forms JSON submit. */
  async function send(): Promise<void> {
    status.value = 'sending'
    const email = fields.email.trim()
    const ctrl = typeof AbortController === 'function' ? new AbortController() : undefined
    const timer = setTimeout(() => ctrl?.abort(), SEND_TIMEOUT_MS)
    try {
      const r = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: subject.value,
          from_name: FROM_NAME,
          name: fields.name.trim(),
          email,
          replyto: email,
          company: fields.company.trim(),
          message: fields.message.trim(),
          locale: locale.value,
          botcheck: false,
        }),
        signal: ctrl?.signal,
      })
      const j = (await r.json().catch(() => ({}))) as { success?: unknown }
      if (r.ok && j.success) succeed()
      else status.value = 'error' // every field is kept as typed
    } catch {
      status.value = 'error'
    } finally {
      clearTimeout(timer)
    }
  }

  async function submit(): Promise<void> {
    if (busy.value || done.value) return
    const invalid = validateAll()
    if (invalid.length) return failValidation(invalid)
    messageAreaOpen.value = true
    if (fields.botcheck) return succeed() // honeypot: pretend success, send nothing
    if (contactMode === 'mailto') return openMail()
    await send()
  }

  function tryMail(): void {
    if (busy.value || done.value) return
    const invalid = validateAll()
    if (invalid.length) return failValidation(invalid)
    openMail()
  }

  // ---- goToContact hooks (§6.3) ----------------------------------------------
  function focusFirstEmpty(): boolean {
    if (done.value) return false
    for (const field of REQUIRED) {
      const el = els[field].value
      if (el && !fields[field].trim()) {
        el.focus({ preventScroll: true })
        return true
      }
    }
    return false
  }

  if (!import.meta.env.SSR) ui.registerContactHooks({ syncMessage, focusFirstEmpty })

  // ---- hydration, draft restore and persistence --------------------------------
  // Anything typed into the prerendered form before hydration: v-model's mounted hook
  // would overwrite it with the (empty) state, so read it from the DOM first.
  const typedBeforeHydration: Partial<Record<TextFieldName, string>> = {}
  onBeforeMount(() => {
    for (const field of TEXT_FIELDS) {
      const el = document.getElementById(FIELD_IDS[field])
      if ((el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) && el.value) {
        typedBeforeHydration[field] = el.value
      }
    }
  })

  function saveDraft(): void {
    if (done.value) return
    const { name, email, company, message } = fields
    if (!messageDirty.value && !name && !email && !company && !message) {
      safeRemove('session', STORAGE_KEYS.draft)
      return
    }
    safeSetJSON('session', STORAGE_KEYS.draft, {
      name,
      email,
      company,
      message,
      messageDirty: messageDirty.value,
    } satisfies Draft)
  }

  onMounted(() => {
    // With JS, the localised validation replaces the browser bubbles (§12).
    if (els.form.value) els.form.value.noValidate = true
    if (done.value) return

    const draft = safeGetJSON<Partial<Draft>>('session', STORAGE_KEYS.draft) ?? {}
    const stored = (field: TextFieldName): string => {
      const v = draft[field]
      return typeof v === 'string' ? v : ''
    }
    const pick = (field: TextFieldName): string =>
      (stored(field) || typedBeforeHydration[field] || '').slice(0, FIELD_MAX[field])

    fields.name = pick('name')
    fields.email = pick('email')
    fields.company = pick('company')

    if (draft.messageDirty === true) {
      messageDirty.value = true
      fields.message = stored('message').slice(0, FIELD_MAX.message)
    } else if (!stored('message') && typedBeforeHydration.message) {
      messageDirty.value = true
      fields.message = typedBeforeHydration.message.slice(0, FIELD_MAX.message)
    } else {
      // Not dirty: recompose from the restored selection, in this page's language (§7B).
      messageDirty.value = false
      fields.message = selection.composeMessage()
    }

    stopDraft = watch(
      () => [fields.name, fields.email, fields.company, fields.message, messageDirty.value],
      saveDraft,
    )
  })

  return {
    mode: contactMode,
    recipient,
    fields,
    errors,
    status,
    done,
    busy,
    messageDirty,
    canRegenerate,
    messageAreaOpen,
    subject,
    formAction,
    els,
    submit,
    tryMail,
    regenerate,
    onInput,
    syncMessage,
    focusFirstEmpty,
  }
}
