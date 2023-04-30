<template>
  <div class="page">
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';

let userStore = useUserStore(),
  { $API } = useNuxtApp()

onMounted(async () => {
  const fragment = new URLSearchParams(window.location.search);
  const code = fragment.get('code');

  console.log(localStorage, localStorage.getItem("connectType"), code)

  if (!code) return;

  if (localStorage.getItem("connectType") == 'auth') {
    let resp, body;

    resp = await $API().Auth.Discord.checkAuth(code);
    body = await resp.json();

    if (body.errors) {
      return console.error(body);
    }

    console.log(body);

    await userStore.saveUser(body.accessToken)
  }
  else if (localStorage.getItem("connectType") == 'update') {
    await userStore.updateUser({ discord: { authCode: code } })
  }

  let redirect_original_url = localStorage.getItem("redirect_original_url")

  //localStorage.removeItem("redirect_original_url");
  //localStorage.removeItem("connectType");

  //navigateTo(redirect_original_url, { external: true });
});
</script>
<style lang="scss" scoped>
#anim {
  width: 100%;
  max-width: 400px;
  margin: auto;
  display: flex;
  gap: 28px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#goBack {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Integral CF';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;
  color: #FFFFFF;
  width: 380px;
  height: 75px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
}
</style>