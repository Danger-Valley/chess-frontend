<template>
  <div
    class="player"
    v-if="props.player"
  >
    <img
      class="player__avatar"
      :src="props.player?.user?.avatar"
    />
    <div class="player__nickname">{{ props.player?.user.username || props.player?.user.email }}</div>
    <div
      class="player__rating"
      v-if="props.player?.user.rating"
    >({{ props.player?.user.rating.toFixed(0) }})</div>
    <img
      v-if="props.player?.user?.country"
      class="player__country"
      :src="props.player?.user.country"
    />
    <div
      class="timer"
      :class="{'timer--active': props.active}"
    >
      {{ Math.floor(props.timer / (60 * 1000))?.toFixed(0).padStart(2, 0) }}:{{ Math.floor((props.timer / 1000) %60)?.toFixed(0).padStart(2, 0) }}:<span class="timer__ms">{{ (props.timer % 1000).toString()[0] }}</span>
    </div>
  </div>
</template>

<script setup>
let props = defineProps(['player', 'timer', 'active']) //player: 'me' or 'opponent'
</script>

<style lang="scss" scoped>
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
}

.timer {
  height: fit-content;
  margin-left: auto;
  padding: 4px 8px;
  background: #242426;
  border-radius: 10px;
  font-family: 'Neue Plak';
  font-size: 20px;
  line-height: 27px;
  color: #FFFFFF4d;
  transition: .3s;

  &--active{
    color: #ACFF00;
    background: rgba(172, 255, 0, 0.10);
  }

  &__ms {
    display: inline-block;
    font-size: 14px;
    line-height: 19px;
    width: 10px;
  }
}</style>