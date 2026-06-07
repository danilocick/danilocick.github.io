<template>
    <div class="container mx-auto my-12 min-h-screen px-4 pt-12">
        <!-- Header -->
        <div class="mb-1 text-center">
            <h4 class="mb-1 text-4xl font-bold md:text-5xl">
                <i class="bi bi-journal-code mr-2 text-primary"></i>
                {{ t('docs.title') }}
            </h4>
            <p class="text-lg text-muted">{{ t('docs.subtitle') }}</p>
        </div>

        <!-- Vista de lista de documentos -->
        <div v-if="!selectedDoc">
            <!-- Buscador -->
            <div class="mb-2">
                <div class="mx-auto md:w-2/3">
                    <BaseInput v-model="searchQuery" :placeholder="t('docs.searchPlaceholder')" icon="bi-search" />
                </div>
            </div>

            <!-- Categorías (Pills) -->
            <div class="mb-2 text-center">
                <button class="mb-2 mr-2 rounded-full px-3 py-1 text-sm transition"
                    :class="selectedCategory === null
                        ? 'bg-primary text-white'
                        : 'border border-primary text-primary hover:bg-primary hover:text-white'"
                    @click="selectedCategory = null">
                    {{ t('docs.categoryAll') }}
                </button>
                <button v-for="cat in categories" :key="cat" class="mb-2 mr-2 rounded-full px-3 py-1 text-sm transition"
                    :class="selectedCategory === cat
                        ? 'bg-primary text-white'
                        : 'border border-primary text-primary hover:bg-primary hover:text-white'"
                    @click="selectedCategory = cat">
                    {{ catLabel(cat) }}
                </button>
            </div>

            <!-- Lista de documentos -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div v-if="filteredDocs.length === 0" class="col-span-full py-12 text-center">
                    <i class="bi bi-search text-6xl text-muted"></i>
                    <p class="mt-4 text-muted">{{ t('docs.noResults') }}</p>
                </div>

                <BaseCard v-for="doc in filteredDocs" :key="doc.id" role="button" tabindex="0"
                    class="doc-card h-full cursor-pointer p-6" @click="selectDoc(doc.id)"
                    @keydown.enter="selectDoc(doc.id)">
                    <div class="mb-4">
                        <i :class="doc.icon" class="text-4xl text-primary"></i>
                    </div>
                    <h5 class="mb-2 text-lg font-semibold">{{ t(doc.title) }}</h5>
                    <p class="mb-4 text-sm text-muted">{{ t(doc.description) }}</p>
                    <div class="mb-4 flex flex-wrap gap-1">
                        <BaseBadge v-for="tag in doc.tags" :key="tag" variant="soft">
                            {{ tag }}
                        </BaseBadge>
                    </div>
                    <small class="text-sm text-muted">
                        <i class="bi bi-calendar3 mr-1"></i>{{ doc.date }}
                    </small>
                </BaseCard>
            </div>
        </div>

        <!-- Vista de documento individual -->
        <div v-else>
            <BaseButton variant="outline-secondary" size="sm" class="mb-6" @click="selectedDoc = null">
                <i class="bi bi-arrow-left"></i>{{ t('docs.back') }}
            </BaseButton>

            <BaseCard class="mb-6 p-6">
                <div class="mb-4">
                    <i :class="currentDoc?.icon" class="text-4xl text-primary"></i>
                </div>
                <h2 class="mb-4 text-2xl font-bold">{{ currentDoc ? t(currentDoc.title) : '' }}</h2>
                <p class="text-muted">{{ currentDoc ? t(currentDoc.description) : '' }}</p>
                <div class="mb-4 mt-3 flex flex-wrap gap-1">
                    <BaseBadge v-for="tag in currentDoc?.tags" :key="tag" variant="primary">
                        {{ tag }}
                    </BaseBadge>
                </div>
                <small class="text-sm text-muted">
                    <i class="bi bi-calendar3 mr-1"></i>{{ currentDoc?.date }}
                </small>
            </BaseCard>

            <BaseCard class="p-6">
                <component :is="currentComponent"></component>
            </BaseCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Import documentation components
import EF_Migrations from '@/components/docs/EF_Migrations.vue';
import API_Methods from '@/components/docs/ASPNETCore_API.vue';
import AzureKeyVault from '@/components/docs/AzureKeyVault.vue';
import { BaseCard, BaseBadge, BaseButton, BaseInput } from '@/components/ui';

const { t } = useI18n();

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
        title: 'docs.efTitle',
        description: 'docs.efDesc',
        category: 'Backend',
        tags: ['EF Core', 'C#', 'Database'],
        icon: 'bi bi-arrow-repeat',
        date: '15 Ene 2024',
        component: EF_Migrations
    },
    {
        id: 'aspnet-api',
        title: 'docs.apiTitle',
        description: 'docs.apiDesc',
        category: 'Backend',
        tags: ['ASP.NET', 'API', 'REST'],
        icon: 'bi bi-code-slash',
        date: '20 Ene 2024',
        component: API_Methods
    },
    {
        id: 'azure-keyvault',
        title: 'docs.kvTitle',
        description: 'docs.kvDesc',
        category: 'Cloud',
        tags: ['Azure', 'Key Vault', 'Secrets', 'C#'],
        icon: 'bi bi-shield-lock',
        date: '07 Jun 2026',
        component: AzureKeyVault
    },
];

const catLabel = (cat: string) => t(`docs.category${cat}`);

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
            t(doc.title).toLowerCase().includes(query) ||
            t(doc.description).toLowerCase().includes(query) ||
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
.doc-card {
    transition: transform 0.2s;
}

.doc-card:hover {
    transform: translateY(-5px);
}
</style>
