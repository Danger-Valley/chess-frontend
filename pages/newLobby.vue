<template>
  <ClientOnly>
    <div class="page">
      <nav class="nav">
        <div class="logo">
          <div class="logo__heading">xChess</div>
          <div class="logo__underheading">By players, for players.</div>
        </div>

        <div class="nav__hr"></div>

        <section class="section">
          <div class="section__heading">Play</div>
          <div class="item">
            <img
              class="item__img"
              src=""
            />
            <div class="item__text">Fast game</div>
          </div>
          <div class="item">
            <img
              class="item__img"
              src=""
            />
            <div class="item__text">New game</div>
          </div>
          <div class="item">
            <img
              class="item__img"
              src=""
            />
            <div class="item__text">Arena game</div>
          </div>
          <div class="item">
            <img
              class="item__img"
              src=""
            />
            <div class="item__text">Tournaments</div>
          </div>
        </section>

        <NuxtLink
          v-if="lobby?.sidebarBanner"
          :to="lobby?.sidebarBanner?.link"
        >
          <img
            class="nav__banner"
            :src="lobby?.sidebarBanner?.image"
          />
        </NuxtLink>

        <section class="section">
          <div class="section__heading">Learn</div>
          <div class="item item--inactive">
            <img
              class="item__img"
              src=""
            />
            <div class="item__text">Puzzles</div>
            <div class="item__soon">Soon</div>
          </div>
          <div class="item item--inactive">
            <img
              class="item__img"
              src=""
            />
            <div class="item__text">Missions</div>
            <div class="item__soon">Soon</div>
          </div>
          <div class="item">
            <img
              class="item__img"
              src=""
            />
            <div class="item__text">News</div>
          </div>
        </section>

        <section class="section">
          <div class="section__heading">More</div>
          <div class="item">
            <img
              class="item__img"
              src=""
            />
            <div class="item__text">Profile</div>
          </div>
          <div class="item">
            <img
              class="item__img"
              src=""
            />
            <div class="item__text">Premium</div>
          </div>
        </section>

        <div class="nav__badge"></div>

        <div class="nav__register">Register</div>
        <div class="nav__login">Log in</div>
      </nav>

      <main class="main">
        <header class="header">
          <div class="header__duck">
            <img
              class="header__duck-img"
              src="@/assets/imgs/newLobby/header-duck.png"
            />
            <div class="header__duck-text">{{ duckText }}</div>
          </div>

          <div class="header__games">
            <div class="animation">
              <div class="animation__dot"></div>
              <div class="animation__bg"></div>
            </div>
            <div class="header__games-text">{{ lobby?.totalGamesCount }} games played</div>
          </div>
        </header>

        <div class="banners">
          <div class="banners__arrow banners__arrow--prev">&lt;</div>
          <div class="banners__container">
            <NuxtLink
              v-for="banner in lobby?.banners"
              class="banner"
              :to="banner?.link"
            >
              <img
                class="banner__bg"
                :src="banner.image"
              />
              <div class="banner__text">Starts in 10 days</div>
            </NuxtLink>
          </div>
          <div class="banners__arrow banners__arrow--next">&gt;</div>
        </div>

        <section class="section">
          <div class="section__heading">Play</div>

          <div class="games">
            <div
              class="game"
              id="game-1"
            >
              <div class="game__heading">New game</div>
              <div class="game__action">Create game</div>
            </div>
            <div
              class="game"
              id="game-2"
            >
              <div class="game__heading">Play with AI</div>
              <div class="game__action">Play bot</div>
            </div>
            <div
              class="game"
              id="game-3"
            >
              <div class="game__heading">Play a Friend</div>
              <div class="game__action">Play now</div>
            </div>
            <div
              class="game"
              id="game-4"
            >
              <div class="game__heading">Arena</div>
              <div class="game__action">Compete now</div>
            </div>
          </div>
        </section>

        <section
          class="section-2"
          v-if="useUserStore()?.getUser?.value?.id"
        >
          <section class="section section--half">
            <div class="section__heading">Rating</div>

            <div class="rating">
              <div class="rating__heading">{{ lobby?.user?.rank?.rank }}</div>
              <div class="rating__leaderboard">Leaderboard position</div>
              <div class="rating__position">#{{ lobby?.user?.leaderboard?.position }} <span
                  class="rating__position--gray">/ {{ lobby?.user?.leaderboard?.total }}</span></div>
            </div>
          </section>
          <section class="section section--half">
            <div class="section__heading">Active games</div>

            <div
              class="active-games"
              v-if="lobby?.activeGames?.length"
            >
              <div
                v-for="(game, counter) in lobby?.activeGames"
                class="active-game"
              >
                <div
                  v-if="counter != 0"
                  class="active-game__hr"
                ></div>
                <div class="active-game__name">{{ game.title }}</div>
                <div
                  class="active-game__btn"
                  @click="navigateTo(`game/${game.gameId}`)"
                >Open</div>
              </div>
            </div>
          </section>
        </section>

        <section class="section">
          <div class="section__heading">Leaderboard</div>

          <div class="leaderboard">
            <div class="leaderboard__heading">
              <div>#</div>
              <div>Username</div>
              <div>W - D - L</div>
              <div>Rating</div>
              <div>Rank</div>
            </div>

            <div
              class="leaderboard__row"
              v-for="(row, counter) in leaderboard"
            >
              <div>{{ counter }}</div>
              <div class="leaderboard__user">
                <img
                  v-if="row.user.image"
                  class="leaderboard__user-image"
                />
                {{ row.user.name }}
              </div>
              <div>{{ row.wins }} - {{ row.draws }} - {{ row.loses }}</div>
              <div>{{ row.rating }}</div>
              <div>{{ row.rank }}</div>
            </div>
          </div>
        </section>

        <div class="main__hr"></div>

        <footer class="footer">
          <div class="footer__item">
            <div class="footer__item-heading">Platform</div>
            <div class="footer__item-text">Wiki</div>
            <div class="footer__item-text">Log out</div>
          </div>
          <div class="footer__item">
            <div class="footer__item-heading">Support</div>
            <div class="footer__item-text">Contact Us</div>
            <div class="footer__item-text">Privacy Policy</div>
            <div class="footer__item-text">Terms of Use</div>
          </div>
          <div class="footer__item">
            <div class="footer__item-heading">Community</div>
            <div class="footer__item-text">Twitter</div>
            <div class="footer__item-text">Discord</div>
          </div>
          <div class="footer__banner">
            <img
              class="footer__banner-img"
              src="@/assets/imgs/newLobby/footer-crown.png"
            />
            <div class="footer__banner-heading">Submit application</div>
            <div class="footer__banner-text">Want to make a partnership? Have an idea or offer?<br />Contact us!</div>
            <div class="footer__banner-action">Submit</div>
          </div>
        </footer>
      </main>

      <PopupsSetUsername />
    </div>
  </ClientOnly>
