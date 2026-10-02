<script setup lang="ts">
// Motif 2 (+ motif 4) — the hand-drawn checkbox: a wobbly square, one marker
// tick and an optional marker ring. Purely visual (aria-hidden): the native
// <input> lives in the parent (usually a sr-only checkbox inside the same <label>).
//
// Checked state, either:
//   - `checked` prop → `.mbox.is-checked` (ticket items, contact item), or
//   - CSS: any `<label>` containing a checked checkbox (picker rows, no JS), or
//   - a parent rule of your own (ChoreCard: `.hero:has(#mode-auto:checked) .chores .tick`).
// Drawing = stroke-dashoffset 1 → 0 on `.tick` / `.mark-ring` (portfolio.css).
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    checked?: boolean
    size: 16 | 22 | 24 | 40
    ring?: boolean
  }>(),
  { checked: false, ring: false },
)

// Rendered stroke widths in CSS px, converted to viewBox units (viewBox is 24).
const TICK_PX: Record<16 | 22 | 24 | 40, number> = { 16: 2, 22: 2.25, 24: 2.5, 40: 3.5 }
const unit = computed(() => 24 / props.size)
const boxWidth = computed(() => +(1.5 * unit.value).toFixed(3))
const tickWidth = computed(() => +(TICK_PX[props.size] * unit.value).toFixed(3))
const ringWidth = computed(() => +(2 * unit.value).toFixed(3))
</script>

<template>
  <span
    class="mbox"
    :class="{ 'is-checked': checked, 'has-ring': ring }"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <svg viewBox="0 0 24 24" :width="size" :height="size" focusable="false" overflow="visible">
      <path
        v-if="ring"
        class="mark-ring"
        pathLength="1"
        :stroke-width="ringWidth"
        d="M13 -4.4C22.6 -4 28.8 3.4 28.4 12.6C28 21.4 20.8 28.6 11.8 28.4C3 28.2 -4.6 21.2 -4.4 12C-4.2 3.2 3.2 -4.6 11.4 -4.6C14.4 -4.6 17.2 -3.8 19.6 -2.4"
      />
      <path
        class="mbox-box"
        :stroke-width="boxWidth"
        d="M1.6 2.1C8.4 1.5 15.6 1.4 22.3 1.8C22.8 8.5 22.7 15.2 22.4 21.9C15.5 22.4 8.6 22.4 1.7 22.1C1.2 15.4 1.1 8.7 1.6 2.1Z"
      />
      <path
        class="tick"
        pathLength="1"
        :stroke-width="tickWidth"
        d="M5.5 12.4C7.2 13.9 8.8 15.7 10.1 17.7C13.1 11.8 17.7 6.1 24.5 0.5"
      />
    </svg>
  </span>
</template>

<style>
.mbox {
  display: inline-block;
  position: relative;
  flex: none;
  vertical-align: middle;
}
.mbox > svg {
  display: block;
  overflow: visible;
}
</style>
