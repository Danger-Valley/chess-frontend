<template>
  <div
    class="popup__wrapper"
    id="EnterEmailPopup"
    @click="$togglePopup('EnterEmailPopup')"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">Enter email</div>
      <div class="popup__underheading">
        Please enter your email so we can notify you 30 minutes before the tournament starts, or about the next great chess tournament.
      </div>
      <div class="field">
        <input
          class="field__input"
          type="email"
        />
      </div>
      <div
        class="btn"
        @click="saveEmail"
      >Notify me</div>
    </div>
  </div>
</template>

<script setup>
let { $API, $togglePopup, $showToast } = useNuxtApp();

const saveEmail = async () => {
  let resp = await $API().User.saveEmail({
    accessToken: localStorage.getItem("accessToken"),
    email: document.querySelector('.field__input').value
  });
  let body = await resp.json();
  console.log(body);

  if(body.errors) {
    console.error(body.errors);
    return $showToast(body.errors[0].message, "error")
  }

  $togglePopup('EnterEmailPopup')
}
</script>

<style lang="scss" scoped>
.popup {
  width: 576px;
  min-height: 206px;
  margin-top: 100px;

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