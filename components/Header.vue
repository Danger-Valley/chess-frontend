<template>
  <header class="header">
    <div class="logo">
      <div class="logo__heading">The Chess</div>
      <div class="logo__underheading">Multichain crypto chess</div>
    </div>

    <div class="header__mobile">
      <div class="status">
        <div class="animation">
          <div class="animation__dot"></div>
          <div class="animation__bg"></div>
        </div>
        {{ activeBoards }} active boadrs
      </div>

      <div class="menu">
        <div
          class="menu__name"
          @click="toggleMenu()"
        >
          Menu
        </div>

        <div
          class="menu__list"
          :class="{ 'menu__list--toggled': isToggled }"
        >
          <div
            class="menu__mobile-close"
            @click="toggleMenu()"
          >
            Close
          </div>
          <NuxtLink
            class="menu__item"
            to=""
          >Lobby</NuxtLink>
          <NuxtLink
            class="menu__item"
            to=""
          >Leaderboard</NuxtLink>
          <NuxtLink
            class="menu__item"
            to=""
          >Tournaments</NuxtLink>
          <NuxtLink
            class="menu__item"
            to=""
          >Chess tv</NuxtLink>
          <NuxtLink
            class="menu__item"
            to=""
          >Wiki</NuxtLink>
          <NuxtLink
            class="menu__item menu__item--action"
            to=""
          >
            Create game
            <IconArrow style="height: calc(8px * 1.25);"></IconArrow>
          </NuxtLink>

          <div class="menu__item menu__item--signin" @click="singIn">
            Sign In
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import IconArrow from "@/assets/imgs/Arrow.svg"
let { $API } = useNuxtApp();

let activeBoards = ref(584),
  isToggled = ref(false)

const toggleMenu = () => {
  // TODO get var from scss?
  if (window.innerWidth <= 1440) isToggled.value = !isToggled.value;
}

const singIn = async () => {
  let resp = await $API().Auth.Google.front();
  let body = await resp.json();
  console.log(resp, body);
}
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
  align-items: baseline;

  &__mobile {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 40px;
    margin-left: auto;
  }
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
    line-height: 1;
    color: #FFFFFF;
    text-transform: uppercase;
  }

  &__underheading {
    font-size: 14px;
    line-height: 1.6;
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
  line-height: 1.6;
  color: #FFFFFF;
}

.animation {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 19px;
  height: 19px;

  &__dot {
    width: 7px;
    height: 7px;
    border-radius: 100%;
    background: #FFBF2E;
  }

  &__bg {
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
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  width: 213px;
  height: 390px;
  padding: 26px;
  background: radial-gradient(64.08% 15.68% at 14.32% 66.28%, rgba(39, 244, 186, 0.105) 0%, rgba(39, 244, 186, 0) 100%), rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(50px);
  border-radius: 20px;

  font-family: 'Neue Plak';
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  text-transform: uppercase;
  color: #FFFFFF;

  &__list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
  }

  &__name {
    margin-bottom: 40px;
    color: #ffffff4d;
  }

  &__mobile-close {
    display: none;
  }

  &__item {
    cursor: pointer;

    &--action {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      color: $color1;
    }

    &--signin {
      margin-top: auto;
    }
  }
}

@media screen and (min-width: #{map-get($sizes, "desktop-high") + px}){
  .logo {
    &__heading {
      font-size: 28px;
    }
    &__underheading{
      font-size: 18px;
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "desktop-low") + px}) {
  .header {
    max-height: unset;
    padding: 34px 40px;
  }

  .logo{
    margin: 16px 10px;
  }

  .menu {
    position: static;
    width: unset;
    height: unset;
    backdrop-filter: unset;
    padding: unset;
    background: unset;
    border: unset;

    &__name {
      margin: unset;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
    }

    &__list {
      position: absolute;
      display: flex;
      flex-direction: column;
      gap: 40px;
      left: 100vw;
      top: 0;
      width: 100vw;
      height: 100vh;
      padding: 34px 50px;
      background-color: #0B0F16;
      transition: .5s;

      &--toggled {
        left: 0;
      }
    }

    &__item {
      font-size: 16px;
      line-height: 1;

      &:first-of-type {
        margin-top: 118px;
      }

      &--signin {
        margin-top: 40px;
      }
    }

    &__mobile-close {
      display: block;
      align-self: flex-end;
      font-size: 18px;
      line-height: 1;
      color: #ffffff4d;
      cursor: pointer;
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "tablet") + px}) {
  .header {
    padding: 71px 20px;
    &__mobile {
      flex-direction: column-reverse;
      align-items: flex-end;
      gap: 12px;
    }
  }

  .logo{
    margin: unset;
  }

  .menu {
    &__list {
      align-items: center;
    }

    &__item {
      &:first-of-type {
        margin-top: 100px;
      }
    }
  }
}</style>