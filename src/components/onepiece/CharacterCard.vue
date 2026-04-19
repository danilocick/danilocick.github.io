<template>
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
                    <span class="badge bg-warning text-dark">{{ store.formatBounty(character.bounty) }}</span>
                </div>
                <div class="progress" style="height: 6px;">
                    <div class="progress-bar bg-warning"
                        :style="{ width: `${store.calculateBountyPercentage(character.bounty)}%` }"></div>
                </div>
            </div>

            <div class="d-flex gap-1 flex-wrap mb-2">
                <span v-if="character.crew" class="badge bg-primary">
                    <i class="bi bi-flag-fill me-1"></i>{{ character.crew.name }}
                </span>
                <span v-if="character.fruit" class="badge bg-danger">
                    <i class="bi bi-apple me-1"></i>{{ character.fruit.name }}
                </span>
            </div>

            <span v-if="character.is_captain" class="badge bg-dark">
                <i class="bi bi-person-badge"></i> Capitán
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useOnePieceStore } from '@/stores/onePiece'
import type { Character } from '@/stores/onePiece'

defineProps<{ character: Character }>()
const store = useOnePieceStore()
</script>

<style scoped>
.card { transition: transform 0.2s; }
.card:hover { transform: translateY(-5px); }
.progress-bar { transition: width 0.3s ease; }
</style>
