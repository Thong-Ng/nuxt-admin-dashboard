// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@unocss/nuxt',
    'shadcn-nuxt',
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    'vue-sonner/nuxt',
  ],
  auth: {
    baseURL: 'http://localhost:4000/api/',
    provider: {
      type: 'local',
      pages: {
        login: '/login'
      },
      endpoints: {
        signIn: { path: 'auth/login', method: 'post' },
        signOut: false,
        getSession: { path: 'user/verify-token', method: 'get' },
      },
      token: {
        signInResponseTokenPointer: '/token',
        maxAgeInSeconds: 604800, // 7 days
      },
      session: {
        dataType: {
          user_id: 'string',
          role: 'string',
          email: 'string',
          username: 'string',
        },
        dataResponsePointer: '/',
      }
    },
    globalAppMiddleware: true,
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  features: {
    // For UnoCSS
    inlineStyles: false,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  routeRules: {
    '/components': { redirect: '/components/accordion' },
    '/settings': { redirect: '/settings/profile' },
  },

  imports: {
    dirs: [
      './lib',
    ],
  },

  compatibilityDate: '2024-12-14',
})
