<script setup lang="ts">
// §9 — native radiogroup Sistema / Claro / Oscuro (footer + mobile menu; no header button).
// State is shared through useTheme(): SSR and hydration render "Sistema" checked, the real
// preference is restored in onMounted (same boxes, so nothing shifts). JS only: the
// root carries data-js-only (without JS the OS setting themes the page).
// The fieldset is always named by its <legend> ("Tema"). The legend is sr-only by default,
// for parents that already show their own visible label (footer). Pass `show-legend` to
// show it in label style (menu). A parent's aria-labelledby falls through to the fieldset.
import { useI18n } from 'vue-i18n'
import { useTheme, type ThemePreference } from '../composables/useTheme'

const props = withDefaults(
  defineProps<{
    /** radio group name, unique per instance (e.g. 'theme-menu', 'theme-footer') */
    name: string
    showLegend?: boolean
  }>(),
  { showLegend: false },
)

const OPTIONS: readonly ThemePreference[] = ['system', 'light', 'dark']

const { t } = useI18n()
const { preference, setPreference } = useTheme()
</script>

<template>
  <fieldset class="theme-switch" data-js-only>
    <legend :class="props.showLegend ? 'label theme-switch-legend' : 'sr-only'">{{ t('theme.label') }}</legend>
    <div class="theme-switch-options">
      <label v-for="o in OPTIONS" :key="o" class="theme-switch-option">
        <input
          class="theme-switch-input"
          type="radio"
          :name="props.name"
          :value="o"
          :checked="preference === o"
          @change="setPreference(o)"
        />
        <span>{{ t(`theme.${o}`) }}</span>
      </label>
    </div>
  </fieldset>
</template>

<style>
.theme-switch {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
.theme-switch-legend {
  padding: 0;
  color: var(--muted);
}
.theme-switch-options {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1.25rem;
}
.theme-switch-legend + .theme-switch-options {
  margin-top: 0.25rem;
}
.theme-switch-option {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  font-size: 1.0625rem;
  line-height: 1.25;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
/* Flat radio: 1.5px --line-strong ring (≥3:1 on bg, surface and surface-2); checked = ink
   ring + 10px ink dot (background-clip keeps the padding transparent on any band). */
.theme-switch-input {
  -webkit-appearance: none;
  appearance: none;
  flex: none;
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 3.5px;
  border: 1.5px solid var(--line-strong);
  border-radius: 50%;
  background-color: transparent;
  background-clip: content-box;
  cursor: pointer;
  transition:
    border-color var(--dur-instant) linear,
    background-color var(--dur-instant) linear;
}
.theme-switch-option:hover .theme-switch-input {
  border-color: var(--ink);
}
.theme-switch-input:checked {
  border-color: var(--ink);
  background-color: var(--ink);
}

/* High contrast: hand the control back to the system so the checked state stays visible */
@media (forced-colors: active) {
  .theme-switch-input {
    -webkit-appearance: auto;
    appearance: auto;
    width: 18px;
    height: 18px;
    padding: 0;
    border: 0;
    background: none;
  }
}
</style>
