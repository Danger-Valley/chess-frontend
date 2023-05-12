<template>
  <div class="player">
    <img
      class="player__avatar"
      :src="player.avatar"
    />
    <div class="player__nickname">{{ player.nickname }}</div>
    <div class="player__rating">({{ player.rating }})</div>
    <img
      class="player__country"
      :src="player.country"
    />
    <IconsWifi class="player__connection-status"></IconsWifi>
    <div class="player__ms">{{ ms }}ms</div>
    <div class="timer">
      {{ timer.m }}:{{ timer.s }}:<span class="timer__ms">{{ timer.ms }}</span>
    </div>
  </div>
</template>

<script setup>
let props = defineProps(['playerType']) //'me' or 'opponent'

let player = ref({
  avatar: '',
  nickname: '',
  rating: '',
  country: ''
}),
  ms = ref(150),
  timer = ref({
    m: 0,
    s: 0,
    ms: 0
  })
</script>

<style lang="scss" scoped>
.player {
  display: flex;
  flex-direction: row;
  width: 100%;
  font-family: 'Neue Plak';
  font-size: 16px;
  line-height: 22px;
  color: #FFFFFF;

  &__avatar {
    width: 20px;
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

.timer {
  margin-left: auto;
  padding: 4px 8px;
  background: #242426;
  border-radius: 10px;
  font-family: 'Neue Plak';
  font-size: 20px;
  line-height: 27px;
  color: #FFFFFF4d;

  &__ms{
    font-size: 14px;
    line-height: 19px;
  }
}
</style>