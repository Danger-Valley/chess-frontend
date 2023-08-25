import { useUserStore } from "~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
  let userStore = useUserStore()
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
        localStorage.setItem("redirect_original_url", location.href);
        localStorage.setItem("connectType", connectType)

        let env = useRuntimeConfig();
        let url = env.public.Discord.redirect

        await navigateTo(url, {
          external: true
        })
      },
      async disconnectDiscord() {
        await userStore.updateUser({ discord: "null" })
      },

      /**
       * @param {string} connectType 'auth' or 'update' (profile)
       */
      async connectTwitter(connectType = 'auth') {
        if (userStore.getUser?.value?.twitterUser) return;
        localStorage.setItem("redirect_original_url", location.href);
        localStorage.setItem("connectType", connectType)

        let env = useRuntimeConfig();
        let url = env.public.Twitter.redirect;

        let rndStr = randomString();

        url = url.replace("NEW_RANDOM_STRING_EACH_TIME", rndStr);
        localStorage.setItem("codeChallenge", rndStr)

        await navigateTo(url, {
          external: true
        })
      },
      async disconnectTwitter() {
        await userStore.updateUser({ twitter: "null" })
      },

      // google flow

      /**
       * @param {string} connectType 'auth' or 'update' (profile)
       */
      async handleOnSuccess(response, connectType = 'auth') {
        if (userStore.getUser?.value?.googleUser) return;
        console.log("resp", response);
        console.log("Access Token: ", response.access_token);

        if (connectType == 'auth') {
          let resp = await nuxtApp.$API().Auth.Google.checkAuth(response.access_token);
          let body = await resp.json();

          if (body.errors) {
            nuxtApp.$showToast(body.errors[0].message, "error");
            return console.error(body);
          }

          console.log(body);
          await userStore.saveUser(body.accessToken)
        }
        else if (connectType == 'update') {
          await userStore.updateUser({ google: { token: response.access_token } })
        }
      },
      handleOnError(errorResponse) {
        console.error("Error: ", errorResponse);
      }
    }
  }
})