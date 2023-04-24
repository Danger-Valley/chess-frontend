<template>
  <button @click="login">Google</button>
  <button @click="connectTwitter">Twitter</button>
  <button @click="connectDiscord">Discord</button>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useTokenClient } from "vue3-google-signin";

let { $API } = useNuxtApp();

let userStore = useUserStore()

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
        userStore.saveUser(body)
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
        userStore.saveUser(body)
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
  userStore.saveUser(body)
};

const handleOnError = (errorResponse) => {
  console.log("Error: ", errorResponse);
};

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError
});
</script>