<script setup lang="ts">
// §4 + §6.6 StickyCta (<1024 only): a 68px bar with one full-width 52px vermilion
// button, shown only while useUiState().stickyVisible holds (hero CTA out of view,
// #contacto not intersecting, no text field focused, form not sent, menu closed).
// Hidden = inert + aria-hidden="true" + translateY(100%).
// SSR and hydration always render the hidden state (heroCtaVisible starts true), so
// there is no mismatch and nothing slides on load. Without JS it is never rendered.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowIcon } from './icons'
import { useTaskSelection } from '../composables/useTaskSelection'
import { useUiState } from '../composables/useUiState'

const { t } = useI18n()
const { stickyVisible, goToContact } = useUiState()
const { count } = useTaskSelection()

const hidden = computed(() => !stickyVisible.value)
</script>

<template>
  <aside
    class="sticky-cta"
    :class="{ 'is-shown': stickyVisible }"
    :aria-label="t('sticky.label')"
    :aria-hidden="hidden ? 'true' : undefined"
    :inert="hidden"
    data-js-only
  >
    <div class="wrap">
      <!-- a real link without JS; with JS goToContact() syncs the message, scrolls and focuses the form -->
      <a href="#contacto" class="btn-primary sticky-cta-btn w-full" @click="goToContact">
        <span>{{ t('sticky.cta', count) }}</span>
        <ArrowIcon />
      </a>
    </div>
  </aside>
</template>

<style>
/* Bar: 68px + safe area (main already reserves the same space below 1024). */
.sticky-cta {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  /* min-height: a 2-line label (text zoom, 320px CA) grows the bar instead of clipping */
  min-height: calc(68px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--bg);
  border-top: 1px solid var(--line);
  /* hidden: slid out below the viewport; visibility flips after the slide so it can
     never peek out (iOS toolbar / overscroll) */
  transform: translateY(100%);
  visibility: hidden;
  transition:
    transform 220ms var(--ease-out),
    visibility 0s linear 220ms;
}
.sticky-cta.is-shown {
  transform: none;
  visibility: visible;
  transition:
    transform 220ms var(--ease-out),
    visibility 0s linear 0s;
}

/* Full width; slim side padding keeps the widest label (CA, 241px) on one line at 320px.
   The label is centred, so the padding is invisible at wider sizes. */
.sticky-cta-btn {
  padding-inline: 8px;
}

/* ≥1024: TaskTicket + the sticky header take over. Short viewports: no fixed bars (§4). */
@media (width >= 64rem) {
  .sticky-cta { display: none; }
}
@media (max-height: 32rem) {
  .sticky-cta { display: none; }
}
@media print {
  .sticky-cta { display: none; }
}
/* Reduced motion: the global rule removes the transition → the bar appears instantly. */
</style>
