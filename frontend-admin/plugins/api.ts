export default defineNuxtPlugin((nuxtApp) => {
    const { token } = useAuth();
  
    const useAPI = $fetch.create({
      baseURL: 'http://localhost:4000/api',
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
  