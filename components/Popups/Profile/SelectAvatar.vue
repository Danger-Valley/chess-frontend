<template>
  <div
    class="popup__wrapper"
    id="SelectAvatarPopup"
    @click="$togglePopup('SelectAvatarPopup')"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">Select PFP</div>

      <div class="images">
        <div
          class="image"
          v-for="img in imgs"
          @click="select(img.image)"
        >
          <img
            class="image__img"
            :src="img.image"
            :alt="img.name"
          />
          <div class="image__name">{{ img.name }}</div>
          <div class="image__select">Select PFP</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';

let emits = defineEmits(['update'])

let { $API, $togglePopup, $showToast } = useNuxtApp();
let imgs = ref()

const open = async () => {
  $togglePopup('SelectAvatarPopup')
  let wallet = useUserStore().getWallets?.value?.[0]

  if (!wallet || imgs.value) return;

  let resp = await $API().User.getNFTs({
    accessToken: localStorage.getItem('accessToken'),
    userId: localStorage.getItem('userId'),
  });
  let body = await resp.json();
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
  imgs.value = body.nfts;

  console.log(imgs.value)
}

const select = async (link) => {
  await useUserStore().updateUser({ avatar: link })
  $togglePopup('SelectAvatarPopup')
}

defineExpose({ open });
</script>

<style lang="scss" scoped>
.popup {
  width: 576px;
  margin-top: calc((100vh - 400px) / 2);

  &__heading {
    font-family: "Neue Plak";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
  }
}

.image {
  align-items: center;
  background-color: transparent;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: .5s;

  &s {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 380px;
    overflow: auto;
    align-items: flex-start;
    width: 100%;
    margin-top: 8px;
  }

  &__img {
    aspect-ratio: 1/1;
    clip-path: path("M114.019 43.6333C109.713 33.9998 104.692 24.7471 99.0028 15.9631L97.1679 13.1571C94.9087 9.67006 91.948 6.76212 88.5006 4.6448C85.0531 2.52745 81.2051 1.25384 77.2373 0.916505L74.0158 0.640305C64.021 -0.213435 53.9786 -0.213435 43.9841 0.640305L40.7627 0.916505C36.7946 1.25384 32.947 2.52745 29.4995 4.6448C26.052 6.76212 23.0911 9.67006 20.8321 13.1571L18.9971 15.9882C13.3084 24.7722 8.28719 34.0249 3.98133 43.6584L2.59481 46.7593C0.886392 50.584 0 54.7654 0 59C0 63.2346 0.886392 67.4159 2.59481 71.2407L3.98133 74.3416C8.28719 83.9753 13.3084 93.228 18.9971 102.012L20.8321 104.843C23.0911 108.33 26.052 111.238 29.4995 113.355C32.947 115.473 36.7946 116.746 40.7627 117.084L43.9841 117.36C53.9786 118.213 64.021 118.213 74.0158 117.36L77.2373 117.084C81.208 116.742 85.0579 115.463 88.5053 113.338C91.9533 111.214 94.9122 108.299 97.1679 104.805L99.0028 101.974C104.692 93.1904 109.713 83.9377 114.019 74.304L115.405 71.203C117.113 67.3783 118 63.197 118 58.9623C118 54.7278 117.113 50.5463 115.405 46.7217L114.019 43.6333Z");
    height: 118px;
    width: 118px;
    object-fit: contain;
  }

  &__name {
    color: #fff;
    font-family: "Neue Plak";
    font-weight: 600;
    font-size: 12px;
    line-height: 17px;
  }

  &__select {
    color: #ffffff80;
    font-family: "Neue Plak";
    font-size: 12px;
    line-height: 16px;
    opacity: 0;
    transition: .5s;
  }

  &:hover &__select {
    opacity: 1;
  }
}
</style>