<template>
  <header class="header">
    <div class="header__top">The Chess</div>
    <div class="header__bottom">By players, for players.</div>
  </header>
  <main class="main">
    <div
      class="slide"
      v-for="slide in 5"
    >
      <template v-if="slide == 1">
        <div class="slide__content">
          <div class="slide__heading">
            Community-driven
            <div class="slide__heading--gradient">chess platform</div>
          </div>
          <div class="slide__text">
            The Chess introduces a new interpretation of the most played board game in the world. Collect chess
            pieces,
            complete daily quests, play with your friends, and be #1 on the leaderboard!
          </div>
          <div
            class="slide__join"
            @click="togglePopup"
          >
            Join waitlist
            <img src="@/assets/arrow.svg" />
          </div>
        </div>
        <img
          class="slide__img"
          src="@/assets/king.jpg"
        />
      </template>

      <template v-if="slide == 2">
        <div class="slide__content">
          <div class="slide__heading">
            Team Tournaments
            <div class="slide__heading--gradient">between OG communities</div>
          </div>
          <div class="slide__text">
            Step into the competitive arena and challenge NFT communities to epic chess tournaments. Compete against
            players from around the world and showcase your skills on the grand stage.<br /><br />
            Rise up the ranks, claim victory, and earn prestigious rewards.
            It's time to prove your mettle and become a chess champion.
          </div>
          <div
            class="slide__join"
            @click="togglePopup"
          >
            Join waitlist
            <img src="@/assets/arrow.svg" />
          </div>
        </div>
        <img
          class="slide__img"
          src="@/assets/queen.jpg"
        />
      </template>

      <template v-if="slide == 3">
        <div class="slide__content">
          <div class="slide__heading">
            On-chain mode
            <div class="slide__heading--gradient">on Solana</div>
          </div>
          <div class="slide__text">
            Elevate your chess matches to a whole new level with our on-chain mode. Every move you make is recorded
            on the
            Solana blockchain, providing an immutable proof of movement.<br /><br />
            Experience the transparency and security of blockchain technology, ensuring fair play and trust in every
            game.
          </div>
          <div
            class="slide__join"
            @click="togglePopup"
          >
            Join waitlist
            <img src="@/assets/arrow.svg" />
          </div>
        </div>
        <img
          class="slide__img"
          src="@/assets/knight.jpg"
        />
      </template>

      <template v-if="slide == 4">
        <div class="slide__content">
          <div class="slide__heading">
            One more thing...
            <div class="slide__heading--gradient">Daily Missions</div>
          </div>
          <div class="slide__text">
            Sharpen your chess skills while reaping exciting rewards with our daily missions. Embark on new chess
            missions every day, ranging from tactical puzzles to strategic challenges. As you conquer
            these missions, you'll unlock exclusive in-game rewards, enhancing your chess experience and
            showcasing your progress.
          </div>
          <div
            class="slide__join"
            @click="togglePopup"
          >
            Join waitlist
            <img src="@/assets/arrow.svg" />
          </div>
        </div>
        <img
          class="slide__img"
          src="@/assets/bishop.jpg"
        />
      </template>

      <template v-if="slide == 5">
        <div class="slide__content">
          <div class="slide__heading">
            Built in-house by
            <div class="slide__heading--gradient">Danger Valley</div>
          </div>
          <div class="slide__text">
            We are the team that always delivers. We build games, tools, top- notch art, community, and utility for
            all our
            holders and the Solana ecosystem.<br /><br />
            We love chess, and it’s time to reimagine how people play it.
            Join the waitlist to be one of the first “Chess 3.0” players with us!
          </div>
          <div
            class="slide__join"
            @click="togglePopup"
          >
            Join waitlist
            <img src="@/assets/arrow.svg" />
          </div>
        </div>
        <img
          class="slide__img"
          src="@/assets/rook.jpg"
        />
      </template>
    </div>
  </main>
  <div class="bullets">
    <a
      class="bullet"
      v-for="bullet in 5"
      @click="goToSlide(bullet)"
      :class="{ 'bullet--active': chosenSlideNumber == bullet }"
      :href="`#${bullet}`"
    >
      <div class="bullet__inner"></div>
    </a>
  </div>
  <footer class="footer">
    <a
      class="footer__link"
      href="https://discord.com/invite/dangervalley"
    ><img
        class="footer__img"
        src="@/assets/disc.png"
      /></a>
    <a
      class="footer__link"
      href="https://twitter.com/danger_valley"
    ><img
        class="footer__img"
        src="@/assets/twi.png"
      /></a>
  </footer>

  <div
    class="popup__wrapper"
    @click="togglePopup"
  >
    <div
      class="popup"
      @click.stop
    >
      <template v-if="!sent">
        <div class="popup__heading">Join waitlist</div>
        <div class="popup__text">We’ll notify you once The Chess is available!</div>
        <div class="popup__func">
          <input
            class="popup__input"
            type="email"
            placeholder="Your email"
          />
          <div
            class="popup__join"
            @click="joinByMail"
          >
            Join waitlist
            <img src="@/assets/arrow.svg" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="popup__heading">Congratulations!</div>
        <div class="popup__text">
          Your email address has been successfully registered.<br /><br />You will be notified when the platform is
          available!
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

