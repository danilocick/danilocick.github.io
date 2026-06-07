<script setup lang="ts">
withDefaults(
    defineProps<{
        modelValue: string
        type?: string
        placeholder?: string
        icon?: string
    }>(),
    { type: 'text', placeholder: '', icon: '' },
)

defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const field =
    'w-full border border-line bg-surface px-3 py-2 text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
</script>

<template>
    <div v-if="icon" class="flex">
        <span class="flex items-center rounded-l-lg border border-r-0 border-line bg-soft px-3">
            <i :class="['bi', icon]"></i>
        </span>
        <input
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :class="[field, 'rounded-r-lg']"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
    </div>
    <input
        v-else
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :class="[field, 'rounded-lg']"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
</template>
