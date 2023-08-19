<template>
  <div
    class="popup__wrapper"
    id="GameSearchPopup"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="content">
        <div class="game-search">
          <div class="game-search__heading">Looking for a game</div>
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
        </div>
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
    rating: '',
    country: ''
  })

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

onUnmounted(() => {
  clearInterval(searchTimeInterval.value)
})
</script>

<style lang="scss" scoped>
.popup {
  min-width: 402px;
  min-height: 122px;
  color: #fff;
  padding: 1px;

  @keyframes rotate {
    0% {
      rotate: 0deg;
    }

    100% {
      rotate: 360deg;
    }
  }

  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    z-index: -2;
    display: flex;
    align-self: center;
    left: calc(-300px + 200px);
    top: calc(-300px + 50px);
    width: 600px;
    aspect-ratio: 1;
    background-repeat: no-repeat;
    background-image: conic-gradient(#2B2B2B, #fff);
    animation: rotate 4s linear infinite;
  }

  &::after {
    content: "";
    position: absolute;
    z-index: -1;
    left: 6px;
    top: 6px;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    background: white;
  }

  &__heading {
    margin-bottom: 10px;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 400px;
  min-height: 120px;
  background-color: #121314;
  padding: 20px;
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

@media screen and (max-width: #{map-get($sizes, "tablet") + px}) {
  .content{
    min-width: unset !important;
    max-width: calc(100vw);
  }
}
</style>