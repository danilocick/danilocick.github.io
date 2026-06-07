<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<template>
    <select
        :value="modelValue"
        class="w-full rounded-lg border border-line bg-surface px-3 py-2 text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
        <slot />
    </select>
</template>
