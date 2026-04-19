<template>
    <section id="sobre-mi" class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center display-5 fw-bold mb-5">Sobre Mí</h2>
            <div class="row g-4">

                <!-- Quién soy -->
                <div class="col-lg-6">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body p-4">
                            <div class="text-primary fs-1 mb-3">
                                <i class="bi bi-person-circle"></i>
                            </div>
                            <h3 class="card-title h4 mb-3">¿Quién soy?</h3>
                            <p class="card-text">
                                Desarrollador full stack especializado en arquitecturas micro-frontend con Vue 3 y
                                Module Federation, y APIs robustas con ASP.NET Core. Trabajo en entornos empresariales
                                con foco en automatización, escalabilidad y código mantenible.
                            </p>
                            <p class="card-text text-muted small">
                                Me interesa activamente la arquitectura de microservicios en entornos cloud Azure.
                            </p>
                            <div class="mt-3 d-flex gap-2 flex-wrap">
                                <span class="badge bg-primary bg-opacity-10 text-primary">Santa Coloma de Gramenet</span>
                                <span class="badge bg-success bg-opacity-10 text-success">Unex S.L. · Sep 2021 – hoy</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Cómo trabajo -->
                <div class="col-lg-6">
                    <div class="card h-100 border-0 shadow-sm">
                        <div class="card-body p-4">
                            <div class="text-primary fs-1 mb-3">
                                <i class="bi bi-gear-fill"></i>
                            </div>
                            <h3 class="card-title h4 mb-3">Cómo trabajo</h3>
                            <ul class="list-unstyled">
                                <li v-for="item in softSkills" :key="item" class="mb-2">
                                    <i class="bi bi-check-circle-fill text-success me-2"></i>{{ item }}
                                </li>
                            </ul>
                            <hr class="my-3" />
                            <small class="text-muted fw-semibold">Idiomas</small>
                            <div class="d-flex gap-2 mt-2 flex-wrap">
                                <span class="badge bg-secondary">🇪🇸 Castellano — Nativo</span>
                                <span class="badge bg-secondary">🏴󠁥󠁳󠁣󠁴󠁿 Catalán — Nativo</span>
                                <span class="badge bg-secondary">🇬🇧 Inglés — Alto</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Skills con progreso -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body p-4">
                            <h3 class="card-title h4 mb-4">
                                <i class="bi bi-laptop text-primary me-2"></i>Stack Técnico
                            </h3>
                            <div class="row g-4">
                                <div v-for="group in skillGroups" :key="group.label" class="col-md-6">
                                    <h5 class="h6 mb-3" :class="group.textClass">
                                        <i :class="['bi', group.icon, 'me-2']"></i>{{ group.label }}
                                    </h5>
                                    <div v-for="skill in group.skills" :key="skill.name" class="mb-3">
                                        <div class="d-flex justify-content-between mb-1">
                                            <small class="fw-semibold">{{ skill.name }}</small>
                                            <small class="text-muted">{{ skill.level }}%</small>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar" :class="group.barClass"
                                                :style="{ width: skill.level + '%' }"></div>
                                        </div>
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
const softSkills = [
    'Resolución de problemas complejos',
    'Buena comunicación y gestión de equipos',
    'Agilidad con los resultados',
    'Espíritu comercial y orientación al cliente',
]

const skillGroups = [
    {
        label: 'Frontend',
        icon: 'bi-window',
        textClass: 'text-primary',
        barClass: 'bg-primary',
        skills: [
            { name: 'Vue 3 + Vite + TypeScript', level: 90 },
            { name: 'Module Federation (Micro-frontend)', level: 80 },
            { name: 'Bootstrap + CSS3', level: 88 },
        ],
    },
    {
        label: 'Backend',
        icon: 'bi-server',
        textClass: 'text-success',
        barClass: 'bg-success',
        skills: [
            { name: 'ASP.NET Core 10 + C#', level: 90 },
            { name: 'Entity Framework Core', level: 85 },
            { name: 'APIs RESTful (arquitectura capas)', level: 88 },
        ],
    },
    {
        label: 'Bases de Datos',
        icon: 'bi-database',
        textClass: 'text-info',
        barClass: 'bg-info',
        skills: [
            { name: 'SQL Server', level: 85 },
            { name: 'PostgreSQL', level: 70 },
            { name: 'Migración y automatización de datos', level: 80 },
        ],
    },
    {
        label: 'Herramientas & Cloud',
        icon: 'bi-tools',
        textClass: 'text-secondary',
        barClass: 'bg-secondary',
        skills: [
            { name: 'Azure (microservicios / cloud)', level: 65 },
            { name: 'Git + CI/CD', level: 80 },
            { name: 'Power BI + Tableau', level: 70 },
        ],
    },
]
</script>

<style scoped>
.progress-bar {
    transition: width 1s ease;
}
</style>
