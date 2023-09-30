<template>
  <div
    class="popup__wrapper"
    id="SignInPopup"
    @click="$togglePopup('SignInPopup')"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">Sign In</div>

      <div
        class="sign-in sign-in--discord"
        @click.stop="$connectDiscord('auth')"
      >
        <img
          src="@/assets/imgs/discord-logo-1.png"
          class="sign-in__icon"
          alt="discord icon"
        >
        <div class="sign-in__text">Sign in with Discord</div>
      </div>

      <div
        class="sign-in sign-in--twitter"
        @click.stop="$connectTwitter('auth')"
      >
        <IconTwitter
          class="sign-in__icon"
          alt="twitter icon"
        ></IconTwitter>
        <div class="sign-in__text">Sign in with Twitter</div>
      </div>

      <div
        class="sign-in sign-in--google"
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
  width: 252px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;

  &__heading {
    margin-bottom: 10px;
  }
}

.sign-in {
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #d9d9d90d;
  cursor: pointer;
  padding: 1px;
  border-radius: 4px;

  &--discord {
    background-color: #7289DA;

    .sign-in__icon {
      padding: 7px;
    }
  }

  &--twitter {
    background-color: #1DA1F2;
  }

  &--google {
    background-color: #4285F4;
  }

  &__text {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;
    color: #FFFFFF;
    margin: 0 auto;
  }

  &__icon {
    width: 38px;
    height: 38px;
    background-color: #fff;
    padding: 10px;
    border-radius: 2px;
  }
}

@media screen and (max-width: #{map-get($sizes, "tablet")-1 + px}) {

  // assuming it's height is always 270px
  .popup {
    height: 270px;
    margin-top: calc((100vh - 270px) / 2);
  }
}
</style>