<template>
  <footer class="footer">
    <div class="lang">
      EN
    </div>

    <div class="socials">
      <NuxtLink to="" target="_blank" class="socials__item">
        <img src="@/assets/imgs/discord-logo.svg" alt="discord"/>
      </NuxtLink>

      <NuxtLink to="" target="_blank" class="socials__item">
        <img src="@/assets/imgs/twitter-logo.svg" alt="twitter"/>
      </NuxtLink>
    </div>

    <NuxtLink class="event link link--small link--gray" to="">
      5 days left before the championship

      <img class="link__arrow" src="@/assets/imgs/Arrow.svg" alt="arrow"/>
    </NuxtLink>
  </footer>
</template>

<style lang="scss" scoped>
.footer{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.lang{
  margin-left: 10px;
  padding: 10px 20px;
  background: #ffffff0d;
  border: 1px solid #ffffff1a;
  backdrop-filter: blur(50px);
  border-radius: 20px;

  font-family: 'Neue Plak';
  font-weight: 600;
  font-size: 14px;
  line-height: 160%;
  color: #fff;
}

.socials{
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-left: 20px;
  margin-right: auto;
  &__item{
    width: 22px;
    cursor: pointer;
  }
}

.event{
  margin-left: auto;
}

@media screen and (max-width: 1439px) {
  .footer{
    flex-wrap: wrap;
    row-gap: 36px;
    padding: 50px;
  }
  .event{
    width: 100%;
    order: 0;
    margin-left: unset;
  }
  .lang{
    margin-left: unset;
  }
}

@media screen and (max-width: 833px) {
  .footer{
    row-gap: 24px;
    padding: 33px 20px;
  }
}
</style>