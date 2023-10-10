import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: [
    '@pinia/nuxt',
    'nuxt-vue3-google-signin',
    '@nuxtjs/robots',
    'nuxt-simple-sitemap'
  ],
  sitemap: {
    exclude: [
      '/twitterAuth',
      '/discordAuth'
    ],
    urls: [
      '/events/650b45ee29a1098682821e4a',
      '/events/651c82a692b7ab49135eb95e',
      '/events/651dba85ff503ad2576a668f',
      '/events/6525af073919a9c269fa561e',
    ]
  },
  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
  vite: {
    optimizeDeps: {
      include: ["@project-serum/anchor", "@solana/web3.js", "buffer"],
      esbuildOptions: {
        target: "esnext",
      },
    },
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
      title: 'xChess',
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon/favicon.png',
          sizes: 'any'
        },
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon/favicon.svg'
        },
        {
          rel: 'apple-touch-icon',
          href: '/favicon/favicon-retina-ipad.png'
        }
      ],
      meta: [
        {
          property: 'author',
          content: 'Danger Valley'
        },
        {
          property: 'keywords',
          content: 'chess, web3, online chess, multiplayer, gaming, solana, solana chess, web3 chess, blockchain'
        },
        {
          property: 'og:site_name',
          content: 'xchess.io'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:image',
          content: 'https://images.xchess.io/static/thumbnail.png'
        },
        {
          property: 'twitter:image',
          content: 'https://images.xchess.io/static/thumbnail.png'
        },
        {
          property: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          property: 'twitter:site',
          content: '@xChess_io'
        },
        {
          property: 'fb:app_id',
          content: '811815390630618'
        }
      ]
    }
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN,
      SOCKET_URL: process.env.SOCKET_URL,
      Discord: {
        redirect: process.env.DISCORD_REDIRECT_URL!
      },
      Twitter: {
        redirect: process.env.TWITTER_REDIRECT_URL!
      }
    }
  }
})
