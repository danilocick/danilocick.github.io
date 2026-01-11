<template>
    <div class="min-vh-100 bg-gradient d-flex align-items-center justify-content-center p-4">
        <div class="rounded-4 shadow-lg p-5 contact-container">
            <h2 class="fs-1 fw-bold text-dark mb-2 text-center">Get In Touch</h2>
            <p class="text-muted text-center mb-4">Connect with me through any of these channels</p>

            <div class="d-flex flex-column gap-3">
                <!-- Email -->
                <a :href="`mailto:${contact.email}`"
                    class="contact-link email-link d-flex align-items-center p-4 text-white text-decoration-none rounded-3">
                    <div class="icon-circle bg-white bg-opacity-25 p-3 rounded-circle me-3">
                        <i class="bi bi-envelope-fill fs-4"></i>
                    </div>
                    <div>
                        <div class="fw-semibold">Email</div>
                        <div class="small opacity-75">{{ contact.email }}</div>
                    </div>
                </a>

                <!-- LinkedIn -->
                <a :href="contact.linkedin" target="_blank" rel="noopener noreferrer"
                    class="contact-link linkedin-link d-flex align-items-center p-4 text-white text-decoration-none rounded-3">
                    <div class="icon-circle bg-white bg-opacity-25 p-3 rounded-circle me-3">
                        <i class="bi bi-linkedin fs-4"></i>
                    </div>
                    <div>
                        <div class="fw-semibold">LinkedIn</div>
                        <div class="small opacity-75">Professional Profile</div>
                    </div>
                </a>

                <!-- GitHub -->
                <a :href="contact.github" target="_blank" rel="noopener noreferrer"
                    class="contact-link github-link d-flex align-items-center p-4 text-white text-decoration-none rounded-3">
                    <div class="icon-circle bg-white bg-opacity-25 p-3 rounded-circle me-3">
                        <i class="bi bi-github fs-4"></i>
                    </div>
                    <div>
                        <div class="fw-semibold">GitHub</div>
                        <div class="small opacity-75">View My Projects</div>
                    </div>
                </a>
            </div>

            <div class="mt-4 text-center">
                <p class="text-muted small mb-0">Looking forward to connecting with you!</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const contact = reactive({
    email: 'danidevhdez@gmail.com',
    linkedin: 'https://www.linkedin.com/in/daniel-hernandez-martin/',
    github: 'https://github.com/danilocick'
});
</script>

<style scoped lang="scss">
@use "../assets/custom.scss" as custom;

.contact-container {
    max-width: 28rem;
    width: 100%;
}

.contact-link {
    transition: all 0.3s ease;
}

.contact-link:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.email-link {
    background: linear-gradient(135deg, #ef4444 0%, #ec4899 100%);
}

.linkedin-link {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.github-link {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.icon-circle {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>