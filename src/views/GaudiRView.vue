<template>
    <Header />

    <section class="hero d-flex align-items-center text-center text-white">
        <div class="container">
            <h1 class="display-4 fw-bold">Bienvenido a Taverna Gaudir</h1>
            <p class="lead">Sabores mediterráneos en un espacio único</p>
            <RouterLink to="/reservas" class="btn btn-warning btn-lg mt-3">Reserva tu mesa</RouterLink>
        </div>
    </section>

    <section class="py-5 bg-light">
        <div class="container text-center">
            <h2 class="mb-4">Nuestra Carta</h2>
            <div class="row g-4">
                <div class="col-md-4" v-for="plato in platos" :key="plato.nombre">
                    <div class="card h-100 shadow trencadis-card">
                        <img :src="plato.img" class="card-img-top" :alt="plato.nombre" />
                        <div class="card-body">
                            <h5 class="card-title">{{ plato.nombre }}</h5>
                            <p class="card-text">{{ plato.descripcion }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-5 text-center bg-warning text-dark">
        <div class="container">
            <h2>Haz tu reserva</h2>
            <p class="mb-4">Disfruta de una experiencia gastronómica única</p>
            <RouterLink to="/reservas" class="btn btn-dark btn-lg">Reservar ahora</RouterLink>
        </div>
    </section>ng


    <footer class="py-4 bg-dark text-white text-center">
        <p class="mb-0">© 2025 Taverna Gaudir | Barcelona</p>
        <div class="mt-2">
            <a href="#" class="text-white me-3"><i class="bi bi-instagram"></i></a>
            <a href="#" class="text-white"><i class="bi bi-facebook"></i></a>
        </div>
    </footer>

</template>

<script setup lang="ts">
import { BRow, BCol } from 'bootstrap-vue-next';
import Header from '@/components/gaudir/header.vue';

const platos = [
    {
        nombre: "Paella de marisco",
        descripcion: "Un clásico con el sabor del Mediterráneo.",
        img: "/images/paella.jpg",
    },
    {
        nombre: "Tapas variadas",
        descripcion: "Selección de tapas tradicionales para compartir.",
        img: "/images/tapas.jpg",
    },
    {
        nombre: "Vinos locales",
        descripcion: "Acompaña tu comida con los mejores vinos.",
        img: "/images/vino.jpg",
    },
];


</script>
<style scoped lang="scss">
@import '../assets/custom.scss';

.hero {
    height: 100vh;
    background: url("/images/hero.jpg") center/cover no-repeat;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: url("/images/trencadis.png");
        opacity: 0.2;
    }

    .container {
        position: relative;
        z-index: 1;
    }
}

.trencadis-card {
    border-radius: 1rem;
    overflow: hidden;
    border: 3px solid #f0ad4e;
}
</style>