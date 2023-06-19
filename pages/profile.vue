<template>
  <div class="page">
    <Header></Header>

    <main class="main">
      <nav class="nav">
        <div
          v-for="(tab, counter) in ['Profile', 'Last games']"
          class="nav__tab"
          :class="{ 'nav__tab--active': counter == chosenTabIndex }"
          @click="chooseTabIndex(counter)"
        >
          {{ tab }}
        </div>
      </nav>

      <div class="content">
        <template v-if="chosenTabIndex == 0">
          <div class="tab">
            <div class="tab__heading">Your name</div>
            <div class="tab__item info">
              <img
                class="info__avatar"
                :src="user?.avatar"
              />
              <div
                class="info__nickname"
                :class="{ 'info__nickname--edit': isNameEditorToggled }"
                id="nickname"
                :contenteditable="isNameEditorToggled"
              >{{ user.username || 'Your username' }}</div>
              <IconEdit
                class="info__edit"
                @click="toggleEditName"
                title="Click to edit/save"
              ></IconEdit>
            </div>
          </div>

          <div class="tab">
            <div class="tab__text">Verify your identity so we can easily message you about a giveaway or allowlist.</div>

            <div class="tab__item">
              <div
                class="social"
                :class="{ 'social--connected': user?.discordUser?.id }"
                id="social-discord"
                @click="$connectDiscord('update')"
              >
                <IconDiscord
                  class="social__icon"
                  alt="discord icon"
                ></IconDiscord>
                <div class="user">
                  <template v-if="user?.discordUser">
                    <img
                      class="user__avatar"
                      v-if="user.discordUser.avatar"
                      :src="user.discordUser.avatar"
                    />
                    <div class="user__username">{{ user.discordUser.username }}</div>
                    <div
                      class="user__disconnect"
                      @click.stop="$disconnectDiscord()"
                    >Disconnect</div>
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
                    <div
                      class="user__disconnect"
                      @click.stop="$disconnectTwitter()"
                    >Disconnect</div>
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
                    <div class="user__username">{{ user.googleUser.email }}</div>
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
                v-for="walletType in ['Solana', 'Ethereum', 'Polygon', 'Bitcoin', 'Stellar']"
              >
                <div class="wallet__type">{{ walletType }} Wallets</div>
                <div class="wallet__amount">{{ userWallets?.filter(el => el.blockchain.toUpperCase() ==
                  walletType.toUpperCase())?.length || 0 }} Wallets Connected</div>
                <div
                  class="wallet__connect"
                  :class="{ 'wallet__connect--soon': walletType != 'Solana' }"
                  @click="openWalletModalProvider(walletType)"
                >
                  <template v-if="walletType == 'Solana'">
                    Connect Wallet
                  </template>
                  <template v-else>Soon!</template>
                </div>
                <div
                  class="wallet__connected"
                  v-if="walletType == 'Solana' && userWallets?.filter(el => el.blockchain.toUpperCase() == walletType.toUpperCase())?.length > 0"
                  v-for="connectedWallet in userWallets?.filter(el => el.blockchain.toUpperCase() == walletType.toUpperCase())"
                >
                  <div class="connectedWallet">
                    {{ $formatWallet(connectedWallet?.walletAddress) }}
                    <svg
                      @click="$disconnectWallet(connectedWallet?.id)"
                      class="connectedWallet__delete"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.8996 4.04973C10.7196 3.82973 8.51961 3.71973 6.32961 3.71973C5.02961 3.71973 3.72961 3.78972 2.43961 3.91972L1.09961 4.04973"
                        stroke="#646669"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.70898 3.38994L4.84898 2.52994C4.94898 1.90994 5.02898 1.43994 6.13898 1.43994H7.85898C8.96898 1.43994 9.04897 1.92994 9.14897 2.52994L9.28897 3.37994"
                        stroke="#646669"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.49 4.12988L11.06 10.7299C10.99 11.7599 10.93 12.5599 9.10001 12.5599H4.89C3.06 12.5599 2.99999 11.7599 2.92999 10.7299L2.5 4.12988"
                        stroke="#646669"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>

    <WalletModalProvider
      dark
      ref="walletModalProviderRef"
    ></WalletModalProvider>
  </div>
</template>

<script setup>
import IconDiscord from "@/assets/imgs/discord-logo.svg"
import IconTwitter from "@/assets/imgs/twitter-logo.svg"
import IconGoogle from "@/assets/imgs/google-logo.svg"
import IconEdit from "@/assets/imgs/edit.svg"
import { useUserStore } from "~/stores/user"
import { WalletModalProvider, useWallet } from "solana-wallets-vue";

