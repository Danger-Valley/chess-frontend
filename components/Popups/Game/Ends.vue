<template>
  <div
    class="popup__wrapper"
    id="GameEndsPopup"
  >
    <div
      class="popup"
      @click.stop
    >
      <div
        class="player"
        v-if="props.me"
      >
        <img
          class="player__avatar"
          :src="props.me.user.avatar"
        />
        <div class="player__name">{{ props.me.user.username || props.me.user.email }}</div>
        <div
          v-if="props.whoWon == 'me'"
          class="player__won"
        >won!</div>
        <div
          class="player__rating"
          v-if="false"
        >
          <template v-if="props.whoWon == 'me'">
            +25 rating
          </template>
          <template v-else-if="props.whoWon == 'opponent'">
            -25 rating
          </template>
          <template v-else-if="props.whoWon == 'draw'">
            draw
          </template>
        </div>
      </div>

      <div
        class="player"
        v-if="props.opponent"
      >
        <img
          class="player__avatar"
          :src="props.opponent.user.avatar"
        />
        <div class="player__name">{{ props.opponent.user.username || props.opponent.user.email }}</div>
        <div
          v-if="props.whoWon == 'opponent'"
          class="player__won"
        >won!</div>
        <div
          class="player__rating"
          v-if="false"
        >
          <template v-if="props.whoWon == 'me'">
            -25 rating
          </template>
          <template v-else-if="props.whoWon == 'opponent'">
            +25 rating
          </template>
          <template v-else-if="props.whoWon == 'draw'">
            draw
          </template>
        </div>
      </div>

      <div class="actions">
        <div class="button" @click="emits('findGame')">Find a new game</div>
        <div class="button" @click="offerRevenge">Offer revenge</div>
        <div
          class="button"
          @click="$togglePopup('GameEndsPopup')"
        >Analyze</div>
      </div>
    </div>
  </div>
</template>

<script setup>
let { $togglePopup, $API } = useNuxtApp();

let props = defineProps(['me', 'opponent', 'whoWon'])
let emits = defineEmits(['findGame'])

watch(() => props.whoWon, () => {
  console.log(props.me, props.opponent, props.whoWon)
  $togglePopup('GameEndsPopup');
})

const offerRevenge = async () => {
  let resp = await $API().Chess.offerRevenge({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })

  let body = await resp.json();
  console.log(body);
}

onMounted(() => {
  console.log(props);
})
</script>

<style lang="scss" scoped>
.popup {
  width: 428px;
  height: 188px;
  padding: 20px;
  margin-top: calc((100vh - 188px) / 2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.player {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  font-family: 'Neue Plak';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;

  &__avatar {
    width: 20px;
    height: 20px;
  }

  &__name {
    color: #FFFFFF;
  }

  &__won {
    padding: 2px 6px;
    background: rgba(248, 166, 20, 0.13);
    border-radius: 10px;
    color: #F8A614;
  }

  &__rating {
    margin-left: auto;
    color: #FFFFFF4d;
  }
}

.actions {
  margin-top: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.button {
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.05);
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  text-align: center;
  color: #FFFFFF;
  width: max-content;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}</style>