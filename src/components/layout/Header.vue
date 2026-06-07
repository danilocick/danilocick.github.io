<template>
    <header class="site-header" :class="{ 'is-scrolled': isScrolled }">
        <div class="header-inner container">

            <!-- Brand -->
            <RouterLink class="ms-5 brand" to="/" @click="closeMenu">
                <span class="brand-bracket">&lt;</span><span class="brand-name">dani</span><span
                    class="brand-dev">dev</span><span class="brand-bracket">/&gt;</span>
                <span class="brand-dot"></span>
            </RouterLink>

            <!-- Desktop nav -->
            <nav class="desktop-nav">
                <RouterLink v-for="item in navItems" :key="item.label" :to="item.link" class="nav-link"
                    active-class="nav-link--active">
                    <i :class="item.icon"></i>
                    {{ t(item.label) }}
                </RouterLink>
            </nav>

            <!-- Actions -->
            <div class="header-actions">
                <!-- Language switcher -->
                <div ref="langRef" class="lang-switch">
                    <button class="icon-btn" @click="langOpen = !langOpen" :aria-label="t('nav.language')"
                        aria-haspopup="true" :aria-expanded="langOpen">
                        <i class="bi bi-translate"></i>
                    </button>
                    <div v-if="langOpen" class="lang-menu">
                        <button v-for="l in locales" :key="l.code" class="lang-item"
                            :class="{ 'lang-item--active': locale === l.code }" @click="changeLocale(l.code)">
                            {{ l.label }}
                        </button>
                    </div>
                </div>
                <button class="icon-btn" @click="theme.toggle()"
                    :title="theme.dark ? t('nav.themeLight') : t('nav.themeDark')">
                    <i class="bi" :class="theme.dark ? 'bi-sun-fill' : 'bi-moon-fill'"></i>
                </button>
                <RouterLink to="/contact" class="cta-btn" @click="closeMenu">
                    {{ t('nav.contact') }}
                    <i class="bi bi-arrow-right ml-1"></i>
                </RouterLink>
                <button class="burger" @click="toggleMenu" :aria-expanded="!isCollapsed" aria-label="Menú">
                    <span :class="{ open: !isCollapsed }"></span>
                </button>
            </div>
        </div>

        <!-- Mobile menu -->
        <div class="mobile-menu" :class="{ 'mobile-menu--open': !isCollapsed }">
            <RouterLink v-for="item in navItems" :key="item.label" :to="item.link" class="mobile-link"
                active-class="mobile-link--active" @click="closeMenu">
                <i :class="item.icon" class="mr-2"></i>{{ t(item.label) }}
            </RouterLink>
            <RouterLink to="/contact" class="mobile-cta" @click="closeMenu">
                <i class="bi bi-chat-dots mr-2"></i>{{ t('nav.contact') }}
            </RouterLink>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { SUPPORTED_LOCALES, setLocale, type LocaleCode } from '@/i18n'

const { t, locale } = useI18n()
const theme = useThemeStore()
const isCollapsed = ref(true)
const isScrolled = ref(false)
const langOpen = ref(false)
const langRef = ref<HTMLElement | null>(null)
const locales = SUPPORTED_LOCALES

const navItems = [
    { label: 'nav.home', link: '/', icon: 'bi bi-house-door' },
    { label: 'nav.projects', link: '/projects', icon: 'bi bi-grid-3x3-gap' },
    { label: 'nav.docs', link: '/docs', icon: 'bi bi-book' },
]

function changeLocale(code: LocaleCode) {
    setLocale(code)
    langOpen.value = false
}

function toggleMenu() { isCollapsed.value = !isCollapsed.value }
function closeMenu() { if (window.innerWidth < 992) isCollapsed.value = true }

function handleScroll() { isScrolled.value = window.scrollY > 40 }
function handleClickOutside(e: MouseEvent) {
    if (langRef.value && !langRef.value.contains(e.target as Node)) langOpen.value = false
}
onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ── Base ────────────────────────────────────────────── */
.site-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transition: background 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease;
    padding: 1.1rem 0;
    background: transparent;
}

.site-header.is-scrolled {
    background: color-mix(in srgb, var(--bg) 75%, transparent);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08), 0 4px 24px rgba(0, 0, 0, 0.06);
    padding: 0.65rem 0;
}

/* ── Inner ───────────────────────────────────────────── */
.header-inner {
    display: flex;
    align-items: center;
    gap: 2rem;
}

