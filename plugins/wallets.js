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

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new BraveWalletAdapter(),
    //new WalletConnectWalletAdapter()
  ],
  autoConnect: true,
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
        // console.log(signedMessage, signedMessage.toString())

        const buffer = Buffer.from(signedMessageArr);
        const signedMessage = buffer.toString('base64');
        console.log('signedMessage', signedMessage);

        if(!signedMessage) return false;

        resp = await nuxtApp.$API().Wallet.connect({
          blockchain,
          walletAddress: publicKey.value,
          signatureId: body.id,
          signature: signedMessage,
          signatureType: 'LOGIN',
          accessToken: localStorage.getItem('accessToken')
        })
        body = await resp.json();

        console.log(body)
        if (body.errors) {
          console.error(body);
          return false;
        }

        return true;
      }
    }
  }
});