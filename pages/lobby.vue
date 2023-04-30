<template>
  <div class="page">
    <Header></Header>

    <main class="main">
      <div class="block"></div>
      <div class="block"></div>
      <div class="block block--double">
        <div class="block__double"></div>
        <div class="block__double"></div>
      </div>
      <div class="block"></div>
      <div class="block block--double"></div>
      <div class="block block--half">
        <div class="block__half"></div>
        <div class="block__half"></div>
      </div>
    </main>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 8px 110px;
}

.block {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;

  &--double {
    width: 100%;
    height: 100%;
    grid-column: span 2;
    aspect-ratio: unset;
  }

  &--half {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background-color: unset;
    cursor: auto;
  }

  &__double {}

  &__half {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 137px;
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
  }
}
</style>