<template>
    <section id="proyectos" class="py-5">
        <div class="container">
            <h2 class="text-center display-5 fw-bold mb-2">Proyectos</h2>
            <p class="text-center text-muted mb-5">Cosas que he construido</p>
            <div class="row g-4 justify-content-center">

                <div class="col-lg-4 col-md-6" v-for="p in projects" :key="p.title">
                    <div class="card h-100 border-0 project-card">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <div class="icon-box me-3" :class="p.iconBg">
                                    <i :class="['bi', p.icon, 'fs-3', p.iconColor]"></i>
                                </div>
                                <div>
                                    <h3 class="card-title h5 mb-0">{{ p.title }}</h3>
                                    <span v-if="p.wip" class="badge bg-warning text-dark mt-1" style="font-size:0.65rem;">En construcción</span>
                                </div>
                            </div>
                            <p class="card-text text-muted mb-3">{{ p.description }}</p>
                            <div class="mb-4 d-flex flex-wrap gap-1">
                                <span v-for="tag in p.tags" :key="tag" class="badge bg-light text-dark">{{ tag }}</span>
                            </div>
                            <a :href="p.href" :class="['btn btn-sm', p.btnClass]" :target="p.external ? '_blank' : undefined">
                                <i class="bi bi-box-arrow-up-right me-1"></i>{{ p.cta }}
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const projects = [
    {
        title: 'One Piece Explorer',
        description: 'Explorador de personajes con búsqueda, filtros por afiliación y fruta del diablo, ranking de recompensas y vista tabla/grid.',
        icon: 'bi-compass',
        iconBg: 'icon-bg-primary',
        iconColor: 'text-primary',
        tags: ['Vue 3', 'TypeScript', 'Pinia', 'Bootstrap'],
        href: '/onepiece',
        btnClass: 'btn-outline-primary',
        cta: 'Ver demo',
        wip: false,
        external: false,
    },
    {
        title: 'Dev Dashboard',
        description: 'Dashboard interno para gestión de proyectos, seguimiento de progreso, despliegues de API y actividad de equipo. Inspirado en el trabajo real en Unex.',
        icon: 'bi-grid-1x2',
        iconBg: 'icon-bg-secondary',
        iconColor: 'text-secondary',
        tags: ['Vue 3', 'ASP.NET Core', 'SQL Server', 'Module Federation'],
        href: '#',
        btnClass: 'btn-outline-secondary',
        cta: 'Próximamente',
        wip: true,
        external: false,
    },
]
</script>

<style scoped lang="scss">
@use "@/assets/custom.scss" as *;

.project-card {
    box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.13);
    }
}

.icon-box {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.icon-bg-primary { background: rgba($primary, 0.12); }
.icon-bg-secondary { background: rgba($secondary, 0.12); }
</style>
