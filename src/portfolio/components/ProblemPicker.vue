<script setup lang="ts">
// §6.3 + §7B — #que-resuelvo: the visitor ticks their own problems and those
// ticks write the contact message (useTaskSelection, read by useContactForm).
//
// - Each row is a <label> wrapping a sr-only native checkbox, a 24px MarkerCheckbox
//   with ring and the pain text. Tick + ring draw from pure CSS
//   (`label:has(input:checked)` in portfolio.css), so rows work without JS.
//   Nothing is ever crossed out here.
// - Answer, tech line and optional case link sit outside the label, in
//   #p-<id>-desc, referenced by the checkbox's aria-describedby.
// - "Otra": the label wraps only the checkbox + "Otra cosa:"; the text input is a
//   sibling. ≥3 typed characters check the box, clearing the text unchecks it.
// - TaskTicket renders at ≥1024 only (CSS), and only with JS (its state is JS state).
//   It follows the fieldset in the DOM, so the keyboard path is rows, "Otra", then
//   the ticket CTA; the grid places it in columns 9–12, spanning the list rows so
//   the sticky ticket travels with them. The closing link comes last.
// - SSR always renders an empty selection; the stored one is restored in onMounted
//   by useTaskSelection (no hydration mismatch).
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import MarkerCheckbox from './MarkerCheckbox.vue'
import TaskTicket from './TaskTicket.vue'
import { ArrowIcon } from './icons'
import type { Problem, ProblemId } from '../content/types'
import { OTHER_MAX, useTaskSelection } from '../composables/useTaskSelection'
import { useUiState } from '../composables/useUiState'

const props = defineProps<{ problems: Problem[] }>()

/** value of the "Otra" checkbox (never a ProblemId) */
const OTHER_VALUE = 'otra'

const { t } = useI18n()
const { count, other, otherOn, isSelected, set, setOther, setOtherOn } = useTaskSelection()
const { announce, goToContact } = useUiState()

const listEl = ref<HTMLFieldSetElement | null>(null)

/** §6.3 live region: "Has marcado {n} tareas", debounced 400ms (a newer call cancels a pending one). */
function announceCount(): void {
  announce(t('picker.live', count.value), 400)
}

function onToggle(id: ProblemId, event: Event): void {
  // follow the native state (robust against double events / pre-hydration clicks)
  set(id, (event.target as HTMLInputElement).checked)
  announceCount()
}

function onOtherToggle(event: Event): void {
  const before = count.value
  setOtherOn((event.target as HTMLInputElement).checked)
  // "Otra" only counts once it has text: announce only real count changes
  if (count.value !== before) announceCount()
}

/** v-model target for the "Otra" text (v-model keeps IME composition intact). */
const otherText = computed<string>({
  get: () => other.value,
  set: (value) => {
    const before = count.value
    setOther(value)
    // announce when typing checks/unchecks the row, never per keystroke
    if (count.value !== before) announceCount()
  },
})

const isExternal = (url?: string) => !!url && /^https?:\/\//i.test(url)

function isProblemId(value: string): value is ProblemId {
  return props.problems.some((p) => p.id === value)
}

onMounted(() => {
  // Rows ticked before hydration: SSR renders every box unticked, hydration does not
  // patch `checked` and autocomplete="off" stops browser form-state restore, so a box
  // that is checked now was ticked by the visitor. Merge it into the (already
  // restored, see useTaskSelection) selection so state and screen agree.
  listEl.value?.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((box) => {
    if (!box.checked) return
    if (box.value === OTHER_VALUE) setOtherOn(true)
    else if (isProblemId(box.value)) set(box.value, true)
  })
})
</script>

