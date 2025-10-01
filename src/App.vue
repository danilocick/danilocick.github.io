<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue';
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>

<style scoped>
/* Puedes añadir estilos específicos del layout si lo necesitas */
</style>
