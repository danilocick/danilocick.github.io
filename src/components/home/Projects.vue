<template>
    <section id="proyectos" class="py-5">
        <div class="container">
            <h2 class="text-center display-5 fw-bold mb-5">Proyectos</h2>
            <div class="row g-4">

                <!-- Proyecto 1 -->
                <div class="col-lg-4 col-md-6">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-primary bg-opacity-10 rounded p-3 me-3">
                                    <i class="bi bi-cart-check fs-2 text-primary"></i>
                                </div>
                                <h3 class="card-title h5 mb-0">API One Piece</h3>
                            </div>
                            <p class="card-text text-muted mb-3">Get History of One Piece and filter them.</p>
                            <div class="mb-3">
                                <span class="badge bg-light text-dark me-1">Vue.js</span>
                                <!-- <span class="badge bg-light text-dark me-1">ASP.NET</span> -->
                                <!-- <span class="badge bg-light text-dark">PostgreSQL</span> -->
                            </div>
                            <a href="/onepiece" class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-box-arrow-up-right me-1"></i>Ver Proyecto
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Proyecto 2 -->
                <!-- <div class="col-lg-4 col-md-6">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-success bg-opacity-10 rounded p-3 me-3">
                                    <i class="bi bi-kanban fs-2 text-success"></i>
                                </div>
                                <h3 class="card-title h5 mb-0">Task Manager</h3>
                            </div>
                            <p class="card-text text-muted mb-3">Sistema de gestión de tareas y proyectos con
                                colaboración en tiempo real y notificaciones.</p>
                            <div class="mb-3">
                                <span class="badge bg-light text-dark me-1">Vue.js</span>
                                <span class="badge bg-light text-dark me-1">SignalR</span>
                                <span class="badge bg-light text-dark">SQL Server</span>
                            </div>
                            <a href="#" class="btn btn-outline-success btn-sm">
                                <i class="bi bi-box-arrow-up-right me-1"></i>Ver Proyecto
                            </a>
                        </div>
                    </div>
                </div> -->

                <!-- Proyecto 3 -->
                <!-- <div class="col-lg-4 col-md-6">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="bg-info bg-opacity-10 rounded p-3 me-3">
                                    <i class="bi bi-graph-up fs-2 text-info"></i>
                                </div>
                                <h3 class="card-title h5 mb-0">Analytics Dashboard</h3>
                            </div>
                            <p class="card-text text-muted mb-3">Dashboard interactivo para visualización de datos con
                                gráficos en tiempo real y reportes personalizados.</p>
                            <div class="mb-3">
                                <span class="badge bg-light text-dark me-1">Vue.js</span>
                                <span class="badge bg-light text-dark me-1">Chart.js</span>
                                <span class="badge bg-light text-dark">PostgreSQL</span>
                            </div>
                            <a href="#" class="btn btn-outline-info btn-sm">
                                <i class="bi bi-box-arrow-up-right me-1"></i>Ver Proyecto
                            </a>
                        </div>
                    </div>
                </div> -->

            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const projects = [
    {
        id: 1,
        title: 'Fantasy League',
        description: 'Crea tu propia liga de fantasía personalizada.',
        href: 'https://cdn.pixabay.com/photo/2023/03/27/06/06/drops-7879899_1280.jpg',
        projHref: ''
    },
    {
        id: 2,
        title: 'Gestión de Tareas',
        description: 'Organiza y gestiona tus tareas diarias de manera eficiente.',
        href: 'https://cdn.pixabay.com/photo/2023/03/27/06/06/drops-7879899_1280.jpg',
        projHref: ''
    },
    {
        id: 3,
        title: 'ASP .NET Core Blog',
        description: 'Un blog completo construido con ASP .NET Core y Vue.js.',
        href: 'https://cdn.pixabay.com/photo/2023/03/27/06/06/drops-7879899_1280.jpg',
        projHref: ''
    }
];
</script>

<style scoped lang="scss">
@use "@/assets/custom.scss" as *;
</style>