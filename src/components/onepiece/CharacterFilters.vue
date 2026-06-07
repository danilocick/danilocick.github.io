<template>
    <BaseCard class="mb-6 mt-6 p-6">
        <div class="grid items-end gap-4 md:grid-cols-12">
            <div class="md:col-span-4">
                <label class="mb-1 block font-semibold">
                    <i class="bi bi-search mr-2"></i>{{ t('onepiece.filterSearch') }}
                </label>
                <BaseInput v-model="store.filter.searchQuery" :placeholder="t('onepiece.filterSearchPlaceholder')" />
            </div>
            <div class="md:col-span-3">
                <label class="mb-1 block font-semibold">
                    <i class="bi bi-funnel mr-2"></i>{{ t('onepiece.filterAffiliation') }}
                </label>
                <BaseSelect v-model="store.filter.filterAffiliation">
                    <option value="all">{{ t('onepiece.affAll') }}</option>
                    <option value="pirate">{{ t('onepiece.affPirate') }}</option>
                    <option value="marine">{{ t('onepiece.affMarine') }}</option>
                    <option value="revolutionary">{{ t('onepiece.affRevolutionary') }}</option>
                </BaseSelect>
            </div>
            <div class="md:col-span-2">
                <label class="mb-1 block font-semibold">
                    <i class="bi bi-apple mr-2"></i>{{ t('onepiece.filterFruit') }}
                </label>
                <BaseSelect v-model="store.filter.filterFruit">
                    <option value="all">{{ t('onepiece.fruitAll') }}</option>
                    <option value="yes">{{ t('onepiece.fruitYes') }}</option>
                    <option value="no">{{ t('onepiece.fruitNo') }}</option>
                </BaseSelect>
            </div>
            <div class="md:col-span-3">
                <label class="mb-1 block font-semibold">
                    <i class="bi bi-sort-down mr-2"></i>{{ t('onepiece.filterSort') }}
                </label>
                <BaseSelect v-model="store.filter.sortBy">
                    <option value="name">{{ t('onepiece.sortName') }}</option>
                    <option value="nameDesc">{{ t('onepiece.sortNameDesc') }}</option>
                    <option value="bounty">{{ t('onepiece.sortBounty') }}</option>
                </BaseSelect>
            </div>
        </div>
    </BaseCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useOnePieceStore } from '@/stores/onePiece'
import { BaseCard, BaseInput, BaseSelect } from '@/components/ui'
const { t } = useI18n()
const store = useOnePieceStore()
</script>
