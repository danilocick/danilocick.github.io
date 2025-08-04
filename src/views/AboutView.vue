<script setup lang="ts">
import About from '@/components/about/About.vue';
</script>

<template>
    <div class="bg-brand">
        <div class="container">
            <div class="my-3">
                <About />
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
@import '@/assets/custom.scss';

.bg-brand {
    background-color: map-get($theme-colors, 'brand');
}
</style>
