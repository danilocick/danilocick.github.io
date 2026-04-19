import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'

export interface Crew {
    id: number
    name: string
}

export interface Fruit {
    id: number
    name: string
    type: string
}

export interface Character {
    id: number
    name: string
    job: string | null
    bounty: string
    status: string
    crew: Crew | null
    fruit: Fruit | null
    is_captain: boolean
}

export const useOnePieceStore = defineStore('onePiece', () => {
    const characters = ref<Character[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const viewGridMode = ref(true)

    const filter = reactive({
        searchQuery: '',
        sortBy: 'name',
        filterAffiliation: 'all',
        filterFruit: 'all',
        currentPage: 1,
        itemsPerPage: 12,
    })

    async function fetchCharacters() {
        loading.value = true
        error.value = null
        try {
            const response = await fetch('https://api.api-onepiece.com/v2/characters/en')
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            characters.value = await response.json()
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error desconocido'
        } finally {
            loading.value = false
        }
    }

    function formatBounty(bounty: string): string {
        if (!bounty || bounty === '0') return 'Sin recompensa'
        const num = parseFloat(bounty)
        if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
        if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}M`
        if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`
        return bounty
    }

    const topBounties = computed(() =>
        [...characters.value]
            .filter(c => parseFloat(c.bounty || '0') > 0)
            .sort((a, b) => parseFloat(b.bounty || '0') - parseFloat(a.bounty || '0'))
            .slice(0, 10)
    )

    const stats = computed(() => {
        const crews = new Set(characters.value.filter(c => c.crew).map(c => c.crew!.name))
        const totalBounty = characters.value.reduce((sum, c) => sum + parseFloat(c.bounty || '0'), 0)
        return {
            totalCharacters: characters.value.length,
            totalCrews: crews.size,
            totalFruits: characters.value.filter(c => c.fruit).length,
            totalBounty: formatBounty(totalBounty.toString()),
        }
    })

    const filteredCharacters = computed(() => {
        let result = [...characters.value]

        if (filter.filterAffiliation !== 'all') {
            result = result.filter(c => {
                const job = (c.job || '').toLowerCase()
                if (filter.filterAffiliation === 'pirate') return job.includes('pirate') || job.includes('captain')
                if (filter.filterAffiliation === 'marine') return job.includes('marine') || job.includes('admiral')
                if (filter.filterAffiliation === 'revolutionary') return job.includes('revolutionary')
                return true
            })
        }

        if (filter.filterFruit === 'yes') result = result.filter(c => c.fruit !== null)
        else if (filter.filterFruit === 'no') result = result.filter(c => c.fruit === null)

        if (filter.searchQuery.trim()) {
            const q = filter.searchQuery.toLowerCase()
            result = result.filter(c =>
                c.name.toLowerCase().includes(q) ||
                (c.job?.toLowerCase().includes(q)) ||
                (c.crew?.name.toLowerCase().includes(q))
            )
        }

        switch (filter.sortBy) {
            case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break
            case 'nameDesc': result.sort((a, b) => b.name.localeCompare(a.name)); break
            case 'bounty': result.sort((a, b) => parseFloat(b.bounty || '0') - parseFloat(a.bounty || '0')); break
        }

        return result
    })

    const totalPages = computed(() => Math.ceil(filteredCharacters.value.length / filter.itemsPerPage))

    const paginatedCharacters = computed(() => {
        const start = (filter.currentPage - 1) * filter.itemsPerPage
        return filteredCharacters.value.slice(start, start + filter.itemsPerPage)
    })

    function calculateBountyPercentage(bounty: string): number {
        const num = parseFloat(bounty || '0')
        const max = parseFloat(topBounties.value[0]?.bounty || '1')
        return Math.min((num / max) * 100, 100)
    }

    return {
        characters, loading, error, viewGridMode, filter,
        fetchCharacters, formatBounty, calculateBountyPercentage,
        topBounties, stats, filteredCharacters, totalPages, paginatedCharacters,
    }
})
