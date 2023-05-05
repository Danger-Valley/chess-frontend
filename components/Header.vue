<template>
  <header class="header">
    <NuxtLink
      class="logo"
      to="/"
    >
      <div class="logo__heading">The Chess</div>
      <div class="logo__underheading">Multichain crypto chess</div>
    </NuxtLink>

    <div class="header__mobile">
      <div class="status">
        <div class="animation">
          <div class="animation__dot"></div>
          <div class="animation__bg"></div>
        </div>
        <div>
          {{ activeBoards }} active boadrs
        </div>
      </div>

      <div
        class="menu"
        :class="{ 'menu--logged': user }"
      >
        <div
          v-if="!user"
          class="menu__name"
          @click="toggleMenu()"
        >
          Menu
        </div>
        <div
          v-else
          class="profile"
          @click="navigateTo('/profile')"
        >
          <img
            class="profile__avatar"
            :src="user.avatar"
          />
          <div class="profile__name">{{ user.username || user.email }}</div>
          <div
            class="profile__cross"
            :class="{ 'profile__cross--closed': isClosed }"
            @click.stop="isClosed = !isClosed"
          >
            <IconCross></IconCross>
          </div>
        </div>

        <div
          class="menu__list-wrapper"
          :class="{ 'menu__list-wrapper--toggled': isToggled, 'menu__list-wrapper--logged': user, 'menu__list-wrapper--closed': isClosed }"
        >
          <div
            class="menu__list"
            :class="{ 'menu__list--logged': user }"
          >
            <div
              class="menu__mobile-close"
              @click="toggleMenu()"
            >
              Close
            </div>
            <NuxtLink
              class="menu__item"
              to="/lobby"
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
              @click="meme"
            >
              <div>Create game</div>
              <IconArrow style="height: calc(8px * 1.25);"></IconArrow>
            </NuxtLink>

            <div
              class="menu__item menu__item--signin"
              @click="singIn"
            >
              Sign In
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import IconArrow from "@/assets/imgs/Arrow.svg"
import IconCross from "@/assets/imgs/+.svg"
import { useUserStore } from "~/stores/user";
let { $togglePopup } = useNuxtApp();

let activeBoards = ref(584),
  // for mobile
  isToggled = ref(false),
  // for desktop
  isClosed = ref(false)

const store = useUserStore()

const user = computed(() => store.getUser.value)

const toggleMenu = () => {
  // TODO get var from scss?
  isToggled.value = !isToggled.value;
}

const singIn = async () => {
  if (!user.value) $togglePopup('SignInPopup')
}

function meme() {
  document.querySelectorAll('div, a, span').forEach(el => {
    if (el.innerHTML && !el.innerHTML.includes('<')) el.textContent = 'hehe'
  })
}

onMounted(() => {
  if(user.value) isClosed.value = true;
})
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
  position: relative;
  z-index: 10;
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
  padding: 16px 20px;
  background: radial-gradient(136px 60.5px at 24px 255px, rgba(39, 244, 186, 0.105) 0%, rgba(39, 244, 186, 0) 100%), rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(50px);
  border-radius: 20px;
  transition: .5s;

  font-family: 'Neue Plak';
  font-weight: 600;
  font-size: 14px;
  line-height: 1;
  text-transform: uppercase;
  color: #FFFFFF;

  &--logged {
    background: radial-gradient(136px 60.5px at 24px 255px, rgba(39, 244, 186, 0.105) 0%, rgba(39, 244, 186, 0) 100%), rgba(255, 255, 255, 0.05);
  }

  &__list {
    &-wrapper {
      height: 304px;
      transition: .5s height;
      overflow: hidden;

      &--logged {
        height: 218px;

        .menu__item--signin {
          height: 0;
        }
      }

      &--closed {
        height: 0;
        //margin-top: 0;
        //margin-bottom: 0;
      }
    }

    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
    margin: 12px 6px;

    &--logged {
      margin-top: 28px;
    }
  }

  &__name {
    margin: 12px 6px 28px 6px;
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
      margin-top: 62px;
    }
  }
}

.profile {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &__avatar {
    width: 38.4px;
    aspect-ratio: 1;
    clip-path: path();
  }

  &__name {
    font-family: 'Neue Plak';
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #FFFFFF;
    text-transform: initial;
    max-width: 76px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__cross {
    padding: 8px;
    margin-left: auto;
    rotate: 0deg;
    transition: .2s;

    svg {
      transition: .2s;
      color: #ffffff4d;
    }

    &--closed {
      rotate: 45deg;

      svg {
        color: #fff;
      }
    }
  }
}

@media screen and (min-width: #{map-get($sizes, "desktop-high") + px}) {
  .logo {
    &__heading {
      font-size: 28px;
    }

    &__underheading {
      font-size: 18px;
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "desktop-low")-1 + px}) {
  .header {
    max-height: unset;
    padding: 34px 40px;
    align-items: flex-start;
  }

  .logo {
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
      margin: 0;
      gap: 40px;
      align-items: center;

      &-wrapper {
        position: absolute;
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
      margin-left: auto;
      display: block;
      font-size: 18px;
      line-height: 1;
      color: #ffffff4d;
      cursor: pointer;
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "tablet")-1 + px}) {
  .header {
    padding: 71px 20px;

    &__mobile {
      flex-direction: column-reverse;
      align-items: flex-end;
      gap: 12px;
    }
  }

  .logo {
    margin: unset;
  }

  .menu {
    &__list {
      &-wrapper {
        padding: 71px 20px;
      }
    }

    &__item {
      &:first-of-type {
        margin-top: 62px;
      }
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "mobile")-1 + px}) {
  .header {
    padding: 26px 15px;
  }

  .menu {
    &__list-wrapper {
      padding: 26px 15px;
    }
  }
}</style>