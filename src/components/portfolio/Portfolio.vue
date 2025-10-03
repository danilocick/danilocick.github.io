<template>
    <h1 class=" text-center pb-2">Portfolio</h1>
    <!-- <div class="d-flex gap-3 alignn-items-center justify-content-center flex-wrap"> -->
    <BRow>
        <BCol>
            <h3 class="pb-2 text-teal-800">Conocimientos avanzados</h3>
            <div class="list d-flex flex-column gap-3">
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    ASP.NET Core
                </div>
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Vue.js
                </div>
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    SQL Server
                </div>
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Azure Functions
                </div>

            </div>
        </BCol>
        <BCol>
            <h3 class="pb-2 text-teal-800">Conocimientos intermedios</h3>
            <div class="list d-flex flex-column gap-3">
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Bootstrap
                </div>
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Node.js
                </div>
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Azure Environment
                </div>

                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    PostgreSQL
                </div>
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    MySQL
                </div>
            </div>
        </BCol>
        <BCol>
            <h3 class="pb-2 text-teal-800">Conocimientos básicos</h3>
            <div class="list d-flex flex-column gap-3">
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Nuxt.js
                </div>
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Tailwind
                </div>
                <div class="d-flex gap-3 align-items-center justify-content-start">
                    <div class="bg-teal-400 rounded d-flex align-items-center justify-content-center"
                        style="width: 3rem; height: 3rem;">
                        <i class="bi bi-award-fill text-white text-center center" />
                    </div>
                    Tableau
                </div>

            </div>
        </BCol>
    </BRow>
    <!-- </div> -->
</template>

<script setup lang="ts">
import { BRow, BCol } from 'bootstrap-vue-next';
</script>

<style scoped lang="scss">
/* Puedes añadir estilos específicos del layout si lo necesitas */
@use "../../assets/custom.scss" as *;

.bg-teal-400 {
    background-color: $teal-400;
}

.text-teal-800 {
    color: $teal-800;
}
</style>
