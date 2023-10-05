<template>
  <div
    class="popup__wrapper"
    id="SetUsernamePopup"
    @click="props.canClose ? $togglePopup('SetUsernamePopup') : null"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">Set Username</div>
      <div class="popup__underheading">
        Your username should have 3 to 40 characters and can only include<br />letters from A to
        Z, numbers from 0 to 9, and underscores
      </div>
      <div class="field">
        <input
          class="field__input"
          type="text"
          minlength="3"
          maxlength="40"
          @input="check"
        />
        <div class="field__status" :class="{'field__status--error': status != 'Available'}">{{ status }}</div>
      </div>
      <div
        class="btn"
        @click="update"
      >Save changes</div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user';

let props = defineProps({
  canClose: {
    type: Boolean,
    default: false
  }
})

let { $API, $togglePopup, $showToast } = useNuxtApp();
let status = ref(),
  checkTimeout = null

const update = async () => {
  if(status.value != 'Available') return;

  await useUserStore().updateUser({
    username: document.querySelector('.field__input').value
  })
  $togglePopup('SetUsernamePopup')
}

const check = async () => {
  clearTimeout(checkTimeout)
  checkTimeout = setTimeout(async () => {
    let username = document.querySelector('.field__input').value;    
    if (username.length < 3) return status.value = "Too short";
    
    let resp = await $API().User.checkUsername({
      accessToken: localStorage.getItem('accessToken'),
      username
    });
    let body = await resp.json();
    console.log(body);
    if (body.errors) {
      $showToast(body.errors[0].message, 'error')
      return status.value = body.errors[0].message;
    }

    status.value = "Available"
  }, 300)
}
</script>

<style lang="scss" scoped>
.popup {
  width: 576px;
  min-height: 206px;
  margin-top: calc((100vh - 206px) / 2);

  &__heading {
    font-family: "Neue Plak";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
  }

  &__underheading {
    color: #67696B;
    font-family: "Neue Plak";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}

.field {
  position: relative;
  margin: 20px 0;
  width: 100%;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.20);
  background: #181B20;

  &__input {
    padding: 9px 10px;
    width: 100%;
    color: #C9C9C9;
    background-color: transparent;
    border: none;
    outline: none;
    font-family: "Neue Plak";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &__status {
    z-index: 2;
    position: absolute;
    top: 9px;
    right: 10px;
    color: #27F4BA;
    text-align: right;
    font-family: Neue Plak;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    transition: .3s;

    &--error {
      color: #F00;
    }
  }
}

.btn {
  width: fit-content;
  margin-top: 20px;
  padding: 15px 13px;
  background: #1FA2F3;
  color: #181B20;
  text-align: center;
  font-family: "Montserrat";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  cursor: pointer;
}</style>