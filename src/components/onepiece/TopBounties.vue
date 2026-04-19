<template>
    <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-warning bg-opacity-10 border-0">
            <h5 class="mb-0">
                <i class="bi bi-trophy-fill text-warning me-2"></i>Top 10 Recompensas Más Altas
            </h5>
        </div>
        <div class="card-body">
            <div class="row g-2">
                <div v-for="(char, index) in store.topBounties" :key="char.id" class="col-12">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <span class="badge rounded-circle"
                                :class="index < 3 ? 'bg-warning text-dark' : 'bg-secondary'"
                                style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
                                {{ index + 1 }}
                            </span>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <div>
                                    <strong>{{ char.name }}</strong>
                                    <small class="text-muted ms-2">{{ char.job }}</small>
                                </div>
                                <span class="badge bg-warning text-dark">{{ store.formatBounty(char.bounty) }}</span>
                            </div>
                            <div class="progress" style="height:8px;">
                                <div class="progress-bar bg-warning"
                                    :style="{ width: `${(parseFloat(char.bounty) / parseFloat(store.topBounties[0].bounty)) * 100}%` }">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useOnePieceStore } from '@/stores/onePiece'
const store = useOnePieceStore()
</script>
