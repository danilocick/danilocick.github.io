<template>
    <section id="proyectos" class="py-20">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <span class="kicker">{{ t('projects.kicker') }}</span>
                <h2 class="text-3xl font-bold md:text-4xl">{{ t('projects.title') }}</h2>
            </div>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                <BaseCard class="h-full p-6">
                    <div class="mb-4 flex items-center">
                        <div class="mr-4 rounded bg-primary/10 p-4">
                            <i class="bi bi-compass text-3xl text-primary"></i>
                        </div>
                        <h3 class="text-lg font-semibold">{{ t('projects.onepieceTitle') }}</h3>
                    </div>
                    <p class="mb-4 text-muted">{{ t('projects.onepieceDesc') }}</p>
                    <div class="mb-4 flex flex-wrap gap-1">
                        <BaseBadge variant="soft">Vue.js</BaseBadge>
                        <BaseBadge variant="soft">TypeScript</BaseBadge>
                    </div>
                    <BaseButton href="/onepiece" variant="outline-primary" size="sm">
                        <i class="bi bi-box-arrow-up-right"></i>{{ t('projects.viewProject') }}
                    </BaseButton>
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
