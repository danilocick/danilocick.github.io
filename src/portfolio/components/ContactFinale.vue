<script setup lang="ts">
// §6.5 #contacto: "the last item on the list". The contact item (40px MarkerCheckbox +
// H2 in .strike) is crossed out only after a real send (§7C). Form logic lives in
// useContactForm (§12); this component is layout, copy and the direct routes.
//
// DOM order = mobile order: intro (eyebrow, item, sub) → form card → more (availability,
// next steps, direct routes, trilingual line). At ≥1024 the grid puts intro + more in
// columns 1–5 (rows 1–2) and the form card in columns 7–12 spanning both rows.
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MarkerCheckbox from './MarkerCheckbox.vue'
import { ArrowIcon, CheckIcon, CopyIcon, LinkedInIcon, MailIcon } from './icons'
import { clientWork, web3formsKey, whatsapp } from '../config/site'
import type { Links } from '../content/types'
import { ERROR_IDS, FIELD_IDS, FIELD_MAX, FROM_NAME, useContactForm } from '../composables/useContactForm'
import { useClipboard } from '../composables/useClipboard'
import { useUiState } from '../composables/useUiState'

const props = defineProps<{ links: Links }>()

const { t } = useI18n()
const ui = useUiState()

const form = useContactForm(props.links.email)
const { fields, errors, status, done, busy, canRegenerate, messageAreaOpen, subject, formAction } = form
const { submit, tryMail, regenerate, onInput } = form
const isWeb3 = form.mode === 'web3forms'

// Template refs owned by the composable (validation focus, goToContact, noValidate).
const formEl = form.els.form
const nameEl = form.els.name
const emailEl = form.els.email
const companyEl = form.els.company
const messageEl = form.els.message

// StickyCta hides while #contacto intersects.
const sectionEl = ref<HTMLElement | null>(null)
ui.track('contactVisible', sectionEl)

