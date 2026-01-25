<template>
    <div class="container my-5 pt-5">
        <!-- Header -->
        <div class="text-center mb-1">
            <h1 class="fw-bold">
                <i class="bi bi-compass text-danger me-2"></i>
                One Piece Characters Report
            </h1>
            <p class="lead text-muted">Explora el mundo de piratas, marines y revolucionarios</p>
        </div>

        <!-- Loading State -->
        <div v-if="state.loading" class="text-center py-5">
            <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Navegando por el Grand Line...</p>
        </div>

        <!-- Error State -->
        <BAlert v-else-if="state.error" variant="danger">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Error:</strong> {{ state.error }}
        </BAlert>

        <!-- Main Content -->
        <div v-else>
            <!-- Stats Cards -->
            <BRow class="mb-2 g-4">
                <BCol md="3">
                    <BCard class="shadow-sm text-center border-0">
                        <i class="bi bi-people-fill text-danger fs-1 mb-3"></i>
                        <h3 class="fw-bold mb-2">{{ stats.totalCharacters }}</h3>
                        <p class="text-muted mb-0">Total Personajes</p>
                    </BCard>
                </BCol>
                <BCol md="3">
                    <BCard class="shadow-sm text-center border-0">
                        <i class="bi bi-award-fill text-warning fs-1 mb-3"></i>
                        <h3 class="fw-bold mb-2">{{ stats.totalCrews }}</h3>
                        <p class="text-muted mb-0">Tripulaciones</p>
                    </BCard>
                </BCol>
                <BCol md="3">
                    <BCard class="shadow-sm text-center border-0">
                        <i class="bi bi-lightning-fill text-primary fs-1 mb-3"></i>
                        <h3 class="fw-bold mb-2">{{ stats.totalFruits }}</h3>
                        <p class="text-muted mb-0">Frutas del Diablo</p>
                    </BCard>
                </BCol>
                <BCol md="3">
                    <BCard class="shadow-sm text-center border-0">
                        <i class="bi bi-star-fill text-success fs-1 mb-3"></i>
                        <h3 class="fw-bold mb-2">{{ stats.totalBounty }}</h3>
                        <p class="text-muted mb-0">Recompensa Total (B)</p>
                    </BCard>
                </BCol>
            </BRow>

            <!-- Filters -->
            <div class="border-0 shadow-sm mb-4 mt-4">
                <div class="card-body">
                    <div class="row g-3 align-items-end">
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">
                                <i class="bi bi-search me-2"></i>Buscar Personaje
                            </label>
                            <input type="text" class="form-control" v-model="filter.searchQuery"
                                placeholder="Buscar por nombre...">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">
                                <i class="bi bi-funnel me-2"></i>Afiliación
                            </label>
                            <select class="form-select" v-model="filter.filterAffiliation">
                                <option value="all">Todas</option>
                                <option value="pirate">Piratas</option>
                                <option value="marine">Marines</option>
                                <option value="revolutionary">Revolucionarios</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label fw-semibold">
                                <i class="bi bi-apple me-2"></i>Fruta
                            </label>
                            <select class="form-select" v-model="filter.filterFruit">
                                <option value="all">Todas</option>
                                <option value="yes">Con fruta</option>
                                <option value="no">Sin fruta</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">
                                <i class="bi bi-sort-down me-2"></i>Ordenar por
                            </label>
                            <select class="form-select" v-model="filter.sortBy">
                                <option value="name">Nombre (A-Z)</option>
                                <option value="nameDesc">Nombre (Z-A)</option>
                                <option value="bounty">Mayor Recompensa</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Info -->
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span>
                    <BBadge pill variant="danger">{{ filteredCharacters.length }}</BBadge>
                    Personajes encontrados
                </span>

                <div class="btn-group btn-group-sm" role="group">
                    <BButton :variant='state.viewGridMode ? "danger" : "outline-danger"'
                        @click="state.viewGridMode = true">
                        <i class="bi bi-grid-3x3-gap"></i>
                    </BButton>
                    <BButton :variant='!state.viewGridMode ? "danger" : "outline-danger"'
                        @click="state.viewGridMode = false">
                        <i class="bi bi-table"></i>
                    </BButton>
                </div>
            </div>

            <!-- Grid View -->
            <div v-if="state.viewGridMode" class="row g-4 mb-4">
                <div v-for="character in paginatedCharacters" :key="character.id" class="col-md-6 col-lg-4">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-start mb-3">
                                <div class="flex-grow-1">
                                    <h5 class="card-title mb-1">{{ character.name }}</h5>
                                    <p class="text-muted small mb-0">{{ character.job || 'Unknown' }}</p>
                                </div>
                                <span v-if="character.status === 'alive'" class="badge bg-success">
                                    <i class="bi bi-heart-fill"></i> Vivo
                                </span>
                                <span v-else-if="character.status === 'deceased'" class="badge bg-secondary">
                                    <i class="bi bi-x-circle-fill"></i> Fallecido
                                </span>
                            </div>

                            <div class="mb-3">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="small text-muted">Recompensa:</span>
                                    <span class="badge bg-warning text-dark">
                                        {{ formatBounty(character.bounty) }}
                                    </span>
                                </div>
                                <div class="progress" style="height: 6px;">
                                    <div class="progress-bar bg-warning"
                                        :style="{ width: `${calculateBountyPercentage(character.bounty)}%` }"></div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <div class="d-flex gap-1 flex-wrap">
                                    <span v-if="character.crew" class="badge bg-primary">
                                        <i class="bi bi-flag-fill me-1"></i>{{ character.crew.name }}
                                    </span>
                                    <span v-if="character.fruit" class="badge bg-danger">
                                        <i class="bi bi-apple me-1"></i>{{ character.fruit.name }}
                                    </span>
                                </div>
                            </div>

                            <div class="d-flex gap-1 flex-wrap">
                                <span v-if="character.is_captain" class="badge bg-dark">
                                    <i class="bi bi-person-badge"></i> Capitán
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table View -->
            <div v-else class="card border-0 shadow-sm mb-4">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>Nombre</th>
                                <th>Trabajo</th>
                                <th>Tripulación</th>
                                <th>Fruta del Diablo</th>
                                <th>Recompensa</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="character in paginatedCharacters" :key="character.id">
                                <td>
                                    <strong>{{ character.name }}</strong>
                                    <span v-if="character.is_captain" class="badge bg-dark ms-2">
                                        Capitán
                                    </span>
                                </td>
                                <td>{{ character.job || '-' }}</td>
                                <td>
                                    <span v-if="character.crew" class="badge bg-primary">
                                        {{ character.crew.name }}
                                    </span>
                                    <span v-else>-</span>
                                </td>
                                <td>
                                    <span v-if="character.fruit" class="badge bg-danger">
                                        {{ character.fruit.name }}
                                    </span>
                                    <span v-else>-</span>
                                </td>
                                <td>
                                    <span class="badge bg-warning text-dark">
                                        {{ formatBounty(character.bounty) }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge"
                                        :class="character.status === 'alive' ? 'bg-success' : 'bg-secondary'">
                                        {{ character.status === 'alive' ? 'Vivo' : 'Fallecido' }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <BPagination v-if="totalPages > 1" v-model="filter.currentPage" :total-rows="filteredCharacters.length"
                :per-page="filter.itemsPerPage" align="center" />

            <!-- Top Bounties -->
            <div class="card border-0 shadow-sm mb-4">
                <div class="card-header bg-warning bg-opacity-10 border-0">
                    <h5 class="mb-0">
                        <i class="bi bi-trophy-fill text-warning me-2"></i>
                        Top 10 Recompensas Más Altas
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row g-2">
                        <div v-for="(char, index) in topBounties" :key="char.id" class="col-12">
                            <div class="d-flex align-items-center">
                                <div class="me-3">
                                    <span class="badge rounded-circle"
                                        :class="index < 3 ? 'bg-warning text-dark' : 'bg-secondary'"
                                        style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                                        {{ index + 1 }}
                                    </span>
                                </div>
                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <div>
                                            <strong>{{ char.name }}</strong>
                                            <small class="text-muted ms-2">{{ char.job }}</small>
                                        </div>
                                        <span class="badge bg-warning text-dark">
                                            {{ formatBounty(char.bounty) }}
                                        </span>
                                    </div>
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar bg-warning"
                                            :style="{ width: `${(parseFloat(char.bounty) / parseFloat(topBounties[0].bounty)) * 100}%` }">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- API Info -->
            <div class="alert alert-info" role="alert">
                <i class="bi bi-info-circle-fill me-2"></i>
                <strong>API Utilizada:</strong>
                <a href="https://api-onepiece.com" target="_blank" class="alert-link">
                    One Piece API
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { BCol, BRow, BAlert, BCard, BBadge, BButton, BPagination } from 'bootstrap-vue-next';

interface Crew {
    id: number;
    name: string;
}

interface Fruit {
    id: number;
    name: string;
    type: string;
}

interface Character {
    id: number;
    name: string;
    job: string | null;
    bounty: string;
    status: string;
    crew: Crew | null;
    fruit: Fruit | null;
    is_captain: boolean;
}

// State
const state = reactive({
    loading: true,
    error: null as string | null,
    viewGridMode: true,
})

const filter = reactive({
    searchQuery: '',
    sortBy: 'name',
    filterAffiliation: 'all',
    filterFruit: 'all',
    currentPage: 1,
    itemsPerPage: 12,
})

const data = reactive({
    characters: [] as Character[],
})

// Fetch data
async function fetchCharacters() {
    try {
        state.loading = true;
        const response = await fetch('https://api.api-onepiece.com/v2/characters/en');

        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }

        const d = await response.json();
        data.characters = d;
    } catch (err) {
        state.error = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
        state.loading = false;
    }
}

// Format bounty
const formatBounty = (bounty: string): string => {
    if (!bounty || bounty === '0') return 'Sin recompensa';

    const num = parseFloat(bounty);
    if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
        return `${(num / 1000000).toFixed(0)}M`;
    } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}K`;
    }
    return bounty;
};

// Calculate bounty percentage
const calculateBountyPercentage = (bounty: string): number => {
    const num = parseFloat(bounty || '0');
    const maxBounty = parseFloat(topBounties.value[0]?.bounty || '1');
    return Math.min((num / maxBounty) * 100, 100);
};

// Computed - Statistics
const stats = computed(() => {
    const crews = new Set(data.characters.filter(c => c.crew).map(c => c.crew!.name));
    const fruits = data.characters.filter(c => c.fruit).length;
    const totalBounty = data.characters.reduce((sum, char) => {
        return sum + parseFloat(char.bounty || '0');
    }, 0);

    return {
        totalCharacters: data.characters.length,
        totalCrews: crews.size,
        totalFruits: fruits,
        totalBounty: formatBounty(totalBounty.toString())
    };
});

// Computed - Top Bounties
const topBounties = computed(() => {
    return [...data.characters]
        .filter(c => parseFloat(c.bounty || '0') > 0)
        .sort((a, b) => parseFloat(b.bounty || '0') - parseFloat(a.bounty || '0'))
        .slice(0, 10);
});

// Computed - Filtered Characters
const filteredCharacters = computed(() => {
    let result = [...data.characters];

    // Filter by affiliation
    if (filter.filterAffiliation !== 'all') {
        result = result.filter(char => {
            const job = (char.job || '').toLowerCase();
            if (filter.filterAffiliation === 'pirate') return job.includes('pirate') || job.includes('captain');
            if (filter.filterAffiliation === 'marine') return job.includes('marine') || job.includes('admiral');
            if (filter.filterAffiliation === 'revolutionary') return job.includes('revolutionary');
            return true;
        });
    }

    // Filter by fruit
    if (filter.filterFruit === 'yes') {
        result = result.filter(char => char.fruit !== null);
    } else if (filter.filterFruit === 'no') {
        result = result.filter(char => char.fruit === null);
    }

    // Filter by search
    if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        result = result.filter(char =>
            char.name.toLowerCase().includes(query) ||
            (char.job && char.job.toLowerCase().includes(query)) ||
            (char.crew && char.crew.name.toLowerCase().includes(query))
        );
    }

    // Sort
    switch (filter.sortBy) {
        case 'name':
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'nameDesc':
            result.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'bounty':
            result.sort((a, b) => parseFloat(b.bounty || '0') - parseFloat(a.bounty || '0'));
            break;
    }

    return result;
});

// Computed - Pagination
const totalPages = computed(() => {
    return Math.ceil(filteredCharacters.value.length / filter.itemsPerPage);
});

const paginatedCharacters = computed(() => {
    const start = (filter.currentPage - 1) * filter.itemsPerPage;
    const end = start + filter.itemsPerPage;
    return filteredCharacters.value.slice(start, end);
});

// Lifecycle
onMounted(() => {
    fetchCharacters();
});
</script>

<style scoped>
.card {
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
}

.progress-bar {
    transition: width 0.3s ease;
}
</style>