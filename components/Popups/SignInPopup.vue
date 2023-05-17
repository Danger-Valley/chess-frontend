<template>
  <div
    class="popup__wrapper"
    id="SignInPopup"
    @click="$togglePopup('SignInPopup')"
  >
    <div class="popup" @click.stop>
      <div class="popup__heading">Sign In</div>

      <div
        class="sign-in"
        @click.stop="$connectDiscord('auth')"
      >
        <IconDiscord
          class="sign-in__icon"
          alt="discord icon"
        ></IconDiscord>
        <div class="sign-in__text">Sign in with Discord</div>
      </div>

      <div
        class="sign-in"
        @click.stop="$connectTwitter('auth')"
      >
        <IconTwitter
          class="sign-in__icon"
          alt="twitter icon"
        ></IconTwitter>
        <div class="sign-in__text">Sign in with Twitter</div>
      </div>

      <div
        class="sign-in"
        @click.stop="login"
      >
        <IconGoogle
          class="sign-in__icon"
          alt="google icon"
        ></IconGoogle>
        <div class="sign-in__text">Sign in with Google</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconDiscord from "@/assets/imgs/discord-logo.svg"
import IconTwitter from "@/assets/imgs/twitter-logo.svg"
import IconGoogle from "@/assets/imgs/google-logo.svg"
import { useTokenClient } from "vue3-google-signin";

let { $connectDiscord, $connectTwitter, $handleOnSuccess, $handleOnError } = useNuxtApp();

const { isReady, login } = useTokenClient({
  onSuccess: (e) => $handleOnSuccess(e, 'auth'),
  onError: $handleOnError
});
</script>

<style lang="scss" scoped>
.popup {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__heading {
    margin-bottom: 10px;
  }
}

.sign-in {
  height: 58px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: #d9d9d90d;
  cursor: pointer;

  &__text {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    color: #FFFFFF;
  }
}

@media screen and (max-width: #{map-get($sizes, "tablet")-1 + px}) {
  // assuming it's height is always 270px
  .popup{
    height: 270px;
    margin-top: calc((100vh - 270px) / 2);
  }
}
</style>