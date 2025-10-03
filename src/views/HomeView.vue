<script setup lang="ts">
import { BRow, BCol, BButton } from 'bootstrap-vue-next';

import Layout from '@/components/home/HomeLayout.vue';
import Services from '@/components/home/Services.vue';
import Projects from '@/components/home/Projects.vue';

import userImage from '@/assets/userImage.png';
import Portfolio from '@/components/portfolio/Portfolio.vue';
</script>

<template>
    <div id="intro" class="intro align-items-center text-center text-dark py-5">
        <BRow class="row  justify-content-sm-center justify-content-md-evenly align-items-center">
            <BCol md="8" sm="10" class="align-items-center mb-1">
                <div class="overlay text-center text-white">
                    <h2 class="card-title fw-bold mb-3 text-black">Desarrollador Full Stack</h2>
                    <p class="card-text mb-3 text-black text-muted">
                        ASP.NET Core | Vue.js | Node.js | SQL Server | PostgreSQL | Azure
                    </p>
                </div>
            </BCol>
            <BCol md="4" sm="10" class="text-center">
                <img :src="userImage" id="user-image" alt="User Image" class="img-fluid" />
            </BCol>
        </BRow>
    </div>

    <div class="container text-center mt-4">
        <h3>Hola, soy <b>Daniel Hernández</b></h3>
        <p> Desarrollador Full Stack<br>
            Ayudo a empresas y startups a construir soluciones web eficientes, seguras y escalables.
            Programas de contabilidad, CRM, ERP, tiendas en línea, blogs y más.
        </p>
    </div>

    <hr />
    <div class="bg-light pb-4">
        <div class="container">
            <Portfolio />
        </div>
    </div>

    <div class="my-3 container">
        <Projects />
    </div>
</template>

<style scoped lang="scss">
// @import '@/assets/custom.scss';

// .bg-brand {
//     background-color: map-get($theme-colors, 'brand');
// }

#user-image {
    max-width: 250px;
}

.intro {
    background-image: url('@/assets/colorful-stingrays.svg');
    background-repeat: repeat;
    background-size: 20%;
    /* Ajusta para cubrir toda el área */
    background-position: center;
    // min-height: 50vh;
    max-height: 560px;
    /* Ajusta la altura según lo que necesites */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.overlay {
    background: rgba(255, 255, 255, 0.819);
    /* opcional: un velo para que se lean mejor los textos */
    border-radius: 1rem;
    padding: 2rem;
}
</style>
