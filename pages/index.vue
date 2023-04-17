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
        <img class="link__arrow" src="@/assets/imgs/Arrow.svg" alt="arrow"/>
      </NuxtLink>

      <img class="main__img" src="@/assets/imgs/white-king-min.png"/>
    </main>

    <Footer></Footer>
  </div>
</template>

<script setup>
useHead({
  title: 'Chess',
  meta: [
    { name: 'description', content: 'desc' }
  ]
})
</script>

<style lang="scss" scoped>
.page{
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #181B20;
}

.main{
  position: relative;
  margin-left: 450px;
  &__heading{
    font-family: 'Neue Plak';
    font-weight: 600;
    font-size: 14px;
    line-height: 160%;
    color: #38B7EC;
    margin-bottom: 20px;
  }

  &__text{
    width: 580px;
    font-family: 'Neue Plak';
    font-weight: 400;
    font-size: 100px;
    line-height: 100%;
    color: #E9DEFF;
  }

  &__create-game{
    margin-top: 85px;
  }

  &__img{
    position: absolute;
    width: clamp(400px, 19vw, 100vw);
    top: 0;
    left: calc(50vw - (450px / 2) - 400px + 331px);
  }
}

#text-effect{
  font-family: Georgia;
  font-style: italic;
  background: linear-gradient(93deg, #38B6EC 49.3%, #23FFB0 87.76%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media screen and (min-width: 2560px) {
  .main{
    margin-left: 530px;
    &__img{
      left: calc(50vw - (530px / 2) - clamp(400px, 19vw, 100vw) + 431px);
    }
  }
}

@media screen and (min-width: 1440px) and (max-width: 1919px) {
  .main{
    margin-left: 143px;
    &__img{
      left: calc(50vw - (143px / 2) - 400px + 201px);
    }
  }
}

@media screen and (min-width: 834px) and (max-width: 1439px) {
  .main{
    margin-left: 50px;
    &__img{
      width: 431px;
      opacity: 0.1;
      left: calc(50vw - (50px / 2) - (431px / 2) + 179px);
    }
  }
}

@media screen and (max-width: 833px) {
  .main{
    margin-left: 20px;
    &__img{
      width: 324px;
      opacity: 0.1;
      left: calc(50vw - (20px / 2) - (324px / 2) + 53px);
    }
  }
}
</style>