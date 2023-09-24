<template>
  <ClientOnly>
    <div class="page">
      <Header
        :activeBoards="lobby?.activeBoardsCount"
        :isAI="isAI"
      ></Header>

      <main class="main">

        <div class="heading">
          <template v-if="useUserStore()?.getUser?.value?.id">Rating</template>
          <template v-else>Sign in</template>
        </div>
        <div class="heading">Active games</div>
        <div class="heading">Daily missions</div>
        <div class="heading">Arena</div>

        <div class="block rating">
          <template v-if="!useUserStore()?.getUser?.value?.id">
            <div class="rating--signin__text">Sign In to play Chess</div>
            <div
              class="rating--signin__btn"
              @click="$togglePopup('SignInPopup')"
            >Sign In</div>
          </template>

          <template v-else-if="lobby?.user.rating != null">
            <div class="rating__points">{{ lobby.user.rating }}</div>
            <div class="rating__text">Leaderboard position</div>
            <div class="rating__position">
              #{{ lobby?.user.leaderboard.position }}
              <span class="rating__max"> / {{ lobby?.user.leaderboard.total }}</span>
            </div>
          </template>
          <template v-else>
            <div class="rating__points">{rank}</div>
            <div class="rating__text">You have to win {{ lobby?.user.rank.gamesLeftTillRank }} more ranked {{
              lobby?.user.rank.gamesLeftTillRank == 1 ? 'game' : 'games' }} to get your rank
            </div>
            <div class="rating__position">
              {{ 30 - lobby?.user.rank.gamesLeftTillRank }}
              <span class="rating__max"> / 30</span>
            </div>
          </template>
        </div>

        <div class="block active-games">
          <template v-if="lobby?.activeGames?.length">
            <div
              class="game"
              v-for="(game, counter) in lobby.activeGames"
            >
              <div
                v-if="counter != 0"
                class="game__hr"
              ></div>
              <div class="game__name">{{ game.title }}</div>
              <div
                class="game__btn"
                @click="navigateTo(`game/${game.gameId}`)"
              >Open</div>
            </div>
          </template>
          <div
            class="active-games__empty"
            v-else
          >
            <NoGamesIcon></NoGamesIcon>
            No active games
          </div>
        </div>

        <div class="block block--coming-soon">
          Coming soon
        </div>

        <div class="block event-1">
          <div class="event-1__heading">{arena}</div>
          <div class="event-1__underheading">Play ranked games 24/7, complete with high-skilled players, and earn your
            rank.
          </div>
          <NuxtLink
            class="event-1__text"
            to="/events/arena"
            v-if="useUserStore()?.getUser?.value?.id"
          >Compete Now</NuxtLink>
          <div
            class="event-1__text"
            @click="$togglePopup('SignInPopup')"
            v-else
          >Compete Now</div>
        </div>

        <div class="block event-1">
          <div class="event-1__heading">AI</div>
          <div class="event-1__underheading">Want to improve your Chess skills and play with the most powerful AI?</div>
          <div
            class="event-1__text"
            v-if="useUserStore()?.getUser?.value?.id"
            @click="isAI = true; $togglePopup('GameSettingsPopup')"
          >Play Now</div>
          <div
            class="event-1__text"
            v-else
            @click="$togglePopup('SignInPopup')"
          >Play Now</div>
        </div>

        <NuxtLink
          class="block block--double event-2"
          :to="`${lobby?.banner?.link}`"
          :style="lobby?.banner?.image ? `backgroundImage: url(${bannerBg})` : ''"
        >
          <!--
          <div class="event-2__heading">Team Tournaments<br />are coming...</div>
          <img
            src="@/assets/imgs/lobby_piece_1.png"
            class="event-2__image"
          />
          -->
        </NuxtLink>

        <div
          class="block play"
          v-if="useUserStore()?.getUser?.value?.id"
          @click="isAI = false; $togglePopup('GameSettingsPopup')"
        >
          Play now
        </div>
        <div
          class="block play"
          v-else
          @click="$togglePopup('SignInPopup')"
        >
          Play now
        </div>
      </main>

      <PopupsSetUsername />
    </div>
  </ClientOnly>
