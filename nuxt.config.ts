// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  $development: {
    runtimeConfig: {
      public: {
        img_url: 'http://localhost:3000/',
        api_url: 'http://127.0.0.1:8080'
      }
    }
  },
  $production: {
    runtimeConfig: {
      public: {
        img_url: 'http://localhost:3000/',
        api_url: 'http://192.168.2.15:8080'
      }
    }
  },

  modules: [
    '@nuxt/icon',
    '@nuxt/fonts',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ]

})
