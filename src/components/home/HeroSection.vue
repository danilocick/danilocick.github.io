<template>
    <section id="home" class="hero-section relative flex min-h-screen items-center text-white">
        <div class="container mx-auto px-4">
            <div class="grid items-center gap-12 lg:grid-cols-12">

                <!-- Text -->
                <div class="text-center lg:col-span-7 lg:text-left">
                    <h1 class="mb-4 text-5xl font-bold md:text-6xl">{{ t('hero.greeting') }}</h1>
                    <p class="mx-auto mb-2 max-w-2xl text-xl md:text-2xl lg:mx-0">
                        {{ t('hero.role') }}
                    </p>
                    <p class="mb-6 text-lg opacity-75">{{ t('hero.stack') }}</p>

                    <div class="mb-12 flex flex-wrap justify-center gap-4 lg:justify-start">
                        <BaseButton href="#proyectos" variant="light" size="lg">
                            <i class="bi bi-grid-3x3-gap"></i>{{ t('hero.ctaProjects') }}
                        </BaseButton>
                        <BaseButton href="#contacto" variant="outline-light" size="lg">
                            <i class="bi bi-envelope"></i>{{ t('hero.ctaContact') }}
                        </BaseButton>
                        <BaseButton href="/cv.pdf" download variant="outline-light" size="lg">
                            <i class="bi bi-file-earmark-arrow-down"></i>{{ t('hero.ctaCv') }}
                        </BaseButton>
                    </div>

                    <!-- Metrics -->
                    <div class="flex flex-wrap justify-center gap-6 lg:justify-start">
                        <div v-for="m in metrics" :key="m.label" class="text-center lg:text-left">
                            <div class="text-2xl font-bold leading-none">{{ m.value }}</div>
                            <span class="text-sm opacity-75">{{ t(m.label) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Avatar -->
                <div class="text-center lg:col-span-5">
                    <div class="avatar-wrapper mx-auto">
                        <img src="@/assets/userImage.jpeg" alt="Daniel Hernández" class="avatar-img" />
                    </div>
                    <div class="mt-4 flex flex-wrap justify-center gap-2">
                        <span class="rounded-full bg-white/20 px-3 py-1 text-sm ring-1 ring-white/30">
                            <i class="bi bi-geo-alt mr-1"></i>{{ t('hero.location') }}
                        </span>
                        <span class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm ring-1 ring-white/30">
                            <span class="relative flex h-2 w-2">
                                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                <span class="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
                            </span>
                            {{ t('hero.available') }}
                        </span>
                    </div>
                </div>

            </div>
        </div>
        <!-- Wave divider -->
        <div class="hero-wave">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
                <path fill="var(--bg, #fff)" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"/>
            </svg>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { BaseButton } from '@/components/ui'
const { t } = useI18n()

const metrics = [
    { value: '3+', label: 'hero.metricYears' },
    { value: '10+', label: 'hero.metricApps' },
    { value: '2', label: 'hero.metricStacks' },
]
</script>

<style scoped>
.hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.avatar-wrapper {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 0;
}

.hero-wave svg {
    display: block;
    width: 100%;
    height: 60px;
}
</style>
