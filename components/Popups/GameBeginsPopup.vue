<template>
  <div
    class="popup__wrapper"
    id="GameBeginsPopup"
    @click="$togglePopup('GameBeginsPopup')"
    v-if="game"
  >
    <div
      class="popup"
      @click.stop
    >
      <div
        class="player"
        v-if="props.game.playerOne?.joined"
      >
        <img
          class="player__avatar"
          :src="props.game.playerOne.user.avatar"
        />
        <div class="player__name">{{ props.game.playerOne.user.username || props.game.playerOne.user.email }}</div>
        <div class="player__rating">({{ props.game.playerOne.user.rating }})</div>
        <img
          v-if="false"
          class="player__country"
          :src="player.country"
        />
        <IconsWifi
          class="player__connection-status"
          :ms="ms"
        ></IconsWifi>
        <div class="player__ms">{{ ms }}ms</div>
      </div>

      <div class="center">VS</div>
      <div class="start">game will start in {{ timeout }} sec</div>

      <div
        class="player"
        v-if="props.game.playerTwo?.joined"
      >
        <img
          class="player__avatar"
          :src="props.game.playerTwo.user.avatar"
        />
        <div class="player__name">{{ props.game.playerTwo.user.username || props.game.playerTwo.user.email }}</div>
        <div class="player__rating">({{ props.game.playerTwo.user.rating }})</div>
        <img
          v-if="false"
          class="player__country"
          :src="player.country"
        />
        <IconsWifi
          class="player__connection-status"
          :ms="ms"
        ></IconsWifi>
        <div class="player__ms">{{ ms }}ms</div>
      </div>
    </div>
  </div>
</template>

<script setup>
let { $togglePopup } = useNuxtApp();

let timeout = ref(5)

let props = defineProps(['game'])

watch(() => props.game, () => {
  console.log(props.game.playerOne);
})
</script>

<style lang="scss" scoped>
.popup {
  width: 400px;
  height: 220px;
  margin-top: calc((100vh - 220px) / 2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.center {
  font-family: 'Montserrat';
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  color: #FFFFFF;
}

.start {
  font-family: 'Neue Plak';
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  color: #FFFFFF4d;
}

.player {

  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  font-family: 'Neue Plak';
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;

  &__avatar {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  &__rating {
    color: #ffffff4d;
    margin-left: 5px;
  }

  &__country {
    margin-left: 30px;
    margin-right: 15px;
    border-radius: 100%;
  }

  &__ms {
    margin-left: 5px;
    color: #ffffff4d;
  }

  &:first-of-type {
    margin-bottom: auto;
  }

  &:last-of-type {
    margin-top: auto;
  }
}
</style>