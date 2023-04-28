<template>
  <div class="page">

    <NuxtLink
      id="goBack"
      to="/"
    >
      Back to The Chess
    </NuxtLink>
  </div>
</template>

<script setup>
let s = ref(1);

onMounted(() => {
  const fragment = new URLSearchParams(window.location.search);
  const code = fragment.get('code');

  if (code) localStorage.setItem("TWITTER_CODE", code);

  /*
  setInterval(() => {
    if (s.value === 1) close();
    s.value--;
  }, 1000)
  */
});
</script>
<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

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