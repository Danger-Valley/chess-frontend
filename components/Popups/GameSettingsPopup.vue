<template>
  <div
    class="popup__wrapper"
    id="GameSettingsPopup"
    @click="$togglePopup('GameSettingsPopup')"
  >
    <div class="popup">
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
          >
            {{ item.name }}
          </div>
        </div>
      </div>

      <div class="popup__heading popup__heading--small">Game type</div>

      <div class="figures">
        <div class="figure">
          <BlackFigure />
        </div>
        <div class="figure">
          <AnyFigure />
        </div>
        <div class="figure">
          <WhiteFigure />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import gameModes from "@/assets/content/gameModes.json"

import BlackFigure from "@/assets/imgs/blackFigure.svg"
import AnyFigure from "@/assets/imgs/anyFigure.svg"
import WhiteFigure from "@/assets/imgs/whiteFigure.svg"

console.log(gameModes)

let choise = ref()
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
      &:nth-last-of-type(2){
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

    &__heading{
      color: #ffffff4d;
    }

    &__list {
      width: 100%;
      display: flex;
      flex-direction: row;
      gap: 10px;
    }
  }

  padding: 5px 10px;
  background: rgba(255, 255, 255, 0.1);
  font-family: 'Neue Plak';
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF80;
  transition: .3s;

  &--active{
    color: #FFFFFF;
  }
}

.figure{
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: .3s;
  &--active{
    // TODO
    border-image: linear-gradient(65.1deg, rgba(252, 248, 213, 0.15) 0%, rgba(252, 248, 213, 0) 100%);
  }

  &s{
    display: flex;
    flex-direction: row;
  }
}
</style>