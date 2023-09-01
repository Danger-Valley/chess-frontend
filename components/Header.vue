<template>
  <header class="header">
    <NuxtLink
      class="logo"
      to="/"
    >
      <div class="logo__heading">xChess</div>
      <div class="logo__underheading">By players, for players.</div>
    </NuxtLink>

    <div class="header__mobile">
      <!-- <div class="status">
        <div class="animation">
          <div class="animation__dot"></div>
          <div class="animation__bg"></div>
        </div>
        <div>
          {{ activeBoards || 0 }} active board{{ activeBoards != 1 ? 's' : '' }}
        </div>
      </div> -->

      <div
        class="menu"
        :class="{ 'menu--logged': user }"
        @click="toggleMenu(true)"
      >
        <div
          v-if="!user"
          class="menu__name menu__name--desktop"
          :class="{ 'menu__name--desktop-closed': isClosed }"
        >
          Menu
        </div>
        <template v-else>
          <div
            class="menu__name menu__name--mobile"
          >
            Menu
          </div>
          <div
            class="profile profile--desktop"
          >
            <img
              class="profile__avatar"
              :src="user.avatar"
            />
            <div class="profile__name">{{ user.username || user.email }}</div>
            <div
              class="profile__cross"
              :class="{ 'profile__cross--closed': isClosed }"
            >
              <IconCross></IconCross>
            </div>
          </div>
        </template>

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
              @click.stop="toggleMenu(false)"
            >
              Close
            </div>
            <div
              v-if="user"
              class="menu__item profile profile--mobile"
            >
              <img
                class="profile__avatar"
                :src="user.avatar"
              />
              <div class="profile__name">{{ user.username || user.email }}</div>
            </div>
            <NuxtLink
              v-if="user"
              class="menu__item"
              to="/"
            >Lobby</NuxtLink>
            <NuxtLink
              v-if="user"
              class="menu__item"
              to="/profile"
            >Profile</NuxtLink>
            <NuxtLink
              class="menu__item"
              to="https://docs.xchess.io"
            >Wiki</NuxtLink>
            <NuxtLink
              v-if="!user"
              class="menu__item"
              to="https://docs.xchess.io/privacy-policy"
            >Privacy Policy</NuxtLink>
            <NuxtLink
              v-if="!user"
              class="menu__item"
              to="https://docs.xchess.io/terms-of-service"
            >Terms of Service</NuxtLink>
            <div
              v-if="user"
              class="menu__item menu__item--action"
              @click="$togglePopup('GameSettingsPopup')"
            >
              <div>Create game</div>
              <IconArrow style="height: calc(8px * 1.25);"></IconArrow>
            </div>

            <div
              class="menu__item menu__item--action"
              @click="$togglePopup('SignInPopup')"
              v-if="!user"
            >
              <div>Sign In</div>
              <IconArrow style="height: calc(8px * 1.25);"></IconArrow>
            </div>
            <div
              class="menu__item menu__item--logout"
              @click="store.logout"
              v-else
            >
              Logout
            </div>
          </div>
        </div>

      </div>
    </div>
  </header>

  <PopupsSignIn></PopupsSignIn>

  <PopupsLobbySearch ref="GameSearchPopupRef" />
  <PopupsLobbySettings
    ref="GameSettingsPopupRef"
    :isAI="props.isAI"
    @play-now="openGameSearchPopup"
  />
</template>

<script setup>
import IconArrow from "@/assets/imgs/Arrow.svg"
import IconCross from "@/assets/imgs/+.svg"
import { useUserStore } from "~/stores/user";
let { $togglePopup, $API, $showToast } = useNuxtApp();

let activeBoards = ref(),
  // for mobile
  isToggled = ref(false),
  // for desktop
  isClosed = ref(false),
  GameSearchPopupRef = ref(),
  GameSettingsPopupRef = ref()

const props = defineProps(['isAI', 'activeBoards'])

const store = useUserStore()

const user = computed(() => store.getUser.value)

watch(user, async (newVal, oldVal) => {
  // if user authorizes
  if (!oldVal?.id && user.value?.id) await navigateTo('/')
})

watch(() => props.activeBoards, () => {
  console.log(props.activeBoards)
  if (props.activeBoards) return activeBoards.value = props.activeBoards;
})

