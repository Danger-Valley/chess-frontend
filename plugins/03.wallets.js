import "solana-wallets-vue/styles.css";
import SolanaWallets, { useWallet } from "solana-wallets-vue";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  BraveWalletAdapter,
  WalletConnectWalletAdapter
} from "@solana/wallet-adapter-wallets";
import base58 from "bs58";
import { useUserStore } from "~/stores/user";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new BraveWalletAdapter(),
    //new WalletConnectWalletAdapter()
  ],
  autoConnect: false,
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SolanaWallets, walletOptions);
  let { publicKey, signMessage } = useWallet();

  return {
    provide: {
      async connectWallet(blockchain = 'SOLANA') {
        let resp = await nuxtApp.$API().Signatures.create({
          blockchain,
          walletAddress: publicKey.value,
          signatureType: 'LOGIN',
          accessToken: localStorage.getItem('accessToken')
        })
        let body = await resp.json();
        console.log(body)

        if (body.errors) {
          console.error(body);
          return false;
        }

        let enc = new TextEncoder()
        let signedMessageArr = await signMessage.value(enc.encode(body.message))
        const signedMessage = base58.encode(signedMessageArr);

        if(!signedMessage) return false;

        resp = await nuxtApp.$API().Wallet.connect({
          blockchain,
          walletAddress: publicKey.value,
          signatureId: body.id,
          signature: signedMessage,
          signatureType: 'LOGIN',
          accessToken: localStorage.getItem('accessToken'),
          userId: localStorage.getItem('userId')
        })
        body = await resp.json();

        console.log(body)
        if (body.errors) {
          console.error(body);
          return false;
        }
        await nuxtApp.$getWallets();
        return true;
      },
      async disconnectWallet(id){
        let resp = await nuxtApp.$API().Wallet.disconnect({
          id,
          accessToken: localStorage.getItem('accessToken'),
          userId: localStorage.getItem('userId')
        })
        let body = await resp.json();
        console.log(body);
        await nuxtApp.$getWallets();
      },
      async getWallets(){
        let resp = await nuxtApp.$API().Wallet.get({
          accessToken: localStorage.getItem('accessToken'),
          userId: localStorage.getItem('userId')
        });
        let body = await resp.json();
        console.log(body);
        useUserStore().saveWallets(body.wallets);
      },
      formatWallet(walletAddress){
        if(!walletAddress) return;
        return `${walletAddress?.slice(0,4)}...${walletAddress?.slice(-4)}`
      }
    }
  }
});