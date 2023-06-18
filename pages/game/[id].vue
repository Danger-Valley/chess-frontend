<template>
  <div class="page">
    <GamePlayer
      class="player"
      :player="playerOpponent"
    ></GamePlayer>

    <main class="main">
      <aside class="aside chat">
        <div class="aside__heading aside__heading--uppercase">Chat (in dev)</div>
        <div class="aside__divider"></div>
      </aside>

      <TheChessboard
        @move="afterMove"
        v-if="canInit"
        :board-config="boardConfig"
        reactive-config
        @board-created="(api) => (boardAPI = api)"
        :player-color="playerMe?.color == 'w' ? 'white' : 'black'"
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

    <PopupsGameBeginsPopup
      :me="playerMe"
      :opponent="playerOpponent"
    ></PopupsGameBeginsPopup>
    <PopupsGameChooseFigurePromotionPopup></PopupsGameChooseFigurePromotionPopup>
  </div>
</template>

<script setup>
import DropdownArrowIcon from "@/assets/imgs/dropdownArrow.svg"
import { TheChessboard } from 'vue3-chessboard';
import 'vue3-chessboard/style.css';
import '@/assets/styles/chess.css';
import { useSocketStore } from "~/stores/socket";

let { $API } = useNuxtApp();

const store = useSocketStore()

let boardConfig = reactive({}),
  turns = ref([]),
  canInit = ref(false),
  game = ref(),
  playerMe = ref(),
  playerOpponent = ref(),
  boardAPI = ref()

const afterMove = async (e) => {
  console.log(e)
  if(e.color !== playerMe.value?.color) return;
  await $API().Chess.move({
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

  store.emit('room', JSON.stringify({ gameId: body.game.id }))

  store.listen('game_event', async (resp) => {
    console.log(resp)
    if (resp.type == 'GAME_MOVE' && resp.gameId == body.game.id && resp.payload?.color !== playerMe.value?.color) {
      boardAPI.value.move(resp.payload.move);
    }
    else if (resp.type == 'GAME_START') {
      resp = await $API().Chess.get({
        id: resp.gameId,
        accessToken: localStorage.getItem('accessToken')
      })
      body = await resp.json();
      if (body.game.playerOne.joined && body.game.playerOne.user.id == meBody.user.id) {
        playerMe.value = body.game.playerOne;
        if (body.game.playerTwo.joined) playerOpponent.value = body.game.playerTwo;
      }
      else if (body.game.playerTwo.joined && body.game.playerTwo.user.id == meBody.user.id) {
        playerMe.value = body.game.playerTwo;
        if (body.game.playerOne.joined) playerOpponent.value = body.game.playerOne;
      }
    }
  })

  boardConfig = {
    fen: body.game.state.fen,
    orientation: playerMe.value?.color == 'w' ? 'white' : 'black',
    viewOnly: false,
    movable: {
      free: false,
      color: playerMe.value?.color == 'w' ? 'white' : 'black'
    },
    events: {
      move: (from, to, capture) => {
        console.log(from, to, capture)
      }
    }
  }

  canInit.value = true;
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

  &__counter {
    color: #FFFFFF4d;
  }

  &__item {
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