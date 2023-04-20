import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@pinia/nuxt',
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/global.scss";'
        }
      }
    },
    plugins: [
      svgLoader({})
    ]
  },
  app: {
    head: {
      title: 'Chess'
    }
  }
})