</template>

<script setup>
import NoGamesIcon from "@/assets/imgs/no-icon.svg"
import { useUserStore } from "~/stores/user";

useHead({
  title: 'Lobby - xChess',
  meta: [
    {
      property: 'og:title',
      content: 'Lobby - xChess'
    }, {
      property: 'twitter:title',
      content: 'Lobby - xChess'
    }, {
      property: 'description',
      content: 'xChess - web3-powered community-driven chess platform on Solana blockchain'
    }, {
      property: 'og:description',
      content: 'xChess - web3-powered community-driven chess platform on Solana blockchain'
    }, {
      property: 'og:url',
      content: 'xchess.io' + useRequestURL().pathname
    }
  ]
})

let { $togglePopup, $API } = useNuxtApp();

let lobby = ref(),
  isAI = ref(false),
  bannerBg = ref()

onMounted(async () => {
  console.log(useNuxtApp().ssrContext?.event.node.req.headers, useRequestURL());

  if (useUserStore()?.getUser?.value?.id && !useUserStore()?.getUser?.value?.username) $togglePopup('SetUsernamePopup')

  let resp = await $API().Lobby.get(localStorage.getItem('accessToken'));
  let body = await resp.json();
  console.log(body);

  if (body.errors) {
    console.error(body.errors);
    return $showToast(body.errors[0].message, 'error')
  }

  lobby.value = body;

  bannerBg.value = lobby.value?.banner?.image;

  if (window.innerWidth < 1440 && window.innerWidth > 833) bannerBg.value = lobby.value?.banner?.imageSquare;
  else bannerBg.value = lobby.value?.banner?.image;

  window.addEventListener('resize', () => {
    if (window.innerWidth < 1440 && window.innerWidth > 833) bannerBg.value = lobby.value?.banner?.imageSquare;
    else bannerBg.value = lobby.value?.banner?.image;
  })
})
</script>

<style lang="scss" scoped>
.main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 8px 350px;
}

.heading {
  font-family: 'Neue Plak';
  font-size: 14px;
  line-height: 19px;
  text-transform: uppercase;
  color: #FFFFFF;
  margin-bottom: -5px;

  &--double {
    grid-column: span 2;
  }
}

