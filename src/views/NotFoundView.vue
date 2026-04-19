<template>
    <div class="min-vh-100 d-flex align-items-center justify-content-center">
        <div class="text-center">
            <h1 class="display-1 fw-bold text-primary">404</h1>
            <p class="fs-4 text-muted mb-4">Página no encontrada.</p>
            <RouterLink to="/" class="btn btn-primary rounded-pill px-4">
                <i class="bi bi-house me-2"></i>Volver al inicio
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
