<template>
  <button @click="signInWith('google')">Google</button>
  <button @click="signInWith('twitter')">Twitter</button>
  <button @click="signInWith('discord')">Discord</button>
</template>

<script setup>
let { $API } = useNuxtApp();

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
      console.log(localStorage.getItem("DISCORD_CODE"))
      return;
      if (localStorage.getItem("DISCORD_CODE")) {
        let resp, body;

        resp = await $API().Discord.checkAuth(localStorage.getItem("DISCORD_CODE"));
        body = await resp.json();
        clearInterval(timer);

        if (body.errors) {
          //nuxtApp.$showToast(body.errors[0].message, "error");
          console.error(body);
        }

        localStorage.removeItem("DISCORD_CODE");
        localStorage.setItem("DISCORD", JSON.stringify(body));

        callback(body);
      }
    }
  }, 500);
}

const signInWith = async (provider) => {
  if(provider == 'discord') connectDiscord()
}
</script>