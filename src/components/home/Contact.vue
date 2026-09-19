<template>
    <section id="contacto" class="py-20">
        <div class="container mx-auto px-4">
            <div class="mb-8 text-center">
                <span class="kicker">{{ t('contact.kicker') }}</span>
                <h2 class="text-3xl font-bold md:text-4xl">{{ t('contact.title') }}</h2>
                <p class="mt-2 text-muted">{{ t('contact.subtitle') }}</p>
            </div>

            <!-- Línea de confianza -->
            <div class="mb-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
                <span class="inline-flex items-center gap-2">
                    <span class="relative flex h-2 w-2">
                        <span
                            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                        <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    {{ t('contact.trustAvailable') }}
                </span>
                <span class="inline-flex items-center gap-2"><i class="bi bi-clock-history text-primary"></i>{{
                    t('contact.trustResponse') }}</span>
                <span class="inline-flex items-center gap-2"><i class="bi bi-geo-alt text-primary"></i>{{
                    t('contact.trustLocation') }}</span>
            </div>

            <div class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
                <!-- Formulario -->
                <BaseCard class="p-6 lg:col-span-3">
                    <h3 class="mb-4 text-lg font-semibold">{{ t('contact.formTitle') }}</h3>
                    <ContactForm />
                </BaseCard>

                <!-- Canales directos + testimonio -->
                <div class="space-y-3 lg:col-span-2">
                    <p class="text-sm font-semibold text-muted">{{ t('contact.channelsTitle') }}</p>

                    <a v-for="link in links" :key="link.label" :href="link.href"
                        :target="link.external ? '_blank' : undefined" rel="noopener"
                        class="contact-card flex items-center gap-3 rounded-lg p-4 text-white no-underline"
                        :style="{ background: link.gradient }">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/25">
                            <i :class="['bi', link.icon]"></i>
                        </div>
                        <div class="min-w-0">
                            <div class="text-sm font-semibold">{{ link.label }}</div>
                            <div class="truncate text-xs opacity-75">{{ link.sub }}</div>
                        </div>
                    </a>

                    <!-- Testimonio (placeholder honesto — pendiente de contenido real) -->
                    <!-- <BaseCard class="border-dashed p-5">
                        <i class="bi bi-quote text-3xl leading-none text-primary/40"></i>
                        <p class="mt-1 text-sm italic text-muted">“{{ t('contact.testimonialQuote') }}”</p>
                        <p class="mt-2 text-xs font-semibold">{{ t('contact.testimonialAuthor') }}</p>
                        <span class="mt-2 inline-block rounded bg-warning/15 px-2 py-0.5 text-[0.65rem] font-semibold text-yellow-700 dark:text-yellow-500">
                            {{ t('contact.testimonialHint') }}
                        </span>
                    </BaseCard> -->
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { BaseCard } from '@/components/ui'
import ContactForm from './ContactForm.vue'
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
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.contact-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}
</style>
