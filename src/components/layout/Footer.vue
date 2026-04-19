<template>
    <footer class="text-center bg-dark text-white mt-4">
        <div class="container py-2">
            <div class="d-flex justify-content-center text-white">
                <a v-for="value in socialLinks" :href="value.url" class="mx-2 text-white" :aria-label="value.label"
                    target="_blank" rel="noopener" :id="value.label.toLowerCase() + '-link'">
                    <i :class="`bi bi-${value.icon.toLowerCase()} text-white`" style="font-size: 1.5rem;"></i>
                </a>
            </div>
            <hr />
            <span class="text-white">© {{ currentYear }} Daniel Hernández Martín</span>
        </div>
        <BTooltip v-for="value in socialLinks" :target="value.label.toLowerCase() + '-link'" placement="top">
            Visit {{ value.label }}
        </BTooltip>
    </footer>
</template>

<script setup lang="ts">
import { BTooltip } from 'bootstrap-vue-next';
const currentYear = new Date().getFullYear()

const socialLinks = [
    { icon: 'github', url: 'https://github.com/danilocick', label: 'GitHub' },
    { icon: 'linkedin', url: 'https://www.linkedin.com/in/daniel-hernandez-martin/', label: 'LinkedIn' },
    { icon: 'envelope', url: 'mailto:danidevhdez@gmail.com', label: 'Email' }
]
</script>


<style scoped></style>
