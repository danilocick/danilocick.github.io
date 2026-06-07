<template>
    <div class="mb-2 grid gap-6 md:grid-cols-4">
        <BaseCard class="p-6 text-center">
            <i class="bi bi-people-fill mb-4 text-4xl text-primary"></i>
            <h3 class="mb-2 text-2xl font-bold">{{ store.stats.totalCharacters }}</h3>
            <p class="text-muted">{{ t('onepiece.statTotal') }}</p>
        </BaseCard>
        <BaseCard class="p-6 text-center">
            <i class="bi bi-award-fill mb-4 text-4xl text-accent"></i>
            <h3 class="mb-2 text-2xl font-bold">{{ store.stats.totalCrews }}</h3>
            <p class="text-muted">{{ t('onepiece.statCrews') }}</p>
        </BaseCard>
        <BaseCard class="p-6 text-center">
            <i class="bi bi-lightning-fill mb-4 text-4xl text-secondary"></i>
            <h3 class="mb-2 text-2xl font-bold">{{ store.stats.totalFruits }}</h3>
            <p class="text-muted">{{ t('onepiece.statFruits') }}</p>
        </BaseCard>
        <BaseCard class="p-6 text-center">
            <i class="bi bi-star-fill mb-4 text-4xl text-warning"></i>
            <h3 class="mb-2 text-2xl font-bold">{{ store.stats.totalBounty }}</h3>
            <p class="text-muted">{{ t('onepiece.statBounty') }}</p>
        </BaseCard>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useOnePieceStore } from '@/stores/onePiece'
import { BaseCard } from '@/components/ui'
const { t } = useI18n()
const store = useOnePieceStore()
</script>
