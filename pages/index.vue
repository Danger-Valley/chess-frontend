<template>
  <div class="page">
    <Header></Header>
    
    <main class="main">
      <div class="main__heading">
        CLASSIC CHESS. BUT DIFFERENT.
      </div>

      <div class="main__text">
        Get a <span id="text-effect">completely</span>  another experience
      </div>

      <NuxtLink class="main__create-game link link--normal link--green" to="">
        Create Game
        <IconArrow class="link__arrow" alt="arrow"></IconArrow>
      </NuxtLink>

      <img class="main__img" src="@/assets/imgs/white-king-min.png"/>
    </main>

    <Footer></Footer>
  </div>
</template>

<script setup>
import IconArrow from "@/assets/imgs/Arrow.svg"
</script>

<style lang="scss" scoped>
.page{
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  background: #181B20;
}

.main{
  $margin_to_set: min(200px, 50vh);
  /*
  margin: #{$margin_to_set} 0;
  display: flex;
  flex-direction: column;
  height: calc(100% - #{$margin_to_set} * 2);
  justify-content: space-between;
  */

  margin-left: 23vw;

  &__heading{
    font-family: 'Neue Plak';
    font-weight: 600;
    font-size: 14px;
    line-height: 1.6;
    color: $color2;
    margin-bottom: 20px;
  }

  &__text{
    max-width: min(580px, 70%);
    font-family: 'Neue Plak';
    font-weight: 400;
    font-size: 100px;
    line-height: 1;
    color: #E9DEFF;
  }

  &__create-game{
    margin-top: 85px;
  }

  &__img{
    position: absolute;
    width: clamp(355px, 19vw, 100vw);
    right: 22.2vw;
    bottom: 0;
    //left: calc(50vw - (450px / 2) - 400px + 331px);
  }
}

#text-effect{
  font-family: Georgia;
  font-style: italic;
  background: linear-gradient(93deg, #38B6EC 49.3%, #23FFB0 87.76%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media screen and (min-width: #{map-get($sizes, "desktop-high") + px}) {
  .main{
    margin-left: 20vw;
    &__heading{
      font-size: 18px;
    }
    &__text{
      font-size: 120px;
    }
    &__create-game{
      margin-top: 135px;
    }
  }
}

@media screen and (min-width: #{map-get($sizes, "desktop-low") + px}) and (max-width: #{map-get($sizes, "desktop")-1 + px}) {
  .main{
    margin-left: 10vw;
  }
}

@media screen and (min-width: #{map-get($sizes, "tablet") + px}) and (max-width: #{map-get($sizes, "desktop-low")-1 + px}) {
  .main{
    margin-left: 50px;
    &__img{
      width: 431px;
      opacity: 0.1;
      right: 22px;
      bottom: 50px;
      filter: blur(5px);
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "tablet") + px}) {
  .main{
    margin-left: 20px;
    &__text{
      font-size: 68px;
    }
    &__img{
      width: 324px;
      opacity: 0.1;
      right: 0;
      bottom: -20px;
      filter: blur(5px);
    }
    &__create-game{
      margin-top: 60px;
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "mobile") + px}) {
  .main{
    margin-top: 50px;
    margin-left: 15px;
    &__text{
      font-size: 48px;
    }
    &__img{
      width: 180px;
      right: 38px;
      bottom: 0;
      filter: blur(5px);
    }
    &__create-game{
      margin-top: 40px;
    }
  }
}
</style>