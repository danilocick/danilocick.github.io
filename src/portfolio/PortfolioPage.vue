<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import ProblemPicker from './components/ProblemPicker.vue'
import AboutSection from './components/AboutSection.vue'
import ContactFinale from './components/ContactFinale.vue'
import StickyCta from './components/StickyCta.vue'
import SiteFooter from './components/SiteFooter.vue'
import { caseStudy, experience, guides, links, problems, quickFacts, stack, testimonials } from './content/profile'
import { useInView } from './composables/useInView'
import { useUiState } from './composables/useUiState'
import { safeRemove, STORAGE_KEYS } from './utils/storage'

const { t } = useI18n()
const { scrolled, liveMessage } = useUiState()

// Only confirmed rows ever render (Oropelius stays hidden until confirmed).
const confirmedExperience = experience.filter((e) => e.confirmed)

// Header IO sentinel: the header's bottom border turns --line once it leaves the viewport.
const sentinel = ref<HTMLElement | null>(null)
const { inView: atTop } = useInView(sentinel, { initial: true })
watch(atTop, (v) => {
  scrolled.value = !v
})

onMounted(() => {
  // legacy key from the old site: the URL decides the language now
  safeRemove('local', STORAGE_KEYS.legacyLocale)
})
</script>

<template>
  <a class="skip-link" href="#contenido">{{ t('a11y.skip') }}</a>
  <SiteHeader />
  <main id="contenido" tabindex="-1">
    <div ref="sentinel" class="top-sentinel" aria-hidden="true"></div>
    <HeroSection />
    <ProblemPicker :problems="problems" />
    <AboutSection
      :case-study="caseStudy"
      :experience="confirmedExperience"
      :facts="quickFacts"
      :stack="stack"
      :guides="guides"
      :testimonials="testimonials"
    />
    <ContactFinale :links="links" />
  </main>
  <StickyCta />
  <SiteFooter />
  <div id="live" class="sr-only" role="status" aria-live="polite" aria-atomic="true">{{ liveMessage }}</div>
</template>
