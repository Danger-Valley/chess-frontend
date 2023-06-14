<template>
  <div class="page">
    <GamePlayer
      class="player"
      :player="playerOpponent"
    ></GamePlayer>

    <main class="main">
      <aside class="aside chat">
        <div class="aside__heading aside__heading--uppercase">Chat</div>
        <div class="aside__divider"></div>

        <div
          class="control"
          :class="{ 'control--reply': reply }"
        >
          <template v-if="connected">
            <div class="reply">
              <svg
                class="reply__close"
                @click="reply = null"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 13L13 1"
                  stroke="#5C5E72"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13 13L1 1"
                  stroke="#5C5E72"
                  stroke-width="1.25"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>


              <svg
                class="reply__sign"
                width="12"
                height="9"
                viewBox="0 0 12 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.75 8C10.75 8.27614 10.9739 8.5 11.25 8.5C11.5261 8.5 11.75 8.27614 11.75 8L10.75 8ZM0.396446 3.39644C0.201184 3.5917 0.201184 3.90829 0.396446 4.10355L3.57843 7.28553C3.77369 7.48079 4.09027 7.48079 4.28553 7.28553C4.4808 7.09027 4.4808 6.77368 4.28553 6.57842L1.45711 3.74999L4.28553 0.921567C4.4808 0.726305 4.4808 0.409722 4.28553 0.21446C4.09027 0.0191981 3.77369 0.0191981 3.57843 0.21446L0.396446 3.39644ZM11.75 8L11.75 6.74999L10.75 6.74999L10.75 8L11.75 8ZM8.25 3.24999L0.75 3.24999L0.75 4.24999L8.25 4.24999L8.25 3.24999ZM11.75 6.74999C11.75 4.817 10.183 3.24999 8.25 3.24999L8.25 4.24999C9.63071 4.24999 10.75 5.36928 10.75 6.74999L11.75 6.74999Z"
                  fill="#5C5E72"
                />
              </svg>

              <div
                class="reply__nickname"
                :title="reply?.profile?.nickname"
              >{{ reply?.profile?.nickname ? `${reply?.profile?.nickname}:` : '' }}</div>
              <div
                class="reply__message"
                :title="reply?.text"
              >{{ reply?.text }}</div>
              <div class="reply__divider"></div>
            </div>
            <div class="control__field">
              <input
                class="control__message"
                v-model="yourMessage"
                placeholder="Your message"
              />
              <div
                @click="sendMessage"
                class="control__send"
              >
                <svg
                  width="12"
                  height="11"
                  viewBox="0 0 12 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 1C10.5 0.723858 10.7239 0.5 11 0.5C11.2761 0.5 11.5 0.723858 11.5 1L10.5 1ZM0.646447 7.35355C0.451185 7.15829 0.451185 6.84171 0.646447 6.64645L3.82843 3.46447C4.02369 3.2692 4.34027 3.2692 4.53553 3.46447C4.7308 3.65973 4.7308 3.97631 4.53553 4.17157L1.70711 7L4.53553 9.82843C4.7308 10.0237 4.7308 10.3403 4.53553 10.5355C4.34027 10.7308 4.02369 10.7308 3.82843 10.5355L0.646447 7.35355ZM11.5 1L11.5 4L10.5 4L10.5 1L11.5 1ZM8 7.5L1 7.5L1 6.5L8 6.5L8 7.5ZM11.5 4C11.5 5.933 9.933 7.5 8 7.5L8 6.5C9.38071 6.5 10.5 5.38071 10.5 4L11.5 4Z"
                    fill="#19D492"
                  />
                </svg>
              </div>
            </div>
          </template>
          <div
            class="control__click"
            v-else
          >
            <svg
              width="12"
              height="14"
              viewBox="0 0 12 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.99902 5.80125V4.60103C2.99902 2.60548 3.49902 1 5.99902 1C8.49902 1 8.99901 2.60548 8.99901 4.60103V5.80125"
                stroke="currentColor"
                stroke-width="1.14317"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.5 13.0009H3.5C1.5 13.0009 1 12.4007 1 10.0001V8.79966C1 6.39899 1.5 5.79883 3.5 5.79883H8.5C10.5 5.79883 11 6.39899 11 8.79966V10.0001C11 12.4007 10.5 13.0009 8.5 13.0009Z"
                stroke="currentColor"
                stroke-width="1.14317"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <ellipse
                cx="6.00039"
                cy="9.33843"
                rx="1.36367"
                ry="1.40288"
                fill="currentColor"
              />
            </svg>
            Connect wallet to talk
          </div>
        </div>
      </aside>

      <TheChessboard
        @move="afterMove"
        v-if="canInit"
        :board-config="boardConfig"
        @board-created="(api) => (boardAPI = api)"
        :player-color="playerMe.value?.color == 'w' ? 'white' : 'black'"
      />

      <aside class="aside info">
        <div class="aside__heading">
          Information
          <DropdownArrowIcon></DropdownArrowIcon>
        </div>
        <div class="aside__divider"></div>
        <div class="aside__heading">
          History
          <DropdownArrowIcon class="rotated"></DropdownArrowIcon>
        </div>
        <div
          class="turn"
          v-for="(turn, counter) in turns"
        >
          <div class="turn__counter">{{ counter }}.</div>
          <div class="turn__item">{{ turn.from }}</div>
          <div class="turn__item">{{ turn.to }}</div>
        </div>

        <div class="aside__divider aside__divider--bottom"></div>
        <div class="panel">
          <div class="panel__container">
            <img class="panel__icon" />
          </div>

          <div class="panel__container">
            <img class="panel__icon" />
          </div>

          <div class="panel__container">
            <img class="panel__icon" />
          </div>

          <div class="panel__container">
            <img class="panel__icon" />
          </div>

          <div class="panel__container">
            <img class="panel__icon" />
          </div>

          <div class="panel__container">
            <img class="panel__icon" />
          </div>
        </div>
      </aside>
    </main>

    <GamePlayer
      class="player"
      :player="playerMe"
    ></GamePlayer>

    <PopupsGameBeginsPopup :game="game"></PopupsGameBeginsPopup>
    <PopupsGameChooseFigurePromotionPopup></PopupsGameChooseFigurePromotionPopup>
  </div>
