<template>
  <ClientOnly>
    <div
      class="page"
      :class="{ 'page--noOverflow': isChatToggledMobile }"
    >

      <NuxtLink
        class="back-to-lobby"
        to="/"
      >
        <ArrowIcon />
        Back to lobby
      </NuxtLink>

      <main class="main">
        <div class="header">
          <div
            class="header__openChat"
            @click="toggleChatMobile"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.4698 16.83L18.8598 19.99C18.9598 20.82 18.0698 21.4 17.3598 20.97L13.1698 18.48C12.7098 18.48 12.2599 18.45 11.8199 18.39C12.5599 17.52 12.9998 16.42 12.9998 15.23C12.9998 12.39 10.5398 10.09 7.49985 10.09C6.33985 10.09 5.26985 10.42 4.37985 11C4.34985 10.75 4.33984 10.5 4.33984 10.24C4.33984 5.68999 8.28985 2 13.1698 2C18.0498 2 21.9998 5.68999 21.9998 10.24C21.9998 12.94 20.6098 15.33 18.4698 16.83Z"
                fill="#181B20"
                stroke="#575D65"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13 15.2298C13 16.4198 12.56 17.5198 11.82 18.3898C10.83 19.5898 9.26 20.3598 7.5 20.3598L4.89 21.9098C4.45 22.1798 3.89 21.8098 3.95 21.2998L4.2 19.3298C2.86 18.3998 2 16.9098 2 15.2298C2 13.4698 2.94 11.9198 4.38 10.9998C5.27 10.4198 6.34 10.0898 7.5 10.0898C10.54 10.0898 13 12.3898 13 15.2298Z"
                fill="#181B20"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div
              class="header__newMessages"
              v-if="hasNewMessages"
            ></div>
          </div>
        </div>

        <aside
          class="aside chat"
          :class="{ 'chat--opened': isChatToggledMobile }"
        >
          <div class="aside__heading aside__heading--uppercase">
            Chat
            <div
              class="chat__close"
              @click.stop="toggleChatMobile"
            >Close</div>
          </div>
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

        <div id="right-panels">
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

            <div class="aside__headings--mobile">
              <div class="aside__heading--mobile aside__heading--mobile--active">History</div>
              <div class="aside__heading--mobile">Information</div>
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
                v-if="!isViewer"
                class="panel__container"
                @click="$togglePopup('GameConfirmDrawPopup')"
              >
                <OneSlashTwo class="panel__icon" />
              </div>

              <div
                v-if="!isViewer"
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
          <aside class="aside hints">
            <div class="aside__heading">
              Hints from AI
              <span class="hints__mobile">{{ hints }} hints</span>
            </div>
            <div class="aside__divider"></div>
            <div class="hints__text">
              You have {{ hints }} hints. You can use them on your
              move in any game. AI will analyze the board and give the move suggestion.
            </div>
            <div class="hints__actions">
              <div
                class="btn btn--blue"
                @click="hints == 0 ? openGameHintsShopPopup() : $togglePopup('GameHintPopup')"
              >Use hint</div>
              <div
                class="btn"
                @click="openGameHintsShopPopup()"
              >Buy hints</div>
            </div>
          </aside>
        </div>
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
        :isEvent="!!game?.eventId"
        @find-game="game?.eventId ? searchEventGame() : $togglePopup('GameSettingsPopup')"
      />
      <PopupsGameConfirmDraw v-if="!isViewer" />
      <PopupsGameIncomeDraw
        v-if="!isViewer"
        :opponent="playerOpponent"
      />
      <PopupsGameHintsShopAsync
        @update="getHints"
        v-if="!isViewer && PopupsGameHintsShopAsync"
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
    
    <audio id="chess-move" style="display: hidden;">
      <source src="@/assets/chess_move.mp3" type="audio/mp3" />
    </audio>
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
  hints = ref(0),
  isChatToggledMobile = ref(false),
  hasNewMessages = ref(false),
  canLoadComponent = ref(false),
  socketMove = false,
  PopupsGameHintsShopAsync = defineAsyncComponent({
    loader: async () => import('~/components/Popups/Game/HintsShop.vue'),
    delay: 0
  })

