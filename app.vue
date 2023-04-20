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
  overflow: hidden;
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
    line-height: 1.6;
    gap: 10px;

    .link__arrow {
      width: calc(8px * 1.25);
    }
  }

  &--normal {
    font-size: 22px;
    line-height: 1;
    gap: 15px;

    .link__arrow {
      width: calc(16px * 1.25);
    }
  }

  &--gray {
    color: #FFFFFF4d;
  }

  &--green {
    color: $color1;
  }
}
</style>