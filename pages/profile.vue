<template>
  <div class="page">
    <Header></Header>

    <main class="main">
      <nav class="nav">
        <div
          v-for="(tab, counter) in ['Profile', 'Last games']"
          class="nav__tab"
          :class="{ 'nav__tab--active': counter == chosenTabIndex }"
          @click="chosenTabIndex = counter"
        >
          {{ tab }}
        </div>
      </nav>

      <div class="content">
        <template>

        </template>
        <div class="tab">
          <div class="tab__heading">Your name</div>
        </div>

        <div class="tab">
          <div class="tab__text">Verify your identity so we can easily message you about a giveaway or allowlist.</div>

          <div class="socials">
            <div class="social" :class="{'social--connected': user?.discrodUser}" id="social-discord">
              <IconDiscord class="social__icon" alt="discord icon"></IconDiscord>
              <div class="user" v-if="user">
                <img class="user__avatar" :src="user.avatar"/>
                <div class="user__username">{{ user.username }}</div>
                <div class="user__disconnect">Disconnect</div>
              </div>
              <template v-else>
                Connect Discord
              </template>
            </div>

            <div class="social" :class="{'social--connected': user?.twitterUser}" id="social-twitter">
              <IconTwitter class="social__icon" alt="twitter icon"></IconTwitter>
              <div class="user" v-if="user">
                <img class="user__avatar" :src="user.avatar"/>
                <div class="user__username">{{ user.username }}</div>
                <div class="user__disconnect">Disconnect</div>
              </div>
              <template v-else>
                Connect Twitter
              </template>
            </div>

            <div class="social" :class="{'social--connected': user?.googleUser}" id="social-google">
              <IconGoogle class="social__icon" alt="google icon"></IconGoogle>
              <div class="user" v-if="user">
                <img class="user__avatar" :src="user.avatar"/>
                <div class="user__username">{{ user.username }}</div>
                <div class="user__disconnect">Disconnect</div>
              </div>
              <template v-else>
                Connect Google
              </template>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import IconDiscord from "@/assets/imgs/discord-logo.svg"
import IconTwitter from "@/assets/imgs/twitter-logo.svg"
import IconGoogle from "@/assets/imgs/google-logo.svg"

let chosenTabIndex = ref(0)
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  background: #181B20;
}

.main {
  margin: 8px 110px;
}

.nav {
  display: flex;
  flex-direction: row;
  gap: 20px;

  &__tab {
    font-family: 'Neue Plak';
    font-weight: 400;
    font-size: 14px;
    line-height: 1;
    text-transform: uppercase;
    color: #ffffff33;

    &--active {
      color: #FFFFFF;
    }
  }
}
</style>