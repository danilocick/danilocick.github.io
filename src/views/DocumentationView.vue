<template>
    <div class="container my-5 pt-5 min-vh-100">
        <!-- Header -->
        <div class="text-center mb-1">
            <h4 class="display-4 fw-bold mb-1">
                <i class="bi bi-journal-code text-primary me-2"></i>
                Documentación
            </h4>
            <p class="lead text-muted">Guías y recursos técnicos</p>
        </div>

        <!-- Vista de lista de documentos -->
        <div v-if="!selectedDoc">
            <!-- Buscador -->
            <div class="row mb-2">
                <div class="col-md-8 mx-auto">
                    <div class="input-group input-group-lg">
                        <span class="input-group-text">
                            <i class="bi bi-search"></i>
                        </span>
                        <input type="text" class="form-control" placeholder="Buscar documentación..."
                            v-model="searchQuery">
                    </div>
                </div>
            </div>

            <!-- Categorías (Pills) -->
            <div class="text-center mb-2">
                <button class="btn btn-sm rounded-pill me-2 mb-2"
                    :class="selectedCategory === null ? 'btn-primary' : 'btn-outline-primary'"
                    @click="selectedCategory = null">
                    Todas
                </button>
                <button v-for="cat in categories" :key="cat" class="btn btn-sm rounded-pill me-2 mb-2"
                    :class="selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'"
                    @click="selectedCategory = cat">
                    {{ cat }}
                </button>
            </div>

            <!-- Lista de documentos -->
            <div class="row g-2">
                <div v-if="filteredDocs.length === 0" class="col-12 text-center py-5">
                    <i class="bi bi-search display-1 text-muted"></i>
                    <p class="text-muted mt-3">No se encontraron documentos</p>
                </div>

                <div v-for="doc in filteredDocs" :key="doc.id" class="col-md-10 col-lg-3">
                    <div class="card h-100 border-0 shadow-sm" @click="selectDoc(doc.id)" style="cursor: pointer;">
                        <div class="card-body">
                            <div class="mb-3">
                                <i :class="doc.icon" class="fs-1 text-primary"></i>
                            </div>
                            <h5 class="card-title">{{ doc.title }}</h5>
                            <p class="card-text text-muted small mb-3">{{ doc.description }}</p>
                            <div class="mb-3">
                                <span v-for="tag in doc.tags" :key="tag" class="badge bg-light text-dark me-1 mb-1">
                                    {{ tag }}
                                </span>
                            </div>
                            <small class="text-muted">
                                <i class="bi bi-calendar3 me-1"></i>{{ doc.date }}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Vista de documento individual -->
        <div v-else>
            <button class="btn btn-outline-secondary mb-4" @click="selectedDoc = null">
                <i class="bi bi-arrow-left me-2"></i>Volver
            </button>

            <div class="card border-0 shadow-sm mb-4">
                <div class="card-body p-4">
                    <div class="mb-3">
                        <i :class="currentDoc?.icon" class="fs-1 text-primary"></i>
                    </div>
                    <h2 class="mb-3">{{ currentDoc?.title }}</h2>
                    <p class="text-muted">{{ currentDoc?.description }}</p>
                    <div class="mb-3">
                        <span v-for="tag in currentDoc?.tags" :key="tag" class="badge bg-primary me-1">
                            {{ tag }}
                        </span>
                    </div>
                    <small class="text-muted">
                        <i class="bi bi-calendar3 me-1"></i>{{ currentDoc?.date }}
                    </small>
                </div>
            </div>

            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <component :is="currentComponent"></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Import documentation components
import EF_Migrations from '@/components/docs/EF_Migrations.vue';
import API_Methods from '@/components/docs/ASPNETCore_API.vue';

// Documents data
interface Doc {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    icon: string;
    date: string;
    component: any;
}

const docs: Doc[] = [
    {
        id: 'ef-migrations',
        title: 'Entity Framework Migrations',
        description: 'Guía completa sobre migraciones en EF Core',
        category: 'Backend',
        tags: ['EF Core', 'C#', 'Database'],
        icon: 'bi bi-arrow-repeat',
        date: '15 Ene 2024',
        component: EF_Migrations
    },
    {
        id: 'aspnet-api',
        title: 'ASP.NET Core API',
        description: 'Métodos y mejores prácticas para APIs',
        category: 'Backend',
        tags: ['ASP.NET', 'API', 'REST'],
        icon: 'bi bi-code-slash',
        date: '20 Ene 2024',
        component: API_Methods
    },
];

// State
const selectedDoc = ref<string | null>(null);
const selectedCategory = ref<string | null>(null);
const searchQuery = ref('');

// Computed
const categories = computed(() => {
    return [...new Set(docs.map(doc => doc.category))];
});

const currentDoc = computed(() => {
    return docs.find(doc => doc.id === selectedDoc.value);
});

const currentComponent = computed(() => {
    return currentDoc.value?.component ?? null;
});

const filteredDocs = computed(() => {
    let result = docs;

    if (selectedCategory.value) {
        result = result.filter(doc => doc.category === selectedCategory.value);
    }

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(doc =>
            doc.title.toLowerCase().includes(query) ||
            doc.description.toLowerCase().includes(query) ||
            doc.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }

    return result;
});

// Methods
const selectDoc = (docId: string) => {
    selectedDoc.value = docId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
/* Solo CSS mínimo necesario */
.card {
    transition: transform 0.2s;
}

.card:hover {
    transform: translateY(-5px);
}
</style>