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
            The Chess introduces a new interpretation<br />of the most played board game in the world.<br />Collect chess
            pieces,
            complete daily quests,<br />play with your friends, and be #1 on the leaderboard!
          </div>
          <div class="slide__join">
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
            Step into the competitive arena and challenge NFT communities to<br />epic chess tournaments. Compete against
            players from around the<br />world and showcase your skills on the grand stage.<br /><br />
            Rise up the ranks, claim victory, and earn prestigious rewards.<br />
            It's time to prove your mettle and become a chess champion.
          </div>
          <div class="slide__join">
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
            Elevate your chess matches to a whole new level with our on-chain<br />mode. Every move you make is recorded
            on the
            Solana blockchain,<br />providing an immutable proof of movement.<br /><br />
            Experience the transparency and security of blockchain<br />technology, ensuring fair play and trust in every
            game.
          </div>
          <div class="slide__join">
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
            Sharpen your chess skills while reaping exciting rewards with our<br />daily missions. Embark on new chess
            missions every day, ranging<br />from tactical puzzles to strategic challenges. As you conquer
            these<br />missions, you'll unlock exclusive in-game rewards, enhancing your<br />chess experience and
            showcasing your progress.
          </div>
          <div class="slide__join">
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
            We are the team that always delivers. We build games, tools, top-<br/>notch art, community, and utility for all our
            holders and the Solana<br/>ecosystem.<br/><br/>
            We love chess, and it’s time to reimagine how people play it.<br/>
            Join the waitlist to be one of the first “Chess 3.0” players with us!
          </div>
          <div class="slide__join">
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
      href=""
    ><img
        class="footer__img"
        src="@/assets/disc.png"
      /></a>
    <a
      class="footer__link"
      href=""
    ><img
        class="footer__img"
        src="@/assets/twi.png"
      /></a>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

let chosenSlideNumber = ref(1)

const goToSlide = (num) => {
  console.log(num);
  chosenSlideNumber.value = num;
  document.querySelector('.main').style.translate = `0 ${-100 * (num - 1)}vh`;
  console.log(document.querySelector('.main').style.translate);
}
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
}</style>
