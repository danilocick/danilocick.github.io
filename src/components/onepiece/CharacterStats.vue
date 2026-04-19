<template>
    <BRow class="mb-2 g-4">
        <BCol md="3">
            <BCard class="shadow-sm text-center border-0">
                <i class="bi bi-people-fill text-danger fs-1 mb-3"></i>
                <h3 class="fw-bold mb-2">{{ store.stats.totalCharacters }}</h3>
                <p class="text-muted mb-0">Total Personajes</p>
            </BCard>
        </BCol>
        <BCol md="3">
            <BCard class="shadow-sm text-center border-0">
                <i class="bi bi-award-fill text-warning fs-1 mb-3"></i>
                <h3 class="fw-bold mb-2">{{ store.stats.totalCrews }}</h3>
                <p class="text-muted mb-0">Tripulaciones</p>
            </BCard>
        </BCol>
        <BCol md="3">
            <BCard class="shadow-sm text-center border-0">
                <i class="bi bi-lightning-fill text-primary fs-1 mb-3"></i>
                <h3 class="fw-bold mb-2">{{ store.stats.totalFruits }}</h3>
                <p class="text-muted mb-0">Frutas del Diablo</p>
            </BCard>
        </BCol>
        <BCol md="3">
            <BCard class="shadow-sm text-center border-0">
                <i class="bi bi-star-fill text-success fs-1 mb-3"></i>
                <h3 class="fw-bold mb-2">{{ store.stats.totalBounty }}</h3>
                <p class="text-muted mb-0">Recompensa Total (B)</p>
            </BCard>
        </BCol>
    </BRow>
</template>

<script setup lang="ts">
import { BRow, BCol, BCard } from 'bootstrap-vue-next'
import { useOnePieceStore } from '@/stores/onePiece'
const store = useOnePieceStore()
</script>
