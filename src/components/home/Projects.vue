<template>
    <h3>Proyectos Destacados: Pending TODO</h3>
    <p>Aquí puedes ver algunos de mis proyectos más recientes y destacados.</p>

    <BCardGroup deck>

        <div v-for="project in projects" :key="project.id" class="card mb-4">
            <div class="inner">
                <p class="card-title">{{ project.title }}</p>
                <p class="small-desc">{{ project.description }}</p>
                <ul class="features">
                    <li>
                        <span class="text-info">
                            <i class="bi bi-check-circle-fill"></i>
                        </span>
                        <span><strong>20</strong> team members</span>
                    </li>
                </ul>
                <BButton :href="project.href">
                    Ver Proyecto
                </BButton>
            </div>
        </div>
    </BCardGroup>
</template>

<script setup lang="ts">
import { BButton, BButtonGroup, BCardGroup, BCard } from 'bootstrap-vue-next';
import { ref } from 'vue';

const projects = [
    {
        id: 1,
        title: 'Proyecto 1',
        description: 'Descripción del proyecto 1',
        href: 'https://via.placeholder.com/300x200'
    },
    {
        id: 2,
        title: 'Proyecto 2',
        description: 'Descripción del proyecto 2',
        href: 'https://via.placeholder.com/300x200'
    },
    {
        id: 3,
        title: 'Proyecto 3',
        description: 'Descripción del proyecto 3',
        href: 'https://via.placeholder.com/300x200'
    }
];
</script>

<style scoped>
.card {
    border-radius: 16px;
    box-shadow: 0 30px 30px -25px rgba(0, 38, 255, 0.205);
    padding: 10px;
    background-color: #fff;
    color: #697e91;
    max-width: 300px;
}

.card strong {
    font-weight: 600;
    color: #425275;
}

.card .inner {
    align-items: center;
    padding: 20px;
    padding-top: 40px;
    background-color: #ecf0ff;
    border-radius: 12px;
    position: relative;
}

.card .pricing {
    position: absolute;
    top: 0;
    right: 0;
    background-color: #bed6fb;
    border-radius: 99em 0 0 99em;
    display: flex;
    align-items: center;
    padding: 0.625em 0.75em;
    font-size: 1.25rem;
    font-weight: 600;
    color: #425475;
}

.card .pricing small {
    color: #707a91;
    font-size: 0.75em;
    margin-left: 0.25em;
}

.card .card-title {
    font-weight: 600;
    font-size: 1.25rem;
    color: #425675;
}

.card .card-title+* {
    margin-top: 0.75rem;
}

.card .small-desc+* {
    margin-top: 1rem;
}

.card .features {
    display: flex;
    flex-direction: column;
}

.card .features li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.card .features li+* {
    margin-top: 0.75rem;
}

.card .features+* {
    margin-top: 1.25rem;
}
</style>