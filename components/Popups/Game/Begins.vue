<template>
  <div
    class="popup__wrapper"
    :class="{ 'popup__wrapper--active': props.show }"
    id="GameBeginsPopup"
    v-if="props.me"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="player">
        <img
          class="player__avatar"
          :src="props.me.user.avatar"
        />
        <div class="player__name">{{ props.me.user.username || props.me.user.email }}</div>
        <div
          class="player__rating"
          v-if="props.me.user.rating > 0"
        >({{ props.me.user.rating }})</div>
        <img
          v-if="false"
          class="player__country"
          :src="props.me.user.country"
        />
      </div>

      <template v-if="props.opponent?.joined">
        <div class="center">VS</div>
        <div class="start">game will start in {{ timeout }} sec</div>

        <div class="player">
          <img
            class="player__avatar"
            :src="props.opponent.user.avatar"
          />
          <div class="player__name">{{ props.opponent.user.username || props.opponent.user.email }}</div>
          <div
            class="player__rating"
            v-if="props.opponent.user.rating > 0"
          >({{ props.opponent.user.rating }})</div>
          <img
            v-if="false"
            class="player__country"
            :src="props.opponent.user.country"
          />
        </div>
      </template>

      <div
        class="connecting"
        v-else
      >Looking for opponent...</div>
    </div>
  </div>
</template>

<script setup>
let { $togglePopup } = useNuxtApp();

let timeout = ref(5)

let props = defineProps(['me', 'opponent', 'show', 'game'])

watch(() => [props.opponent, props.show], () => {
  if (props.show && props.opponent?.joined && props.game?.status != 'CANCELED') {
    console.time();
    let closeInterval = setInterval(() => {

      console.log(props.show)
      timeout.value -= 1;
      console.timeLog();
      if (timeout.value == 0) {
        $togglePopup('GameBeginsPopup');
        clearInterval(closeInterval);
        console.timeEnd();
      }
    }, 1000)
  }
}, { deep: true })
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

  &__connection-status {
    margin-left: auto;
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

.connecting {
  width: 100%;
  text-align: center;
  font-family: 'Neue Plak';
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF4d;
}
</style>