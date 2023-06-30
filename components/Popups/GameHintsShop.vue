<template>
  <div
    class="popup__wrapper"
    id="GameHintsShopPopup"
    @click="$togglePopup('GameHintsShopPopup')"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">Shop</div>

      <div class="hints">
        <div
          class="hint"
          v-for="hint in hints"
        >
          <div class="hint__hr"></div>
          <div class="hint__content">
            <div class="hint__name">{{ hint.name }}</div>
            <div class="hint__price">{{ hint.price }} SOL</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
let { $togglePopup } = useNuxtApp();

let hints = ref([
  {
    name: "5 hints",
    price: 0.5
  },
  {
    name: "15 hints",
    price: 1
  },
  {
    name: "30 hints",
    price: 1.5
  },
  {
    name: "60 hints",
    price: 2.3
  },
  {
    name: "100 hints",
    price: 5
  }
])
</script>

<style lang="scss" scoped>
.popup {
  width: 340px;
  min-height: 300px;
  top: 74px;

  &__heading {
    text-transform: uppercase;
  }
}

.hint{
  &s{

  }
}
</style>