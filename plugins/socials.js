import { useUserStore } from "~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
  let userStore = useUserStore()
  const close = () => {
    if (document.querySelector('#SignInPopup')) nuxtApp.$togglePopup('SignInPopup')
  }
  const randomString = () => {
    let res = "";
    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // [10;20]
    let num = Math.ceil(Math.random() * 10) + 10;

    for (let i = 0; i < num; i++) {
      // [0;len(abc)]
      res += abc[Math.round(Math.random() * abc.length)];
    }
    return res;
  }

  return {
    provide: {
      /**
       * @param {string} connectType 'auth' or 'update' (profile)
       */
      async connectDiscord(connectType = 'auth') {
        if (userStore.getUser?.value?.discordUser) return;

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
                return console.error(body);
              }

              console.log(body);
              if (connectType == 'auth') await userStore.saveUser(body.accessToken)
              else if (connectType == 'update') {
                await userStore.updateUser({ discord: { authCode: localStorage.getItem("DISCORD_CODE") } })
              }

              localStorage.removeItem("DISCORD_CODE");
              close()
            }
          }
        }, 500);
      },

      /**
       * @param {string} connectType 'auth' or 'update' (profile)
       */
      async connectTwitter(connectType = 'auth') {
        if (userStore.getUser?.value?.twitterUser) return;
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
                return console.error(body);
              }

              if (connectType == 'auth') await userStore.saveUser(body.accessToken)
              else if (connectType == 'update') {
                await userStore.updateUser({ twitter: { authCode: localStorage.getItem("TWITTER_CODE"), codeChallenge: rndStr } })
              }
              localStorage.removeItem("TWITTER_CODE");
              close()
            }
          }
        }, 500);
      },

      // google flow

      /**
       * @param {string} connectType 'auth' or 'update' (profile)
       */
      async handleOnSuccess(response, connectType = 'auth') {
        if (userStore.getUser?.value?.googleUser) return;
        console.log("Access Token: ", response.access_token);

        let resp = await nuxtApp.$API().Auth.Google.checkAuth(response.access_token);
        let body = await resp.json();

        if (body.errors) {
          //nuxtApp.$showToast(body.errors[0].message, "error");
          return console.error(body);
        }

        console.log(body);
        if (connectType == 'auth') await userStore.saveUser(body.accessToken)
        else if (connectType == 'update') {
          await userStore.updateUser({ google: { token: response.access_token } })
        }
        close()
      },
      handleOnError(errorResponse) {
        console.error("Error: ", errorResponse);
      }
    }
  }
})