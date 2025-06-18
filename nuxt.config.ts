// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: [
    'bootstrap/dist/css/bootstrap.css',
    'bootstrap-vue-next/dist/bootstrap-vue-next.css',
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-icons/font/bootstrap-icons.css'
  ],
  plugins: [
    { src: "@/plugins/vue3-toastify.client.ts"},
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL
    }
  }
})