const mailHref = `mailto:${props.links.email}`
const waNumber = whatsapp ? whatsapp.replace(/\D/g, '') : ''
const waHref = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(t('contact.waText'))}` : ''

// Copiar: one state for the direct routes, one for the message area (error / handoff).
const { copy: copyForRoute, copied: routeCopied } = useClipboard()
const { copy: copyForMessage, copied: messageCopied } = useClipboard()

/** If the clipboard is blocked, select the visible address so it can be copied by hand. */
function selectText(id: string): void {
  const el = document.getElementById(id)
  const selection = window.getSelection()
  if (!el || !selection) return
  const range = document.createRange()
  range.selectNodeContents(el)
  selection.removeAllRanges()
  selection.addRange(range)
}

async function copyEmail(copy: (text: string) => Promise<boolean>, addressId: string): Promise<void> {
  if (await copy(props.links.email)) ui.announce(t('contact.copiedLive'))
  else selectText(addressId)
}

/** The privacy link also opens the footer's <details id="legal"> before the jump. */
function openLegal(): void {
  const details = document.getElementById('legal')
  if (details instanceof HTMLDetailsElement) details.open = true
}
</script>

<template>
  <section id="contacto" ref="sectionEl" class="contact section" aria-labelledby="contacto-h2">
    <div class="wrap">
      <div class="page-grid contact-grid">
        <!-- Intro: eyebrow, the contact item, sub -->
        <div class="contact-intro col-span-full lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <p class="eyebrow">{{ t('contact.eyebrow') }}</p>
          <div class="contact-item" :class="{ 'is-done': done }">
            <MarkerCheckbox :size="40" :checked="done" />
            <h2 id="contacto-h2" class="contact-item-title text-item" tabindex="-1">
              <span class="strike">{{ clientWork ? t('contact.itemProject') : t('contact.itemWrite') }}</span>
            </h2>
          </div>
          <p class="section-intro">{{ t('contact.sub') }}</p>
        </div>

        <!-- Form card -->
        <div class="contact-card card col-span-full lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
          <form
            ref="formEl"
            class="contact-form"
            :class="{ 'is-sent': done }"
            method="post"
            :action="formAction"
            :enctype="isWeb3 ? undefined : 'text/plain'"
            aria-labelledby="contacto-h2"
            @submit.prevent="submit()"
          >
            <div class="contact-field">
              <label class="contact-label" :for="FIELD_IDS.name">{{ t('contact.f.name') }}</label>
              <input
                :id="FIELD_IDS.name"
                ref="nameEl"
                v-model="fields.name"
                class="contact-input"
                type="text"
                name="name"
                autocomplete="name"
                autocapitalize="words"
                required
                :maxlength="FIELD_MAX.name"
                :readonly="done"
                :aria-invalid="errors.name ? 'true' : undefined"
                :aria-describedby="errors.name ? ERROR_IDS.name : undefined"
                @input="onInput('name', $event)"
              >
              <p v-if="errors.name" :id="ERROR_IDS.name" class="contact-err">{{ t(errors.name) }}</p>
            </div>

            <div class="contact-field">
              <label class="contact-label" :for="FIELD_IDS.email">{{ t('contact.f.email') }}</label>
              <input
                :id="FIELD_IDS.email"
                ref="emailEl"
                v-model="fields.email"
                class="contact-input"
                type="email"
                inputmode="email"
                name="email"
                autocomplete="email"
                autocapitalize="off"
                spellcheck="false"
                required
                :maxlength="FIELD_MAX.email"
                :readonly="done"
                :aria-invalid="errors.email ? 'true' : undefined"
                :aria-describedby="errors.email ? ERROR_IDS.email : undefined"
                @input="onInput('email', $event)"
              >
              <p v-if="errors.email" :id="ERROR_IDS.email" class="contact-err">{{ t(errors.email) }}</p>
            </div>

            <div class="contact-field">
              <label class="contact-label" :for="FIELD_IDS.company">{{ t('contact.f.company') }}</label>
              <input
                :id="FIELD_IDS.company"
                ref="companyEl"
                v-model="fields.company"
                class="contact-input"
                type="text"
                name="company"
                autocomplete="organization"
                :maxlength="FIELD_MAX.company"
                :readonly="done"
                @input="onInput('company', $event)"
              >
            </div>

            <div class="contact-field">
              <label class="contact-label" :for="FIELD_IDS.message">{{ t('contact.f.message') }}</label>
              <textarea
                :id="FIELD_IDS.message"
                ref="messageEl"
                v-model="fields.message"
                class="contact-input contact-textarea paper"
                name="message"
                rows="6"
                required
                :maxlength="FIELD_MAX.message"
                :placeholder="t('contact.f.messagePh')"
                :readonly="done"
                :aria-invalid="errors.message ? 'true' : undefined"
                :aria-describedby="errors.message ? ERROR_IDS.message : undefined"
                @input="onInput('message', $event)"
              ></textarea>
              <p v-if="errors.message" :id="ERROR_IDS.message" class="contact-err">{{ t(errors.message) }}</p>
              <!-- Always laid out (JS only), so the button appearing after a draft restore never shifts the form. -->
              <div class="contact-regen" data-js-only>
                <button
                  type="button"
                  class="contact-textbtn"
                  :class="{ 'is-off': !canRegenerate }"
                  @click="regenerate"
                >
                  {{ t('contact.regenerate') }}
                </button>
              </div>
            </div>

            <!-- Honeypot (Web3Forms): checked → pretend success, send nothing -->
            <input
              v-model="fields.botcheck"
              type="checkbox"
              name="botcheck"
              class="hidden"
              tabindex="-1"
              autocomplete="off"
              aria-hidden="true"
            >
            <template v-if="isWeb3">
              <input type="hidden" name="access_key" :value="web3formsKey">
              <input type="hidden" name="subject" :value="subject">
              <input type="hidden" name="from_name" :value="FROM_NAME">
            </template>

            <div class="contact-submit-row">
              <button
                type="submit"
                class="btn-outline contact-submit w-full sm:w-auto"
                :aria-disabled="busy || done ? 'true' : undefined"
                :aria-describedby="isWeb3 ? undefined : 'contact-mailnote'"
              >
                <template v-if="isWeb3">
                  <span class="swap">
                    <span :class="{ 'is-off': busy }">{{ t('contact.submit') }}</span>
                    <span :class="{ 'is-off': !busy }">{{ t('contact.sending') }}</span>
                  </span>
                  <ArrowIcon />
                </template>
                <template v-else>
                  <MailIcon />
                  <span>{{ t('contact.submitMail') }}</span>
                </template>
              </button>
              <p v-if="!isWeb3" id="contact-mailnote" class="contact-note">{{ t('contact.mailNote') }}</p>
            </div>

            <!-- Message area (§12): one polite status region; every variant is stacked in a
                 .swap, so the tallest reserves the height and swapping never shifts layout. -->
            <div class="contact-msg" role="status" aria-live="polite">
              <div v-if="messageAreaOpen" class="swap contact-msg-swap">
                <p v-if="isWeb3" class="contact-msg-layer" :class="{ 'is-off': status !== 'sending' }">
                  {{ t('contact.sending') }}
                </p>

                <i18n-t
                  keypath="contact.success"
                  tag="p"
                  scope="global"
                  class="contact-msg-layer contact-msg-success"
                  :class="{ 'is-off': status !== 'success' }"
                >
                  <template #email><strong class="contact-addr">{{ fields.email.trim() }}</strong></template>
                </i18n-t>

                <div v-if="isWeb3" class="contact-msg-layer" :class="{ 'is-off': status !== 'error' }">
                  <i18n-t keypath="contact.error" tag="p" scope="global">
                    <template #email>
                      <a id="contact-error-email" class="link contact-addr" :href="mailHref">{{ links.email }}</a>
                    </template>
                  </i18n-t>
                  <div class="contact-msg-actions">
                    <button
                      type="button"
                      class="contact-minibtn"
                      aria-describedby="contact-error-email"
                      @click="copyEmail(copyForMessage, 'contact-error-email')"
                    >
                      <span class="swap">
                        <CopyIcon :class="{ 'is-off': messageCopied }" />
                        <CheckIcon :class="{ 'is-off': !messageCopied }" />
                      </span>
                      <span class="swap">
                        <span :class="{ 'is-off': messageCopied }">{{ t('contact.copy') }}</span>
                        <span :class="{ 'is-off': !messageCopied }">{{ t('contact.copied') }}</span>
                      </span>
                    </button>
                    <button type="button" class="contact-minibtn" @click="tryMail">
                      <MailIcon />
                      <span>{{ t('contact.tryMail') }}</span>
                    </button>
                  </div>
                </div>

                <div class="contact-msg-layer" :class="{ 'is-off': status !== 'handoff' }">
                  <p>{{ t('contact.handoff') }}</p>
                  <div class="contact-msg-actions">
                    <span id="contact-handoff-email" class="contact-addr">{{ links.email }}</span>
                    <button
                      type="button"
                      class="contact-minibtn"
                      aria-describedby="contact-handoff-email"
                      @click="copyEmail(copyForMessage, 'contact-handoff-email')"
                    >
                      <span class="swap">
                        <CopyIcon :class="{ 'is-off': messageCopied }" />
                        <CheckIcon :class="{ 'is-off': !messageCopied }" />
                      </span>
                      <span class="swap">
                        <span :class="{ 'is-off': messageCopied }">{{ t('contact.copy') }}</span>
                        <span :class="{ 'is-off': !messageCopied }">{{ t('contact.copied') }}</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Privacy first layer (ADAPTATIONS D: Web3Forms named only in web3forms mode) -->
            <i18n-t keypath="contact.privacy" tag="p" scope="global" class="contact-privacy">
              <template #processor>
                <template v-if="isWeb3">{{ t('contact.privacyProcessor') }}{{ ' ' }}</template>
              </template>
              <template #email>
                <a class="link contact-addr" :href="mailHref">{{ links.email }}</a>
              </template>
              <template #legal>
                <a class="link" href="#legal" @click="openLegal">{{ t('contact.privacyLegal') }}</a>
              </template>
            </i18n-t>
          </form>
        </div>

        <!-- Availability, next steps, direct routes, trilingual line -->
        <div class="contact-more col-span-full lg:col-span-5 lg:col-start-1 lg:row-start-2">
          <p v-if="clientWork" class="contact-availability measure">{{ t('contact.availability') }}</p>

          <div v-if="clientWork" class="contact-block">
            <h3 class="text-h3">{{ t('contact.next.title') }}</h3>
            <ol class="contact-next measure">
              <li>{{ t('contact.next.1') }}</li>
              <li>{{ t('contact.next.2') }}</li>
              <li>{{ t('contact.next.3') }}</li>
            </ol>
          </div>

          <div class="contact-block">
            <h3 class="text-h3">{{ t('contact.direct') }}</h3>
            <ul class="contact-routes" role="list">
              <li class="contact-route">
                <a class="contact-route-link" :href="mailHref">
                  <MailIcon />
                  <span id="contact-route-email" class="contact-route-text contact-addr">{{ links.email }}</span>
                </a>
                <button
                  type="button"
                  class="contact-minibtn"
                  data-js-only
                  aria-describedby="contact-route-email"
                  @click="copyEmail(copyForRoute, 'contact-route-email')"
                >
                  <span class="swap">
                    <CopyIcon :class="{ 'is-off': routeCopied }" />
                    <CheckIcon :class="{ 'is-off': !routeCopied }" />
                  </span>
                  <span class="swap">
                    <span :class="{ 'is-off': routeCopied }">{{ t('contact.copy') }}</span>
                    <span :class="{ 'is-off': !routeCopied }">{{ t('contact.copied') }}</span>
                  </span>
                </button>
              </li>
              <li v-if="waHref" class="contact-route">
                <a class="contact-route-link" :href="waHref" target="_blank" rel="noopener">
                  <svg
                    class="icon"
                    viewBox="0 0 24 24"
                    width="1em"
                    height="1em"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M4.6 19.4l1.1-3.5a8 8 0 1 1 2.9 2.7z" />
                  </svg>
                  <span class="contact-route-text">{{ t('brand.whatsapp') }}</span>{{ ' ' }}<span class="sr-only">{{ t('a11y.newTab') }}</span>
                </a>
              </li>
              <li class="contact-route">
                <a class="contact-route-link" :href="links.linkedin" target="_blank" rel="noopener">
                  <LinkedInIcon />
                  <span class="contact-route-text">{{ t('brand.linkedin') }}</span>{{ ' ' }}<span class="sr-only">{{ t('a11y.newTab') }}</span>
                </a>
              </li>
            </ul>
          </div>

          <p class="contact-tri">
            <span lang="es">{{ t('contact.trilingual.es') }}</span>{{ ' ' }}<span lang="ca">{{ t('contact.trilingual.ca') }}</span>{{ ' ' }}<span lang="en">{{ t('contact.trilingual.en') }}</span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
/* ==========================================================================
   ContactFinale (§6.5, §7C, §12). Unscoped, every class prefixed "contact-".
   Shared classes used as is: .section .wrap .page-grid .eyebrow .section-intro
   .measure .card .paper .strike .swap/.is-off .link .btn-outline .icon
   ========================================================================== */

/* ---- grid: intro + more in cols 1–5, form card in cols 7–12 (≥1024) ---------- */
.contact-grid {
  align-items: start;
}
@media (width >= 64rem) {
  /* rows: intro (auto) + more (1fr); the card spans both, so its height lands in
     the flexible row and never opens a gap between the sub and the availability */
  .contact-grid {
    grid-template-rows: auto 1fr;
  }
}

/* ---- the contact item: 40px box + H2 in .strike ------------------------------- */
.contact-item {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  column-gap: 14px;
  align-items: start;
  font-size: var(--text-item);
  line-height: var(--text-item--line-height);
}
/* centre the box on the H2's first line (28px → 44px type) */
.contact-item .mbox {
  margin-top: calc((var(--text-item--line-height) * 1em - 40px) / 2);
}
/* §7C: the strike draws (480ms, .strike), the tick follows (240ms, 360ms delay) */
.contact-item .tick {
  transition-delay: 360ms;
}

/* ---- form card ------------------------------------------------------------------ */
.contact-card {
  margin-top: 32px;
  padding: 16px;
}
@media (width >= 30rem) {
  .contact-card {
    padding: 24px;
  }
}
@media (width >= 48rem) {
  .contact-card {
    margin-top: 48px;
  }
}
@media (width >= 64rem) {
  .contact-card {
    margin-top: 0;
    padding: 32px;
  }
}

.contact-field + .contact-field {
  margin-top: 20px;
}
.contact-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 700;
  font-size: var(--text-small);
  line-height: 1.4;
  color: var(--ink);
}

/* §12 fields: ≥52px, 17px text, 1.5px --line-strong; --ink on focus; --accent-ink when invalid */
.contact-input {
  display: block;
  width: 100%;
  min-height: 52px;
  margin: 0;
  padding: 12px 14px;
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.5;
  color: var(--ink);
  background-color: var(--surface);
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius);
  appearance: none;
  transition: border-color var(--dur-instant) linear;
}
.contact-input::placeholder {
  color: var(--muted);
  opacity: 1;
}
.contact-input:focus {
  border-color: var(--ink);
}
.contact-input[aria-invalid="true"] {
  border-color: var(--accent-ink);
}
.contact-textarea {
  resize: vertical;
}

.contact-err {
  margin-top: 6px;
  font-weight: 700;
  font-size: var(--text-small);
  line-height: 1.4;
  color: var(--ink);
}

/* regenerate: a reserved 44px row under the textarea */
.contact-regen {
  display: flex;
  align-items: center;
  min-height: 44px;
  margin-top: 4px;
}
.contact-textbtn {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: var(--text-small);
  line-height: 1.3;
  color: var(--ink);
  text-align: left;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
  cursor: pointer;
  touch-action: manipulation;
}
.contact-textbtn:hover {
  text-decoration-thickness: 2px;
}
.contact-textbtn.is-off {
  visibility: hidden;
}

/* submit: ink fill (vermilion stays reserved for the hero and sticky CTAs) */
.contact-submit-row {
  margin-top: 12px;
}
.contact-submit {
  background: var(--ink);
  color: var(--bg);
  border-color: var(--ink);
}
.contact-submit:hover {
  background: var(--ink);
}
.contact-submit .swap {
  justify-items: center;
}
.contact-submit[aria-disabled="true"] {
  cursor: progress;
}
.contact-submit[aria-disabled="true"]:active {
  translate: none;
}
.contact-form.is-sent .contact-submit {
  cursor: default;
}
.contact-note {
  margin-top: 8px;
  font-size: var(--text-small);
  line-height: 1.4;
  color: var(--muted);
}

/* message area */
.contact-msg-swap {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--ink);
}
.contact-msg-layer > * + * {
  margin-top: 10px;
}
.contact-msg-success {
  font-weight: 700;
}
.contact-msg-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.contact-msg-actions > .contact-addr {
  margin-right: auto;
  font-size: var(--text-small);
}
.contact-addr {
  overflow-wrap: anywhere;
  hyphens: none;
}
span.contact-addr,
strong.contact-addr {
  font-weight: 700;
}

/* small secondary buttons: Copiar, Probar desde mi correo (44px targets) */
.contact-minibtn {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 10px;
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius);
  background: transparent;
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: var(--text-small);
  line-height: 1.2;
  color: var(--ink);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.contact-minibtn:hover {
  border-color: var(--ink);
}
.contact-minibtn:active {
  translate: 0 1px;
}

/* privacy first layer: 13px, muted */
.contact-privacy {
  margin-top: 16px;
  max-width: 62ch;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--muted);
}

/* ---- availability, next steps, routes, trilingual -------------------------------- */
.contact-more {
  margin-top: 48px;
}
@media (width >= 64rem) {
  .contact-more {
    margin-top: 24px;
  }
}
.contact-block {
  margin-top: 40px;
}
.contact-more > :first-child {
  margin-top: 0;
}

.contact-next {
  margin-top: 16px;
  padding-left: 1.5em;
  list-style: decimal;
}
.contact-next > li {
  padding-left: 0.25em;
}
.contact-next > li + li {
  margin-top: 10px;
}
.contact-next > li::marker {
  font-weight: 700;
  color: var(--ink);
}

/* direct routes: 56px rows (48px on desktop) with 1px dividers. Below 480px the
   text is 15px so "address + Copiar" stays on one row down to 360px (ES, widest). */
.contact-routes {
  margin-top: 16px;
  border-top: 1px solid var(--line);
}
.contact-route {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  min-height: 56px;
  padding-block: 6px;
  border-bottom: 1px solid var(--line);
}
@media (width >= 64rem) {
  .contact-route {
    min-height: 48px;
    padding-block: 2px;
  }
}
.contact-route-link {
  display: inline-flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 44px;
  font-weight: 700;
  font-size: var(--text-small);
  color: var(--ink);
  text-decoration: none;
}
@media (width >= 30rem) {
  .contact-route-link {
    gap: 10px;
    font-size: inherit;
  }
}
.contact-route-link .icon {
  width: 1.25rem;
  height: 1.25rem;
}
.contact-route-link:hover .contact-route-text {
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.2em;
}

.contact-tri {
  margin-top: 32px;
  font-size: var(--text-small);
  line-height: 1.5;
  color: var(--muted);
}

@media (forced-colors: active) {
  .contact-input[aria-invalid="true"] {
    border-width: 3px;
  }
  .contact-minibtn {
    border-color: ButtonText;
  }
}
</style>