</template>

<script setup>
import DropdownArrowIcon from "@/assets/imgs/dropdownArrow.svg"
import { useWallet } from "solana-wallets-vue";
import { TheChessboard } from 'vue3-chessboard';
import '@/assets/styles/chess.css';
import { useSocketStore } from "~/stores/socket";

let { $API } = useNuxtApp();

const { publicKey, wallet, disconnect, connected } = useWallet();

const store = useSocketStore()

const socket = computed(() => store.socketGetter)

let boardConfig = ref({}),
  reply = ref(),
  turns = ref([]),
  canInit = ref(false),
  game = ref(),
  playerMe = ref(),
  playerOpponent = ref(),
  boardAPI = ref()

const afterMove = (e) => {
  console.log(e)
  $API().Chess.move({
    id: useRoute().params.id,
    move: e.san,
    accessToken: localStorage.getItem('accessToken')
  })
  turns.value.push({
    from: e.from,
    to: e.to
  })
}

const join = async () => {
  let resp = await $API().Chess.join({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();
  console.log(body);
  return body;
}

onMounted(async () => {
  let resp = await $API().Chess.get({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();
  console.log(resp, body)
  game.value = body.game;

  body = await join();

  let meResp = await $API().User.get(localStorage.getItem('accessToken'))
  let meBody = await meResp.json();
  console.log(meBody, body.game.playerOne, body.game.playerTwo)

  if (body.game.playerOne.joined && body.game.playerOne.user.id == meBody.user.id) {
    playerMe.value = body.game.playerOne;
    if (body.game.playerTwo.joined) playerOpponent.value = body.game.playerTwo;
  }
  else if (body.game.playerTwo.joined && body.game.playerTwo.user.id == meBody.user.id) {
    playerMe.value = body.game.playerTwo;
    if (body.game.playerOne.joined) playerOpponent.value = body.game.playerOne;
  }

  console.log(playerMe.value, playerOpponent.value);

  boardConfig.value = {
    fen: body.game.state.fen,
    orientation: playerMe.value?.color == 'w' ? 'white' : 'black',
    movable: {
      free: false,
      color: playerMe.value?.color == 'w' ? 'white' : 'black'
      //color: 
    },
    events: {
      move: (from, to, capture) => {
        console.log(from, to, capture)
      }
    }
  }

  canInit.value = true;

  store.emit('room', JSON.stringify({ gameId: body.game.id }))

  store.listen('game_event', (resp) => {
    console.log(resp)
    if(resp.type == 'GAME_MOVE' && resp.gameId == body.game.id){
      // it will throw an error but also MAKE move - to investigate later 
      boardAPI.value.move(resp.payload.move)
    }
  })
})
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: 283px auto 283px;
  grid-template-rows: 35px auto 35px;
  gap: 25px 20px;
  padding: 20px 33px;
  background-color: #181B20;
}

.main {
  grid-row: 2;
  grid-column: span 3;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
}

.aside {
  display: flex;
  flex-direction: column;
  grid-column: span 1;
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(50px);

  &__heading {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-family: 'Neue Plak';
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #FFFFFF;

    &--uppercase {
      text-transform: uppercase;
    }
  }

  &__divider {
    width: 100%;
    height: 1px;
    margin: 7px 0;
    background-color: #3A3D40;

    &--bottom {
      margin-top: auto;
    }
  }
}

.turn {
  display: flex;
  gap: 30px;
  
  font-family: 'Neue Plak';
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  &__counter{
    color: #FFFFFF4d;
  }
  &__item{
    width: 40%;
    color: #FFFFFF;
  }
}

.player {
  grid-column: 2;
}

.panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &__container {
    width: 39px;
    aspect-ratio: 1;
    background: #181B20;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.rotated {
  rotate: 90deg;
}
</style>