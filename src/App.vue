<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import FooterC from '@/components/FooterC.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <FooterC />
    <RouterView />
    <Footer />
  </div>
</template>

<style scoped>
/* Puedes añadir estilos específicos del layout si lo necesitas */
</style>
