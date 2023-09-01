<template>
  <div
    class="popup__wrapper"
    id="GameConfirmRevengePopup"
    @click="$togglePopup('GameConfirmRevengePopup')"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">Are you sure you want to revenge {{ props.opponent?.user.username }}?</div>
      <div class="actions">
        <div
          class="button"
          @click="revenge"
        >Revenge</div>
        <div
          class="button"
          @click="$togglePopup('GameConfirmRevengePopup')"
        >Cancel</div>
      </div>
    </div>
  </div>
</template>

<script setup>
let { $togglePopup, $API, $showToast } = useNuxtApp();

let props = defineProps(['opponent'])

const revenge = async () => {
  let resp = await $API().Chess.offerRevenge({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })

  let body = await resp.json();
  console.log(body);
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
  $togglePopup('GameConfirmRevengePopup')
}
</script>

<style lang="scss" scoped>
.popup {
  display: flex;
  flex-direction: column;
  width: 450px;
  min-height: 144px;
  margin: calc((100vh - 144px) / 2) auto;
  background: rgba(24, 27, 32, 0.55);
  backdrop-filter: blur(50px);

  &__wrapper {
    background: rgba(0, 0, 0, 0.4) !important;
  }

  &__heading {
    text-transform: none;
    text-align: center;
  }
}

.actions {
  margin-top: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
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
}
</style>