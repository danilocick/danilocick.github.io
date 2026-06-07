<script setup lang="ts">
import Footer from '@/components/layout/Footer.vue'
import { RouterView } from 'vue-router'
import Header from '@/components/layout/Header.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>

<style scoped></style>
