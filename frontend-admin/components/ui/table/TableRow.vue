<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr :class="cn('border-b dark:border-white transition-colors hover:bg-[#F9F6EF] dark:hover-bg-transparent data-[state=selected]:bg-muted', props.class)">
    <slot />
  </tr>
</template>
