// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  $development: {
    runtimeConfig: {
      public: {
        api_url: 'http://127.0.0.1:8080'
      }
    }
  },

  modules: [
    '@nuxt/icon',
    '@nuxt/fonts',
    '@pinia/nuxt'
  ]

})