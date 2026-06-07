<template>
    <BaseCard class="mb-6 overflow-hidden">
        <div class="bg-warning/10 p-4">
            <h5 class="text-lg font-semibold">
                <i class="bi bi-trophy-fill mr-2 text-warning"></i>{{ t('onepiece.topTitle') }}
            </h5>
        </div>
        <div class="p-6">
            <div class="flex flex-col gap-2">
                <div v-for="(char, index) in store.topBounties" :key="char.id">
                    <div class="flex items-center">
                        <div class="mr-4">
                            <span class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                                :class="index < 3 ? 'bg-warning text-gray-900' : 'bg-secondary text-white'">
                                {{ index + 1 }}
                            </span>
                        </div>
                        <div class="flex-1">
                            <div class="mb-1 flex items-center justify-between">
                                <div>
                                    <strong>{{ char.name }}</strong>
                                    <small class="ml-2 text-sm text-muted">{{ char.job }}</small>
                                </div>
                                <BaseBadge variant="warning">{{ store.formatBounty(char.bounty) }}</BaseBadge>
                            </div>
                            <div class="h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                                <div class="h-full bg-warning"
                                    :style="{ width: `${(parseFloat(char.bounty) / parseFloat(store.topBounties[0].bounty)) * 100}%` }">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useOnePieceStore } from '@/stores/onePiece'
import { BaseCard, BaseBadge } from '@/components/ui'
const { t } = useI18n()
const store = useOnePieceStore()
</script>