let chosenSlideNumber = ref(1),
  sent = ref(false),
  isScrolling = false,
  touchStartPosition = null;

const wheelHandler = (e) => {
  //console.log(e);
  if (!isScrolling) {
    isScrolling = true;
    goToSlide(chosenSlideNumber.value + Math.sign(e.deltaY));
    setTimeout(() => isScrolling = false, 1000)
  }
}

const touchStartHandler = (e) => {
  console.log(e.touches[0].pageY);
  touchStartPosition = e.touches[0].pageY;
}

const touchStopHandler = (e) => {
  console.log(e.changedTouches[0].pageY);
  if (!isScrolling && Math.abs(touchStartPosition - e.changedTouches[0].pageY) > 60){
    isScrolling = true
    goToSlide(chosenSlideNumber.value + Math.sign(touchStartPosition - e.changedTouches[0].pageY))
    setTimeout(() => isScrolling = false, 1000)
  }
  touchStartPosition = null;
}

const goToSlide = (num) => {
  console.log(num)
  if (num > 5) num = 1;
  else if (num < 1) num = 5;
  chosenSlideNumber.value = num;
  document.querySelector('.main').style.translate = `0 ${-100 * (num - 1)}vh`;
}

const togglePopup = () => {
  document.querySelector('.popup__wrapper').classList.toggle('popup__wrapper--active');
}

const joinByMail = async () => {
  let mail = document.querySelector('input.popup__input');

  if (mail.value.length == 0 || !mail.checkValidity()) return;

  let resp = await fetch('https://api-dev.thechess.io/auth/api/v1/waitlist', {
    method: "POST",
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: mail.value
    })
  })
  let body = await resp.json();
  console.log(body);
  sent.value = true;
}

onMounted(() => {
  document.addEventListener('wheel', wheelHandler)
  document.addEventListener('touchstart', touchStartHandler)
  document.addEventListener('touchend', touchStopHandler)
  setTimeout(() => {
    document.querySelector("#app").style.opacity = 1;
  }, 500);
})
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #181B20;
}

#app {
  opacity: 0;
  transition: 2s;
}

@font-face {
  font-family: 'Neue Plak';
  src: url('@/assets/NeuePlak/NeuePlak-Regular.ttf');
  font-weight: 400;
}

@font-face {
  font-family: 'Neue Plak';
  src: url('@/assets/NeuePlak/NeuePlak-SemiBold.ttf');
  font-weight: 600;
}

.header {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  top: 100px;
  left: 100px;
  font-family: 'Neue Plak';
  font-style: normal;
  line-height: 1;

  &__top {
    color: #FFFFFF;
    font-size: 22px;
    font-weight: 600;
    text-transform: uppercase;
  }

  &__bottom {
    font-size: 14px;
    line-height: 1.6;
    color: #FFFFFF4d;
  }
}

.main {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: inherit;
  height: inherit;
  left: 100px;
  transition: 1s ease-in-out;
}

