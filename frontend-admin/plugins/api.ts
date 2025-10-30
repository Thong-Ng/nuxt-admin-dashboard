export default defineNuxtPlugin((nuxtApp) => {
    const { token } = useAuth();
  
    const useAPI = $fetch.create({
      baseURL: 'https://nuxt-admin-dashboard-two.vercel.app/api',
      onRequest({ request, options, error }) {
        if (token.value) {
          options.headers.set('Authorization', token.value)
        }
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          await nuxtApp.runWithContext(() => navigateTo('/login'))
        }
      }
    })
  
    return {
      provide: {
        useAPI,
      }
    }
  })
  