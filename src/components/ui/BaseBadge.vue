<script setup lang="ts">
type Variant =
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'dark'
    | 'soft'

const props = withDefaults(defineProps<{ variant?: Variant }>(), { variant: 'soft' })
</script>

<template>
    <span :class="['badge', `badge-${props.variant}`]">
        <slot />
    </span>
</template>
