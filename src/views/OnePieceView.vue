<template>
    <div class="container my-5 pt-5">
        <div class="text-center mb-1">
            <h1 class="fw-bold">
                <i class="bi bi-compass text-danger me-2"></i>One Piece Characters Report
            </h1>
            <p class="lead text-muted">Explora el mundo de piratas, marines y revolucionarios</p>
        </div>

        <!-- Loading -->
        <div v-if="store.loading" class="text-center py-5">
            <div class="spinner-border text-danger" style="width:3rem;height:3rem;" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3 text-muted">Navegando por el Grand Line...</p>
        </div>

        <!-- Error -->
        <div v-else-if="store.error" class="alert alert-danger d-flex align-items-center gap-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill fs-4"></i>
            <div class="flex-grow-1">
                <strong>Error al cargar datos:</strong> {{ store.error }}
            </div>
            <button class="btn btn-outline-danger btn-sm" @click="store.fetchCharacters()">
                <i class="bi bi-arrow-clockwise me-1"></i>Reintentar
            </button>
        </div>

        <!-- Content -->
        <div v-else>
            <CharacterStats />
            <CharacterFilters />

            <div class="d-flex justify-content-between align-items-center mb-3">
                <span>
                    <BBadge pill variant="danger">{{ store.filteredCharacters.length }}</BBadge>
                    Personajes encontrados
                </span>
                <div class="btn-group btn-group-sm" role="group">
                    <BButton :variant="store.viewGridMode ? 'danger' : 'outline-danger'"
                        @click="store.viewGridMode = true">
                        <i class="bi bi-grid-3x3-gap"></i>
                    </BButton>
                    <BButton :variant="!store.viewGridMode ? 'danger' : 'outline-danger'"
                        @click="store.viewGridMode = false">
                        <i class="bi bi-table"></i>
                    </BButton>
                </div>
            </div>

            <!-- Grid -->
            <div v-if="store.viewGridMode" class="row g-4 mb-4">
                <div v-for="character in store.paginatedCharacters" :key="character.id" class="col-md-6 col-lg-4">
                    <CharacterCard :character="character" />
                </div>
            </div>

            <!-- Table -->
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
                            <tr v-for="character in store.paginatedCharacters" :key="character.id">
                                <td>
                                    <strong>{{ character.name }}</strong>
                                    <span v-if="character.is_captain" class="badge bg-dark ms-2">Capitán</span>
                                </td>
                                <td>{{ character.job || '-' }}</td>
                                <td>
                                    <span v-if="character.crew" class="badge bg-primary">{{ character.crew.name }}</span>
                                    <span v-else>-</span>
                                </td>
                                <td>
                                    <span v-if="character.fruit" class="badge bg-danger">{{ character.fruit.name }}</span>
                                    <span v-else>-</span>
                                </td>
                                <td>
                                    <span class="badge bg-warning text-dark">{{ store.formatBounty(character.bounty) }}</span>
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

            <BPagination v-if="store.totalPages > 1" v-model="store.filter.currentPage"
                :total-rows="store.filteredCharacters.length" :per-page="store.filter.itemsPerPage" align="center" />

            <TopBounties />

            <div class="alert alert-info" role="alert">
                <i class="bi bi-info-circle-fill me-2"></i>
                <strong>API:</strong>
                <a href="https://api-onepiece.com" target="_blank" class="alert-link">One Piece API</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { BBadge, BButton, BPagination } from 'bootstrap-vue-next'
import { useOnePieceStore } from '@/stores/onePiece'
import CharacterStats from '@/components/onepiece/CharacterStats.vue'
import CharacterFilters from '@/components/onepiece/CharacterFilters.vue'
import CharacterCard from '@/components/onepiece/CharacterCard.vue'
import TopBounties from '@/components/onepiece/TopBounties.vue'

const store = useOnePieceStore()

onMounted(() => store.fetchCharacters())
</script>
