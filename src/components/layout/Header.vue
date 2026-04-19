<template>
    <nav class="navbar navbar-expand-lg navbar-light fixed-top shadow-sm" :class="{ 'navbar-scrolled': isScrolled }">
        <div class="container">
            <!-- Logo/Brand -->
            <RouterLink class="navbar-brand d-flex align-items-center" to="/" @click="closeMenu">
                <div class="brand-container">
                    <span class="brand-tag">&lt;</span>
                    <span class="brand-name">dani</span>
                    <span class="brand-dev">dev</span>
                    <span class="brand-tag">/&gt;</span>
                </div>
            </RouterLink>

            <!-- Toggler button for mobile -->
            <button class="navbar-toggler border-0" type="button" @click="toggleMenu" aria-controls="navbarNav"
                :aria-expanded="!isCollapsed" aria-label="Toggle navigation">
                <i class="bi" :class="isCollapsed ? 'bi-list' : 'bi-x'" style="font-size: 1.5rem;"></i>
            </button>

            <!-- Navigation Links -->
            <div class="collapse navbar-collapse" :class="{ show: !isCollapsed }" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
                    <li class="nav-item" v-for="item in navItems" :key="item.text">
                        <RouterLink class="nav-link px-3 py-2 rounded-pill" :to="item.link" @click="closeMenu"
                            active-class="active">
                            <i :class="item.icon" class="me-2"></i>
                            {{ item.text }}
                        </RouterLink>
                    </li>

                    <!-- Dark mode toggle -->
                    <li class="nav-item ms-lg-1">
                        <button class="btn btn-sm rounded-pill px-3 py-2 border" @click="theme.toggle()"
                            :title="theme.dark ? 'Modo claro' : 'Modo oscuro'">
                            <i class="bi" :class="theme.dark ? 'bi-sun-fill' : 'bi-moon-fill'"></i>
                        </button>
                    </li>

                    <!-- CTA Button -->
                    <li class="nav-item ms-lg-2">
                        <RouterLink to="/contact" class="btn btn-primary rounded-pill px-4 py-2" @click="closeMenu">
                            <i class="bi bi-chat-dots me-2"></i>
                            Let's Talk
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { useThemeStore } from "@/stores/theme"

const theme = useThemeStore()
import { RouterLink } from "vue-router";

const isCollapsed = ref(true);
const isScrolled = ref(false);

const toggleMenu = () => {
    isCollapsed.value = !isCollapsed.value;
};

const closeMenu = () => {
    // Only close when in mobile view
    if (window.innerWidth < 992) {
        isCollapsed.value = true;
    }
};

// Handle scroll effect
const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
    window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});

const navItems = [
    { text: "Home", link: "/", icon: "bi bi-house-door" },
    { text: "Projects", link: "/projects", icon: "bi bi-grid-3x3-gap" },
    { text: "Docs", link: "/docs", icon: "bi bi-book" },
];
</script>

<style scoped lang="scss">
@use "../../assets/custom.scss" as *;

.navbar {
    background-color: rgba($light, 0.95);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    padding: 1rem 0;
}

.navbar-scrolled {
    padding: 0.5rem 0;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important;
}

// Brand styles
.navbar-brand {
    font-weight: 700;
    font-size: 1.5rem;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
}

.brand-container {
    display: flex;
    align-items: center;
    gap: 0.2rem;
}

.brand-tag {
    color: $primary;
    font-weight: 400;
    opacity: 0.7;
}

.brand-name {
    color: $accent;
    font-weight: 700;
}

.brand-dev {
    color: $dark;
    font-weight: 700;
}

// Navigation items
.nav-link {
    font-weight: 500;
    color: $dark;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
        color: $primary;
        background-color: rgba($primary, 0.1);
    }

    &.active {
        color: $primary;
        font-weight: 600;
        background-color: rgba($primary, 0.1);

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 6px;
            height: 6px;
            background-color: $primary;
            border-radius: 50%;
        }
    }

    i {
        font-size: 1rem;
        opacity: 0.8;
    }
}

// CTA Button
.btn-primary {
    font-weight: 600;
    box-shadow: 0 4px 15px rgba($primary, 0.3);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba($primary, 0.4);
    }
}

// Mobile menu
@media (max-width: 991.98px) {
    .navbar-collapse {
        background-color: $light;
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .nav-item {
        margin-bottom: 0.5rem;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .nav-link {
        padding: 0.75rem 1rem !important;

        &.active::after {
            display: none;
        }
    }

    .btn-primary {
        width: 100%;
        margin-top: 0.5rem;
    }
}

// Toggler icon animation
.navbar-toggler {
    &:focus {
        box-shadow: none;
    }

    i {
        transition: transform 0.3s ease;
    }

    &:hover i {
        transform: scale(1.1);
    }
}

// Smooth transitions
.navbar-collapse {
    transition: height 0.3s ease;
}
</style>