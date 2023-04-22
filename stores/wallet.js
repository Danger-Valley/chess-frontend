import { defineStore } from 'pinia'

export const useWalletStore = defineStore('wallet', () => {
  const wallet = ref()

  const getWallet = computed(() => wallet)

  async function connectWallet(type) {
    let publicKey, walletId;
    switch (type) {
      case "Phantom":
        if (window.solana) {
          let resp = await window.solana.connect();
          publicKey = resp.publicKey,
            walletId = publicKey.toString();
          //await nuxtApp.$showToast("Wallet connected");
          saveWallet(walletId, type);
        }
        else window.open("https://phantom.app/");
        break;
      case "Solflare":
        if (window.solflare) {
          await window.solflare.connect(),
            publicKey = window.solflare.publicKey;
          if (!publicKey) {
            break;
          }
          walletId = publicKey.toString();
          //await nuxtApp.$showToast("Wallet connected");
          saveWallet(walletId, type);
        }
        else window.open("https://solflare.com/");
        break;
      case "Slope":
        if (typeof window.Slope == "function") {
          let slope = new window.Slope();
          let resp = await slope.connect();
          if (resp.msg == "Cancelled" || resp.msg == 'The user rejected the request.') {
            break;
          }
          publicKey = resp.data.publicKey,
            walletId = publicKey;
          //await nuxtApp.$showToast("Wallet connected");
          saveWallet(walletId, type);
        }
        else window.open("https://slope.finance/");
        break;
      default:
        break;
    }
  }

  async function saveWallet(id, type) {
    wallet.value = {
      id,
      type,
      time: Date.now()
    }
  }

  return { count, increment }
})