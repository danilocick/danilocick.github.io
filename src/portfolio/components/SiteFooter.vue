<script setup lang="ts">
// §6.7 Footer: 1px top rule, --surface-2 band; 3 columns ≥1024, 2 + 1 at 768–1023, stacked below.
//   1 · identity line, LinkedIn / GitHub / CV, © year
//   2 · language (full LangSwitch) and theme (ThemeSwitch, JS only)
//   3 · <details id="legal"> (§11 + ADAPTATIONS D), colophon, "Volver arriba"
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LangSwitch from './LangSwitch.vue'
import ThemeSwitch from './ThemeSwitch.vue'
import { ArrowIcon, ArrowUpIcon } from './icons'
import { CV_DOWNLOAD_NAME, links } from '../content/profile'
import { contactMode, legal as legalInfo } from '../config/site'

const { t } = useI18n()

const mailto = `mailto:${links.email}`

// footer.copyright "© {year}": the prerender bakes the build year into the HTML. On the
// client the visitor's year is rendered; when it differs (after New Year, before the next
// build) data-allow-mismatch="text" lets hydration patch the text silently — same length,
// so nothing shifts and no mismatch is logged.
const year = new Date().getFullYear()

// <details id="legal"> also opens when reached through its fragment (the contact privacy
// link, or a shared /#legal URL). The contact form's link opens it on click as well.
const legalEl = ref<HTMLDetailsElement | null>(null)

function openLegalFromHash(): void {
  if (window.location.hash === '#legal' && legalEl.value && !legalEl.value.open) legalEl.value.open = true
}

onMounted(() => {
  openLegalFromHash()
  window.addEventListener('hashchange', openLegalFromHash)
})
onBeforeUnmount(() => {
  window.removeEventListener('hashchange', openLegalFromHash)
})
</script>

<template>
  <footer class="site-footer">
    <div class="wrap page-grid site-footer-grid">
      <!-- 1 · identity + links + year -->
      <div class="site-footer-col col-span-full md:col-span-4 lg:col-span-4">
        <p class="site-footer-id">{{ t('footer.line') }}</p>
        <ul class="site-footer-links" role="list">
          <li>
            <a :href="links.linkedin" class="site-footer-link" target="_blank" rel="noopener">
              {{ t('brand.linkedin') }}<span class="sr-only">{{ ' ' + t('a11y.newTab') }}</span>
            </a>
          </li>
          <li>
            <a :href="links.github" class="site-footer-link" target="_blank" rel="noopener">
              {{ t('brand.github') }}<span class="sr-only">{{ ' ' + t('a11y.newTab') }}</span>
            </a>
          </li>
          <li>
            <a :href="links.cv" :download="CV_DOWNLOAD_NAME" type="application/pdf" class="site-footer-link">
              {{ t('about.cv') }}
            </a>
          </li>
        </ul>
        <p class="site-footer-copy" data-allow-mismatch="text">{{ t('footer.copyright', { year }) }}</p>
      </div>

      <!-- 2 · language + theme -->
      <div class="site-footer-col col-span-full md:col-span-4 lg:col-span-4">
        <div class="site-footer-group">
          <p id="footer-lang-label" class="label site-footer-label">{{ t('lang.label') }}</p>
          <!-- the visible label names the list (LangSwitch then drops its own aria-label) -->
          <LangSwitch variant="full" aria-labelledby="footer-lang-label" />
        </div>
        <!-- theme radios need JS (localStorage + data-theme); without it the OS setting rules.
             The fieldset's own <legend> is the visible "Tema" label (one name, read once). -->
        <div class="site-footer-group" data-js-only>
          <ThemeSwitch name="theme-footer" show-legend />
        </div>
      </div>

      <!-- 3 · legal, colophon, back to top -->
      <div class="site-footer-col col-span-full lg:col-span-4">
        <details id="legal" ref="legalEl" class="site-footer-legal">
          <summary class="site-footer-summary">
            <ArrowIcon class="site-footer-summary-icon" />
            <span>{{ t('footer.legal') }}</span>
          </summary>
          <div class="site-footer-legal-body">
            <h2 class="label site-footer-legal-title">{{ t('legal.noticeTitle') }}</h2>
            <!-- NIF / Domicilio render only once filled in config/site.ts (never a TODO to visitors) -->
            <ul class="site-footer-legal-facts" role="list">
              <li>{{ t('legal.holder', { name: t('brand.fullName') }) }}</li>
              <li v-if="legalInfo.nif">{{ t('legal.nif', { nif: legalInfo.nif }) }}</li>
              <li v-if="legalInfo.address">{{ t('legal.address', { address: legalInfo.address }) }}</li>
              <i18n-t keypath="legal.email" tag="li" scope="global">
                <template #email>
                  <a :href="mailto" class="link">{{ links.email }}</a>
                </template>
              </i18n-t>
              <li>{{ t('legal.activity') }}</li>
            </ul>

            <h2 class="label site-footer-legal-title">{{ t('legal.privacyTitle') }}</h2>
            <!-- Web3Forms is named only when the form really goes through it (ADAPTATIONS D) -->
            <i18n-t keypath="legal.privacy" tag="p" scope="global">
              <template #processor>{{
                contactMode === 'web3forms' ? t('legal.privacyProcessor') : t('legal.privacyNoProcessor')
              }}</template>
              <template #email>
                <a :href="mailto" class="link">{{ links.email }}</a>
              </template>
              <template #aepd>
                <a href="https://www.aepd.es" hreflang="es" class="link" target="_blank" rel="noopener">
                  {{ t('legal.aepd') }}<span class="sr-only">{{ ' ' + t('a11y.newTab') }}</span>
                </a>
              </template>
            </i18n-t>

            <h2 class="label site-footer-legal-title">{{ t('legal.cookiesTitle') }}</h2>
            <p>{{ t('legal.cookies') }}</p>
          </div>
        </details>

        <p class="site-footer-colophon">{{ t('footer.colophon') }}</p>

        <a href="#inicio" class="site-footer-link site-footer-top">
          <ArrowUpIcon />
          <span>{{ t('footer.top') }}</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<style>
