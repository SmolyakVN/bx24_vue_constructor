export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: '/bx24_vue_constructor/',
    buildAssetsDir: 'assets',
  },
  modules: ['@bitrix24/b24ui-nuxt'],
  css: ['~/assets/css/main.css']
})