<template>
    <div>
        <HeroSection />
        <div class="reveal"><AboutMe /></div>
        <div class="reveal reveal-delay-1"><Projects /></div>
        <div class="reveal reveal-delay-2"><PreviewDocs /></div>
        <div class="reveal reveal-delay-3"><Contact /></div>
    </div>
</template>

<script setup lang="ts">
import Projects from '@/components/home/Projects.vue'
import AboutMe from '@/components/home/AboutMe.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import Contact from '@/components/home/Contact.vue'
import PreviewDocs from '@/components/docs/Preview.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

useScrollReveal()
</script>
