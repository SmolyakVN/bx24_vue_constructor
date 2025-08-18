export default defineNuxtConfig({
  ssr: false,
  app: {
    baseURL: '/bx24_vue_constructor/',
    buildAssetsDir: '/_nuxt/'
  },
  nitro: {
    output: {
      dir: '.output',
      publicDir: '.output/public'
    }
  },
  modules: ['@bitrix24/b24ui-nuxt'],
  plugins: ['~/assets/plugins/bx24.js'],
  css: ['~/assets/css/main.css']
})