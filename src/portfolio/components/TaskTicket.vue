<script setup lang="ts">
// §6.3 TaskTicket — the sticky "Tu lista" aside next to the picker (≥1024; the
// parent hides it below that and without JS). Reads the shared selection:
//   count · the selected `.short` labels (ticked + ringed, never struck) ·
//   the "Otra" text when it counts · the fixed last item (the contact item) ·
//   the outline CTA (goToContact) · "Borrar selección" when n > 0.
// §7C: after a successful send (useUiState().contactDone) the fixed item is
// crossed out and ticked like the contact H2; the selected tasks stay as they are.
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MarkerCheckbox from './MarkerCheckbox.vue'
import { ArrowIcon } from './icons'
import { clientWork } from '../config/site'
import { useTaskSelection } from '../composables/useTaskSelection'
import { useUiState } from '../composables/useUiState'

const { t } = useI18n()
const { count, shortKeys, other, otherActive, clear } = useTaskSelection()
const { contactDone, goToContact, announce } = useUiState()

const itemKey = clientWork ? 'contact.itemProject' : 'contact.itemWrite'

const ctaEl = ref<HTMLAnchorElement | null>(null)

function onClear(): void {
  clear()
  announce(t('picker.live', 0), 400)
  // the clear button disappears with the selection: keep focus in the ticket
  ctaEl.value?.focus()
}
</script>

<template>
  <aside class="ticket card paper" aria-labelledby="ticket-title">
    <h3 id="ticket-title" class="text-h3">{{ t('ticket.title') }}</h3>
    <p class="ticket-count text-small text-muted">{{ t('ticket.count', count) }}</p>

    <p v-if="count === 0" class="ticket-empty text-small text-muted">{{ t('ticket.empty') }}</p>

    <ul class="ticket-list" role="list">
      <li v-for="key in shortKeys" :key="key" class="ticket-item ticket-pick">
        <MarkerCheckbox :size="16" checked ring />
        <span class="ticket-text">{{ t(key) }}</span>
      </li>
      <li v-if="otherActive" key="other" class="ticket-item ticket-pick">
        <MarkerCheckbox :size="16" checked ring />
        <span class="ticket-text">{{ other.trim() }}</span>
      </li>
      <li class="ticket-item ticket-fixed" :class="{ 'is-done': contactDone }">
        <MarkerCheckbox :size="16" :checked="contactDone" />
        <span class="ticket-text"><span class="strike">{{ t(itemKey) }}</span></span>
      </li>
    </ul>

    <a ref="ctaEl" href="#contacto" class="btn-outline ticket-cta w-full" @click="goToContact">
      <span>{{ t('picker.cta', count) }}</span>
      <ArrowIcon />
    </a>

    <button v-if="count > 0" type="button" class="ticket-clear" @click="onClear">
      {{ t('ticket.clear') }}
    </button>
  </aside>
</template>

<style>
/* §6.3: sticky at top 88px (64px header + 24), --surface + cuadrícula, 6px radius,
   24px padding. Border/background/radius come from .card, the grid from .paper. */
.ticket {
  position: sticky;
  top: 88px;
  padding: 24px;
}
/* short desktop viewports: a sticky panel taller than the screen would hide its CTA */
@media (max-height: 40rem) {
  .ticket {
    position: static;
  }
}

.ticket-count {
  margin-top: 4px;
}
.ticket-empty {
  margin-top: 16px;
}

.ticket-list {
  display: grid;
  row-gap: 10px;
  margin-top: 16px;
}
.ticket-item {
  display: grid;
  grid-template-columns: 16px minmax(0, 1fr);
  column-gap: 12px;
  align-items: start;
  font-size: var(--text-chore);
  line-height: 1.33;
  font-weight: 700;
}
/* centre the 16px box on the first text line */
.ticket-item > .mbox {
  margin-top: calc((var(--text-chore) * 1.33 - 16px) / 2);
}
.ticket-text {
  min-width: 0;
  overflow-wrap: anywhere; /* the free "Otra" text can be anything */
}
/* the fixed contact item closes the list */
.ticket-fixed {
  margin-top: 6px;
}
/* §7C: struck + ticked like the contact H2 (strike 480ms; tick 240ms after 360ms) */
.ticket-fixed .tick {
  transition-delay: 360ms;
}

/* a newly ticked task draws its tick and ring as it lands on the list */
@starting-style {
  .ticket-pick .tick,
  .ticket-pick .mark-ring {
    stroke-dashoffset: 1.001;
  }
}

/* outline CTA (never a second vermilion fill); solid paper behind the label */
.ticket-cta {
  margin-top: 24px;
  background: var(--surface);
}
.ticket-cta:hover {
  background: var(--surface-2);
}

/* text button, 44px target */
.ticket-clear {
  display: block;
  min-height: 44px;
  margin: 8px auto 0;
  padding-inline: 12px;
  background: transparent;
  color: var(--muted);
  font-size: var(--text-small);
  font-weight: 700;
  line-height: 1.4;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
  cursor: pointer;
  touch-action: manipulation;
}
.ticket-clear:hover {
  color: var(--ink);
  text-decoration-thickness: 2px;
}
</style>
