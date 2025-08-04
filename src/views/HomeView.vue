<script setup lang="ts">
import { BRow, BCol } from 'bootstrap-vue-next';

import Layout from '@/components/home/HomeLayout.vue';
import Services from '@/components/home/Services.vue';
import Projects from '@/components/home/Projects.vue';
</script>

<template>
    <div class="bg-brand">
        <div class="my-4 container">
            <BRow class="mt-3">
                <BCol md="7">
                    <Layout />
                </BCol>
                <BCol md="5">
                    <div class="hero-image">
                        <img src="@/assets/amigo.png" alt="Programando">
                    </div>
                </BCol>
            </BRow>
        </div>
    </div>
    <div class="container my-3">
        <Services />
    </div>
    <div class="my-3 container">
        <Projects />
    </div>

</template>


<style scoped lang="scss">
@import '@/assets/custom.scss';

.bg-brand {
    background-color: map-get($theme-colors, 'brand');
}


.hero-image {
    flex: 1;
    position: relative;
}

.hero-image img {
    max-width: 400px;
    /* tamaño controlado */
    height: auto;
    margin-bottom: -140px;
    display: block;

    /* Sobresale por debajo */
}
</style>
