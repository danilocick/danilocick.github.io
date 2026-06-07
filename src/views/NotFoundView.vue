<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-7xl font-bold text-primary">404</h1>
            <p class="mb-6 text-2xl text-muted">{{ t('notFound.message') }}</p>
            <BaseButton to="/" pill class="px-6">
                <i class="bi bi-house"></i>{{ t('notFound.back') }}
            </BaseButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { BaseButton } from '@/components/ui'
const { t } = useI18n()
</script>
