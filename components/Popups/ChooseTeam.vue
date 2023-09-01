<template>
  <div
    class="popup__wrapper"
    id="ChooseTeamPopup"
    @click="$togglePopup('ChooseTeamPopup')"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">Choose the team</div>
      <div class="popup__underheading">
        You can play only for the team where you are Holder.
        <br />
        Connect your wallet in <NuxtLink to="/profile"><u>Profile</u></NuxtLink> to prove ownership.
      </div>
      <div class="popup__choose">
        Play for

        <div
          class="option"
          v-for="team in props.teams"
          :class="{ 'option--active': chosenTeam == team.id }"
          @click="chosenTeam = team.id"
        >
          <div class="option__front">{{ team.name }}</div>
        </div>
      </div>

      <div class="popup__actions">
        <div
          class="btn"
          @click="register"
        >Register</div>
        <div class="popup__actions-text">You won’t be able to change the team in future.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
let props = defineProps(['teams'])

let { $API, $togglePopup, $showToast } = useNuxtApp();
let emits = defineEmits(['register'])
let chosenTeam = ref()

const register = async () => {
  let resp = await $API().Events.register({
    accessToken: localStorage.getItem('accessToken'),
    id: useRoute().params.id,
    teamId: chosenTeam.value
  });
  let body = await resp.json();
  console.log(body);
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
  emits('register')
  $togglePopup('ChooseTeamPopup')
}

watch(() => props.teams, () => {
  chosenTeam.value = props?.teams?.[0].id
})
</script>

<style lang="scss" scoped>
.popup {
  width: 470px;
  margin-top: 76px;

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

  &__choose {
    color: #67696B;
    font-family: "Neue Plak";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__actions {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;

    &-text {
      max-width: 160px;
      color: #FFFfff4d;
      font-family: "Neue Plak";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
}

.option {
  width: fit-content;
  background: transparent;
  transition: .3s;
  cursor: pointer;
  font-size: 16px;

  &__front {
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    margin: 2px;
    padding: 5px 10px;
    background: #282A2C;
  }

  &--active {
    color: #FFFFFF;
    background: linear-gradient(65.1deg, rgba(252, 248, 213, 1) 0%, rgba(252, 248, 213, 0) 100%);
  }
}

.btn {
  width: fit-content;
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
}

@media screen and (max-width: #{map-get($sizes, "tablet") + px}) {
  .popup {
    width: calc(100vw - 2 * 20px);
    margin: 200px 20px;
  }
}
</style>