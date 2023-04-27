<template>
  <div
    class="popup__wrapper"
    id="SignInPopup"
  >
    <div class="popup">
      <div class="popup__heading">Sign In</div>

      <div
        class="sign-in"
        @click="connectDiscord"
      >
        <IconDiscord
          class="sign-in__icon"
          alt="discord icon"
        ></IconDiscord>
        <div class="sign-in__text">Sign in with Discord</div>
      </div>

      <div
        class="sign-in"
        @click="connectTwitter"
      >
        <IconTwitter
          class="sign-in__icon"
          alt="twitter icon"
        ></IconTwitter>
        <div class="sign-in__text">Sign in with Twitter</div>
      </div>

      <div
        class="sign-in"
        @click="login"
      >
        <IconGoogle
          class="sign-in__icon"
          alt="google icon"
        ></IconGoogle>
        <div class="sign-in__text">Sign in with Google</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconDiscord from "@/assets/imgs/discord-logo.svg"
import IconTwitter from "@/assets/imgs/twitter-logo.svg"
import IconGoogle from "@/assets/imgs/google-logo.svg"

import { useUserStore } from '@/stores/user'
import { useTokenClient } from "vue3-google-signin";

let { $API, $togglePopup } = useNuxtApp();

let userStore = useUserStore()

const close = () => $togglePopup('SignInPopup')

const connectDiscord = async () => {
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

        resp = await $API().Auth.Discord.checkAuth(localStorage.getItem("DISCORD_CODE"));
        body = await resp.json();
        clearInterval(timer);

        if (body.errors) {
          //nuxtApp.$showToast(body.errors[0].message, "error");
          console.error(body);
        }

        localStorage.removeItem("DISCORD_CODE");
        console.log(body);
        await userStore.saveUser(body.accessToken)
        close()
      }
    }
  }, 500);
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
const connectTwitter = async (callback) => {
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

        resp = await $API().Auth.Twitter.checkAuth({
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
        close()
      }
    }
  }, 500);
}

// google flow

const handleOnSuccess = async (response) => {
  console.log("Access Token: ", response.access_token);

  let resp = await $API().Auth.Google.checkAuth(response.access_token);
  let body = await resp.json();

  if (body.errors) {
    //nuxtApp.$showToast(body.errors[0].message, "error");
    console.error(body);
  }

  console.log(body);
  await userStore.saveUser(body.accessToken)
  close()
};

const handleOnError = (errorResponse) => {
  console.log("Error: ", errorResponse);
};

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError
});
</script>

<style lang="scss" scoped>
.popup {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__heading {
    margin-bottom: 10px;
  }
}

.sign-in {
  height: 58px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: #d9d9d90d;
  cursor: pointer;

  &__text {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    color: #FFFFFF;
  }
}</style>