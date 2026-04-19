<template>
    <section id="proyectos" class="py-5">
        <div class="container">
            <h2 class="text-center display-5 fw-bold mb-5">Proyectos</h2>
            <div class="row g-4">

                <div class="col-lg-4 col-md-6">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-primary bg-opacity-10 rounded p-3 me-3">
                                    <i class="bi bi-compass fs-2 text-primary"></i>
                                </div>
                                <h3 class="card-title h5 mb-0">API One Piece</h3>
                            </div>
                            <p class="card-text text-muted mb-3">Explorador de personajes de One Piece con filtros, búsqueda y ranking de recompensas.</p>
                            <div class="mb-3">
                                <span class="badge bg-light text-dark me-1">Vue.js</span>
                                <span class="badge bg-light text-dark me-1">TypeScript</span>
                            </div>
                            <a href="/onepiece" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-box-arrow-up-right me-1"></i>Ver Proyecto
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use "@/assets/custom.scss" as *;
</style>
