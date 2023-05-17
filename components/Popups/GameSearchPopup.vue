<template>
  <div
    class="popup__wrapper"
    id="GameSearchPopup"
    @click="closePopup"
  >
    <div class="popup" @click.stop>
      <div class="game-search">
        <div class="game-search__heading">Game search</div>
        <div class="game-search__time">{{ formatTime }}</div>
      </div>
      <div
        class="player"
        v-if="user"
      >
        <img
          class="player__avatar"
          :src="user.avatar"
        />
        <div class="player__name">{{ user.username || user.email }}</div>
        <div class="player__rating">({{ player.rating }})</div>
        <img
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
import { useUserStore } from '~/stores/user'

let { $togglePopup } = useNuxtApp();

const store = useUserStore()

const user = computed(() => store.getUser.value)

let startTime = ref(),
  searchTime = ref(0),
  searchTimeInterval = ref(),
  player = ref({
    rating: '1423',
    country: ''
  }),
  ms = ref(150)

const formatTime = computed(() => `${Math.floor(searchTime.value / 60)}:${Math.floor(searchTime.value % 60).toString().padStart(2, '0')}`)

const startTimeTracking = () => {
  startTime.value = Date.now()
  searchTimeInterval.value = setInterval(() => {
    searchTime.value = (Date.now() - startTime.value) / 1000
  }, 1000)
}

const closePopup = () => {
  $togglePopup('GameSearchPopup'); 
  clearInterval(searchTimeInterval.value); 
  searchTime.value = 0
}

defineExpose({ startTimeTracking })
</script>

<style lang="scss" scoped>
.popup {
  min-width: 400px;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #fff;

  &__heading {
    margin-bottom: 10px;
  }
}

.game-search {
  display: flex;
  flex-direction: row;
  width: 100%;
  font-family: 'Montserrat';
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  color: #FFFFFF;

  &__time {
    margin-left: auto;
  }
}

.player {
  margin-top: auto;
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
}
</style>