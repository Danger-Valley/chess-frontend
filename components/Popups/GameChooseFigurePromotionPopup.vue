<template>
  <div
    class="popup__wrapper"
    id="GameChooseFigurePromotionPopup"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">
        Please choose a figure
      </div>

      <div class="figures">
        <div class="figure">
          <BlackRook/>
        </div>
        <div class="figure">
          <BlackKnight/>
        </div>
        <div class="figure">
          <BlackOfficer/>
        </div>
        <div class="figure">
          <BlackQueen/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BlackRook from "@/assets/imgs/blackRook.svg"
import BlackKnight from "@/assets/imgs/blackKnight.svg"
import BlackOfficer from "@/assets/imgs/blackOfficer.svg"
import BlackQueen from "@/assets/imgs/blackQueen.svg"
</script>

<style lang="scss" scoped>
.popup{
  height: 188px;
  margin-top: calc((100vh - 188px) / 2);
}
.popup__heading{
  margin-bottom: 30px;
  text-transform: initial;
}
.figure {
  width: 95px;
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #E8EDF9;

  &s {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
}
</style>