const openGameHintsShopPopup = () => {
  if (!canLoadComponent.value) canLoadComponent.value = true;

  nextTick(() => {
    $togglePopup('GameHintsShopPopup')
  })
}

const searchEventGame = async () => {
  // if it is event game
  console.log(game.value.eventId)
  let resp = await $API().Chess.initEventGame({
    id: game.value.eventId,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();
  console.log(body);
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
  await navigateTo(`/game/${body.game.id}`)
}

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
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
  await navigateTo({
    params: {
      id: body.game.id
    }
  })
}

const toggleChatMobile = () => {
  isChatToggledMobile.value = !isChatToggledMobile.value;
  hasNewMessages.value = false;
}

const getMessages = async () => {
  let resp = await $API().Chat.get({
    gameId: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();
  console.log(body);

  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }

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

  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }

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
  document.querySelector('#chess-move')?.play();
  console.log("After move:", e)

  if (!doTriggerAfterMove) return false;

  turns.value.push(e.san);

  boardAPI.value.stopViewingHistory()
  activeTurnIndex.value = turns.value.length;

  // was if (e.color !== playerMe.value?.color || isViewer.value)
  if (socketMove) return socketMove = false;
  let resp = await $API().Chess.move({
    id: useRoute().params.id,
    move: e.san,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();

  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
}

const join = async () => {
  let resp = await $API().Chess.join({
    id: useRoute().params.id,
    accessToken: localStorage.getItem('accessToken')
  })
  let body = await resp.json();
  if (body.errors) {
    console.error(body.errors[0].message)
    return $showToast(body.errors[0].message, 'error')
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
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    let resp = await $API().User.getPaymentProfile(accessToken);
    let body = await resp.json();
    console.log(body);
    if (body.errors) {
      return $showToast(body.errors[0].message, 'error')
    }
    hints.value = body?.user?.hintsCount || 0;
  }
  else {
    hints.value = 0;
  }
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
  window.addEventListener('freeze', (event) => {
    console.log('freeze', event);
  }, { capture: true });

  window.addEventListener('resume', (event) => {
    console.log('resume', event);
    console.warn(`Is socket connected? ${store.socketGetter.connected}`)
    if (!store.socketGetter.connected && process.client) {
      setTimeout(() => {
        console.warn(`Is socket connected? ${store.socketGetter.connected} - reloading`)
        if (!store.socketGetter.connected) location.reload();
      }, 3000)
    }
  }, { capture: true });

  // get my user
  let meResp, meBody;
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    meResp = await $API().User.get(accessToken)
    meBody = await meResp.json();
    if (meBody.errors) {
      return $showToast(meBody.errors[0].message, 'error')
    }
  }

  await getHints();

  // socket func
  store.listen('game_event', async (resp) => {
    console.log("Game event:", resp)
    if (resp.type == 'GAME_MOVE' && resp.gameId == game.value.id) {
      const turnColor = boardAPI.value.getTurnColor() == 'white' ? 'w' : 'b';

      console.log(resp.payload.playerId, playerMe.value.id, playerOpponent.value.id)
      console.log(resp.payload.color, playerMe.value?.color);
      // was if (resp.payload?.color !== playerMe.value?.color || isViewer.value)

      if (turnColor == resp.payload.color) {
        socketMove = true;
        boardAPI.value.move(resp.payload.move);
      }

      if (resp.payload.playerId == playerMe.value.id) {
        // console.log('mitim', 'playerMe');
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
        lastTimerValue = timer.value.opponent
        activeTimer.value = 'opponent'
      }
      else if (resp.payload.playerId == playerOpponent.value.id) {
        // console.log('mitim', 'playerOpponent');
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
        lastTimerValue = timer.value.me
        activeTimer.value = 'me'
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
      if (body.errors) {
        return $showToast(body.errors[0].message, 'error')
      }
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
    hasNewMessages.value = true;
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
  if (body.errors) {
    return $showToast(body.errors[0].message, 'error')
  }
  game.value = body.game;

  if (
    body.game.playerOne.joined &&
    body.game.playerTwo.joined &&
    !(body.game.playerOne.id == localStorage.getItem('userId') || body.game.playerTwo.id == localStorage.getItem('userId'))
  ) console.error('Two players have already joined the game');
  else if (
    localStorage.getItem('accessToken') &&
    (!body.game.playerOne.joined || !body.game.playerTwo.joined) &&
    body.game.status == "CREATED"
  ) {
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

    playerMe.value = body.game.playerOne;
    if (body.game.playerTwo.joined) playerOpponent.value = body.game.playerTwo;

    isViewer.value;

    if (game.value.status == "CREATED") {
      if (!body?.game?.playerOne?.joined || !body?.game?.playerTwo?.joined) {
        $togglePopup('SignInPopup');
      }
    }

  }

  // set board config
  boardConfig = {
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

  if (game.value.status == "CANCELED") {
    $showToast('Game canceled because of inactivity. Start a new game in Lobby.', 'error', 0)
  }

  canInit.value = true;
})

const initAfterBoardCreated = async () => {
  // load pgn
  boardAPI.value.loadPgn(game.value.state.pgn)

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
      
      console.log(el);
      //boardAPI.value.move(el.move);
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

  store.listen("connect", async () => {
    // force refresh board, timers, chat, moves
    console.warn('FORCE REFRESH AFTER SOCKET CONNECT')

    // board
    let resp = await $API().Chess.get({
      id: useRoute().params.id,
      accessToken: localStorage.getItem('accessToken')
    })
    let body = await resp.json();
    console.log("Get game:", JSON.parse(JSON.stringify(body)))
    if (body.errors) {
      return $showToast(body.errors[0].message, 'error')
    }
    game.value = body.game;
    boardConfig.fen = body.game.state.fen;

    // chat
    await getMessages()

    // moves & timers
    timer.value = {
      me: game.value.config.timeForGame * 1000,
      opponent: game.value.config.timeForGame * 1000
    }
    timeAddedPerMove = game.value.config.timeAddedPerMove;

    if (game.value.moves.length > 0) {
      clearInterval(timerMeInterval)
      clearInterval(timerOpponentInterval)
      beginTime = game.value.startedAt;

      turns.value = [];
      let lastTime = beginTime;
      game.value.moves.map(el => {
        console.log(timer.value.me, timer.value.opponent, el.createdAt, lastTime)
        turns.value.push(el.move);
        activeTurnIndex.value++;
        if (el.playerId == playerMe.value.id) timer.value.me = timer.value.me - (new Date(el.createdAt) - new Date(lastTime))
        else if (el.playerId == playerOpponent.value.id) timer.value.opponent = timer.value.opponent - (new Date(el.createdAt) - new Date(lastTime))
        lastTime = el.createdAt;
        //boardAPI.value.move(el.move);
      })

      if (game.value.moves.at(-1).playerId == playerMe.value.id) {
        //timer.value.opponent = timer.value.opponent - (new Date() - new Date(lastTime)) - 5000
        lastTimerValue = timer.value.opponent
        activeTimer.value = 'opponent'
        timerOpponentInterval = setInterval(timerOpponentFunc, 100)
      }
      else if (game.value.moves.at(-1).playerId == playerOpponent.value.id) {
        //timer.value.me = timer.value.me - (new Date() - new Date(lastTime)) - 5000
        lastTimerValue = timer.value.me
        activeTimer.value = 'me'
        timerMeInterval = setInterval(timerMeFunc, 100)
      }

      lastTimeForInterval = new Date(lastTime);
      console.log(timer.value.me, timer.value.opponent, new Date(lastTime))
    }
  })
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
  grid-template-rows: 14px auto;
  grid-template-columns: max(230px, 18%) auto max(290px, 18%);
  gap: 25px 20px;
  padding: 20px 33px;
  background-color: $color-font;
  overflow: hidden;

  &--noOverflow {
    overflow: hidden !important;
  }
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

.header {
  display: none;
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

    &s--mobile {
      display: none;
    }

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

  &__close {
    display: none;
  }

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
  height: 100%;
}

.turn {
  &s {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    max-height: calc(100vh - 375px);
    overflow: auto;
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

.hints {
  &__mobile {
    display: none;
  }

  &__text {
    font-family: "Neue Plak";
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;
    color: #fff;
  }

  &__actions {
    margin-top: 15px;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .btn {
    width: 100%;
    padding: 13px 15px;
    background: rgba(255, 255, 255, 0.05);

    color: #FFF;
    text-align: center;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Montserrat;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 100%;
    cursor: pointer;

    &--blue {
      color: #181B20;
      background: #1FA2F3;
    }
  }
}

#right-panels {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

// used to be max-width: #{map-get($sizes, "tablet")-1 + px}
@media screen and (max-width: 1200px) {
  .page {
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: unset;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .back-to-lobby {
    display: none;
  }

  .header {
    order: -2;
    display: flex;
    margin-top: 62px;
    margin-left: 10px;

    &__openChat {
      position: relative;
      padding: 6px 10px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      cursor: pointer;
    }

    &__newMessages {
      position: absolute;
      right: -2px;
      top: -2px;
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background-color: #6FC659;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    gap: 34px;
  }

  .player {
    padding: 0 10px;
  }

  .chat {
    overflow: hidden;
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background: #25272B;
    padding: unset;
    left: -100vw;
    transition: .5s;

    &--opened {
      left: 0;
    }

    &__close {
      display: block;
      color: #FFFFFF4d;
      margin-left: auto;
      margin-right: 20px;
      font-feature-settings: 'clig' off, 'liga' off;
      font-family: Neue Plak;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 100%;
      text-transform: uppercase;
      cursor: pointer;
    }

    &__messages {
      margin-top: 21px;
      margin-left: 20px;
      gap: 25px;
      max-height: calc(100vh - 129px - 140px - 20px);
    }

    .message {
      &__author {
        font-size: 18px;
      }

      &__text {
        font-size: 18px;
      }
    }

    &__input {
      &Field {
        height: 140px;
        padding: 15px 20px;
        align-items: flex-start;
      }

      font-size: 16px;
    }

    &__send {
      width: 24px;
      height: 24px;
    }

    .aside {
      &__heading {
        font-size: 24px;
        margin-top: 64px;
        margin-left: 20px;
      }

      &__divider {
        margin: 11px 0;
      }
    }
  }

  .info {
    border: unset;
    background: unset;
    backdrop-filter: unset;
    padding: unset;

    .panel {
      padding: 0 20px;
      order: -1;
      margin-bottom: 53px;
    }

    .aside {

      &__divider,
      &__heading {
        display: none;
      }

      &__headings--mobile {
        display: flex;
        flex-direction: row;
        gap: 20px;
        padding: 0 20px;
        margin-bottom: 20px;

        .aside__heading--mobile {
          display: block;
          color: #FFFFFF4d;
          font-family: "Neue Plak";
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;

          &--active {
            color: #FFF;
          }
        }
      }
    }

    .turn {
      &s {
        justify-content: flex-start;
        padding: 15px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.10);
        border-bottom: 1px solid rgba(255, 255, 255, 0.10);
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(50px);
      }
    }
  }

  .playboard {
    order: -1;
    height: auto;
  }

  .turns {
    margin-bottom: 5px;
  }

  #right-panels {
    gap: 20px;
  }

  .hints {
    order: -1;

    &__mobile {
      margin-left: auto;
      display: block;
    }

    &__text,
    .aside__divider {
      display: none;
    }
  }
}
</style>