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
      <div class="popup__heading">QUICK GAME PRESET SETTING</div>

      <div class="popup__heading popup__heading--small">Game type</div>

      <div
        class="options"
        v-for="mode in gameModes"
        :key="mode.type"
      >
        <div class="options__heading">{{ mode.name }}</div>
        <div class="options__list">
          <div
            class="option"
            v-for="item in mode.items"
            :key="item.id"
            :class="{ 'option--active': item.id == option }"
            @click="option = item.id"
          >
            <div class="option__front">{{ item.name }}</div>
          </div>
        </div>
      </div>

      <div class="popup__heading popup__heading--small">Game type</div>

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
  </div>
</template>

<script setup>
import gameModes from "@/assets/content/gameModes.json"

import BlackFigure from "@/assets/imgs/blackFigure.svg"
import AnyFigure from "@/assets/imgs/Board-Squares.svg"
import WhiteFigure from "@/assets/imgs/whiteFigure.svg"

console.log(gameModes)

let option = ref(gameModes?.[0]?.items?.[0].id),
  color = ref(null)

defineExpose({option, color})
</script>

<style lang="scss" scoped>
.popup {
  min-width: 448px;
  min-height: 589px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #fff;

  &__heading {
    margin-bottom: 10px;
    font-size: 16px;
    line-height: 22px;

    &--small {
      text-transform: initial;
      margin-bottom: unset;

      &:nth-last-of-type(2) {
        margin-top: 60px;
      }
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

    &__heading {
      color: #ffffff4d;
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
</style>