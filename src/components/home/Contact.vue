<template>
    <section id="contacto" class="py-5">
        <div class="container">
            <h2 class="text-center display-5 fw-bold mb-2">Contacto</h2>
            <p class="text-center text-muted mb-5">¿Tienes un proyecto en mente? Escríbeme.</p>
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="row g-3">
                        <div class="col-md-4" v-for="link in links" :key="link.label">
                            <a :href="link.href" :target="link.external ? '_blank' : undefined"
                                rel="noopener"
                                class="contact-card d-flex align-items-center gap-3 p-4 rounded-3 text-white text-decoration-none"
                                :style="{ background: link.gradient }">
                                <div class="icon-circle bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                                    <i :class="['bi', link.icon, 'fs-5']"></i>
                                </div>
                                <div>
                                    <div class="fw-semibold">{{ link.label }}</div>
                                    <div class="small opacity-75">{{ link.sub }}</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const links = [
    {
        label: 'Email',
        sub: 'danidevhdez@gmail.com',
        icon: 'bi-envelope-fill',
        href: 'mailto:danidevhdez@gmail.com',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #ec4899 100%)',
        external: false,
    },
    {
        label: 'LinkedIn',
        sub: 'daniel-hernandez-martin',
        icon: 'bi-linkedin',
        href: 'https://www.linkedin.com/in/daniel-hernandez-martin/',
        gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        external: true,
    },
    {
        label: 'GitHub',
        sub: 'danilocick',
        icon: 'bi-github',
        href: 'https://github.com/danilocick',
        gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        external: true,
    },
]
</script>

<style scoped>
.contact-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.contact-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}
.icon-circle {
    width: 44px;
    height: 44px;
}
</style>
