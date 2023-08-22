<template>
  <ClientOnly>
    <div class="page">

      <NuxtLink
        class="back-to-lobby"
        to="/lobby"
      >
        <ArrowIcon />
        Back to lobby
      </NuxtLink>

      <main class="main">
        <aside class="aside chat">
          <div class="aside__heading aside__heading--uppercase">Chat</div>
          <div class="aside__divider"></div>
          <div class="chat__messages">
            <div
              v-for="message in messages"
              class="message"
            >
              <div class="message__author">
                <template v-if="message.userId == 'system'">System message</template>
                <template v-else>
                  {{ message.userId == playerMe.id ? playerMe.user.username : playerOpponent.user.username }}
                </template>
              </div>
              <div class="message__text">{{ message.text }}</div>
            </div>
          </div>
          <ClientOnly>
            <div
              class="chat__inputField"
              v-if="userId && playerMe"
            >
              <input
                class="chat__input"
                type="text"
                placeholder="Your message"
                :disabled="userId !== playerMe.id"
              />
              <ChatSend
                class="chat__send"
                @click="sendMessage"
              />
            </div>
          </ClientOnly>
        </aside>

        <div class="playboard">
          <GamePlayer
            class="player"
            :player="playerOpponent"
            :timer="timer.opponent"
            :active="activeTimer == 'opponent'"
          ></GamePlayer>

          <TheChessboard
            @move="afterMove"
            v-if="canInit"
            :board-config="boardConfig"
            reactive-config
            @board-created="(api) => { (boardAPI = api); initAfterBoardCreated() }"
            :player-color="playerMe?.color == 'w' ? 'white' : 'black'"
          />

          <GamePlayer
            class="player"
            :player="playerMe"
            :timer="timer.me"
            :active="activeTimer == 'me'"
          ></GamePlayer>
        </div>

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
          <div class="turns">
            <div
              class="turn"
              v-for="(turn, counter) in turns"
            >
              <div
                class="turn__counter"
                v-if="counter % 2 == 0"
              >{{ counter / 2 + 1 }}.</div>
              <div
                class="turn__item"
                :class="{ 'turn__item--active': counter == activeTurnIndex - 1 }"
              >{{ turn }}</div>
            </div>
          </div>

          <div class="aside__divider aside__divider--bottom"></div>
          <div class="panel">
            <div
              class="panel__container panel__container--hint"
              @click="hints == 0 ? $togglePopup('GameHintsShopPopup') : $togglePopup('GameHintPopup')"
            >
              <Lightbulb class="panel__icon" />
              <span>{{ hints }}</span>
            </div>

            <div
              class="panel__container"
              @click="$togglePopup('GameConfirmDrawPopup')"
            >
              <OneSlashTwo class="panel__icon" />
            </div>

            <div
              class="panel__container"
              @click="$togglePopup('GameResignPopup')"
            >
              <Flag
                class="panel__icon"
                style="height: 100%; padding: 11px;"
              />
            </div>

            <div
              class="panel__container"
              :class="{ 'panel__container--inactive': turns.length == 0 || activeTurnIndex == 0 }"
              @click="stepHistory(-2)"
            >
              <BackAll class="panel__icon" />
            </div>

            <div
              class="panel__container"
              :class="{ 'panel__container--inactive': turns.length == 0 || activeTurnIndex == 0 }"
              @click="stepHistory(-1)"
            >
              <BackOne class="panel__icon" />
            </div>

            <div
              class="panel__container"
              :class="{ 'panel__container--inactive': turns.length == 0 || activeTurnIndex == turns.length }"
              @click="stepHistory(1)"
            >
              <ForwardOne class="panel__icon" />
            </div>

            <div
              class="panel__container"
              :class="{ 'panel__container--inactive': turns.length == 0 || activeTurnIndex == turns.length }"
              @click="stepHistory(2)"
            >
              <ForwardAll class="panel__icon" />
            </div>
          </div>
        </aside>
      </main>

      <PopupsGameBegins
        :me="playerMe"
        :opponent="playerOpponent"
        :show="showBegins"
        :game="game"
      ></PopupsGameBegins>
      <PopupsGameEnds
        :isViewer="isViewer"
        :me="playerMe"
        :opponent="playerOpponent"
        :whoWon="whoWon"
        @find-game="$togglePopup('GameSettingsPopup')"
      />
      <PopupsGameConfirmDraw v-if="!isViewer" />
      <PopupsGameIncomeDraw
        v-if="!isViewer"
        :opponent="playerOpponent"
      />
      <PopupsGameHintsShop
        @update="getHints"
        v-if="!isViewer"
      />
      <PopupsGameHint
        :hints="hints"
        @hint="useHint"
        v-if="!isViewer"
      />
      <PopupsGameResign v-if="!isViewer" />
      <PopupsGameConfirmRevenge
        :opponent="playerOpponent"
        v-if="!isViewer"
      />
      <PopupsGameIncomeRevenge
        :opponent="playerOpponent"
        v-if="!isViewer"
      />
      <PopupsLobbySearch
        ref="GameSearchPopupRef"
        v-if="!isViewer"
      />
      <PopupsLobbySettings
        ref="GameSettingsPopupRef"
        @play-now="openGameSearchPopup"
        v-if="!isViewer"
      />
      <PopupsSignIn></PopupsSignIn>
    </div>
  </ClientOnly>
