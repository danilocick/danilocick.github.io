<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

type Variant =
    | 'primary'
    | 'outline-primary'
    | 'outline-secondary'
    | 'light'
    | 'outline-light'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
    defineProps<{
        variant?: Variant
        size?: Size
        pill?: boolean
        to?: string
        href?: string
    }>(),
    { variant: 'primary', size: 'md', pill: false },
)

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))

const classes = computed(() => [
    'btn',
    `btn-${props.variant}`,
    props.size === 'sm' ? 'btn-sm' : props.size === 'lg' ? 'btn-lg' : '',
    props.pill ? 'rounded-full' : '',
])
</script>

<template>
    <component
        :is="tag"
        :to="to"
        :href="href"
        :type="tag === 'button' ? 'button' : undefined"
        :class="classes"
    >
        <slot />
    </component>
</template>
