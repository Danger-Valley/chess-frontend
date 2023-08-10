<template>
  <div
    class="popup__wrapper"
    id="GameSettingsPopup"
    @click="$togglePopup('GameSettingsPopup')"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">CREATE GAME</div>

      <div class="options">
        <div class="options__heading">Play with</div>
        <div class="options__list">
          <div
            class="option"
            v-for="(option, counter) in ['Anyone', 'Friend', 'AI']"
            :class="{ 'option--active': playWith == counter }"
            @click="playWith = counter"
          >
            <div class="option__front">{{ option }}</div>
          </div>
        </div>

        <div class="options__heading">Game type</div>
        <div class="options__list">
          <div
            class="option"
            v-for="option in gameModes"
            :class="{ 'option--active': gameType.type == option.type }"
            @click="gameType = option; gameMode = gameType?.items?.[0].id"
          >
            <div class="option__front">{{ option.name }}</div>
          </div>
        </div>

        <div class="options__heading">Mode</div>
        <div class="options__list">
          <div
            class="option"
            v-for="option in gameType?.items"
            :class="{ 'option--active': gameMode == option.id }"
            @click="gameMode = option.id"
          >
            <div class="option__front">{{ option.name }}</div>
          </div>
        </div>

        <div class="options__heading">Figure color</div>
        <div class="figures">
          <div
            class="figure"
            :class="{ 'figure--active': color == 'b' }"
            @click="color = 'b'"
          >
            <div class="figure__front">
              <BlackFigure />
            </div>
          </div>
          <div
            class="figure"
            :class="{ 'figure--active': color == null }"
            @click="color = null"
          >
            <div class="figure__front">
              <AnyFigure />
            </div>
          </div>
          <div
            class="figure"
            :class="{ 'figure--active': color == 'w' }"
            @click="color = 'w'"
          >
            <div class="figure__front">
              <WhiteFigure />
            </div>
          </div>
        </div>
      </div>

      <div
        class="play"
        @click="$togglePopup('GameSettingsPopup'); emit('playNow')"
      >
        Play now
      </div>
    </div>
  </div>
</template>

<script setup>
import gameModes from "@/assets/content/gameModes.json"

import BlackFigure from "@/assets/imgs/blackFigure.svg"
import AnyFigure from "@/assets/imgs/Board-Squares.svg"
import WhiteFigure from "@/assets/imgs/whiteFigure.svg"

let props = defineProps(['isAI'])

let playWith = ref(0),
  gameType = ref(gameModes?.[0]),
  gameMode = ref(gameType.value?.items?.[0].id),
  color = ref(null)

const emit = defineEmits(['playNow'])

watch(() => props.isAI, () => {
  // hardcode for AI
  if(props.isAI) playWith.value = 2;
  else playWith.value = 0;
})

defineExpose({ playWith, gameMode, color })
</script>

<style src="@vueform/toggle/themes/default.css"></style>
<style lang="scss" scoped>
.popup {
  min-width: 448px;
  min-height: 589px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #fff;

  &__wrapper--active{
    z-index: 101;
  }

  &__underheading {
    max-width: 155px;
    color: #ffffff4d;
    font-size: 8px;
    line-height: 7px;
    text-transform: initial;
  }

  &__heading {
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 22px;

    &--small {
      text-transform: initial;
      margin-bottom: unset;
    }

    &--mt {
      margin-top: 60px;
    }
  }
}

.option {
  &s {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 10px;
    font-family: 'Neue Plak';
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #FFFFFF80;

    &--hor {
      flex-direction: row;
      justify-content: space-between;
    }

    &__heading {
      color: #ffffff4d;
      margin-top: 12px;
    }

    &__list {
      width: 100%;
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  }

  background: transparent;
  transition: .3s;
  cursor: pointer;

  &__front {
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    margin: 2px;
    padding: 5px 10px;
    background: #282A2C;
  }

  &--active {
    color: #FFFFFF;
    background: linear-gradient(65.1deg, rgba(252, 248, 213, 1) 0%, rgba(252, 248, 213, 0) 100%);
  }
}

.figure {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;

  &--active {
    background: linear-gradient(65.1deg, rgba(252, 248, 213, 1) 0%, rgba(252, 248, 213, 0) 100%);
  }

  &__front {
    display: flex;
    height: calc(100% - 4px);
    margin: 2px;
    transition: .3s;
    z-index: 2;
    background: #121314;
  }

  &s {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

.toggle-container:focus {
  box-shadow: none !important;
  outline: none;
}

.play {
  width: 261px;
  height: 77px;
  margin: auto;
  margin-top: 10px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $color1;
  font-size: 16px;
  font-family: Montserrat;
  font-weight: 500;
  line-height: 100%;
  text-transform: uppercase;
  border: 1px solid $color1;
  cursor: pointer;
}
</style>