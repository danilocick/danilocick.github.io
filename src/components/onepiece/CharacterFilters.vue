<template>
    <div class="border-0 shadow-sm mb-4 mt-4">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <div class="col-md-4">
                    <label class="form-label fw-semibold">
                        <i class="bi bi-search me-2"></i>Buscar Personaje
                    </label>
                    <input type="text" class="form-control" v-model="store.filter.searchQuery"
                        placeholder="Buscar por nombre...">
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-semibold">
                        <i class="bi bi-funnel me-2"></i>Afiliación
                    </label>
                    <select class="form-select" v-model="store.filter.filterAffiliation">
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
                    <select class="form-select" v-model="store.filter.filterFruit">
                        <option value="all">Todas</option>
                        <option value="yes">Con fruta</option>
                        <option value="no">Sin fruta</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-semibold">
                        <i class="bi bi-sort-down me-2"></i>Ordenar por
                    </label>
                    <select class="form-select" v-model="store.filter.sortBy">
                        <option value="name">Nombre (A-Z)</option>
                        <option value="nameDesc">Nombre (Z-A)</option>
                        <option value="bounty">Mayor Recompensa</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useOnePieceStore } from '@/stores/onePiece'
const store = useOnePieceStore()
</script>
