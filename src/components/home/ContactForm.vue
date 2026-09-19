<template>
    <form class="space-y-4" @submit.prevent="onSubmit">
        <!-- Éxito -->
        <div v-if="status === 'success'"
            class="flex items-center gap-2 rounded-lg bg-success/10 p-4 text-success">
            <i class="bi bi-check-circle-fill"></i>
            <span>{{ t('contact.formSuccess') }}</span>
        </div>

        <template v-else>
            <div>
                <label for="cf-name" class="mb-1 block text-sm font-semibold">{{ t('contact.formName') }}</label>
                <input id="cf-name" v-model.trim="form.name" required :placeholder="t('contact.formNamePlaceholder')"
                    :class="field" />
            </div>

            <div>
                <label for="cf-email" class="mb-1 block text-sm font-semibold">{{ t('contact.formEmail') }}</label>
                <input id="cf-email" v-model.trim="form.email" type="email" required
                    :placeholder="t('contact.formEmailPlaceholder')" :class="field" />
            </div>

            <div>
                <label for="cf-message" class="mb-1 block text-sm font-semibold">{{ t('contact.formMessage') }}</label>
                <textarea id="cf-message" v-model.trim="form.message" required rows="5"
                    :placeholder="t('contact.formMessagePlaceholder')" :class="field"></textarea>
            </div>

            <!-- Honeypot anti-spam (oculto para humanos) -->
            <input v-model="form.botcheck" type="checkbox" class="hidden" tabindex="-1" autocomplete="off"
                aria-hidden="true" />

            <div v-if="status === 'error'" class="flex items-center gap-2 text-sm text-danger">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <span>{{ t('contact.formError') }}</span>
            </div>

            <BaseButton type="submit" :disabled="status === 'sending'"
                class="w-full disabled:cursor-not-allowed disabled:opacity-60">
                <i class="bi bi-send"></i>
                {{ status === 'sending' ? t('contact.formSending') : t('contact.formSend') }}
            </BaseButton>

            <p class="text-xs text-muted">{{ t('contact.formPrivacy') }}</p>
        </template>
    </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BaseButton } from '@/components/ui'

const { t } = useI18n()

// ⚠️ Reemplaza por tu Access Key gratuita de https://web3forms.com
// (Créala con tu email danidevhdez@gmail.com; los mensajes te llegarán ahí.)
const WEB3FORMS_ACCESS_KEY = 'REEMPLAZA_CON_TU_ACCESS_KEY'

const form = reactive({ name: '', email: '', message: '', botcheck: false })
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

const field =
    'w-full rounded-lg border border-line bg-bg px-3 py-2 text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'

async function onSubmit() {
    if (form.botcheck) return // bot detectado
    status.value = 'sending'
    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: 'Nuevo contacto desde el portfolio',
                from_name: form.name,
                name: form.name,
                email: form.email,
                message: form.message,
            }),
        })
        const data = await res.json()
        status.value = data.success ? 'success' : 'error'
    } catch {
        status.value = 'error'
    }
}
</script>