const openGameSearchPopup = async () => {
  //localStorage.setItem('autoJoin', true);
  $togglePopup('GameSearchPopup')
  GameSearchPopupRef.value.startTimeTracking()
  let body = {
    mode: GameSettingsPopupRef.value.gameMode,
    accessToken: localStorage.getItem('accessToken'),
    everyoneCanJoin: GameSettingsPopupRef.value.playWith == 0,
    isAI: GameSettingsPopupRef.value.playWith == 2
  }
  if (GameSettingsPopupRef.value.color) body = {
    ...body,
    color: GameSettingsPopupRef.value.color
  }
  let resp = await $API().Chess.find_create(body);
  body = await resp.json();
  console.log(body);
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
  await navigateTo(`game/${body.game.id}`)
}

const toggleMenu = (blockOnMobile = false) => {
  if(blockOnMobile && window.innerWidth <= 1440 && isToggled.value) return;
  isToggled.value = !isToggled.value;
  isClosed.value = !isClosed.value;
}

onMounted(async () => {
  isClosed.value = true;
  // logic here: if index page - we get boardsCount from page API -> props to this component; else page - we send API call
  if (useRoute().fullPath == '/') return;

  let resp = await $API().Lobby.get(localStorage.getItem('accessToken'));
  let body = await resp.json();

  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }

  activeBoards.value = body.activeBoardsCount;
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
  z-index: 3;

  &__mobile {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 40px;
    margin-left: auto;
    max-height: 72.38px;
  }
}

.logo {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 10px;
  align-self: center;

  font-family: 'Neue Plak';

  &__heading {
    font-size: 22px;
    font-weight: 600;
    line-height: 1;
    color: #FFFFFF;
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
  align-self: center;

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
  cursor: pointer;

  &--logged {
    align-self: flex-start;
    background: radial-gradient(136px 60.5px at 24px 195px, #{$color1}1a 0%, #{$color1}00 100%),
    rgba(255, 255, 255, 0.05);
  }

  &__list {
    &-wrapper {
      height: 142px;
      transition: .5s height;
      overflow: hidden;

      &--logged {
        height: 190px;

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
    transition: .5s;
    margin: 12px 6px 28px 6px;
    color: #ffffff4d;

    &--mobile {
      display: none;
    }

    &--desktop {
      &-closed {
        margin: 12px 6px;
      }
    }
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

    // &--signin,
    // &--logout {
    //   margin-top: 20px;
    // }
  }
}

.profile {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  &--mobile {
    display: none;
  }

  &__avatar {
    width: 38.4px;
    aspect-ratio: 1;
    clip-path: path("M36.7179 14.3204C35.3312 11.4045 33.7143 8.60388 31.8823 5.94508L31.2913 5.09576C30.5638 4.04027 29.6104 3.16008 28.5002 2.5192C27.39 1.8783 26.1508 1.4928 24.873 1.39069L23.8356 1.30709C20.6169 1.04868 17.3829 1.04868 14.1644 1.30709L13.127 1.39069C11.8491 1.4928 10.6101 1.8783 9.49983 2.5192C8.38962 3.16008 7.43612 4.04027 6.70863 5.09576L6.11772 5.95268C4.28574 8.61148 2.66876 11.4121 1.28212 14.328L0.835616 15.2667C0.285448 16.4243 0 17.69 0 18.9717C0 20.2535 0.285448 21.5191 0.835616 22.6768L1.28212 23.6154C2.66876 26.5314 4.28574 29.3321 6.11772 31.9908L6.70863 32.8477C7.43612 33.9032 8.38962 34.7835 9.49983 35.4244C10.6101 36.0652 11.8491 36.4508 13.127 36.5528L14.1644 36.6364C17.3829 36.8948 20.6169 36.8948 23.8356 36.6364L24.873 36.5528C26.1517 36.4494 27.3915 36.0622 28.5017 35.4192C29.6121 34.7763 30.565 33.8939 31.2913 32.8363L31.8823 31.9794C33.7143 29.3207 35.3312 26.52 36.7179 23.604L37.1644 22.6654C37.7144 21.5077 38 20.2421 38 18.9603C38 17.6786 37.7144 16.4129 37.1644 15.2553L36.7179 14.3204Z");
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
    margin-left: auto;

    &__name {
      display: block;
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

      // &--signin {
      //   margin-top: 40px;
      // }
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

  .profile {
    &--desktop {
      display: none;
    }

    &--mobile {
      display: flex;
      padding: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(50px);
      border-radius: 20px;
      margin-bottom: 10px;
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

@media screen and (max-width: #{map-get($sizes, "mobile") + px}) {
  .header {
    padding: 26px 15px;
  }

  .menu {
    &__list-wrapper {
      padding: 26px 15px;
    }
  }
}
</style>