.slide {
  position: relative;
  width: 100%;
  justify-content: space-between;
  z-index: 1;
  display: flex;

  &__content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 50px;
  }

  &__heading {
    grid-column: 1;
    font-family: 'Neue Plak';
    font-style: normal;
    font-weight: 400;
    font-size: 70px;
    line-height: 1;
    color: #E9DEFF;

    &--gradient {
      font-family: Georgia;
      font-style: italic;
      background: linear-gradient(93deg, #38B6EC 49.3%, #23FFB0 87.76%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &__text {
    max-width: 400px;
    font-family: 'Neue Plak';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 2;
    color: #8D9197;
  }

  &__join {
    display: flex;
    flex-direction: row;
    gap: 15px;
    font-family: 'Neue Plak';
    font-style: normal;
    font-weight: 400;
    font-size: 22px;
    line-height: 1;
    text-transform: uppercase;
    color: #27F4BA;
    cursor: pointer;
  }

  &__img {
    width: 900px;
    max-height: 100vh;
    object-fit: cover;
  }
}

.bullet {
  position: relative;
  width: 25px;
  height: 25px;
  background-color: transparent;
  border: 2px solid transparent;
  border-radius: 100%;
  padding: 4px;
  z-index: 2;
  transition: .3s;

  &__inner {
    position: absolute;
    width: 13px;
    height: 13px;
    background-color: #fff;
    border-radius: 100%;
  }

  &--active {
    border: 2px solid #fff;
  }

  &s {
    height: 100vh;
    position: absolute;
    right: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 21px;
  }
}

.footer {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: row;
  gap: 20px;
  bottom: 100px;
  left: 100px;

  &__img {
    width: 20px;
  }
}

.popup {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 640px;
  height: 390px;
  scale: .5;
  transition: .5s;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(50px);
  padding: 64px;

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    opacity: 0;
    transition: .5s;
    background-color: rgba(0, 0, 0, 0.8);

    &--active {
      opacity: 1;
      z-index: 100;

      .popup {
        scale: 1;
      }
    }
  }

  &__heading {
    font-family: 'Neue Plak';
    font-style: normal;
    font-weight: 400;
    font-size: 55px;
    line-height: 1.2;
    text-align: center;
    color: #E9DEFF;
  }

  &__text {
    font-family: 'Neue Plak';
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 1.6;
    text-align: center;
    color: #8D9197;
  }

  &__func {
    display: flex;
    flex-direction: row;
    gap: 30px;
    justify-content: center;
    align-items: center;
  }

  &__input {
    height: 50px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: unset;
    outline: unset;
    border-radius: 10px;

    font-family: 'Neue Plak';
    font-style: normal;
    font-weight: 400;
    font-size: 22px;
    line-height: 30px;
    color: #fff;

    &::placeholder {
      color: #5D5F63;
    }
  }

  &__join {
    display: flex;
    flex-direction: row;
    gap: 15px;
    font-family: 'Neue Plak';
    font-style: normal;
    font-weight: 400;
    font-size: 22px;
    line-height: 1;
    text-transform: uppercase;
    color: #27F4BA;
    cursor: pointer;
  }
}

@media screen and (max-width: 1200px) {
  .header {
    top: 26px;
    left: 15px;
  }

  .footer {
    width: fit-content;
    top: 26px;
    bottom: unset;
    left: unset;
    right: 15px;
    z-index: 3;
  }

  .main {
    width: 100%;
    top: 88px;
    left: unset;
    gap: 88px;
  }

  .slide {
    flex-direction: column;
    height: calc(100vh - 88px);

    &__content {
      width: auto;
      padding: 0 15px 15px 15px;
      margin: auto;
    }

    &__heading {
      font-size: 30px;
    }

    &__text {
      font-size: 12px;
    }

    &__img {
      width: inherit;
      height: 63vmax;
      margin: auto;
    }
  }

  .bullet {
    &--active {
      border-color: #ffffff99;
    }

    &__inner {
      background-color: #ffffff99;
    }

    &s {
      width: 100%;
      height: auto;
      right: unset;
      left: 0;
      bottom: 9px;
      flex-direction: row;
    }
  }

  .popup {
    width: 80vw;

    &__func {
      flex-direction: column;
    }
  }
}
</style>