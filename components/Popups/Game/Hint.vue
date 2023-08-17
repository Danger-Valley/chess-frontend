<template>
  <div
    class="popup__wrapper"
    id="GameHintPopup"
    @click="$togglePopup('GameHintPopup')"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">You have 3 hints left, would you like to use one?</div>
      <div class="popup__actions">
        <div
          class="button button--active"
          @click="useHint"
        >Yes, let's go</div>
        <div
          class="button"
          @click="$togglePopup('GameHintPopup')"
        >No, not yet</div>
      </div>
    </div>
  </div>
</template>

<script setup>
let { $togglePopup, $API, $showToast } = useNuxtApp();

let emits = defineEmits(['hint'])

const useHint = async () => {
  let resp = await $API().Chess.getHintForMove({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();
  conbsole.log(body);
  if(body.errors) {
    $showToast('Something went wrong. Try again.', 'error')
    return console.error(body.errors[0].message);
  }
  emits('hint', body)
  $togglePopup('GameHintPopup');
}
</script>

<style lang="scss" scoped>
.popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 428px;
  height: 173px;
  margin: calc((100vh - 173px) / 2) auto;
  &__heading{
    text-align: center;
    max-width: 220px;
    text-transform: initial;
    font-size: 16px;
    line-height: normal;
  }
  &__actions{
    margin-top: auto;
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
}

.button{
  padding: 13px 16px;
  height: 40px;
  color: #FFF;
  text-align: center;
  font-size: 14px;
  font-family: Montserrat;
  font-weight: 500;
  line-height: 100%;
  background: rgba(255, 255, 255, 0.05);

  &--active{
    background: $color1;
    color: $color-font;
  }
}
</style>