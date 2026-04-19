<template>
    <section id="documentacion" class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center display-5 fw-bold mb-5">Documentación</h2>
            <div class="row g-4">

                <!-- Artículo 1 -->
                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-start">
                                <div class="bg-primary bg-opacity-10 rounded p-3 me-3">
                                    <i class="bi bi-file-text fs-3 text-primary"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h3 class="h5 mb-2">Guía completa de Vue 3 Composition API</h3>
                                    <p class="text-muted mb-3">Aprende a usar la Composition API de Vue 3 con ejemplos
                                        prácticos y mejores prácticas.</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="badge bg-primary">Vue.js</span>
                                        <RouterLink to="/docs" class="btn btn-sm btn-outline-primary">Leer más</RouterLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Artículo 2 -->
                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-start">
                                <div class="bg-success bg-opacity-10 rounded p-3 me-3">
                                    <i class="bi bi-file-code fs-3 text-success"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h3 class="h5 mb-2">Clean Architecture en ASP.NET Core</h3>
                                    <p class="text-muted mb-3">Implementa Clean Architecture en tus proyectos ASP.NET
                                        Core para código mantenible.</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="badge bg-success">ASP.NET</span>
                                        <RouterLink to="/docs" class="btn btn-sm btn-outline-success">Leer más</RouterLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Artículo 3 -->
                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-start">
                                <div class="bg-info bg-opacity-10 rounded p-3 me-3">
                                    <i class="bi bi-database fs-3 text-info"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h3 class="h5 mb-2">Optimización de consultas PostgreSQL</h3>
                                    <p class="text-muted mb-3">Técnicas avanzadas para mejorar el rendimiento de tus
                                        consultas en PostgreSQL.</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="badge bg-info">PostgreSQL</span>
                                        <RouterLink to="/docs" class="btn btn-sm btn-outline-info">Leer más</RouterLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Artículo 4 -->
                <div class="col-lg-6">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-start">
                                <div class="bg-warning bg-opacity-10 rounded p-3 me-3">
                                    <i class="bi bi-lightbulb fs-3 text-warning"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h3 class="h5 mb-2">Mejores prácticas en desarrollo web</h3>
                                    <p class="text-muted mb-3">Tips y trucos para escribir código más limpio, seguro y
                                        mantenible.</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="badge bg-warning text-dark">General</span>
                                        <RouterLink to="/docs" class="btn btn-sm btn-outline-warning">Leer más</RouterLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>