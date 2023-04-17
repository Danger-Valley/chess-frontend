<template>
  <NuxtPage></NuxtPage>
</template>

<style lang="scss">
@font-face {
  font-family: 'Neue Plak';
  src: url('~/assets/fonts/NeuePlak/NeuePlak-Regular.ttf');
  font-weight: 400;
}

@font-face {
  font-family: 'Neue Plak';
  src: url('~/assets/fonts/NeuePlak/NeuePlak-SemiBold.ttf');
  font-weight: 600;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.link {
  display: flex;
  flex-direction: row;
  cursor: pointer;

  font-family: 'Neue Plak';
  font-weight: 600;
  text-transform: uppercase;

  &--small {
    font-size: 14px;
    line-height: 160%;
    gap: 10px;

    &__arrow {
      width: 8px;
    }
  }

  &--normal {
    font-size: 22px;
    line-height: 100%;
    gap: 15px;

    &__arrow {
      width: 16px;
    }
  }

  &--gray {
    color: #FFFFFF4d;
  }

  &--green {
    color: #27F4BA;
  }
}
</style>