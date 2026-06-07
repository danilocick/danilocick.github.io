<template>
    <div class="flex min-h-screen items-center justify-center bg-soft p-6">
        <div class="contact-container rounded-2xl border border-line bg-surface p-12 shadow-lg">
            <h2 class="mb-2 text-center text-4xl font-bold text-fg">{{ t('contactPage.title') }}</h2>
            <p class="mb-6 text-center text-muted">{{ t('contactPage.subtitle') }}</p>

            <div class="flex flex-col gap-4">
                <!-- Email -->
                <a :href="`mailto:${contact.email}`"
                    class="contact-link email-link flex items-center rounded-lg p-6 text-white no-underline">
                    <div class="icon-circle mr-4 flex items-center justify-center rounded-full bg-white/25">
                        <i class="bi bi-envelope-fill text-xl"></i>
                    </div>
                    <div>
                        <div class="font-semibold">Email</div>
                        <div class="text-sm opacity-75">{{ contact.email }}</div>
                    </div>
                </a>

                <!-- LinkedIn -->
                <a :href="contact.linkedin" target="_blank" rel="noopener noreferrer"
                    class="contact-link linkedin-link flex items-center rounded-lg p-6 text-white no-underline">
                    <div class="icon-circle mr-4 flex items-center justify-center rounded-full bg-white/25">
                        <i class="bi bi-linkedin text-xl"></i>
                    </div>
                    <div>
                        <div class="font-semibold">LinkedIn</div>
                        <div class="text-sm opacity-75">{{ t('contactPage.linkedinSub') }}</div>
                    </div>
                </a>

                <!-- GitHub -->
                <a :href="contact.github" target="_blank" rel="noopener noreferrer"
                    class="contact-link github-link flex items-center rounded-lg p-6 text-white no-underline">
                    <div class="icon-circle mr-4 flex items-center justify-center rounded-full bg-white/25">
                        <i class="bi bi-github text-xl"></i>
                    </div>
                    <div>
                        <div class="font-semibold">GitHub</div>
                        <div class="text-sm opacity-75">{{ t('contactPage.githubSub') }}</div>
                    </div>
                </a>
            </div>

            <div class="mt-6 text-center">
                <p class="text-sm text-muted">{{ t('contactPage.footer') }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const contact = reactive({
    email: 'danidevhdez@gmail.com',
    linkedin: 'https://www.linkedin.com/in/daniel-hernandez-martin/',
    github: 'https://github.com/danilocick'
});
</script>

<style scoped>
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
}
</style>
