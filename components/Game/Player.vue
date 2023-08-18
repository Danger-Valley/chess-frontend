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
    margin-right: 10px;
    width: 21px;
    height: 21px;
    clip-path: path("M20.2914 7.91393C19.5251 6.30251 18.6316 4.75477 17.6191 3.28544L17.2926 2.81608C16.8905 2.23278 16.3636 1.74636 15.7501 1.39219C15.1366 1.03801 14.4518 0.824969 13.7456 0.768542L13.1723 0.722341C11.3936 0.579532 9.60636 0.579532 7.82769 0.722341L7.25437 0.768542C6.54819 0.824969 5.86345 1.03801 5.24991 1.39219C4.63637 1.74636 4.10944 2.23278 3.7074 2.81608L3.38085 3.28964C2.36844 4.75897 1.47484 6.30671 0.708543 7.91813L0.461788 8.43684C0.157748 9.07661 0 9.77605 0 10.4844C0 11.1927 0.157748 11.8921 0.461788 12.5319L0.708543 13.0506C1.47484 14.6621 2.36844 16.2098 3.38085 17.6791L3.7074 18.1527C4.10944 18.736 4.63637 19.2224 5.24991 19.5766C5.86345 19.9308 6.54819 20.1438 7.25437 20.2002L7.82769 20.2464C9.60636 20.3892 11.3936 20.3892 13.1723 20.2464L13.7456 20.2002C14.4523 20.1431 15.1374 19.9291 15.7509 19.5738C16.3646 19.2185 16.8912 18.7308 17.2926 18.1464L17.6191 17.6728C18.6316 16.2035 19.5251 14.6558 20.2914 13.0443L20.5382 12.5256C20.8422 11.8858 21 11.1864 21 10.4781C21 9.76975 20.8422 9.07031 20.5382 8.43054L20.2914 7.91393Z");
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