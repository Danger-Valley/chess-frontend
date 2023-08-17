<template>
  <NuxtPage></NuxtPage>
</template>

<script setup>
import { useMixpanelStore } from "@/stores/mixpanel"

useMixpanelStore().init();
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  &.no-overflow{
    overflow: hidden;
  }
}

a {
  text-decoration: unset;
  color: unset;
}

.page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background: $color-font;
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

// toasts
.v-toast {
  &__text {
    font-family: 'Neue Plak';
    font-size: 18px;
    line-height: 25px;
  }

  &__item {
    user-select: none;
    backdrop-filter: blur(20px);
    border-radius: 20px;
    color: #fff;

    &--success {
      background: rgba(0, 255, 80, 0.25);

      .v-toast__icon {
        background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0C5.3832 0 0 5.3832 0 12C0 18.6168 5.3832 24 12 24C18.6168 24 24 18.6168 24 12C24 5.3832 18.6168 0 12 0ZM17.1366 9.9366L11.1366 15.9366C10.9608 16.1124 10.7304 16.2 10.5 16.2C10.2696 16.2 10.0392 16.1124 9.8634 15.9366L6.8634 12.9366C6.5118 12.585 6.5118 12.0156 6.8634 11.664C7.215 11.3124 7.7844 11.3124 8.136 11.664L10.4994 14.0274L15.8628 8.664C16.2144 8.3124 16.7838 8.3124 17.1354 8.664C17.487 9.0156 17.4876 9.585 17.1366 9.9366Z' fill='white'/%3E%3C/svg%3E%0A") !important;
      }
    }

    &--error {
      background: rgba(255, 50, 0, 0.25);

      .v-toast__icon {
        background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 12C0 5.3832 5.3832 0 12 0C18.6168 0 24 5.3832 24 12C24 18.6168 18.6168 24 12 24C5.3832 24 0 18.6168 0 12ZM7 7.82487L7.82487 7L12.0791 11.2542L16.3333 7L17.1582 7.82487L12.904 12.0791L17.1582 16.3333L16.3333 17.1582L12.0791 12.904L7.82487 17.1582L7 16.3333L11.2542 12.0791L7 7.82487Z' fill='white'/%3E%3C/svg%3E%0A") !important;
      }
    }

    &--warning {
      background: rgba(255, 174, 0, 0.25);

      .v-toast__icon {
        background-image: url("data:image/svg+xml,%3Csvg width='22' height='18' viewBox='0 0 22 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.2389 15.451L12.4419 0.816C12.1349 0.305 11.5959 0 10.9999 0C10.4039 0 9.86488 0.305 9.55888 0.815L0.760884 15.451C0.448884 15.97 0.440884 16.619 0.738884 17.146C1.03588 17.673 1.59688 18 2.20288 18H19.7979C20.4029 18 20.9649 17.673 21.2619 17.146C21.5599 16.619 21.5509 15.97 21.2389 15.451ZM11.9999 15H9.99988V13H11.9999V15ZM11.9999 11H9.99988V6H11.9999V11Z' fill='white'/%3E%3C/svg%3E%0A") !important;
      }
    }

    &--info {
      background: rgba(0, 123, 255, 0.25);

      .v-toast__icon {
        background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 12C0 5.3832 5.3832 0 12 0C18.6168 0 24 5.3832 24 12C24 18.6168 18.6168 24 12 24C5.3832 24 0 18.6168 0 12ZM11.288 7.71C11.48 7.89 11.732 7.98 12.044 7.98C12.344 7.98 12.59 7.89 12.782 7.71C12.986 7.518 13.088 7.278 13.088 6.99C13.088 6.702 12.986 6.468 12.782 6.288C12.59 6.096 12.344 6 12.044 6C11.744 6 11.492 6.096 11.288 6.288C11.096 6.468 11 6.702 11 6.99C11 7.29 11.096 7.53 11.288 7.71ZM12.818 9.708H11.252V18.438H12.818V9.708Z' fill='white'/%3E%3C/svg%3E%0A") !important;
      }
    }

    &--default {
      background: rgba(82, 82, 82, 0.25);

      .v-toast__icon {
        background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 12C0 5.3832 5.3832 0 12 0C18.6168 0 24 5.3832 24 12C24 18.6168 18.6168 24 12 24C5.3832 24 0 18.6168 0 12ZM11.288 7.71C11.48 7.89 11.732 7.98 12.044 7.98C12.344 7.98 12.59 7.89 12.782 7.71C12.986 7.518 13.088 7.278 13.088 6.99C13.088 6.702 12.986 6.468 12.782 6.288C12.59 6.096 12.344 6 12.044 6C11.744 6 11.492 6.096 11.288 6.288C11.096 6.468 11 6.702 11 6.99C11 7.29 11.096 7.53 11.288 7.71ZM12.818 9.708H11.252V18.438H12.818V9.708Z' fill='white'/%3E%3C/svg%3E%0A") !important;
      }
    }
  }
}
</style>