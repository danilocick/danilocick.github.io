<template>
    <div class="container mx-auto my-12 px-4 pt-12">
        <div class="mb-1 text-center">
            <h1 class="text-3xl font-bold md:text-4xl">
                <i class="bi bi-compass mr-2 text-primary"></i>{{ t('onepiece.title') }}
            </h1>
            <p class="text-lg text-muted">{{ t('onepiece.subtitle') }}</p>
        </div>

        <!-- Loading -->
        <div v-if="store.loading" class="py-12 text-center">
            <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
                role="status">
                <span class="sr-only">{{ t('onepiece.loading') }}</span>
            </div>
            <p class="mt-4 text-muted">{{ t('onepiece.loading') }}</p>
        </div>

        <!-- Error -->
        <div v-else-if="store.error"
            class="flex items-center gap-4 rounded-lg border border-danger/20 bg-danger/10 p-4 text-danger" role="alert">
            <i class="bi bi-exclamation-triangle-fill text-xl"></i>
            <div class="flex-1">
                <strong>{{ t('onepiece.errorTitle') }}</strong> {{ store.error }}
            </div>
            <button class="inline-flex items-center rounded-lg border border-danger px-3 py-1.5 text-sm font-semibold transition hover:bg-danger hover:text-white"
                @click="store.fetchCharacters()">
                <i class="bi bi-arrow-clockwise mr-1"></i>{{ t('onepiece.retry') }}
            </button>
        </div>

        <!-- Content -->
        <div v-else>
            <CharacterStats />
            <CharacterFilters />

            <div class="mb-4 flex items-center justify-between">
                <span class="flex items-center gap-2">
                    <span class="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-white">{{ store.filteredCharacters.length }}</span>
                    {{ t('onepiece.foundLabel') }}
                </span>
                <div class="inline-flex overflow-hidden rounded-lg border border-primary">
                    <button class="px-3 py-1.5 text-sm transition" :aria-label="t('onepiece.gridView')"
                        :class="store.viewGridMode ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'"
                        @click="store.viewGridMode = true">
                        <i class="bi bi-grid-3x3-gap"></i>
                    </button>
                    <button class="px-3 py-1.5 text-sm transition" :aria-label="t('onepiece.tableView')"
                        :class="!store.viewGridMode ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'"
                        @click="store.viewGridMode = false">
                        <i class="bi bi-table"></i>
                    </button>
                </div>
            </div>

            <!-- Grid -->
            <div v-if="store.viewGridMode" class="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CharacterCard v-for="character in store.paginatedCharacters" :key="character.id" :character="character" />
            </div>

            <!-- Table -->
            <BaseCard v-else class="mb-6 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-soft">
                            <tr>
                                <th class="px-4 py-3 font-semibold">{{ t('onepiece.colName') }}</th>
                                <th class="px-4 py-3 font-semibold">{{ t('onepiece.colJob') }}</th>
                                <th class="px-4 py-3 font-semibold">{{ t('onepiece.colCrew') }}</th>
                                <th class="px-4 py-3 font-semibold">{{ t('onepiece.colFruit') }}</th>
                                <th class="px-4 py-3 font-semibold">{{ t('onepiece.colBounty') }}</th>
                                <th class="px-4 py-3 font-semibold">{{ t('onepiece.colStatus') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="character in store.paginatedCharacters" :key="character.id"
                                class="border-t border-line hover:bg-soft">
                                <td class="px-4 py-3">
                                    <strong>{{ character.name }}</strong>
                                    <BaseBadge v-if="character.is_captain" variant="dark" class="ml-2">{{ t('onepiece.captain') }}</BaseBadge>
                                </td>
                                <td class="px-4 py-3">{{ character.job || '-' }}</td>
                                <td class="px-4 py-3">
                                    <BaseBadge v-if="character.crew" variant="primary">{{ character.crew.name }}</BaseBadge>
                                    <span v-else>-</span>
                                </td>
                                <td class="px-4 py-3">
                                    <BaseBadge v-if="character.fruit" variant="accent">{{ character.fruit.name }}</BaseBadge>
                                    <span v-else>-</span>
                                </td>
                                <td class="px-4 py-3">
                                    <BaseBadge variant="warning">{{ store.formatBounty(character.bounty) }}</BaseBadge>
                                </td>
                                <td class="px-4 py-3">
                                    <BaseBadge :variant="character.status === 'alive' ? 'success' : 'secondary'">
                                        {{ character.status === 'alive' ? t('onepiece.alive') : t('onepiece.deceased') }}
                                    </BaseBadge>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </BaseCard>

            <!-- Pagination -->
            <div v-if="store.totalPages > 1" class="mt-6 flex flex-wrap items-center justify-center gap-1">
                <button :aria-label="t('onepiece.prevPage')"
                    class="rounded-lg border border-line px-3 py-1.5 text-sm transition hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="store.filter.currentPage === 1" @click="setPage(store.filter.currentPage - 1)">
                    <i class="bi bi-chevron-left"></i>
                </button>
                <template v-for="(page, i) in visiblePages" :key="i">
                    <span v-if="page === '...'" class="px-2 py-1.5 text-muted">…</span>
                    <button v-else
                        class="min-w-[2.25rem] rounded-lg border px-3 py-1.5 text-sm transition"
                        :class="page === store.filter.currentPage
                            ? 'border-primary bg-primary text-white'
                            : 'border-line hover:bg-soft'"
                        @click="setPage(page as number)">
                        {{ page }}
                    </button>
                </template>
                <button :aria-label="t('onepiece.nextPage')"
                    class="rounded-lg border border-line px-3 py-1.5 text-sm transition hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="store.filter.currentPage === store.totalPages" @click="setPage(store.filter.currentPage + 1)">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>

            <TopBounties />

            <div class="flex items-center rounded-lg bg-info/10 p-4 text-info" role="alert">
                <i class="bi bi-info-circle-fill mr-2"></i>
                <span><strong>API:</strong>
                    <a href="https://api-onepiece.com" target="_blank" class="font-semibold underline">One Piece API</a></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOnePieceStore } from '@/stores/onePiece'

const { t } = useI18n()
import CharacterStats from '@/components/onepiece/CharacterStats.vue'
import CharacterFilters from '@/components/onepiece/CharacterFilters.vue'
import CharacterCard from '@/components/onepiece/CharacterCard.vue'
import TopBounties from '@/components/onepiece/TopBounties.vue'
import { BaseCard, BaseBadge } from '@/components/ui'

const store = useOnePieceStore()

function setPage(page: number) {
    if (page >= 1 && page <= store.totalPages) store.filter.currentPage = page
}

const visiblePages = computed<(number | '...')[]>(() => {
    const total = store.totalPages
    const current = store.filter.currentPage
    const delta = 2
    const range: number[] = []
    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
        range.push(i)
    }
    const pages: (number | '...')[] = []
    if (range[0] > 1) {
        pages.push(1)
        if (range[0] > 2) pages.push('...')
    }
    pages.push(...range)
    const last = range[range.length - 1]
    if (last < total) {
        if (last < total - 1) pages.push('...')
        pages.push(total)
    }
    return pages
})

onMounted(() => store.fetchCharacters())
</script>
