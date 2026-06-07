<template>
    <section id="contacto" class="py-20">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <span class="kicker">{{ t('contact.kicker') }}</span>
                <h2 class="text-3xl font-bold md:text-4xl">{{ t('contact.title') }}</h2>
                <p class="mt-2 text-muted">{{ t('contact.subtitle') }}</p>
            </div>
            <div class="flex justify-center">
                <div class="w-full lg:w-2/3">
                    <div class="grid gap-4 md:grid-cols-3">
                        <a v-for="link in links" :key="link.label" :href="link.href"
                            :target="link.external ? '_blank' : undefined" rel="noopener"
                            class="contact-card flex items-center gap-4 rounded-lg p-6 text-white no-underline"
                            :style="{ background: link.gradient }">
                            <div class="icon-circle flex shrink-0 items-center justify-center rounded-full bg-white/25">
                                <i :class="['bi', link.icon, 'text-lg']"></i>
                            </div>
                            <div>
                                <div class="font-semibold">{{ link.label }}</div>
                                <div class="text-sm opacity-75">{{ link.sub }}</div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const links = [
    {
        label: 'Email',
        sub: 'danidevhdez@gmail.com',
        icon: 'bi-envelope-fill',
        href: 'mailto:danidevhdez@gmail.com',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
        external: false,
    },
    {
        label: 'LinkedIn',
        sub: 'daniel-hernandez-martin',
        icon: 'bi-linkedin',
        href: 'https://www.linkedin.com/in/daniel-hernandez-martin/',
        gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        external: true,
    },
    {
        label: 'GitHub',
        sub: 'danilocick',
        icon: 'bi-github',
        href: 'https://github.com/danilocick',
        gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        external: true,
    },
]
</script>

<style scoped>
.contact-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.contact-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
.icon-circle {
    width: 44px;
    height: 44px;
}
</style>
