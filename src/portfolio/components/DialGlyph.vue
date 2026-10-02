<script setup lang="ts">
// Motif 1 — the dial: a 1.5px ink circle, a bar handle with a tip dot.
// Pure SVG, aria-hidden. Colour = currentColor (set `color` on a parent).
// The handle is at A MANO (-45°) by default; rotation is driven by CSS:
//   - `fixed="auto"` / `fixed="man"` pins the position (logo, favicon-like uses);
//   - without `fixed`, a parent rule rotates `.dial-glyph .handle`
//     (e.g. ChoreCard: `.hero:has(#mode-auto:checked) .dial .handle { rotate: 45deg }`).
withDefaults(
  defineProps<{
    size?: 24 | 48 | 56
    fixed?: 'man' | 'auto'
  }>(),
  { size: 24, fixed: undefined },
)
</script>

<template>
  <svg
    class="dial-glyph"
    :class="fixed ? `is-${fixed}` : undefined"
    :width="size"
    :height="size"
    viewBox="0 0 56 56"
    aria-hidden="true"
    focusable="false"
  >
    <circle class="dial-ring" cx="28" cy="28" r="24" />
    <g class="handle">
      <rect class="dial-bar" x="24.5" y="8" width="7" height="40" rx="3.5" />
      <circle class="dial-tip" cx="28" cy="13" r="1.6" />
    </g>
  </svg>
</template>

<style>
.dial-glyph {
  display: block;
  flex: none;
  overflow: visible;
}
.dial-glyph .dial-ring,
.dial-glyph .dial-bar {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
}
.dial-glyph .dial-tip {
  fill: currentColor;
}
.dial-glyph .handle {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  rotate: -45deg;
}
.dial-glyph.is-auto .handle {
  rotate: 45deg;
}
.dial-glyph.is-man .handle {
  rotate: -45deg;
}
</style>
