<template>
    <section id="home" class="bg-primary bg-gradient text-white min-vh-100 d-flex align-items-center">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h1 class="display-3 fw-bold mb-4">Hola, soy Daniel Hernández</h1>
                    <p class="lead fs-4 mb-4">Desarrollador Full Stack especializado en crear aplicaciones web modernas
                        y escalables</p>
                    <p class="fs-5 mb-5 opacity-75">ASP.NET Core · Vue.js · SQL Server</p>

                    <div class="d-flex gap-3 justify-content-center flex-wrap mb-5">
                        <a href="#proyectos" class="btn btn-light btn-lg px-4">
                            <i class="bi bi-grid-3x3-gap me-2"></i>Ver Proyectos
                        </a>
                        <a href="#contacto" class="btn btn-outline-light btn-lg px-4">
                            <i class="bi bi-envelope me-2"></i>Contactar
                        </a>
                    </div>

                    <div class="d-flex gap-3 justify-content-center flex-wrap">
                        <span class="badge bg-light text-dark fs-6 px-3 py-2">Azure</span>
                        <span class="badge bg-light text-dark fs-6 px-3 py-2">Github</span>
                        <span class="badge bg-light text-dark fs-6 px-3 py-2">Analítica de datos</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
</script>
<style scoped lang="scss">
@use "@/assets/custom.scss" as *;

.bg-gradient {
    background: linear-gradient(135deg, $primary 0%, $secondary 100%) !important;
}
</style>