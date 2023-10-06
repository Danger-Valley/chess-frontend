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
          v-else-if="props.whoWon == 'draw'"
        >
          draw
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
          v-else-if="props.whoWon == 'draw'"
        >
          draw
        </div>
      </div>

      <div class="actions">
        <div
          v-if="!isViewer"
          class="button"
          @click="emits('findGame')"
        >Find a new game</div>
        <div
          v-if="!isViewer && !isEvent"
          class="button"
          @click="offerRevenge"
        >Offer revenge</div>
        <div
          v-else-if="!isViewer && isEvent"
          class="button"
          @click="navigateTo('/')"
        >Back to lobby</div>
        <div
          class="button"
          @click="$togglePopup('GameEndsPopup')"
        >Analyze</div>
      </div>
    </div>
  </div>
</template>

<script setup>
let { $togglePopup, $API, $showToast } = useNuxtApp();

let props = defineProps(['me', 'opponent', 'whoWon', 'isViewer', 'isEvent'])
let emits = defineEmits(['findGame'])

watch(() => props.whoWon, () => {
  console.log(props.me, props.opponent, props.whoWon)
  document.querySelector(`#GameEndsPopup`).classList.add('popup__wrapper--active')
})

const offerRevenge = async () => {
  let resp = await $API().Chess.offerRevenge({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })

  let body = await resp.json();
  console.log(body);
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
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
    width: 21px;
    height: 21px;
    clip-path: path("M20.2914 7.91393C19.5251 6.30251 18.6316 4.75477 17.6191 3.28544L17.2926 2.81608C16.8905 2.23278 16.3636 1.74636 15.7501 1.39219C15.1366 1.03801 14.4518 0.824969 13.7456 0.768542L13.1723 0.722341C11.3936 0.579532 9.60636 0.579532 7.82769 0.722341L7.25437 0.768542C6.54819 0.824969 5.86345 1.03801 5.24991 1.39219C4.63637 1.74636 4.10944 2.23278 3.7074 2.81608L3.38085 3.28964C2.36844 4.75897 1.47484 6.30671 0.708543 7.91813L0.461788 8.43684C0.157748 9.07661 0 9.77605 0 10.4844C0 11.1927 0.157748 11.8921 0.461788 12.5319L0.708543 13.0506C1.47484 14.6621 2.36844 16.2098 3.38085 17.6791L3.7074 18.1527C4.10944 18.736 4.63637 19.2224 5.24991 19.5766C5.86345 19.9308 6.54819 20.1438 7.25437 20.2002L7.82769 20.2464C9.60636 20.3892 11.3936 20.3892 13.1723 20.2464L13.7456 20.2002C14.4523 20.1431 15.1374 19.9291 15.7509 19.5738C16.3646 19.2185 16.8912 18.7308 17.2926 18.1464L17.6191 17.6728C18.6316 16.2035 19.5251 14.6558 20.2914 13.0443L20.5382 12.5256C20.8422 11.8858 21 11.1864 21 10.4781C21 9.76975 20.8422 9.07031 20.5382 8.43054L20.2914 7.91393Z");
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