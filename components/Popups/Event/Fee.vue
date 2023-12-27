<template>
  <div
    class="popup__wrapper"
    id="RegistrationFeePopup"
    @click="$togglePopup('RegistrationFeePopup')"
  >
    <div
      class="popup"
      @click.stop
    >
      <div class="popup__heading">Registration fee</div>
      <div class="popup__underheading">
        It costs {{ props.amount }} to participate in this tournament.
        <br />
        Please, connect your wallet and pay the registration fee.
      </div>
      <div class="status">
        <div
          class="btn"
          :class="{ 'status__btn--success': success }"
          @click="pay"
        >
          <template v-if="success">Completed!</template>
          <template v-else-if="waiting">
            <SpinnerDiamond />
          </template>
          <template v-else>Pay registration fee</template>
        </div>
        <div
          class="status__wait"
          v-if="waiting"
        >
          Verifying your transaction.
          <br />
          This could take up to 10 seconds.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWallet } from "solana-wallets-vue";
import { Transaction } from "@solana/web3.js"

let { $API, $togglePopup, $showToast } = useNuxtApp();

const { publicKey, signTransaction, connect, select } = useWallet();

let props = defineProps(['amount', 'id'])
let emits = defineEmits(['reregister'])

const waiting = ref(false),
  success = ref(false)

const pay = async () => {
  if(!publicKey.value) {
    await connect();
  }

  waiting.value = true;
  let resp = await $API().Events.payFee({
    accessToken: localStorage.getItem("accessToken"),
    id: props.id,
    walletAddress: publicKey.value
  });
  let body = await resp.json();

  console.log(body)
  if (body.errors) {
    waiting.value = false;
    success.value = false;
    return $showToast(body.errors[0].message, 'error')
  }
  let depositId = body.depositId
  let sign;
  try {
    sign = await signTransaction.value(Transaction.from(JSON.parse(body.transaction).data));
  } catch (e) {
    success.value = false;
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
    waiting.value = false;
    success.value = false;
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
      emits('reregister');
      setTimeout(() => $togglePopup('RegistrationFeePopup'), 2000)
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
</script>

<style lang="scss" scoped>
.popup {
  width: 470px;
  height: 185px;
  margin-top: calc((100dvh - 185px) / 2);
  display: flex;
  flex-direction: column;
  gap: 20px;

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

.status {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;

  &__btn--success {
    background: #27F4BA !important;
  }

  &__wait {
    color: #FFFFFF4d;
    font-family: "Neue Plak";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 170px;
  padding: 15px 13px;
  background: #1FA2F3;
  color: #181B20;
  text-align: center;
  font-family: "Montserrat";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
  transition: .3s ease;
  cursor: pointer;
}
</style>