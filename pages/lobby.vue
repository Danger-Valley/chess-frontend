<template>
  <div class="page">
    <Header></Header>

    <main class="main">

      <div class="block rating">
        <div class="rating__points">{{ rating.points }}</div>
        <div class="rating__text">Leaderboard position</div>
        <div class="rating__position">
          #{{ rating.position[0] }}
          <span class="rating__max"> / {{ rating.position[1] }}</span>
        </div>
      </div>

      <div class="block active-games">
        <NoGamesIcon></NoGamesIcon>
        No active games
      </div>

      <div class="block block--double">
        <div class="block__double"></div>
        <div class="block__double"></div>
      </div>

      <div class="block event-1">
        <div class="event-1__heading">Soon</div>
        <div class="event-1__underheading">Only on The Chess</div>
        <div class="event-1__text">Solana-based on-chain mode</div>
        <img
          src=""
          class="event-1__bg-image"
        />
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
        <div class="block__half play">
          Play now
          <div class="settings">
            <SettingsIcon></SettingsIcon>
          </div>
        </div>

        <div class="block__half create">
          Create game <ArrowIcon></ArrowIcon>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import NoGamesIcon from "@/assets/imgs/no-icon.svg"
import ArrowIcon from "@/assets/imgs/Arrow.svg"
import SettingsIcon from "@/assets/imgs/settings.svg"

let rating = ref({
  points: 1488,
  position: [23, 100]
})
</script>

<style lang="scss" scoped>
.main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 8px 110px;
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
    color: #27F4BA;
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
  gap: 10px;
  align-items: center;
  justify-content: center;
  color: #FFFFFF4d;
  font-size: 16px;
  line-height: 22px;
}

// TODO add mixins?
.event-1 {
  display: flex;
  flex-direction: column;
  gap: 10px;

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
  color: #27F4BA;
  border: 1px solid #27F4BA;
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
  background: rgba(39, 244, 186, 0.1);
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
</style>