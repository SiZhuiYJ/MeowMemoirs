<template>
  <section class="player-shell">
    <header class="player-shell__header">
      <slot name="title">Music Player</slot>
    </header>
    <div class="player-shell__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.player-shell {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-shell__header {
  font-weight: 700;
  font-size: 18px;
}

.player-shell__body {
  width: 100%;
}
</style>
