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
        <template v-if="chosenTabIndex == 0">
          <div class="tab">
            <div class="tab__heading">Your name</div>
            <div>
              <!-- не впевнений в дизайну тож потім зроблю -->
            </div>
          </div>

          <div class="tab">
            <div class="tab__text">Verify your identity so we can easily message you about a giveaway or allowlist.</div>

            <div class="tab__item">
              <div
                class="social"
                :class="{ 'social--connected': user?.discrodUser }"
                id="social-discord"
                @click="$connectDiscord('update')"
              >
                <IconDiscord
                  class="social__icon"
                  alt="discord icon"
                ></IconDiscord>
                <div class="user">
                  <template v-if="user?.discrodUser">
                    <img
                      class="user__avatar"
                      v-if="user.discrodUser.avatar"
                      :src="user.discrodUser.avatar"
                    />
                    <div class="user__username">{{ user.discrodUser.username }}</div>
                    <div class="user__disconnect">Disconnect</div>
                  </template>

                  <template v-else>
                    Connect Discord
                  </template>
                </div>
              </div>

              <div
                class="social"
                :class="{ 'social--connected': user?.twitterUser }"
                id="social-twitter"
                @click="$connectTwitter('update')"
              >
                <IconTwitter
                  class="social__icon"
                  alt="twitter icon"
                ></IconTwitter>
                <div class="user">
                  <template v-if="user?.twitterUser">
                    <img
                      class="user__avatar"
                      v-if="user.twitterUser.avatar"
                      :src="user.twitterUser.avatar"
                    />
                    <div class="user__username">{{ user.twitterUser.username }}</div>
                    <div class="user__disconnect">Disconnect</div>
                  </template>

                  <template v-else>
                    Connect Twitter
                  </template>
                </div>
              </div>

              <div
                class="social"
                :class="{ 'social--connected': user?.googleUser }"
                id="social-google"
                @click="login()"
              >
                <IconGoogle
                  class="social__icon"
                  alt="google icon"
                ></IconGoogle>
                <div class="user">
                  <template v-if="user?.googleUser">
                    <img
                      class="user__avatar"
                      v-if="user.googleUser.avatar"
                      :src="user.googleUser.avatar"
                    />
                    <div class="user__username">{{ user.googleUser.username }}</div>
                    <div class="user__disconnect">Disconnect</div>
                  </template>
                  <template v-else>
                    Connect Google
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div class="tab">
            <div class="tab__text">Add multiple wallets to verify token ownership. All of these wallets can also access
              your profile.</div>
            <div class="tab__item">
              <div
                class="wallet"
                v-for="walletType in ['Ethereum', 'Solana', 'Polygon', 'Bitcoin', 'Stellar']"
              >
                <div class="wallet__type">{{ walletType }} Wallets</div>
                <div class="wallet__amount">0 Wallets Connected</div>
                <div class="wallet__connect">Connect Wallet</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import IconDiscord from "@/assets/imgs/discord-logo.svg"
import IconTwitter from "@/assets/imgs/twitter-logo.svg"
import IconGoogle from "@/assets/imgs/google-logo.svg"
import { useUserStore } from "~/stores/user"

let chosenTabIndex = ref(0)

const store = useUserStore()

const user = computed(() => store.getUser.value)

let { $connectDiscord, $connectTwitter, $handleOnSuccess, $handleOnError } = useNuxtApp();

const { isReady, login } = useTokenClient({
  onSuccess: (e) => $handleOnSuccess(e, 'update'),
  onError: $handleOnError
});

onMounted(() => {
  console.log(user.value)
})
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
  margin-bottom: 28px;

  &__tab {
    font-family: 'Neue Plak';
    font-weight: 400;
    font-size: 14px;
    line-height: 1;
    text-transform: uppercase;
    color: #ffffff33;
    cursor: pointer;

    &--active {
      color: #FFFFFF;
    }
  }
}

.content {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.tab {
  max-width: 385px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  font-family: 'Neue Plak';
  font-weight: 400;
  font-size: 14px;

  &__heading {
    line-height: 1;
    text-transform: uppercase;
    color: #FFFFFF;
    margin: 10px 0;
  }

  &__text {
    width: 280px;
    line-height: 1.2;
    color: #ffffff4d;
    margin-bottom: 20px;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

.social {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: rgba(217, 217, 217, 0.05);
  border: 2px solid transparent;
  border-radius: 10px;
  transition: .3s;
  cursor: pointer;

  &--connected {
    .user {
      width: calc(100% - 36px);
      margin-left: 10px;
    }

    &#social {
      &-discord {
        border: 2px solid #656CE1;
        background-color: #656CE1;
      }

      &-twitter {
        border: 2px solid red;
        background-color: red;
      }

      &-google {
        border: 2px solid red;
        background-color: red;
      }
    }
  }

  &__icon {
    margin-left: 5px;
  }
}

.user {
  width: 140px;
  height: 54px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  margin-left: 8px;
  transition: .3s;

  font-family: 'Montserrat';
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  color: #FFFFFF;
  background: #222529;
  border-radius: 10px;

  &__avatar {
    width: 38px;
    aspect-ratio: 1;
  }

  &__username {
    font-family: 'Neue Plak';
    font-weight: 400;
    font-size: 16px;
    line-height: 1;
    color: #FFFFFF;
  }

  &__disconnect {
    margin-left: auto;
    font-family: 'Neue Plak';
    font-weight: 400;
    font-size: 16px;
    line-height: 1;
    color: #ff0000;
  }
}

.wallet {
  display: grid;
  grid-template-columns: auto auto;
  gap: 3px;
  padding: 10px 18px;
  background: rgba(217, 217, 217, 0.05);
  border-radius: 10px;

  font-family: 'Neue Plak';
  font-weight: 400;

  &__type {
    font-size: 14px;
    line-height: 1;
    color: #FFFFFF;
  }

  &__amount {
    font-size: 14px;
    line-height: 1.2;
    color: #FFFFFF4d;
    grid-row: 2;
    grid-column: 1;
  }

  &__connect {
    width: fit-content;
    margin-left: auto;
    grid-row: 1 / span 2;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;

    font-size: 12px;
    line-height: 1.2;
    color: #FFFFFF;
    text-align: center;
    cursor: pointer;
  }

}</style>