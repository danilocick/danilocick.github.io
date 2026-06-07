<template>
    <section id="sobre-mi" class="bg-soft py-20">
        <div class="container mx-auto px-4">
            <div class="mb-12 text-center">
                <span class="kicker">{{ t('about.kicker') }}</span>
                <h2 class="text-3xl font-bold md:text-4xl">{{ t('about.title') }}</h2>
            </div>
            <div class="grid gap-6 lg:grid-cols-2">

                <!-- Quién soy -->
                <BaseCard class="h-full p-6">
                    <div class="mb-4 text-4xl text-primary">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <h3 class="mb-4 text-xl font-semibold">{{ t('about.whoTitle') }}</h3>
                    <p class="mb-3">{{ t('about.whoBody') }}</p>
                    <p class="text-sm text-muted">{{ t('about.whoNote') }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                        <span class="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{{ t('hero.location') }}</span>
                        <span class="rounded bg-success/10 px-2 py-1 text-xs font-semibold text-success">{{ t('about.badgeJob') }}</span>
                    </div>
                </BaseCard>

                <!-- Cómo trabajo -->
                <BaseCard class="h-full p-6">
                    <div class="mb-4 text-4xl text-primary">
                        <i class="bi bi-gear-fill"></i>
                    </div>
                    <h3 class="mb-4 text-xl font-semibold">{{ t('about.howTitle') }}</h3>
                    <ul class="list-none">
                        <li v-for="item in softSkills" :key="item" class="mb-2">
                            <i class="bi bi-check-circle-fill mr-2 text-success"></i>{{ t(item) }}
                        </li>
                    </ul>
                    <hr class="my-4 border-line" />
                    <small class="text-sm font-semibold text-muted">{{ t('about.languagesLabel') }}</small>
                    <div class="mt-2 flex flex-wrap gap-2">
                        <BaseBadge variant="secondary">{{ t('about.langEs') }}</BaseBadge>
                        <BaseBadge variant="secondary">{{ t('about.langCa') }}</BaseBadge>
                        <BaseBadge variant="secondary">{{ t('about.langEn') }}</BaseBadge>
                    </div>
                </BaseCard>
            </div>

            <!-- Skills con progreso -->
            <div class="mt-6">
                <BaseCard class="p-6">
                    <h3 class="mb-6 text-xl font-semibold">
                        <i class="bi bi-laptop mr-2 text-primary"></i>{{ t('about.stackTitle') }}
                    </h3>
                    <div class="grid gap-6 md:grid-cols-2">
                        <div v-for="group in skillGroups" :key="group.label">
                            <h5 class="mb-4 text-base font-semibold" :class="group.textClass">
                                <i :class="['bi', group.icon, 'mr-2']"></i>{{ t(group.label) }}
                            </h5>
                            <div v-for="skill in group.skills" :key="skill.name" class="mb-4">
                                <div class="mb-1 flex justify-between">
                                    <small class="text-sm font-semibold">{{ skill.name }}</small>
                                    <small class="text-sm text-muted">{{ skill.level }}%</small>
                                </div>
                                <div class="h-1.5 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
                                    <div class="progress-bar h-full" :class="group.barClass"
                                        :style="{ width: skill.level + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BaseCard>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { BaseCard, BaseBadge } from '@/components/ui'
const { t } = useI18n()

const softSkills = ['about.soft1', 'about.soft2', 'about.soft3', 'about.soft4']

const skillGroups = [
    {
        label: 'about.groupFrontend',
        icon: 'bi-window',
        textClass: 'text-primary',
        barClass: 'bg-primary',
        skills: [
            { name: 'Vue 3 + Vite + TypeScript', level: 90 },
            { name: 'Module Federation (Micro-frontend)', level: 80 },
            { name: 'Tailwind + CSS3', level: 88 },
        ],
    },
    {
        label: 'about.groupBackend',
        icon: 'bi-server',
        textClass: 'text-accent',
        barClass: 'bg-accent',
        skills: [
            { name: 'ASP.NET Core 10 + C#', level: 90 },
            { name: 'Entity Framework Core', level: 85 },
            { name: 'APIs RESTful (arquitectura capas)', level: 88 },
        ],
    },
    {
        label: 'about.groupDatabase',
        icon: 'bi-database',
        textClass: 'text-secondary',
        barClass: 'bg-secondary',
        skills: [
            { name: 'SQL Server', level: 85 },
            { name: 'PostgreSQL', level: 70 },
            { name: 'Migración y automatización de datos', level: 80 },
        ],
    },
    {
        label: 'about.groupTools',
        icon: 'bi-tools',
        textClass: 'text-muted',
        barClass: 'bg-gray-400 dark:bg-gray-500',
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
