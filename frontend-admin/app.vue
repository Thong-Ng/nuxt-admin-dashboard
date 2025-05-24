<script setup lang="ts">
import { Sonner } from '@/components/ui/sonner'
import { ConfigProvider } from 'radix-vue'

const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#09090b' : '#ffffff')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})

useServerHead({
  bodyAttrs: {
    class: `theme-gray`,
    style: `--radius: 0.5rem;`,
  },
})

const title = 'Admin Dashboard'
const description = 'Admin dashboard of court booking system.'

const router = useRouter()

const useIdFunction = () => useId()

</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <div vaul-drawer-wrapper>
      <div class="font-sans">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    </div>
    <Sonner position="top-center" class="pointer-events-auto"/>
  </ConfigProvider>
</template>