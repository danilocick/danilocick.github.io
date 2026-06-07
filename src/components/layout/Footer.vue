<template>
    <footer class="mt-6 bg-gray-900 text-center text-white">
        <div class="container mx-auto px-4 py-3">
            <div class="flex justify-center">
                <a v-for="value in socialLinks" :key="value.label" :href="value.url"
                    class="mx-2 text-white transition hover:opacity-75" :aria-label="value.label"
                    :title="t('footer.visit', { name: value.label })" target="_blank" rel="noopener">
                    <i :class="`bi bi-${value.icon.toLowerCase()}`" class="text-2xl"></i>
                </a>
            </div>
            <hr class="my-3 border-white/20" />
            <span>© {{ currentYear }} Daniel Hernández Martín</span>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const currentYear = new Date().getFullYear()

const socialLinks = [
    { icon: 'github', url: 'https://github.com/danilocick', label: 'GitHub' },
    { icon: 'linkedin', url: 'https://www.linkedin.com/in/daniel-hernandez-martin/', label: 'LinkedIn' },
    { icon: 'envelope', url: 'mailto:danidevhdez@gmail.com', label: 'Email' }
]
</script>
