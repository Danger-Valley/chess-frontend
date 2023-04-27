import { useUserStore } from "~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
  let userStore = useUserStore()
  
  return {
    provide: {
      async connectDiscord() {
        if(userStore.getUser.value.discordUser) return;

        let env = useRuntimeConfig();
        let url;

        if (location.host.startsWith("dev") || location.host.startsWith("localhost"))
          url = env.public.Discord.redirect.dev;
        else
          url = env.public.Discord.redirect.prod;

        let discordTab = open(url, "Discord login");
        let timer = setInterval(async () => {
          if (discordTab.closed) {
            if (localStorage.getItem("DISCORD_CODE")) {
              let resp, body;

              resp = await nuxtApp.$API().Auth.Discord.checkAuth(localStorage.getItem("DISCORD_CODE"));
              body = await resp.json();
              clearInterval(timer);

              if (body.errors) {
                //nuxtApp.$showToast(body.errors[0].message, "error");
                console.error(body);
              }

              localStorage.removeItem("DISCORD_CODE");
              console.log(body);
              await userStore.saveUser(body.accessToken)
              nuxtApp.$togglePopup('SignInPopup')
            }
          }
        }, 500);
      },

      randomString() {
        let res = "";
        let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        // [10;20]
        let num = Math.ceil(Math.random() * 10) + 10;

        for (let i = 0; i < num; i++) {
          // [0;len(abc)]
          res += abc[Math.round(Math.random() * abc.length)];
        }
        return res;
      },
      async connectTwitter() {
        if(userStore.getUser.value.twitterUser) return;
        let env = useRuntimeConfig();
        let url;

        if (location.host.startsWith("dev") || location.host.startsWith("localhost"))
          url = env.public.Twitter.redirect.dev;
        else
          url = env.public.Twitter.redirect.prod;

        let rndStr = randomString();

        console.log(`Random string for Twitter's code challenge: ${rndStr}`);

        url = url.replace("NEW_RANDOM_STRING_EACH_TIME", rndStr);

        console.log(`Url for redirect: ${url}`);

        let twitterTab = open(url, "Twitter login");
        let timer = setInterval(async () => {
          if (twitterTab.closed) {
            if (localStorage.getItem("TWITTER_CODE")) {
              let resp, body;

              resp = await nuxtApp.$API().Auth.Twitter.checkAuth({
                authCode: localStorage.getItem("TWITTER_CODE"),
                codeChallenge: rndStr
              });
              body = await resp.json();
              clearInterval(timer);

              if (body.errors) {
                //nuxtApp.$showToast(body.errors[0].message, "error", 10);
                console.error(body);
              }

              localStorage.removeItem("TWITTER_CODE");
              await userStore.saveUser(body.accessToken)
              nuxtApp.$togglePopup('SignInPopup')
            }
          }
        }, 500);
      },

      // google flow

      async handleOnSuccess(response) {
        if(userStore.getUser.value?.googleUser) return;
        console.log("Access Token: ", response.access_token);

        let resp = await nuxtApp.$API().Auth.Google.checkAuth(response.access_token);
        let body = await resp.json();

        if (body.errors) {
          //nuxtApp.$showToast(body.errors[0].message, "error");
          console.error(body);
        }

        console.log(body);
        await userStore.saveUser(body.accessToken)
        nuxtApp.$togglePopup('SignInPopup')
      },
      handleOnError(errorResponse) {
        console.log("Error: ", errorResponse);
      }
    }
  }
})