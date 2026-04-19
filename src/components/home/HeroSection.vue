<template>
    <section id="home" class="hero-section text-white min-vh-100 d-flex align-items-center position-relative">
        <div class="container">
            <div class="row align-items-center g-5">

                <!-- Text -->
                <div class="col-lg-7 text-center text-lg-start">
                    <h1 class="display-3 fw-bold mb-3">Hola, soy Daniel Hernández</h1>
                    <p class="lead fs-4 mb-2">
                        Full Stack Developer especializado en micro-frontends con Vue 3 y APIs robustas con ASP.NET Core
                    </p>
                    <p class="fs-5 mb-4 opacity-75">Vue 3 · Module Federation · ASP.NET Core 10 · SQL Server</p>

                    <div class="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap mb-5">
                        <a href="#proyectos" class="btn btn-light btn-lg px-4">
                            <i class="bi bi-grid-3x3-gap me-2"></i>Ver Proyectos
                        </a>
                        <a href="#contacto" class="btn btn-outline-light btn-lg px-4">
                            <i class="bi bi-envelope me-2"></i>Contactar
                        </a>
                        <a href="/cv.pdf" download class="btn btn-outline-light btn-lg px-4">
                            <i class="bi bi-file-earmark-arrow-down me-2"></i>Descargar CV
                        </a>
                    </div>

                    <!-- Metrics -->
                    <div class="d-flex gap-4 justify-content-center justify-content-lg-start flex-wrap">
                        <div v-for="m in metrics" :key="m.label" class="text-center text-lg-start">
                            <div class="fw-bold fs-3 lh-1">{{ m.value }}</div>
                            <small class="opacity-75">{{ m.label }}</small>
                        </div>
                    </div>
                </div>

                <!-- Avatar -->
                <div class="col-lg-5 text-center">
                    <div class="avatar-wrapper mx-auto">
                        <img src="@/assets/userImage.jpeg" alt="Daniel Hernández" class="avatar-img" />
                    </div>
                    <div class="mt-3 d-flex gap-2 justify-content-center">
                        <span class="badge bg-white bg-opacity-25">Santa Coloma de Gramenet</span>
                        <span class="badge bg-white bg-opacity-25">Disponible</span>
                    </div>
                </div>

            </div>
        </div>
        <!-- Wave divider -->
        <div class="hero-wave">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
                <path fill="var(--bs-body-bg, #fff)" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"/>
            </svg>
        </div>
    </section>
</template>

<script setup lang="ts">
const metrics = [
    { value: '3+', label: 'Años de experiencia' },
    { value: '10+', label: 'Apps en producción' },
    { value: '2', label: 'Stacks dominados' },
]
</script>

<style scoped lang="scss">
@use "@/assets/custom.scss" as *;

.hero-section {
    background: linear-gradient(135deg, $primary 0%, $secondary 100%);
}

.avatar-wrapper {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hero-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 0;

    svg {
        display: block;
        width: 100%;
        height: 60px;
    }
}
</style>