/* Band: 1px --line rule on --surface-2. Below 1024 the StickyCta bar (68px + safe area)
   can be showing at the very end of the page, so the footer keeps its last line clear of it. */
.site-footer {
  border-top: 1px solid var(--line);
  background: var(--surface-2);
  font-size: var(--text-small);
  line-height: 1.5;
  padding-top: 48px;
  padding-bottom: calc(48px + 68px + env(safe-area-inset-bottom));
}
@media (width < 64rem) and (max-height: 32rem) {
  /* short viewports: no sticky bar (§4) */
  .site-footer { padding-bottom: calc(48px + env(safe-area-inset-bottom)); }
}
@media (width >= 64rem) {
  .site-footer {
    padding-top: 64px;
    padding-bottom: calc(64px + env(safe-area-inset-bottom));
  }
}

.site-footer-grid { row-gap: 40px; }
@media (width >= 64rem) {
  .site-footer-grid { row-gap: 0; }
}

.site-footer-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

/* Column 1 */
.site-footer-id {
  color: var(--ink);
  font-weight: 700;
}
.site-footer-links {
  display: flex;
  flex-wrap: wrap;
  column-gap: 24px;
  margin-top: 4px;
}
.site-footer-copy {
  margin-top: 4px;
  color: var(--muted);
}

/* Footer links: ink, underlined, 44px touch targets; 17px like the LangSwitch / ThemeSwitch
   controls next to them (the band's running text stays 15px) */
.site-footer-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  font-size: 1.0625rem;
  line-height: 1.25;
  color: var(--ink);
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.18em;
}
.site-footer-link:hover { text-decoration-thickness: 2px; }

/* Column 2 */
.site-footer-group { width: 100%; }
.site-footer-group + .site-footer-group { margin-top: 24px; }
.site-footer-label {
  margin-bottom: 4px;
  color: var(--muted);
}

/* Column 3: legal disclosure */
.site-footer-legal {
  align-self: stretch;
}
.site-footer-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  width: fit-content;
  max-width: 100%;
  list-style: none;
  color: var(--ink);
  font-size: 1.0625rem;
  line-height: 1.25;
  font-weight: 700;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.site-footer-summary::-webkit-details-marker { display: none; }
.site-footer-summary:hover span {
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.18em;
}
/* → closed, ↓ open (no animation: only marker drawings move on this page) */
.site-footer-summary-icon { color: var(--muted); }
.site-footer-legal[open] > .site-footer-summary .site-footer-summary-icon { rotate: 90deg; }

.site-footer-legal-body {
  max-width: 62ch;
  padding: 4px 0 8px;
  color: var(--ink);
}
.site-footer-legal-title { margin-top: 20px; }
.site-footer-legal-title:first-child { margin-top: 8px; }
.site-footer-legal-body > :not(h2) { margin-top: 6px; }
.site-footer-legal-facts > li + li { margin-top: 2px; }
.site-footer-legal-body .link { overflow-wrap: anywhere; }

.site-footer-colophon {
  max-width: 62ch;
  margin-top: 16px;
  color: var(--muted);
}
.site-footer-top { margin-top: 8px; }

@media print {
  .site-footer { padding-bottom: 48px; }
}
</style>
