<template>
    <header>
        <nav class="navbar navbar-expand-lg bg-white shadow-sm">
            <div class="container">
                <a class="navbar-brand" href="/">
                    <!-- <img src="@/assets/logo.png" alt="Logo" width="30" height="30"
                        class="d-inline-block align-text-top"> -->
                    <span class="secondary">Dani</span>dev
                </a>
                <BButton class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </BButton>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item" v-for="item in navItems" :key="item.text">
                            <RouterLink class="nav-link" :to="item.link">{{ item.text }}</RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script setup>
import { BButton } from 'bootstrap-vue-next';
import { RouterLink } from 'vue-router'
const navItems = [
    { text: 'Home', link: '/' },
    { text: 'Projects', link: '/projects' },
    { text: 'Contact', link: '/contact' },
    { text: 'About me', link: '/about' },
]
</script>

<style scoped lang="scss">
@import '@/assets/custom.scss';

.secondary {
    color: map-get($theme-colors, 'secondary');
}
</style>