<template>
  <section id="que-resuelvo" class="picker section" aria-labelledby="picker-h2">
    <div class="wrap page-grid">
      <div class="col-span-full lg:col-[1/span_8]">
        <p class="eyebrow">{{ t('picker.eyebrow') }}</p>
        <h2 id="picker-h2" class="text-h2" tabindex="-1">{{ t('picker.h2') }}</h2>
        <p class="section-intro">{{ t('picker.intro') }}</p>
      </div>

      <fieldset
        ref="listEl"
        class="picker-list section-body col-span-full lg:col-[1/span_7] lg:row-[2]"
        aria-labelledby="picker-h2"
      >
        <div v-for="p in problems" :key="p.id" class="picker-item">
          <label class="picker-row">
            <input
              class="sr-only"
              type="checkbox"
              name="tasks"
              :value="p.id"
              autocomplete="off"
              :aria-describedby="`p-${p.id}-desc`"
              :checked="isSelected(p.id)"
              @change="onToggle(p.id, $event)"
            />
            <MarkerCheckbox :size="24" ring />
            <span class="picker-pain text-pain font-bold text-ink">{{ t(p.painKey) }}</span>
          </label>
          <div :id="`p-${p.id}-desc`" class="picker-desc">
            <p class="picker-answer text-body text-ink">{{ t(p.answerKey) }}</p>
            <p class="picker-tech text-small text-muted">
              <span class="font-bold" aria-hidden="true">{{ t('picker.techPrefix') }}</span>
              <span class="sr-only">{{ t('picker.techPrefixSr') }}</span>
              {{ t(p.techKey) }}
            </p>
            <p v-if="p.caseUrl" class="picker-case text-small">
              <a
                v-if="isExternal(p.caseUrl)"
                :href="p.caseUrl"
                class="link picker-case-link"
                target="_blank"
                rel="noopener"
              >
                <span>{{ t('picker.caseLink') }}</span>
                <ArrowIcon />
                <span class="sr-only">{{ t('a11y.newTab') }}</span>
              </a>
              <a v-else :href="p.caseUrl" class="link picker-case-link">
                <span>{{ t('picker.caseLink') }}</span>
                <ArrowIcon />
              </a>
            </p>
          </div>
        </div>

        <div class="picker-item picker-other">
          <label class="picker-row">
            <input
              class="sr-only"
              type="checkbox"
              name="tasks"
              :value="OTHER_VALUE"
              autocomplete="off"
              :checked="otherOn"
              @change="onOtherToggle"
            />
            <MarkerCheckbox :size="24" ring />
            <span class="picker-pain text-pain font-bold text-ink">{{ t('picker.other.label') }}</span>
          </label>
          <input
            id="picker-other-text"
            v-model="otherText"
            class="picker-other-input"
            type="text"
            name="tasks-other"
            :maxlength="OTHER_MAX"
            autocomplete="off"
            enterkeyhint="done"
            :aria-label="t('picker.other.aria')"
            :placeholder="t('picker.other.placeholder')"
          />
        </div>
      </fieldset>

      <div class="picker-aside section-body hidden lg:block lg:col-[9/span_4] lg:row-[2/span_2]" data-js-only>
        <TaskTicket />
      </div>

      <p class="picker-closing text-body col-span-full lg:col-[1/span_7] lg:row-[3]">
        <a href="#contacto" class="link" @click="goToContact">{{ t('picker.closing') }}</a>
      </p>
    </div>
  </section>
</template>

<style>
/* ---- §6.3 picker rows ---------------------------------------------------- */

/* a fieldset defaults to min-inline-size:min-content (would overflow at 320px) */
.picker-list {
  min-inline-size: 0;
}

/* rows separated by 1px --line */
.picker-item {
  position: relative;
  isolation: isolate;
  border-bottom: 1px solid var(--line);
}
.picker-item:first-child {
  border-top: 1px solid var(--line);
}

/* --surface-2 hover band, slightly wider than the text column (pointer devices only) */
@media (hover: hover) {
  .picker-item::before {
    content: "";
    position: absolute;
    inset: 0 -12px;
    z-index: -1;
    background: var(--surface-2);
    visibility: hidden;
    pointer-events: none;
  }
  .picker-item:has(> .picker-row:hover)::before {
    visibility: visible;
  }
}

/* The label is the whole top band of the row: ≥56px hit area, 24px top padding. */
.picker-row {
  position: relative; /* anchors the sr-only checkbox (no scroll jump on focus) */
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  column-gap: 16px;
  align-items: start;
  min-height: 56px;
  padding-block: 24px 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
/* centre the 24px box on the first line of the pain text (line-height 1.4) */
.picker-row > .mbox {
  margin-top: calc((var(--text-pain) * 1.4 - 24px) / 2);
}
.picker-pain {
  min-width: 0;
}

/* answer + tech + case link, indented 40px (24px box + 16px gap) */
.picker-desc {
  padding: 0 0 24px 40px;
}
.picker-answer,
.picker-tech {
  max-width: 62ch;
}
.picker-tech {
  margin-top: 6px;
}
.picker-case {
  margin-top: 8px;
}
.picker-case-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 44px;
}

/* ---- "Otra" row ------------------------------------------------------------- */
.picker-other {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  padding-bottom: 24px;
}
.picker-other-input {
  min-width: 0;
  min-height: 52px;
  margin-left: 40px;
  padding: 12px 14px;
  -webkit-appearance: none;
  appearance: none;
  border: 1.5px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--ink);
  line-height: 1.4;
}
.picker-other-input::placeholder {
  color: var(--muted);
  opacity: 1;
}
.picker-other-input:hover,
.picker-other-input:focus {
  border-color: var(--ink);
}

/* ≥768: label and input share one line */
@media (width >= 48rem) {
  .picker-other {
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 16px;
    align-items: center;
    padding-block: 16px;
  }
  .picker-other > .picker-row {
    align-items: center;
    padding-block: 0;
  }
  .picker-other > .picker-row > .mbox {
    margin-top: 0;
  }
  .picker-other-input {
    margin-left: 0;
    max-width: 36rem;
  }
}

/* ---- after the list ---------------------------------------------------------- */
.picker-closing {
  margin-top: 32px;
}

/* the aside stretches over the list rows, so the sticky ticket travels with them */
.picker-aside {
  min-width: 0;
}

@media (forced-colors: active) {
  .picker-other-input {
    border-color: CanvasText;
  }
}
</style>