let chosenTabIndex = ref(0),
  isNameEditorToggled = ref(false),
  walletModalProviderRef = ref()

const { publicKey, wallet, disconnect, connect, connecting, connected, ready, readyState } = useWallet();

const store = useUserStore()

const user = computed(() => store.getUser.value),
  userWallets = computed(() => store.getWallets.value)

let { $connectDiscord, $disconnectDiscord, $connectTwitter, $disconnectTwitter, $handleOnSuccess, $handleOnError, $formatWallet, $connectWallet, $disconnectWallet } = useNuxtApp();

watch([connected, wallet, readyState], async () => {
  console.log(readyState.value, wallet.value)
  if (userWallets?.value?.wallets?.length > 0 && userWallets?.value?.wallets?.find(el => el.walletAddress == publicKey)) return;
  if (readyState.value == "Installed") connect();
  if (connected.value) await $connectWallet()
})

const { isReady, login } = useTokenClient({
  onSuccess: async (e) => {
    await $handleOnSuccess(e, 'update')
    document.querySelectorAll("#social-google svg path").forEach(el => {
      if (el.getAttribute('data-class') == 'blue') el.style.fill = '#4284F3';
      else if (el.getAttribute('data-class') == 'green') el.style.fill = '#34A853';
      else if (el.getAttribute('data-class') == 'yellow') el.style.fill = '#FBBC05';
      else if (el.getAttribute('data-class') == 'red') el.style.fill = '#EA4335';
    })
  },
  onError: $handleOnError
});

const openWalletModalProvider = (walletType) => {
  console.log(wallet.value, walletType)
  if (walletType == 'Solana') walletModalProviderRef.value.openModal();
}

const chooseTabIndex = (index) => {
  chosenTabIndex.value = index;
  location.hash = index;
}

const uploadAvatar = async () => {

}

const toggleEditName = async () => {
  isNameEditorToggled.value = !isNameEditorToggled.value;
  if (!isNameEditorToggled.value) {
    let body = {
      username: document.querySelector('.info__nickname').innerText
    }
    await store.updateUser(body)
  }
}

const modifyGoogleIcon = () => {
  document.querySelectorAll("#social-google svg path").forEach(el => {
    if (el.getAttribute('data-class') == 'blue') el.style.fill = '#4284F3';
    else if (el.getAttribute('data-class') == 'green') el.style.fill = '#34A853';
    else if (el.getAttribute('data-class') == 'yellow') el.style.fill = '#FBBC05';
    else if (el.getAttribute('data-class') == 'red') el.style.fill = '#EA4335';
  })
}

onMounted(() => {
  chosenTabIndex.value = location.hash.slice(1);
  modifyGoogleIcon()
  console.log(publicKey.value)
})

watch(user, () => {
  modifyGoogleIcon()
})
</script>

<style lang="scss" scoped>
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

.info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;

  &__avatar {
    width: 75px;
    aspect-ratio: 1;
    cursor: pointer;
  }

  &__nickname {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border: 1px solid transparent;
    transition: .3s;
    padding: 10px;
    font-family: 'Neue Plak';
    font-weight: 400;
    font-size: 22px;
    line-height: 30px;
    color: #FFFFFF;

    &--edit {
      border: 1px solid #fff;
    }
  }

  &__edit {
    padding: 12px;
    box-sizing: content-box;
    cursor: pointer;
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
        border: 2px solid #1D9BF0;
        background-color: #1D9BF0;
      }

      &-google {
        border: 2px solid #fff;
        background-color: #fff;
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
    transition: .3s;

    font-size: 12px;
    line-height: 1.2;
    color: #FFFFFF;
    text-align: center;
    cursor: pointer;

    &--soon {
      border: unset !important;
      cursor: not-allowed;
    }

    &:hover {
      border: 1px solid rgba(255, 255, 255, 0.7);
    }
  }

  &__connected {
    margin-top: 14px;
    grid-column: span 2;
    display: flex;
    flex-direction: column;
  }

  .connectedWallet {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-family: 'Neue Plak';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    color: #fff;

    &__delete {
      margin-left: auto;
      background: rgba(100, 102, 105, 0.1);
      border-radius: 5px;
      padding: 6px;
      box-sizing: content-box;
      cursor: pointer;

      path {
        transition: .3s;
      }

      &:hover {
        path {
          stroke: #fff;
        }
      }
    }
  }
}
</style>