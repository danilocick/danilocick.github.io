<template>
    <div class="container mx-auto my-12 min-h-screen px-4 pt-12">
        <!-- Header -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold md:text-4xl">
                <i class="bi bi-egg-fried mr-2 text-primary"></i>Recetario
            </h1>
            <p class="text-lg text-muted">Mis recetas de cocina</p>
        </div>

        <!-- Sin recetas -->
        <div v-if="recipes.length === 0" class="py-16 text-center text-muted">
            <i class="bi bi-journal-x text-6xl"></i>
            <p class="mt-4">Aún no hay recetas. Añádelas en <code>src/data/recipes.ts</code>.</p>
        </div>

        <div v-else class="grid gap-6 lg:grid-cols-12">
            <!-- Menú de recetas -->
            <aside class="lg:col-span-4">
                <BaseCard class="p-4">
                    <h2 class="mb-3 px-2 text-sm font-semibold uppercase tracking-wider text-muted">
                        Recetas ({{ recipes.length }})
                    </h2>
                    <nav class="flex flex-col gap-1">
                        <button v-for="recipe in recipes" :key="recipe.id" type="button"
                            class="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition"
                            :class="recipe.id === selectedId
                                ? 'bg-primary text-white'
                                : 'hover:bg-soft'"
                            @click="selectedId = recipe.id">
                            <i class="bi bi-caret-right-fill text-xs"
                                :class="recipe.id === selectedId ? 'opacity-100' : 'opacity-30'"></i>
                            <span class="font-medium">{{ recipe.name }}</span>
                        </button>
                    </nav>
                </BaseCard>
            </aside>

            <!-- Detalle de la receta -->
            <main v-if="selected" class="lg:col-span-8">
                <BaseCard class="overflow-hidden">
                    <img :src="selected.image || defaultImage" :alt="selected.name"
                        class="aspect-[16/9] w-full object-cover" />

                    <div class="p-6">
                        <h2 class="text-2xl font-bold">{{ selected.name }}</h2>
                        <p v-if="selected.description" class="mt-1 text-muted">{{ selected.description }}</p>

                        <!-- Meta -->
                        <div v-if="selected.time || selected.servings" class="mt-3 flex flex-wrap gap-2">
                            <BaseBadge v-if="selected.time" variant="soft">
                                <i class="bi bi-clock"></i>{{ selected.time }}
                            </BaseBadge>
                            <BaseBadge v-if="selected.servings" variant="soft">
                                <i class="bi bi-people"></i>{{ selected.servings }} raciones
                            </BaseBadge>
                        </div>

                        <div class="mt-6 grid gap-8 md:grid-cols-2">
                            <!-- Ingredientes -->
                            <section>
                                <h3 class="mb-3 flex items-center text-lg font-semibold">
                                    <i class="bi bi-basket mr-2 text-primary"></i>Ingredientes
                                </h3>
                                <ul class="space-y-2">
                                    <li v-for="ing in selected.ingredients" :key="ing" class="flex gap-2">
                                        <i class="bi bi-check-circle-fill mt-1 shrink-0 text-success"></i>
                                        <span>{{ ing }}</span>
                                    </li>
                                </ul>
                            </section>

                            <!-- Pasos -->
                            <section>
                                <h3 class="mb-3 flex items-center text-lg font-semibold">
                                    <i class="bi bi-list-ol mr-2 text-primary"></i>Pasos
                                </h3>
                                <ol class="space-y-3">
                                    <li v-for="(step, i) in selected.steps" :key="i" class="flex gap-3">
                                        <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                            {{ i + 1 }}
                                        </span>
                                        <span>{{ step }}</span>
                                    </li>
                                </ol>
                            </section>
                        </div>
                    </div>
                </BaseCard>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { recipes } from '@/data/recipes'
import { BaseCard, BaseBadge } from '@/components/ui'
import defaultImage from '@/assets/recipe-default.svg'

const selectedId = ref(recipes[0]?.id ?? '')
const selected = computed(() => recipes.find((r) => r.id === selectedId.value))
</script>
