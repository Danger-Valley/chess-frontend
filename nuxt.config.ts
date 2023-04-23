import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
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
      title: 'The Chess'
    }
  },
  runtimeConfig:{
    public: {
      API_URL: process.env.API_URL,
      Discord: {
        redirect: {
          dev: process.env.DISCORD_REDIRECT_URL_DEV,
          prod: process.env.DISCORD_REDIRECT_URL_PROD
        }
      },
      Twitter: {
        redirect: {
          dev: process.env.TWITTER_REDIRECT_URL_DEV,
          prod: process.env.TWITTER_REDIRECT_URL_PROD
        }
      }
    }
  }
})
