<template>
  <div class="page">
    <Header></Header>

    <main class="main">

      <div class="heading">Rating</div>
      <div class="heading">Active games</div>
      <div class="heading heading--double">Daily mission</div>

      <div class="block rating">
        <template v-if="lobby?.user.rank.points">
          <div class="rating__points">{{ lobby.user.rank.points }}</div>
          <div class="rating__text">Leaderboard position</div>
        </template>
        <template v-else>
          <div class="rating__text">You have to win {{ lobby?.user.rank.gamesLeftTillRank }} more games to get your rank
          </div>
        </template>
        <div class="rating__position">
          #{{ lobby?.user.leaderboard.position }}
          <span class="rating__max"> / {{ lobby?.user.leaderboard.total }}</span>
        </div>
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
            <div class="game__btn" @click="navigateTo(`game/${game.gameId}`)">Open</div>
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

      <div class="block block--double">
        <div class="block__double"></div>
        <div class="block__double"></div>
      </div>

      <div class="block event-1">
        <div class="event-1__heading">AI</div>
        <div class="event-1__underheading">Want to improve your Chess skills and play with the most powerful AI?</div>
        <div class="event-1__text">Play Now</div>
      </div>

      <div class="block block--double event-2">
        <div class="event-2__heading">5 days left</div>
        <div class="event-2__underheading">before the</div>
        <div class="event-2__text">BLITZ Community Championship</div>
        <img
          src=""
          class="event-2__bg-image"
        />
      </div>

      <div class="block block--half">
        <div
          class="block__half play"
          @click="openGameSearchPopup"
        >
          Play now
          <div
            class="settings"
            @click.stop="$togglePopup('GameSettingsPopup')"
          >
            <SettingsIcon></SettingsIcon>
          </div>
        </div>

        <div class="block__half create">
          Create game <ArrowIcon></ArrowIcon>
        </div>
      </div>
    </main>

    <PopupsGameSearchPopup ref="GameSearchPopupRef"></PopupsGameSearchPopup>
    <PopupsGameSettingsPopup
      ref="GameSettingsPopupRef"
      @play-now="openGameSearchPopup"
    ></PopupsGameSettingsPopup>
  </div>
</template>

<script setup>
import NoGamesIcon from "@/assets/imgs/no-icon.svg"
import ArrowIcon from "@/assets/imgs/Arrow.svg"
import SettingsIcon from "@/assets/imgs/settings.svg"

let { $togglePopup, $API } = useNuxtApp();

let lobby = ref(),
  GameSearchPopupRef = ref(),
  GameSettingsPopupRef = ref()

const getUserById = async (id) => {
  let resp = await $API().User.getByIds([id])
  let body = await resp.json();
  return body.users.username;
}

const openGameSearchPopup = async () => {
  //localStorage.setItem('autoJoin', true);
  $togglePopup('GameSearchPopup')
  GameSearchPopupRef.value.startTimeTracking()
  let body = {
    mode: GameSettingsPopupRef.value.option,
    accessToken: localStorage.getItem('accessToken'),
    everyoneCanJoin: GameSettingsPopupRef.value.everyoneCanJoin
  }
  if (GameSettingsPopupRef.value.color) body = {
    ...body,
    color: GameSettingsPopupRef.value.color
  }
  let resp = await $API().Chess.find_create(body);
  body = await resp.json();
  console.log(body);
  await navigateTo(`game/${body.game.id}`)
}

onMounted(async () => {
  let resp = await $API().Lobby.get(localStorage.getItem('accessToken'));
  let body = await resp.json();
  console.log(body);

  if (body.errors) return console.error(body.errors);

  lobby.value = body;
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
    width: 100%;
    height: 100%;
    grid-column: span 2;
    aspect-ratio: unset;
  }

  &--half {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: unset;
    cursor: auto;
    padding: unset;
  }

  &__double {}

  &__half {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc((100% - 20px) / 2);
    background: rgba(255, 255, 255, 0.05);
    font-family: "Montserrat";
    text-transform: uppercase;
    cursor: pointer;
  }
}

.rating {
  display: flex;
  flex-direction: column;
  gap: 10px;

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
  }
}

.event-2 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #000008;

  &__heading {
    font-weight: 600;
    font-size: 26px;
    line-height: 36px;
    color: #FFFFFF;
  }

  &__underheading {
    margin-top: auto;
    color: #FFFFFF4d;
    font-size: 16px;
    line-height: 22px;
  }

  &__text {
    font-weight: 600;
    font-size: 22px;
    line-height: 31px;
    color: #FFFFFF;
  }
}

.play {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $color1;
  border: 1px solid $color1;
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
    &--double {
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

    &--half {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 117px;
      padding: 0 147px;
      display: flex;
      flex-direction: row-reverse;
      justify-content: center;
      align-items: center;
      gap: 20px;
      background: $color-font;
      box-shadow: 0px -12px 50px rgba(0, 0, 0, 0.25);
    }

    &__half {
      height: 77px;
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

    &--half {
      padding: 0 20px;
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