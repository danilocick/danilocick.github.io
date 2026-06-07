<template>
    <section id="documentacion" class="bg-soft py-20">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <span class="kicker">{{ t('docsPreview.kicker') }}</span>
                <h2 class="text-3xl font-bold md:text-4xl">{{ t('docsPreview.title') }}</h2>
            </div>
            <div class="grid gap-6 lg:grid-cols-2">

                <!-- Artículo 1 -->
                <BaseCard class="h-full p-6">
                    <div class="flex items-start">
                        <div class="mr-4 rounded bg-primary/10 p-4">
                            <i class="bi bi-file-text text-2xl text-primary"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="mb-2 text-lg font-semibold">{{ t('docsPreview.a1Title') }}</h3>
                            <p class="mb-4 text-muted">{{ t('docsPreview.a1Desc') }}</p>
                            <div class="flex items-center justify-between">
                                <BaseBadge variant="primary">Vue.js</BaseBadge>
                                <BaseButton to="/docs" variant="outline-primary" size="sm">{{ t('docsPreview.readMore') }}</BaseButton>
                            </div>
                        </div>
                    </div>
                </BaseCard>

                <!-- Artículo 2 -->
                <BaseCard class="h-full p-6">
                    <div class="flex items-start">
                        <div class="mr-4 rounded bg-accent/10 p-4">
                            <i class="bi bi-file-code text-2xl text-accent"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="mb-2 text-lg font-semibold">{{ t('docsPreview.a2Title') }}</h3>
                            <p class="mb-4 text-muted">{{ t('docsPreview.a2Desc') }}</p>
                            <div class="flex items-center justify-between">
                                <BaseBadge variant="accent">ASP.NET</BaseBadge>
                                <BaseButton to="/docs" variant="outline-primary" size="sm">{{ t('docsPreview.readMore') }}</BaseButton>
                            </div>
                        </div>
                    </div>
                </BaseCard>

                <!-- Artículo 3 -->
                <BaseCard class="h-full p-6">
                    <div class="flex items-start">
                        <div class="mr-4 rounded bg-secondary/10 p-4">
                            <i class="bi bi-database text-2xl text-secondary"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="mb-2 text-lg font-semibold">{{ t('docsPreview.a3Title') }}</h3>
                            <p class="mb-4 text-muted">{{ t('docsPreview.a3Desc') }}</p>
                            <div class="flex items-center justify-between">
                                <BaseBadge variant="secondary">PostgreSQL</BaseBadge>
                                <BaseButton to="/docs" variant="outline-primary" size="sm">{{ t('docsPreview.readMore') }}</BaseButton>
                            </div>
                        </div>
                    </div>
                </BaseCard>

                <!-- Artículo 4 -->
                <BaseCard class="h-full p-6">
                    <div class="flex items-start">
                        <div class="mr-4 rounded bg-primary/10 p-4">
                            <i class="bi bi-lightbulb text-2xl text-primary"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="mb-2 text-lg font-semibold">{{ t('docsPreview.a4Title') }}</h3>
                            <p class="mb-4 text-muted">{{ t('docsPreview.a4Desc') }}</p>
                            <div class="flex items-center justify-between">
                                <BaseBadge variant="soft">{{ t('docsPreview.a4Badge') }}</BaseBadge>
                                <BaseButton to="/docs" variant="outline-primary" size="sm">{{ t('docsPreview.readMore') }}</BaseButton>
                            </div>
                        </div>
                    </div>
                </BaseCard>

            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { BaseCard, BaseBadge, BaseButton } from '@/components/ui'
const { t } = useI18n()
</script>
