<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="
      cn(
        'rounded-xl border-[#E0DDD2] bg-[#F9F6EF] text-card-foreground shadow',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
