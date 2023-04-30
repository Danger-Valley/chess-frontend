<template>
  <ClientOnly>
    <NuxtPage></NuxtPage>
  </ClientOnly>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

a {
  text-decoration: unset;
  color: unset;
}

.page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  background: #181B20;
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

@media screen and (min-width: #{map-get($sizes, "desktop-high") + px}) {
  .link {
    &--small {
      font-size: 18px;

      .link__arrow {
        width: calc(13px * 1.25);
      }
    }

    &--normal {
      font-size: 26px;
      gap: 19px;

      .link__arrow {
        width: calc(20px * 1.25);
      }
    }
  }
}

@media screen and (max-width: #{map-get($sizes, "tablet") + px}) {
  .link {
    &--normal {
      font-size: 18px;
      gap: 12px;

      .link__arrow {
        width: calc(20px * 1.25);
      }
    }
  }
}
</style>