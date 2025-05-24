import type { UseFetchOptions } from 'nuxt/app'

export function useFetchAPI<T>(
  url: string | (() => string),
  options?: UseFetchOptions<T>,
) {
  return useFetch(url, {
    ...options,
    $fetch: useNuxtApp().$useAPI
  })
}
