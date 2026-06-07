<template>
    <BaseCard class="op-card h-full p-4">
        <div class="mb-4 flex items-start">
            <div class="flex-1">
                <h5 class="mb-1 text-lg font-semibold">{{ character.name }}</h5>
                <p class="text-sm text-muted">{{ character.job || t('onepiece.unknown') }}</p>
            </div>
            <BaseBadge v-if="character.status === 'alive'" variant="success">
                <i class="bi bi-heart-fill"></i> {{ t('onepiece.alive') }}
            </BaseBadge>
            <BaseBadge v-else-if="character.status === 'deceased'" variant="secondary">
                <i class="bi bi-x-circle-fill"></i> {{ t('onepiece.deceased') }}
            </BaseBadge>
        </div>

        <div class="mb-4">
            <div class="mb-2 flex items-center justify-between">
                <span class="text-sm text-muted">{{ t('onepiece.bounty') }}</span>
                <BaseBadge variant="warning">{{ store.formatBounty(character.bounty) }}</BaseBadge>
            </div>
            <div class="h-1.5 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                <div class="progress-bar h-full bg-warning"
                    :style="{ width: `${store.calculateBountyPercentage(character.bounty)}%` }"></div>
            </div>
        </div>

        <div class="mb-2 flex flex-wrap gap-1">
            <BaseBadge v-if="character.crew" variant="primary">
                <i class="bi bi-flag-fill"></i>{{ character.crew.name }}
            </BaseBadge>
            <BaseBadge v-if="character.fruit" variant="accent">
                <i class="bi bi-apple"></i>{{ character.fruit.name }}
            </BaseBadge>
        </div>

        <BaseBadge v-if="character.is_captain" variant="dark">
            <i class="bi bi-person-badge"></i> {{ t('onepiece.captain') }}
        </BaseBadge>
    </BaseCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useOnePieceStore } from '@/stores/onePiece'
import type { Character } from '@/stores/onePiece'
import { BaseCard, BaseBadge } from '@/components/ui'

const { t } = useI18n()
defineProps<{ character: Character }>()
const store = useOnePieceStore()
</script>

<style scoped>
.op-card { transition: transform 0.2s; }
.op-card:hover { transform: translateY(-5px); }
.progress-bar { transition: width 0.3s ease; }
</style>
