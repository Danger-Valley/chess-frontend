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
      <div class="popup__heading">Buy hints</div>
      <div class="popup__underheading">You can use AI hints in any Chess game.<br />1 hint = 1 recommendation</div>

      <div class="section">
        <div class="section__heading">Pay with</div>
        <div class="section__items">
          <div
            class="section__item"
            v-for="token in tokens"
            :title="token.name"
            :class="{ 'section__item--active': selectedToken == token }"
            @click="selectedToken = token; selectedPrice = prices?.filter(el => el.tokenId == selectedToken?.id)[0]"
          >
            <div class="section__front">{{ token.ticker }}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section__heading">Amount</div>
        <div
          class="section__items"
          v-if="prices"
        >
          <div
            class="section__item"
            v-for="price in prices?.filter(el => el.tokenId == selectedToken?.id)"
            :class="{ 'section__item--active': selectedPrice == price }"
            @click="selectedPrice = price"
          >
            <div class="section__front">{{ price.title }}</div>
          </div>
        </div>
      </div>

      <div
        class="btn"
        :class="{ 'btn--success': success, 'btn--waiting': waiting }"
        @click="purchase"
      >
        <div class="btn__content">
          <template v-if="waiting">
            <SpinnerDiamond />
          </template>
          <template v-else>
            <template v-if="success">Complete!</template>
            <template v-else>Purchase</template>
          </template>
        </div>
        <div class="btn__success"></div>
      </div>
    </div>
  </div>

  <WalletModalProvider
    dark
    ref="walletModalProviderRef"
  ></WalletModalProvider>
</template>

<script setup>
import { useWallet, WalletModalProvider } from "solana-wallets-vue";
import { Transaction } from "@solana/web3.js"

let { $togglePopup, $API, $showToast } = useNuxtApp();
let { publicKey, readyState, connected, signTransaction, connect } = useWallet();

let emits = defineEmits(['update'])

let tokens = ref([]),
  selectedToken = ref(),
  prices = ref([]),
  selectedPrice = ref(),
  walletModalProviderRef = ref(),
  purchaseAfterConnection = false,
  waiting = ref(false),
  success = ref(false)

watch([connected, readyState], async () => {
  console.log(readyState.value)
  if (readyState.value == "Installed") await connect();
  if (purchaseAfterConnection) {
    purchaseAfterConnection = false;
    purchase();
  }
}, { immediate: true })

const purchase = async () => {
  console.log(publicKey.value?.toString())

  if (!publicKey.value) {
    purchaseAfterConnection = true;
    return walletModalProviderRef.value.openModal();
  }

  let resp = await $API().Payments.Hints.buy({
    accessToken: localStorage.getItem('accessToken'),
    walletAddress: publicKey.value.toString(),
    amount: selectedPrice.value.amount,
    splTokenId: selectedToken.value.id
  })
  let body = await resp.json();
  success.value = false;
  waiting.value = true;

  console.log(body)
  if (body.errors) {
    success.value = false;
    waiting.value = false;
    return $showToast(body.errors[0].message, 'error')
  }
  let depositId = body.depositId
  let sign;
  try {
    sign = await signTransaction.value(Transaction.from(JSON.parse(body.transaction).data));
  } catch (e) {
    return waiting.value = false;
  }

  resp = await $API().Payments.Deposit.claim({
    accessToken: localStorage.getItem('accessToken'),
    id: depositId,
    transaction: JSON.stringify(sign.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    }).toJSON())
  })
  body = await resp.json();
  console.log(body);
  if (body.errors) {
    success.value = false;
    waiting.value = false;
    return $showToast(body.errors[0].message, 'error')
  }

  let int = setInterval(async () => {
    resp = await $API().Payments.Deposit.getStatus({
      accessToken: localStorage.getItem('accessToken'),
      id: depositId
    })
    body = await resp.json();
    console.log(body);

    if (body.status == 'COMPLETED') {
      clearInterval(int)
      waiting.value = false;
      success.value = true;
      emits('update');
      setTimeout(() => $togglePopup('GameHintsShopPopup'), 2000)
      setTimeout(() => {
        waiting.value = false;
        success.value = false;
      }, 3000)
    }
    else if (body.status == 'ERROR') {
      clearInterval(int)
      waiting.value = false;
      success.value = false;
      $showToast('Something went wrong. Try again.', 'error')
    }
  }, 5000)
}

onMounted(async () => {
  let resp = await $API().Payments.Hints.getPrices(localStorage.getItem('accessToken'));
  let body = await resp.json();

  console.log(body);
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
  body.tokens.map(el => {
    tokens.value.push(el.splToken);
    el.prices.map(price => {
      prices.value.push({ ...price, tokenId: el.splToken.id })
    })
  })
  console.log(tokens.value, prices.value);
  selectedToken.value = tokens.value?.[0]
  selectedPrice.value = prices.value?.[0]
})
</script>

<style lang="scss" scoped>
.popup {
  width: 470px;
  min-height: 400px;
  top: 74px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(24, 27, 32, 0.55);
  backdrop-filter: blur(50px);

  &__heading {
    text-transform: uppercase;
  }

  &__underheading {
    color: #67696B;
    font-family: "Neue Plak";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 20px;
  }
}

.section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;

  &__heading {
    color: #FFFFFF4d;
    font-family: "Neue Plak";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &__item {
    color: #FFFFFF80;
    font-family: "Neue Plak";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    cursor: pointer;

    &s {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
    }

    &--active {
      color: #FFFFFF;
      background: linear-gradient(65.1deg, rgba(252, 248, 213, 1) 0%, rgba(252, 248, 213, 0) 100%);
    }
  }

  &__front {
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    margin: 2px;
    padding: 5px 10px;
    background: #282A2C;
  }
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 120px;
  padding: 15px 13px;
  margin-top: 20px;
  background: #1FA2F3;
  color: #181B20;
  text-align: center;
  font-family: "Montserrat";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  cursor: pointer;

  &__content {
    position: relative;
    z-index: 1;
  }

  &--waiting::after {
    text-align: start;
    width: 180px;
    content: 'Verifying your transaction. This could take up to 30 seconds.';
    position: absolute;
    left: calc(100% + 5px);
    color: #FFFFFF4d;
    font-family: "Neue Plak";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &--success &__success {
    left: 0;
    width: 100%;
    background: #27F4BA;
  }

  &__success {
    z-index: 0;
    position: absolute;
    width: 20%;
    height: 100%;
    left: 40%;
    top: 0;
    transition: .3s ease;
  }
}

@keyframes expand {
  100% {
    width: 100%;
  }
}
</style>