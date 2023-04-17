<template>
  <header class="header">
    <div class="logo">
      <div class="logo__heading">The Chess</div>
      <div class="logo__underheading">Multichain crypto chess</div>
    </div>

    <div class="status">
      <div class="animation">
        <div class="animation__dot"></div>
        <div class="animation__bg"></div>
      </div>
      {{ activeBoards }} active boadrs
    </div>

    <div class="menu">
      Menu
    </div>
  </header>
</template>

<script setup>
let activeBoards = ref(584)
</script>

<style lang="scss" scoped>
@keyframes fadeOut {
  from {
    transform: scale(0);
    opacity: 1;
  }

  to {
    transform: scale(1.5);
    opacity: 0;
  }
}

.header {
  width: 100%;
  max-height: 150px;
  padding: 40px;
  display: flex;
  flex-direction: row;
  gap: 40px;
  align-items: flex-start;
}

.logo {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 10px;

  font-family: 'Neue Plak';

  &__heading {
    font-size: 22px;
    font-weight: 600;
    line-height: 100%;
    color: #FFFFFF;
    text-transform: uppercase;
  }

  &__underheading {
    font-size: 14px;
    line-height: 160%;
    color: #ffffff4d;
  }
}

.status {
  display: flex;
  flex-direction: row;
  gap: 9px;
  margin-left: auto;

  font-family: 'Neue Plak';
  font-size: 14px;
  line-height: 160%;
  color: #FFFFFF;
}

.animation {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 19px;
  height: 19px;
  &__dot{
    width: 7px;
    height: 7px;
    border-radius: 100%;
    background: #FFBF2E;
  }
  &__bg{
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 100%;
    background: #ffbf2e;
    animation-name: fadeOut;
    animation-duration: 2s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
  }
}

.menu {
  width: 213px;
  height: 390px;
  background: radial-gradient(64.08% 15.68% at 14.32% 66.28%, rgba(39, 244, 186, 0.105) 0%, rgba(39, 244, 186, 0) 100%), rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(50px);
  border-radius: 20px;
}
</style>