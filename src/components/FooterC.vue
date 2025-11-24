<template>
    <nav class="navbar navbar-expand-lg shadow-sm">
        <div class="container">
            <RouterLink class="navbar-brand" to="/">
                <span class="etiqueta">dani</span>dev
            </RouterLink>

            <!-- Toggler button -->
            <BButton class="navbar-toggler" type="button" @click="isCollapsed = !isCollapsed" aria-controls="navbarNav"
                :aria-expanded="!isCollapsed" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </BButton>

            <!-- Collapsible nav -->
            <div class="collapse navbar-collapse" :class="{ show: !isCollapsed }" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item" v-for="item in navItems" :key="item.text">
                        <RouterLink class="nav-link" :to="item.link" @click="closeMenu">
                            {{ item.text }}
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { BButton } from "bootstrap-vue-next";
import { RouterLink } from "vue-router";

const isCollapsed = ref(true);

const closeMenu = () => {
    // only close when in mobile view
    if (window.innerWidth < 992) {
        isCollapsed.value = true;
    }
};

const navItems = [
    { text: "Home", link: "/" },
    { text: "Projects", link: "/projects" },
    { text: "Contact", link: "/contact" },
    { text: "About me", link: "/about" },
    { text: "Documentation", link: "/docs" },
];
</script>

<style scoped lang="scss">
@use "../assets/custom.scss" as *;

.navbar {
    background-color: $teal-100;
}

.etiqueta {
    color: $green-700;
}
</style>
