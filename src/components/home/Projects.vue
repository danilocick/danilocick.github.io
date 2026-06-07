<template>
    <section id="proyectos" class="py-20">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <span class="kicker">{{ t('projects.kicker') }}</span>
                <h2 class="text-3xl font-bold md:text-4xl">{{ t('projects.title') }}</h2>
                <p class="mt-2 text-muted">{{ t('projects.subtitle') }}</p>
            </div>
            <div class="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">

                <BaseCard v-for="p in projects" :key="p.title" class="project-card h-full p-6">
                    <div class="mb-4 flex items-center">
                        <div class="icon-box mr-4" :class="p.iconBg">
                            <i :class="['bi', p.icon, 'text-2xl', p.iconColor]"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-semibold">{{ t(p.title) }}</h3>
                            <BaseBadge v-if="p.wip" variant="warning" class="mt-1">{{ t('projects.wip') }}</BaseBadge>
                        </div>
                    </div>
                    <p class="mb-4 text-muted">{{ t(p.description) }}</p>
                    <div class="mb-6 flex flex-wrap gap-1">
                        <BaseBadge v-for="tag in p.tags" :key="tag" variant="soft">{{ tag }}</BaseBadge>
                    </div>
                    <BaseButton :href="p.href" :target="p.external ? '_blank' : undefined" size="sm" :variant="p.variant">
                        <i class="bi bi-box-arrow-up-right"></i>{{ t(p.cta) }}
                    </BaseButton>
                </BaseCard>

            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { BaseCard, BaseBadge, BaseButton } from '@/components/ui'
const { t } = useI18n()

const projects = [
    {
        title: 'projects.onepieceTitle',
        description: 'projects.onepieceDesc',
        icon: 'bi-compass',
        iconBg: 'icon-bg-primary',
        iconColor: 'text-primary',
        tags: ['Vue 3', 'TypeScript', 'Pinia', 'Tailwind'],
        href: '/onepiece',
        variant: 'outline-primary',
        cta: 'projects.onepieceCta',
        wip: false,
        external: false,
    },
    {
        title: 'projects.dashboardTitle',
        description: 'projects.dashboardDesc',
        icon: 'bi-grid-1x2',
        iconBg: 'icon-bg-secondary',
        iconColor: 'text-secondary',
        tags: ['Vue 3', 'ASP.NET Core', 'SQL Server', 'Module Federation'],
        href: '#',
        variant: 'outline-secondary',
        cta: 'projects.dashboardCta',
        wip: true,
        external: false,
    },
] as const
</script>

<style scoped>
.project-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.project-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.13);
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

.icon-bg-primary { background: rgba(102, 126, 234, 0.12); }
.icon-bg-secondary { background: rgba(118, 75, 162, 0.12); }
</style>
