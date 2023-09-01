<template>
  <div
    class="popup__wrapper"
    id="GameIncomeRevengePopup"
    @click="$togglePopup('GameIncomeRevengePopup')"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">{{ props.opponent?.user.username }} offers a revenge</div>
      <div class="actions">
        <div class="button" @click="acceptRevenge">Accept</div>
        <div class="button" @click="rejectRevenge">Decline</div>
      </div>
    </div>
  </div>
</template>

<script setup>
let { $togglePopup, $API, $showToast } = useNuxtApp();

let props = defineProps(['opponent'])

const acceptRevenge = async () => {
  let resp = await $API().Chess.acceptRevenge({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })

  let body = await resp.json();
  console.log(body);
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
  await navigateTo({
    params: {
      id: body.gameId
    }
  })
  $togglePopup('GameIncomeRevengePopup')
}

const rejectRevenge = async () => {
  let resp = await $API().Chess.rejectRevenge({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })

  let body = await resp.json();
  console.log(body);
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
  $togglePopup('GameIncomeRevengePopup')
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

  &__wrapper{
    background: rgba(0, 0, 0, 0.4) !important;
    &--active{
      z-index: 102;
    }
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