/* ── Brand ───────────────────────────────────────────── */
.brand {
    text-decoration: none;
    font-size: 1.35rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.05rem;
    flex-shrink: 0;
    transition: transform 0.2s ease;
}

.brand:hover {
    transform: scale(1.04);
}

.brand-bracket {
    color: #667eea;
    font-weight: 400;
    opacity: 0.7;
}

.brand-name {
    color: #06b6d4;
}

.brand-dev {
    color: var(--fg);
}

.brand-dot {
    width: 7px;
    height: 7px;
    background: #22c55e;
    border-radius: 50%;
    margin-left: 6px;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.25);
    animation: pulse-dot 2.5s ease-in-out infinite;
}

@keyframes pulse-dot {

    0%,
    100% {
        box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.25);
    }

    50% {
        box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.1);
    }
}

/* ── Desktop nav ─────────────────────────────────────── */
.desktop-nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-left: auto;
}

@media (max-width: 991.98px) {
    .desktop-nav {
        display: none;
    }
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--fg);
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
}

.nav-link i {
    font-size: 0.85rem;
    opacity: 0.7;
}

.nav-link:hover {
    background: rgba(102, 126, 234, 0.09);
    color: #667eea;
}

.nav-link.nav-link--active {
    background: rgba(102, 126, 234, 0.12);
    color: #667eea;
    font-weight: 600;
}

/* ── Actions ─────────────────────────────────────────── */
.header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

.icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--fg);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    font-size: 0.9rem;
}

.icon-btn:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
    color: #667eea;
}

.cta-btn {
    display: flex;
    align-items: center;
    padding: 0.45rem 1.1rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    transition: filter 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 3px 12px rgba(102, 126, 234, 0.35);
}

.cta-btn:hover {
    filter: brightness(0.94);
    transform: translateY(-1px);
    box-shadow: 0 5px 18px rgba(102, 126, 234, 0.45);
    color: #fff;
}

@media (max-width: 991.98px) {
    .cta-btn {
        display: none;
    }
}

/* ── Burger ──────────────────────────────────────────── */
.burger {
    display: none;
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
}

@media (max-width: 991.98px) {
    .burger {
        display: flex;
    }
}

.burger span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--fg);
    border-radius: 2px;
    transition: all 0.25s ease;
    position: relative;
}

.burger span::before,
.burger span::after {
    content: '';
    position: absolute;
    left: 0;
    width: 22px;
    height: 2px;
    background: var(--fg);
    border-radius: 2px;
    transition: all 0.25s ease;
}

.burger span::before {
    top: -7px;
}

.burger span::after {
    top: 7px;
}

.burger span.open {
    background: transparent;
}

.burger span.open::before {
    transform: rotate(45deg);
    top: 0;
}

.burger span.open::after {
    transform: rotate(-45deg);
    top: 0;
}

/* ── Mobile menu ─────────────────────────────────────── */
.mobile-menu {
    display: none;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem 1rem 1rem;
    background: var(--bg);
    border-top: 1px solid var(--line);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

@media (max-width: 991.98px) {
    .mobile-menu {
        display: flex;
        max-height: 0;
        overflow: hidden;
        padding: 0 1rem;
        transition: max-height 0.3s ease, padding 0.3s ease;
        border-top: none;
        box-shadow: none;
    }
}

.mobile-menu.mobile-menu--open {
    max-height: 400px;
    padding: 0.75rem 1rem 1rem;
    border-top: 1px solid var(--line);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.mobile-link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-weight: 500;
    color: var(--fg);
    text-decoration: none;
    transition: background 0.2s;
}

.mobile-link:hover,
.mobile-link.mobile-link--active {
    background: rgba(102, 126, 234, 0.09);
    color: #667eea;
}

.mobile-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;
    padding: 0.75rem;
    border-radius: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    transition: filter 0.2s;
}

.mobile-cta:hover {
    filter: brightness(0.94);
    color: #fff;
}

/* ── Language switcher ───────────────────────────────── */
.lang-switch {
    position: relative;
}

.lang-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 150px;
    display: flex;
    flex-direction: column;
    padding: 0.35rem;
    border-radius: 12px;
    background: var(--surface);
    border: 1px solid var(--line);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    z-index: 1100;
}

.lang-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--fg);
    font-size: 0.9rem;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.lang-item:hover {
    background: rgba(102, 126, 234, 0.09);
    color: #667eea;
}

.lang-item--active {
    background: rgba(102, 126, 234, 0.12);
    color: #667eea;
    font-weight: 600;
}
</style>