</template>

<script setup>
import { TheChessboard } from 'vue3-chessboard';
import 'vue3-chessboard/style.css';
import '@/assets/styles/chess.css';
import { useSocketStore } from "~/stores/socket";

import ArrowIcon from "@/assets/imgs/Arrow.svg"
import ChatSend from "@/assets/imgs/chatSend.svg"
import DropdownArrowIcon from "@/assets/imgs/dropdownArrow.svg"
import Lightbulb from "@/assets/imgs/lightbulb.svg"
import OneSlashTwo from "@/assets/imgs/1slash2.svg"
import Flag from "@/assets/imgs/flag.svg"
import BackAll from "@/assets/imgs/backAll.svg"
import BackOne from "@/assets/imgs/backOne.svg"
import ForwardAll from "@/assets/imgs/forwardAll.svg"
import ForwardOne from "@/assets/imgs/forwardOne.svg"
import { useUserStore } from '~/stores/user';

useHead({
  title: 'Play Chess online for Free with Friends, Family, or AI - xChess',
  meta: [
    {
      property: 'og:title',
      content: 'Play Chess online for Free with Friends, Family, or AI - xChess'
    }, {
      property: 'twitter:title',
      content: 'Play Chess online for Free with Friends, Family, or AI - xChess'
    }, {
      property: 'description',
      content: 'xChess - web3-powered community-driven chess platform on Solana blockchain'
    }, {
      property: 'og:description',
      content: 'xChess - web3-powered community-driven chess platform on Solana blockchain'
    }, {
      property: 'og:url',
      content: 'xchess.io' + useRequestURL().pathname
    }
  ]
})

let { $togglePopup, $API, $showToast } = useNuxtApp();

const store = useSocketStore(),
  user = useUserStore()

let boardConfig = reactive({}),
  turns = ref([]),
  activeTurnIndex = ref(0),
  canInit = ref(false),
  game = ref(),
  playerMe = ref(),
  playerOpponent = ref(),
  boardAPI = ref(),
  whoWon = ref(),
  timer = ref({
    me: null,
    opponent: null
  }),
  timeAddedPerMove = 0,
  beginTime = null,
  timerMeInterval = null,
  timerOpponentInterval = null,
  activeTimer = ref(),
  messages = ref([]),
  userId = computed(() => user.getUser.value?.id),
  lastTimeForInterval = null,
  lastTimerValue = null,
  GameSearchPopupRef = ref(),
  GameSettingsPopupRef = ref(),
  showBegins = ref(false),
  isViewer = ref(true),
  doTriggerAfterMove = false,
  hints = ref(0)

