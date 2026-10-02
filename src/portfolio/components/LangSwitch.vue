<script setup lang="ts">
// §6.0 / §9 — language links. The URL decides the language: three real links to
// '/', '/ca/', '/en/' (work without JS), each with its own `lang` + `hreflang`,
// `aria-current="page"` on the page's own locale.
//   compact (header ≥1024): "ES · CA · EN" — visible code aria-hidden + sr-only "CA, Català"
//   full    (menu, footer): visible endonyms "Castellano · Català · English"
// With JS, activating a link carries `location.hash`, so /ca/#experiencia keeps the
// reader's place (the href is updated at activation time, so ctrl/⌘/middle-click and
// "open in new tab" from the context menu carry it too).
// Named by `lang.label` ("Idioma") unless the parent passes aria-labelledby (fallthrough).
import { useI18n } from 'vue-i18n'
import type { Locale } from '../content/types'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{
  variant: 'compact' | 'full'
}>()

const { t } = useI18n()
const { locale, SUPPORTED, hrefFor } = useLocale()

/** Point the link at the same place in the other language right before the browser follows it. */
function carryHash(event: MouseEvent, l: Locale): void {
  const a = event.currentTarget
  if (!(a instanceof HTMLAnchorElement)) return
  const hash = window.location.hash
  a.href = hrefFor(l) + (hash.length > 1 ? hash : '')
}
</script>

<template>
  <ul
    class="lang-switch"
    :class="`lang-switch--${props.variant}`"
    :aria-label="$attrs['aria-labelledby'] ? undefined : t('lang.label')"
  >
    <li v-for="(l, i) in SUPPORTED" :key="l" class="lang-switch-item">
      <span v-if="i > 0" class="lang-switch-sep" aria-hidden="true">·</span>
      <a
        class="lang-switch-link"
        :href="hrefFor(l)"
        :hreflang="l"
        :lang="l"
        :aria-current="l === locale ? 'page' : undefined"
        @click="carryHash($event, l)"
        @auxclick="carryHash($event, l)"
        @contextmenu="carryHash($event, l)"
      >
        <template v-if="props.variant === 'compact'">
          <span aria-hidden="true">{{ t(`lang.short.${l}`) }}</span>
          <span class="sr-only">{{ t('lang.compactSr', { short: t(`lang.short.${l}`), name: t(`lang.names.${l}`) }) }}</span>
        </template>
        <template v-else>{{ t(`lang.names.${l}`) }}</template>
      </a>
    </li>
  </ul>
</template>

<style>
.lang-switch {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}
.lang-switch-item {
  display: flex;
  align-items: center;
}
.lang-switch-sep {
  padding-inline: 0.125rem;
  color: var(--muted);
  user-select: none;
}
.lang-switch-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding-inline: 0.375rem;
  color: var(--ink);
  line-height: 1.25;
  white-space: nowrap;
  text-decoration: none;
  text-underline-offset: 0.25em;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
.lang-switch-link:hover {
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
}
/* the page's own language: 2px ink underline (same signal as the nav's aria-current) */
.lang-switch-link[aria-current="page"] {
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
}

/* compact: "ES · CA · EN", 44×44 targets */
.lang-switch--compact .lang-switch-link {
  min-width: 44px;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

/* full: endonyms; the current one is 700 (fixed per page, so no shift) */
.lang-switch--full {
  column-gap: 0.125rem;
}
.lang-switch--full .lang-switch-link {
  font-size: 1.0625rem;
  font-weight: 400;
}
/* first endonym aligns with the label above it */
.lang-switch--full .lang-switch-item:first-child .lang-switch-link {
  padding-inline-start: 0;
}
.lang-switch--full .lang-switch-link[aria-current="page"] {
  font-weight: 700;
}
</style>
