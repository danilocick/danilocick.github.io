<template>
    <div class="container my-4">

        <h1 class="mb-4">Documentation</h1>

        <!-- Selector -->
        <div class="mb-3">
            <label class="form-label fw-semibold">Select a topic:</label>
            <select class="form-select" v-model="selectedDoc">
                <option disabled value="">-- Choose a documentation file --</option>
                <option v-for="value in Object.keys(componentsMap)" :key="value" :value="value">{{ value }}</option>
            </select>
        </div>

        <hr />

        <!-- Dynamic Component -->
        <component :is="currentComponent"></component>

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Import your documentation components
import EF_Migrations from '@/components/docs/EF_Migrations.vue';
import API_Methods from '@/components/docs/ASPNETCore_API.vue'
// import OtherDoc from '@/components/docs/OtherDoc.vue'; // Example extra file

// Holds the selected value
const selectedDoc = ref("");

// Map of component names
const componentsMap: Record<string, any> = {
    EF_Migrations,
    // OtherDoc,
    API_Methods,
};

// Compute which component to show
const currentComponent = computed(() => {
    return componentsMap[selectedDoc.value] ?? null;
});
</script>
