<script setup lang="ts">
import { BRow, BCol, BButton } from 'bootstrap-vue-next';
import Projects from '@/components/home/Projects.vue';

import userImage from '@/assets/userImage.png';
import Portfolio from '@/components/portfolio/Portfolio.vue';
</script>

<template>
    <div class="intro text-dark ">
        <BRow align-h="evenly" align-v="center">
            <BCol md="5" sm="10" class="align-items-center">
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
    padding-top: 8px;
}

.overlay {
    background: rgba(255, 255, 255, 0.819);
    /* opcional: un velo para que se lean mejor los textos */
    border-radius: 1rem;
    padding: 2rem;
}


@media (max-width: 600px) {
    #user-image {
        max-width: 200px;
    }

    .intro {
        max-height: 500px;
        padding: 2rem 0;
        padding-top: 0;
        margin-top: 0;
    }

    .overlay {
        padding: 1rem;
        border-radius: 0;
    }
}
</style>
