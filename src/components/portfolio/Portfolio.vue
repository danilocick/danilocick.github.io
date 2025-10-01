<template>
    <h1 class="text-center">Portfolio</h1>
    <!-- <div class="d-flex gap-3 alignn-items-center justify-content-center flex-wrap"> -->
    <BRow>
        <BCol>
            <div class="bold">
                <p> Hola, soy Daniel Hernández<br>
                    Desarrollador Full Stack<br>
                    Ayudo a empresas y startups a construir soluciones web eficientes, seguras y escalables.
                </p>
            </div>
        </BCol>
        <BCol>

            <div class="list d-flex flex-column gap-3">
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-primary rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    ASP.NET Core
                </div>
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-primary rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Vue.js + Bootstrap
                </div>

                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-primary rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Vue.js + Nuxt.js
                </div>
            </div>
        </BCol>
        <BCol>
            <div class="list d-flex flex-column gap-3">
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-primary rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Vue.js + Tailwind
                </div>

                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-primary rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Node.js
                </div>

                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-primary rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Azure
                </div>

                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-primary rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    PostgreSQL
                </div>

                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-primary rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    SQL Server
                </div>
            </div>
        </BCol>
    </BRow>
    <!-- </div> -->


</template>

<script setup lang="ts">
import { BRow, BCol } from 'bootstrap-vue-next';
</script>

<style scoped>
/* Puedes añadir estilos específicos del layout si lo necesitas */
</style>