</template>

<script setup>
import { useUserStore } from "~/stores/user";

useHead({
  title: 'Lobby - xChess',
  meta: [
    {
      property: 'og:title',
      content: 'Lobby - xChess'
    }, {
      property: 'twitter:title',
      content: 'Lobby - xChess'
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

let { $togglePopup, $API } = useNuxtApp();

let lobby = ref(),
  bannerBg = ref(),
  duckText = ref("Great day for a chess game!")

onMounted(async () => {
  console.log(useNuxtApp().ssrContext?.event.node.req.headers, useRequestURL());

  if (useUserStore()?.getUser?.value?.id && !useUserStore()?.getUser?.value?.username) $togglePopup('SetUsernamePopup')

  let resp = await $API().Lobby.get(localStorage.getItem('accessToken'));
  let body = await resp.json();
  console.log(body);

  if (body.errors) {
    console.error(body.errors);
    return $showToast(body.errors[0].message, 'error')
  }

  lobby.value = body;
})
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 177px;
}

.nav {
  width: 220px;
  height: 860px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 18px 10px 12px 10px;
  border-radius: 20px;
  background: #1A1E23;
  backdrop-filter: blur(50px);

  .logo {
    color: #FFF;
    font-family: "Space Mono";
    font-style: normal;
    font-weight: 400;

    &__heading {
      font-size: 16px;
      line-height: 16px;
      margin-bottom: 3px;
    }

    &__underheading {
      font-size: 10px;
      line-height: 10px;
    }
  }

  &__hr {
    width: 100%;
    height: 1px;
    background: #313539;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 15px;

    &__heading {
      color: #ffffff4d;
      font-family: "Space Mono";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 12px;
      text-transform: uppercase;
    }

    .item {
      display: flex;
      flex-direction: row;
      gap: 6px;
      align-items: center;
      cursor: pointer;

      &__img {
        width: 18px;
        height: 18px;
      }

      &__text {
        color: #FFF;
        font-family: "Space Mono";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }

      &__soon {
        color: #454545;
        font-family: "Space Mono";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin-left: auto;
      }

      &--inactive {
        .item__text {
          color: #454545;
        }
      }
    }
  }

  &__banner {
    width: 100%;
    height: 84px;
    border-radius: 10px;
    cursor: pointer;
  }

  &__badge {
    width: 100%;
    height: 44px;
    margin-top: auto;
    margin-bottom: -10px;
    cursor: pointer;
  }

  &__register {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 66px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.10);
    cursor: pointer;
    margin-bottom: -13px;

    color: #FFF;
    text-align: center;
    font-family: "Space Mono";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &__login {
    color: #FFF;
    text-align: center;
    font-family: "Space Mono";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
}

.main {
  width: 844px;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    &__duck {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;

      &-img {
        width: 26px;
        height: 26px;
      }

      &-text {
        position: relative;
        padding: 10px;
        border-radius: 10px 10px 10px 0px;
        background: #202227;
        margin-left: 9px;
        color: #FFF;
        font-family: "Space Mono";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;

        &::before {
          content: "";
          position: absolute;
          left: -7px;
          bottom: 0;
          width: 7px;
          height: 7px;
          clip-path: polygon(100% 0, 0% 100%, 100% 100%);
          z-index: 1;
          background-color: #202227;
        }
      }
    }

    &__games {
      display: flex;
      flex-direction: row;
      gap: 8px;

      .animation {
        @keyframes fadeOut {
          from {
            transform: scale(0);
            opacity: 1;
          }

          to {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 19px;
        height: 19px;

        &__dot {
          width: 7px;
          height: 7px;
          border-radius: 100%;
          background: #FFBF2E;
        }

        &__bg {
          width: 100%;
          height: 100%;
          position: absolute;
          border-radius: 100%;
          background: #ffbf2e;
          animation-name: fadeOut;
          animation-duration: 2s;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;
        }
      }

      &-text {
        color: #FFF;
        font-family: "Space Mono";
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 12px;
      }
    }
  }

  .banner {
    position: relative;
    width: 100%;
    height: 100%;

    &s {
      position: relative;
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 220px;
      margin-bottom: 40px;

      &__arrow {
        position: absolute;
        top: calc((100% - 35px) / 2);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        color: #fff;
        background-color: #333538;
        cursor: pointer;
        z-index: 2;

        &--prev {
          left: calc(35px / -2);
        }

        &--next {
          right: calc(35px / -2);
        }
      }

      &__container {
        display: flex;
        overflow: hidden;
        gap: 100%;
      }
    }

    &__bg {
      height: 100%;
      object-fit: contain;
      border-radius: 10px;
    }

    &__text {
      position: absolute;
      left: 14px;
      bottom: 14px;
      padding: 20px 13px;
      border-radius: 10px;
      background: rgba(19, 28, 43, 0.10);
      backdrop-filter: blur(50px);

      color: #FFF;
      text-align: center;
      font-family: "Space Mono";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
    }
  }

  .section {
    margin-bottom: 40px;

    &__heading {
      color: #FFF;
      font-family: "Space Mono";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
      text-transform: uppercase;
    }

    &--half {
      width: 50%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .game {
      position: relative;
      width: 100%;
      height: 161px;
      border-radius: 10px;
      background: rgba(31, 36, 42, 0.40);
      backdrop-filter: blur(50px);
      overflow: hidden;

      &s {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 15px;
        gap: 10px;
      }

      &__heading {
        position: absolute;
        left: 14px;
        top: 14px;
        color: #FFF;
        font-family: "Space Mono";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 16px;
      }

      &__action {
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 44px;
        background: rgba(0, 0, 0, 0.10);
        backdrop-filter: blur(12px);

        color: #FFF;
        text-align: center;
        font-family: "Space Mono";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px;
      }
    }

    #game {
      &-1 {
        background-image: url("@/assets/imgs/newLobby/games-new.png");
        background-size: cover;
      }

      &-2 {
        background-image: url("@/assets/imgs/newLobby/games-AI.png");
        background-size: cover;
      }

      &-3 {
        background-image: url("@/assets/imgs/newLobby/games-friend.png");
        background-size: cover;
      }

      &-4 {
        background-image: url("@/assets/imgs/newLobby/games-arena.png");
        background-size: cover;
      }
    }

    .leaderboard {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: space-between;
      padding: 0 16px;
      margin-top: 25px;

      // to inherit
      grid-template-columns: 50px 167px 167px 167px auto;

      &__heading {
        display: grid;
        grid-template-columns: inherit;
        gap: 20px;
        color: #FFF;
        font-variant-numeric: lining-nums tabular-nums;
        font-family: Space Mono;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 140%;
        text-transform: capitalize;
      }

      &__row {
        display: grid;
        grid-template-columns: inherit;
        gap: 20px;
        color: #FFF;
        font-variant-numeric: lining-nums tabular-nums;
        font-family: Space Mono;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 140%;
        text-transform: capitalize;
      }

      &__user {
        display: flex;
        flex-direction: row;
        justify-content: center;

        &-image {
          margin-right: 9px;
          width: 21px;
          height: 21px;
          clip-path: path("M20.2914 7.91393C19.5251 6.30251 18.6316 4.75477 17.6191 3.28544L17.2926 2.81608C16.8905 2.23278 16.3636 1.74636 15.7501 1.39219C15.1366 1.03801 14.4518 0.824969 13.7456 0.768542L13.1723 0.722341C11.3936 0.579532 9.60636 0.579532 7.82769 0.722341L7.25437 0.768542C6.54819 0.824969 5.86345 1.03801 5.24991 1.39219C4.63637 1.74636 4.10944 2.23278 3.7074 2.81608L3.38085 3.28964C2.36844 4.75897 1.47484 6.30671 0.708543 7.91813L0.461788 8.43684C0.157748 9.07661 0 9.77605 0 10.4844C0 11.1927 0.157748 11.8921 0.461788 12.5319L0.708543 13.0506C1.47484 14.6621 2.36844 16.2098 3.38085 17.6791L3.7074 18.1527C4.10944 18.736 4.63637 19.2224 5.24991 19.5766C5.86345 19.9308 6.54819 20.1438 7.25437 20.2002L7.82769 20.2464C9.60636 20.3892 11.3936 20.3892 13.1723 20.2464L13.7456 20.2002C14.4523 20.1431 15.1374 19.9291 15.7509 19.5738C16.3646 19.2185 16.8912 18.7308 17.2926 18.1464L17.6191 17.6728C18.6316 16.2035 19.5251 14.6558 20.2914 13.0443L20.5382 12.5256C20.8422 11.8858 21 11.1864 21 10.4781C21 9.76975 20.8422 9.07031 20.5382 8.43054L20.2914 7.91393Z");
        }
      }
    }
  }

  .section-2 {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .rating {
    height: 161px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    padding: 17px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__heading {
      color: $color1;
      font-family: Space Mono;
      font-size: 40px;
      font-style: normal;
      font-weight: 400;
      line-height: 40px;
    }

    &__leaderboard {
      color: #FFFFFF4d;
      font-family: Space Mono;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
    }

    &__position {
      color: #FFF;
      font-family: Space Mono;
      font-size: 22px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px;

      &--gray {
        color: #66676B;
        font-weight: 400;
      }
    }
  }

  .active-game {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    &s {
      height: 161px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      padding: 17px 20px;
    }

    &__hr {
      width: 100%;
      height: 1px;
      margin-bottom: 17px;
      background: #2C2E32;
    }

    &__name {
      color: #FFF;
      font-size: 16px;
      font-family: "Neue Plak";
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }

    &__btn {
      padding: 6px 10px;
      border-radius: 10px;
      background-color: $color1;
      color: $color-font;
      font-size: 12px;
      font-family: "Neue Plak";
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      cursor: pointer;
    }
  }

  &__hr {
    width: 100%;
    height: 1px;
    color: #ffffff1a;
  }

  .footer {
    margin-top: 40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    &__item {
      display: flex;
      flex-direction: column;
      gap: 12px;

      &-heading {
        color: #ffffff4d;
        font-family: Space Mono;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 14px;
      }

      &-text {
        color: #FFF;
        font-family: Space Mono;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px;
      }
    }

    &__banner {
      display: grid;
      grid-template-columns: auto 70px;
      width: 308px;
      min-height: 139px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      overflow: hidden;

      &-img {
        grid-column: 2;
        grid-row: 1 / span 2;
      }

      &-heading {
        padding: 10px;
        color: #FFF;
        font-family: Space Mono;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 16px;
      }

      &-text {
        margin: 4px 0 6px 10px;
        color: #ffffff80;
        font-family: Space Mono;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 150%;
      }

      &-action {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-column: 1 / span 2;
        grid-row: 3;
        width: 100%;
        height: 39px;
        margin-top: auto;
        background: rgba(255, 255, 255, 0.10);
        backdrop-filter: blur(35px);
        color: #FFF;
        text-align: center;
        font-family: Space Mono;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 14px;
        cursor: pointer;
      }
    }
  }
}
</style>