.block {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  font-family: 'Neue Plak';

  &--double {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    width: 100%;
    height: 100%;
    grid-column: span 2;
    aspect-ratio: unset;
    padding: 0;
  }

  &--coming-soon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    color: #FFFFFF4d;
    text-align: center;
    font-size: 16px;
    font-family: "Neue Plak";
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &__double {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    color: #FFFFFF4d;
    text-align: center;
    font-size: 16px;
    font-family: "Neue Plak";
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    >img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.rating {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &--signin {
    &__text {
      color: #ffffff4d;
      text-align: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin: auto;
    }

    &__btn {
      position: absolute;
      margin: 0 auto;
      left: 0;
      right: 0;
      bottom: 20px;
      text-align: center;
      color: #FFF;
      font-family: "Neue Plak";
      font-size: 22px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      cursor: pointer;
    }
  }

  &__points {
    font-weight: 400;
    font-size: 62px;
    line-height: 85px;
    color: $color1;
  }

  &__text {
    margin-top: auto;
    font-size: 16px;
    line-height: 22px;
    color: #FFFFFF4d;
  }

  &__position {
    font-weight: 600;
    font-size: 22px;
    line-height: 31px;
    color: #FFFFFF;
  }

  &__max {
    color: #66676B;
  }
}

.active-games {
  display: flex;
  flex-direction: column;
  overflow: auto;
  gap: 12px;
  color: #FFFFFF4d;
  font-size: 16px;
  line-height: 22px;

  &__empty {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }
}

.game {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  &__hr {
    width: 100%;
    height: 1px;
    margin-bottom: 17px;
    background: #2C2E32;
  }

  &__name {
    color: #FFF;
    font-size: 16px;
    font-family: "Neue Plak";
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &__btn {
    padding: 6px 10px;
    border-radius: 10px;
    background-color: $color1;
    color: $color-font;
    font-size: 12px;
    font-family: "Neue Plak";
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    cursor: pointer;
  }
}

// TODO add mixins?
.event-1 {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__heading {
    font-weight: 400;
    font-size: 62px;
    color: $color1;
  }

  &__underheading {
    margin-top: auto;
    color: #FFFFFF4d;
    font-size: 16px;
    line-height: 22px;
  }

  &__text {
    max-width: 160px;
    font-weight: 600;
    font-size: 22px;
    line-height: 31px;
    color: #FFFFFF;
    cursor: pointer;
  }
}

.event-2 {
  position: relative;
  display: flex;
  flex-direction: row;
  gap: 10px;
  background: #000008;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  overflow: hidden;

  &__heading {
    font-weight: 600;
    font-size: 22px;
    color: #FFFFFF;
    margin: auto 0;
  }

  &__image {
    position: absolute;
    top: 16px;
    right: 8%;
    height: 104%;
  }
}

.play {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $color1;
  border: 1px solid $color1;
  text-align: center;
  font-size: 30px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  text-transform: uppercase;
  cursor: pointer;
}

.settings {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  aspect-ratio: 1;
  background: #{$color1}1a;
  border-radius: 5px;
  padding: 6px;
  cursor: pointer;
}

.create {
  display: flex;
  flex-direction: row;
  gap: 15px;
  justify-content: center;
  align-items: center;
  color: #fff;

  svg {
    width: calc(10px * 1.25);
  }
}

@media screen and (min-width: #{map-get($sizes, "desktop-high") + px}) {
  .main {
    margin: 8px 534px;
  }
}

@media screen and (max-width: #{map-get($sizes, "desktop")-1 + px}) {
  .main {
    margin: 8px 110px;
  }
}

@media screen and (max-width: #{map-get($sizes, "desktop-low")-1 + px}) {
  .main {
    grid-template-columns: repeat(2, 1fr);
    margin: 8px 147px 150px 147px;
  }

  .heading {

    &:nth-of-type(3),
    &:nth-of-type(4) {
      display: none;
    }
  }

  .block {
    &--double {
      grid-column: span 1;

      &:not(.event-2) {
        display: none;
      }
    }

    &.play {
      position: fixed;
      left: 0;
      bottom: 0;
      width: calc(100% - 2 * 147px);
      height: 117px;
      padding: 0 147px;
      margin: 0 147px;
      display: flex;
      flex-direction: row-reverse;
      justify-content: center;
      align-items: center;
      gap: 20px;
      background: $color-font;
      box-shadow: 0px -12px 50px rgba(0, 0, 0, 0.25);
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "tablet")-1 + px}) {
  .main {
    margin: 8px 20px;
    grid-template-rows: auto 141px 210px;
  }

  .block {
    aspect-ratio: unset;
    padding: 10px;

    &.play {
      padding: 0 20px;
      margin: 0 20px;
      width: calc(100% - 2 * 20px);
    }
  }

  .rating {
    &__points {
      font-size: 32px;
      line-height: 44px;
    }

    &__text {
      font-size: 12px;
      line-height: 16px;
    }

    &__position {
      font-size: 16px;
      line-height: 22px;
    }
  }

  .active-games {
    font-size: 12px;
    line-height: 16px;
  }

  .event-1,
  .event-2 {
    &__heading {
      font-size: 16px;
      line-height: 22px;
    }

    &__underheading {
      font-size: 12px;
      line-height: 16px;
    }

    &__text {
      font-size: 16px;
      line-height: 22px;
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "mobile")-1 + px}) {
  .main {
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding-bottom: 120px;
  }

  .block {
    height: 141px;
  }

  .rating {
    order: -1;
  }

  .heading {
    &:nth-of-type(1) {
      order: -2;
    }

    &:nth-of-type(2) {
      order: 0;
    }
  }
}</style>