const openGameSearchPopup = async () => {
  //localStorage.setItem('autoJoin', true);
  $togglePopup('GameSearchPopup')
  GameSearchPopupRef.value.startTimeTracking()
  let body = {
    mode: GameSettingsPopupRef.value.gameMode,
    accessToken: localStorage.getItem('accessToken'),
    everyoneCanJoin: GameSettingsPopupRef.value.playWith == 0
  }
  if (GameSettingsPopupRef.value.color) body = {
    ...body,
    color: GameSettingsPopupRef.value.color
  }
  let resp = await $API().Chess.find_create(body);
  body = await resp.json();
  console.log(body);
  await navigateTo({
    params: {
      id: body.game.id
    }
  })
}

const getMessages = async () => {
  let resp = await $API().Chat.get({
    gameId: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();
  console.log(body);

  if (body.errors) return console.error(body.errors);

  messages.value = body.messages;
}

const sendMessage = async () => {
  let text = document.querySelector('.chat__input').value;

  if (!text) return console.error("Enter your message first!");

  let resp = await $API().Chat.send({
    text,
    gameId: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();
  console.log(body);

  if (body.errors) return console.error(body.errors);

  document.querySelector('.chat__input').value = "";
  document.querySelector('.chat__messages').scrollBy(0, 100000)
}

const stepHistory = async (step) => {
  if (!boardAPI.value) return;

  console.log(step, activeTurnIndex.value, turns.value.length)

  if (step == 2) {
    activeTurnIndex.value = turns.value.length;
    return boardAPI.value.stopViewingHistory()
  }
  else if (step == 1) {
    activeTurnIndex.value = Math.min(activeTurnIndex.value + 1, turns.value.length);
    return boardAPI.value.viewNext()
  }
  else if (step == -1) {
    activeTurnIndex.value = Math.max(activeTurnIndex.value - 1, 0);
    return boardAPI.value.viewPrevious()
  }
  else if (step == -2) {
    activeTurnIndex.value = 0;
    return boardAPI.value.viewStart()
  }
}

const afterMove = async (e) => {
  console.log("After move:", e)
  if (!doTriggerAfterMove) return false;
  turns.value.push(e.san);
  boardAPI.value.stopViewingHistory()
  activeTurnIndex.value = turns.value.length;
  if (e.color !== playerMe.value?.color) return;
  await $API().Chess.move({
    id: useRoute().params.id,
    move: e.san,
    accessToken: localStorage.getItem('accessToken')
  })
}

const join = async () => {
  let resp = await $API().Chess.join({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();
  if (body.errors) {
    console.error(body.errors[0].message)
    return null
  }
  console.log("Join: ", body);
  return body;
}

const timerMeFunc = () => {
  clearInterval(timerOpponentInterval)
  if (timer.value.me > 100) timer.value.me = Math.max(lastTimerValue - (new Date() - lastTimeForInterval), 0) || 0;
  else {
    clearInterval(timerOpponentInterval)
    clearInterval(timerMeInterval)
    timer.value.me = 0;
    boardConfig.viewOnly = true;
  }
}

const timerOpponentFunc = () => {
  clearInterval(timerMeInterval)
  if (timer.value.opponent > 100) timer.value.opponent = Math.max(lastTimerValue - (new Date() - lastTimeForInterval), 0) || 0;
  else {
    clearInterval(timerOpponentInterval)
    clearInterval(timerMeInterval)
    timer.value.opponent = 0;
    boardConfig.viewOnly = true;
  }
}

const getHints = async () => {
  let resp = await $API().User.getPaymentProfile(localStorage.getItem('accessToken'));
  let body = await resp.json();
  console.log(body);
  hints.value = body?.user?.hintsCount || 0;
}

const useHint = async (e) => {
  hints.value = e.user.hintsCount;
  boardAPI.value.drawMove(e.from, e.to, 'blue');
  await getHints();
}

const tryHint = () => {
  console.log('draw move e4')
  boardAPI.value.drawMove('e4', 'e6', 'blue');
}

onMounted(async () => {
  // get my user
  let meResp, meBody;
  if (localStorage.getItem('accessToken')) {
    meResp = await $API().User.get(localStorage.getItem('accessToken'))
    meBody = await meResp.json();
  }

  await getHints();

  // socket func
  store.listen('game_event', async (resp) => {
    console.log("Game event:", resp)
    if (resp.type == 'GAME_MOVE' && resp.gameId == game.value.id) {
      console.log(resp.payload.playerId, playerMe.value.id, playerOpponent.value.id)
      if (resp.payload?.color !== playerMe.value?.color) boardAPI.value.move(resp.payload.move);

      if (resp.payload.playerId == playerMe.value.id) {
        timer.value.me =
          // 3600 * 1000
          (game.value.config.timeForGame * 1000) -
          (new Date(resp.payload.createdAt) - new Date(game.value.startedAt)) +
          (timeAddedPerMove * 1000) -
          // minus 100 - because interval is not immediate
          100 +
          // 'restore' from opponent's time
          (game.value.config.timeForGame * 1000 - timer.value.opponent);
        clearInterval(timerMeInterval)
        timerOpponentInterval = setInterval(timerOpponentFunc, 100)
        activeTimer.value = 'opponent'
        lastTimerValue = timer.value.opponent
      }
      else if (resp.payload.playerId == playerOpponent.value.id) {
        timer.value.opponent =
          // 3600 * 1000
          (game.value.config.timeForGame * 1000) -
          (new Date(resp.payload.createdAt) - new Date(game.value.startedAt)) +
          (timeAddedPerMove * 1000) -
          // minus 100 - because interval is not immediate
          100 +
          // 'restore' from opponent's time
          (game.value.config.timeForGame * 1000 - timer.value.me);
        clearInterval(timerOpponentInterval)
        timerMeInterval = setInterval(timerMeFunc, 100)
        activeTimer.value = 'me'
        lastTimerValue = timer.value.me
      }
      lastTimeForInterval = new Date(resp.payload.createdAt)
      console.log(timerMeInterval, timerOpponentInterval, activeTimer.value, lastTimerValue)
    }
    else if (resp.type == 'GAME_START') {
      resp = await $API().Chess.get({
        id: resp.gameId,
        accessToken: localStorage.getItem('accessToken')
      })
      body = await resp.json();
      game.value = body.game;
      if (body.game.playerOne.joined && body.game.playerOne.user.id == meBody.user.id) {
        playerMe.value = body.game.playerOne;
        if (body.game.playerTwo.joined) playerOpponent.value = body.game.playerTwo;
      }
      else if (body.game.playerTwo.joined && body.game.playerTwo.user.id == meBody.user.id) {
        playerMe.value = body.game.playerTwo;
        if (body.game.playerOne.joined) playerOpponent.value = body.game.playerOne;
      }

      beginTime = body.game.startedAt;
      lastTimeForInterval = new Date(beginTime);

      console.log("Turn, mine color, opponent's color:", body.game.state.turn, playerMe.value.color, playerOpponent.value.color)

      if (body.game.state.turn == playerMe.value.color) {
        lastTimerValue = timer.value.me
        if (timer.value.me >= game.value.config.timeForGame * 1000 - 2000) {
          setTimeout(() => {
            timerMeInterval = setInterval(timerMeFunc, 100)
            activeTimer.value = 'me'
          }, 5000)
        }
        else {
          timerMeInterval = setInterval(timerMeFunc, 100)
          activeTimer.value = 'me'
        }
      }
      else if (body.game.state.turn == playerOpponent.value.color) {
        lastTimerValue = timer.value.opponent
        if (timer.value.opponent >= game.value.config.timeForGame * 1000 - 2000) {
          setTimeout(() => {
            timerOpponentInterval = setInterval(timerOpponentFunc, 100)
            activeTimer.value = 'opponent'
          }, 5000)
        }
        else {
          timerOpponentInterval = setInterval(timerOpponentFunc, 100)
          activeTimer.value = 'opponent'
        }
      }
    }
    else if (resp.type == 'GAME_END') {
      //TODO test
      if (resp.payload.isDraw) return whoWon.value = 'draw';
      else {
        if (playerMe.value.id == resp.payload.winnerUserId) whoWon.value = 'me';
        else if (playerOpponent.value.id == resp.payload.winnerUserId) whoWon.value = 'opponent';
      }

      clearInterval(timerMeInterval)
      clearInterval(timerOpponentInterval)
      activeTimer.value = null
      boardConfig.viewOnly = true;
    }
    else if (!isViewer.value && resp.type == 'OFFER_DRAW') {
      $togglePopup("GameIncomeDrawPopup")
    }
    else if (!isViewer.value && resp.type == 'OFFER_REVENGE') {
      $togglePopup('GameIncomeRevengePopup')
    }
    else if (!isViewer.value && resp.type == 'OPEN_GAME') {
      navigateTo({
        params: {
          id: resp.payload.gameId
        }
      })
    }
  })

  store.listen('chat_message', (resp) => {
    messages.value.push(resp);
    nextTick(() => {
      document.querySelector('.chat__messages').scrollBy(0, 100000)
    })
  })

  store.emit('room', JSON.stringify({ gameId: useRoute().params.id }))

  // get game. If connected by find_create - it autojoins (on server)
  let resp = await $API().Chess.get({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();
  console.log("Get game:", JSON.parse(JSON.stringify(body)))
  game.value = body.game;

  if (
    body.game.playerOne.joined &&
    body.game.playerTwo.joined &&
    !(body.game.playerOne.id == localStorage.getItem('userId') || body.game.playerTwo.id == localStorage.getItem('userId'))
  ) console.error('Two players have already joined the game');
  else if (localStorage.getItem('accessToken') && (!body.game.playerOne.joined || !body.game.playerTwo.joined)) {
    let joinBody = await join();
    if (joinBody) body = joinBody;
    game.value = body.game;
  }

  beginTime = body.game.startedAt;
  lastTimeForInterval = new Date(beginTime);

  // basic timer values
  timer.value = {
    me: game.value.config.timeForGame * 1000,
    opponent: game.value.config.timeForGame * 1000
  }
  timeAddedPerMove = game.value.config.timeAddedPerMove;

  isViewer.value = true;
  // connected players to local vars
  if (meBody && body.game.playerOne.joined && body.game.playerOne.user.id == meBody.user.id) {
    playerMe.value = body.game.playerOne;
    if (body.game.playerTwo.joined) playerOpponent.value = body.game.playerTwo;
    isViewer.value = false;
  }
  else if (meBody && body.game.playerTwo.joined && body.game.playerTwo.user.id == meBody.user.id) {
    playerMe.value = body.game.playerTwo;
    if (body.game.playerOne.joined) playerOpponent.value = body.game.playerOne;
    isViewer.value = false;
  }
  // if connected as viewer
  else {
    console.error('CONNECTED AS VIEWER')
    if (Math.random() > .5) {
      playerMe.value = body.game.playerTwo;
      if (body.game.playerOne.joined) playerOpponent.value = body.game.playerOne;
    }
    else {
      playerMe.value = body.game.playerOne;
      if (body.game.playerTwo.joined) playerOpponent.value = body.game.playerTwo;
    }
    isViewer.value;

    if (game.status == "CREATED"){
      if (!body.game.playerOne.joined || !body.game.playerTwo.joined){
        $togglePopup('SignInPopup');
      }
    }

  }

  // set board config
  boardConfig = {
    //fen: body.game.state.fen,
    orientation: playerMe.value?.color == 'w' ? 'white' : 'black',
    coordinates: true,
    viewOnly: isViewer.value,
    movable: {
      free: false,
      color: playerMe.value?.color == 'w' ? 'white' : 'black'
    },
    events: {
      move: (from, to, capture) => {
        console.log(from, to, capture)
      }
    },
    drawable: {
      brushes: {
        blue: { key: 'b', color: '#1FA2F3', opacity: 1, lineWidth: 10 }
      }
    }
  }

  if (game.value.status == "CANCELED"){
    $showToast('Game canceled because of inactivity. Start a new game in Lobby.', 'error', 0)
  }

  canInit.value = true;
})

const initAfterBoardCreated = async () => {
  // calculate timer by counting moves and their timestamps
  console.warn("Moves:", game.value.moves.length)
  if (game.value.moves.length > 0) {
    let lastTime = beginTime;
    game.value.moves.map(el => {
      console.log(timer.value.me, timer.value.opponent, el.createdAt, lastTime)
      turns.value.push(el.move);
      activeTurnIndex.value++;
      if (el.playerId == playerMe.value.id) timer.value.me = timer.value.me - (new Date(el.createdAt) - new Date(lastTime))
      else if (el.playerId == playerOpponent.value.id) timer.value.opponent = timer.value.opponent - (new Date(el.createdAt) - new Date(lastTime))
      lastTime = el.createdAt;
      boardAPI.value.move(el.move);
    })

    if (game.value.moves.at(-1).playerId == playerMe.value.id) {
      //timer.value.opponent = timer.value.opponent - (new Date() - new Date(lastTime)) - 5000
      lastTimerValue = timer.value.opponent
    }
    else if (game.value.moves.at(-1).playerId == playerOpponent.value.id) {
      //timer.value.me = timer.value.me - (new Date() - new Date(lastTime)) - 5000
      lastTimerValue = timer.value.me
    }

    lastTimeForInterval = new Date(lastTime);
    console.log(timer.value.me, timer.value.opponent, new Date(lastTime))
  }

  console.log("Start timestamp", new Date())

  if (game.value.playerOne.joined && game.value.playerTwo.joined) {
    clearInterval(timerMeInterval)
    clearInterval(timerOpponentInterval)
    beginTime = game.value.startedAt;

    console.log("turn, mine color, opponent's color:", game.value.state.turn, playerMe.value.color, playerOpponent.value.color)

    let awaitFiveSec = true
    if (new Date(game.value.startedAt) - new Date() > 0) {
      showBegins.value = true;
      awaitFiveSec = false
    }

    setTimeout(() => {
      if (game.value.state.turn == playerMe.value.color) {
        lastTimerValue = timer.value.me
        console.log(timer.value.me, (new Date() - new Date(game.value.startedAt)), game.value.moves.length == 0)
        if (game.value.moves.length == 0) {
          timer.value.me = timer.value.me - (new Date() - new Date(game.value.startedAt));
        }
        console.log(game.value.status);
        console.error(timer.value.me, game.value.config.timeForGame * 1000 - 2000, timer.value.me >= game.value.config.timeForGame * 1000 - 2000, showBegins.value)
        if (game.value.status == 'FINISHED') {
          clearInterval(timerMeInterval)
          clearInterval(timerOpponentInterval)
          activeTimer.value = null
          $togglePopup('GameEndsPopup')
        }
        else if (timer.value.me >= game.value.config.timeForGame * 1000 - 2000 && timer.value.opponent >= game.value.config.timeForGame * 1000 - 2000) {
          setTimeout(() => {
            activeTimer.value = 'me'
            timerMeInterval = setInterval(timerMeFunc, 100)
          }, awaitFiveSec ? 5000 : 0)
          showBegins.value = true;
        }
        else {
          activeTimer.value = 'me'
          timerMeInterval = setInterval(timerMeFunc, 100)
          showBegins.value = false;
        }
      }
      else if (game.value.state.turn == playerOpponent.value.color) {
        lastTimerValue = timer.value.opponent
        console.log(timer.value.opponent, (new Date() - new Date(game.value.startedAt)), game.value.moves.length == 0)
        if (game.value.moves.length == 0) {
          timer.value.opponent = timer.value.opponent - (new Date() - new Date(game.value.startedAt));
        }
        console.log(game.value.status);
        console.error(timer.value.opponent, game.value.config.timeForGame * 1000 - 2000, timer.value.opponent >= game.value.config.timeForGame * 1000 - 2000, showBegins.value)
        if (game.value.status == 'FINISHED') {
          clearInterval(timerMeInterval)
          clearInterval(timerOpponentInterval)
          activeTimer.value = null
          $togglePopup('GameEndsPopup')
        }
        else if (timer.value.me >= game.value.config.timeForGame * 1000 - 2000 && timer.value.opponent >= game.value.config.timeForGame * 1000 - 2000) {
          setTimeout(() => {
            activeTimer.value = 'opponent'
            timerOpponentInterval = setInterval(timerOpponentFunc, 100)
          }, awaitFiveSec ? 5000 : 0)
          showBegins.value = true;
        }
        else {
          activeTimer.value = 'opponent'
          timerOpponentInterval = setInterval(timerOpponentFunc, 100)
          showBegins.value = false;
        }
      }
      // timing when game starts
    }, Math.max(0, new Date(game.value.startedAt) - new Date()))
  }
  else {
    showBegins.value = true;
  }

  doTriggerAfterMove = true;

  console.error(timer.value.me, timer.value.opponent)

  await getMessages();

  window.addEventListener("keydown", async (e) => {
    if (e.key == "Enter") await sendMessage();
  })

  if (game.value.state.isGameOver) {
    if (game.value.state.isDraw) return whoWon.value = 'draw';
    else {
      if (playerMe.value.id == game.value.state.winnerUserId) whoWon.value = 'me';
      else if (playerOpponent.value.id == game.value.state.winnerUserId) whoWon.value = 'opponent';
    }
  }
}

onUnmounted(() => {
  clearInterval(timerMeInterval)
  clearInterval(timerOpponentInterval)
})
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  grid-template-rows: 14px auto;
  grid-template-columns: max(230px, 18%) auto max(290px, 18%);
  gap: 25px 20px;
  padding: 20px 33px;
  background-color: $color-font;
}

.back-to-lobby {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  color: $color1;
  font-size: 14px;
  font-family: "Neue Plak";
  font-style: normal;
  font-weight: 400;
  line-height: 100%;
  text-transform: uppercase;

  svg {
    width: 8px;
    height: 8px;
    scale: -1 1;
  }
}

.main {
  grid-column: span 3;
  display: grid;
  grid-template-columns: inherit;
  gap: inherit;
}

.aside {
  display: flex;
  flex-direction: column;
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

.chat {
  grid-column: 1;

  &__messages {
    display: flex;
    flex-direction: column;
    overflow: auto;
    max-height: calc(100vh - (2 * 20px) - (2 * 10px) - 22px - 15px - 45px - 45px);
    gap: 20px;
  }

  &__input {
    width: calc(100% - 20px);
    background: transparent;
    border: unset;
    outline: unset;
    font-family: 'Neue Plak';
    font-size: 12px;
    color: #fff;

    &::placeholder {
      opacity: .3;
    }

    &Field {
      margin-top: auto;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      background: $color-font;
      padding: 13px;
    }
  }

  &__send {
    width: 19px;
    margin-left: auto;
    cursor: pointer;
  }
}

.message {
  font-family: "Neue Plak";

  &__author {
    font-size: 12px;
    color: #FFFFFF4d;
  }

  &__text {
    font-size: 14px;
    color: #FFF;
  }
}

.info {
  grid-column: 3;
}

.turn {
  &s {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
  }

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  font-family: 'Neue Plak';
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  &__counter {
    color: #FFFFFF4d;
  }

  &__item {
    width: 86px;
    color: #FFFFFF;
    border-radius: 10px;
    background: transparent;
    transition: .3s;
    padding: 5px 10px;

    &--active {
      background: rgba(255, 255, 255, 0.05);
    }
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
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 34px;
    aspect-ratio: 1;
    background: $color-font;
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;

    &--inactive {
      >svg {
        opacity: 0.3;
      }

      border-color: transparent;
    }

    &--hint {
      position: relative;
      display: block;
      background: $color1;

      >svg {
        position: absolute;
        right: 4px;
        top: 4px;
      }

      >span {
        position: absolute;
        left: 6px;
        bottom: 1px;
        color: $color-font;
        font-size: 12px;
        font-family: "Neue Plak";
      }
    }
  }
}

.playboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  margin: auto;
  width: min(100%, calc(100vh - 40px - (2 * (35px + 20px))) - 40px);
  height: calc(100vh - 40px - 40px);
}

.rotated {
  rotate: 90deg;
}

@media screen and (max-width: #{map-get($sizes, "tablet")-1 + px}) {
  .page {
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .back-to-lobby {
    display: none;
  }

  .main {
    display: flex;
    flex-direction: column;
  }

  .playboard {
    order: -1;
    height: auto;
  }

  .turns {
    margin-bottom: 5px;
  }
}
</style>