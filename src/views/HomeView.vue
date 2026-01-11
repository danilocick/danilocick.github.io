<template>
    <div>
        <HeroSection />
        <AboutMe />
        <Projects />
        <PreviewDocs />
        <Contact />
    </div>
</template>
<script setup lang="ts">
import Projects from '@/components/home/Projects.vue';
import AboutMe from '@/components/home/AboutMe.vue';
import HeroSection from '@/components/home/HeroSection.vue';
import Contact from '@/components/home/Contact.vue';
import PreviewDocs from '@/components/docs/Preview.vue';
</script>

<style scoped lang="scss"></style>
