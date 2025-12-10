<script setup lang="ts"></script>
<template>
  <div class="confession-container">
    <router-view></router-view>
  </div>
</template>
<style scoped lang="scss">
.confession-container {
  width: 100vw;
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  // padding: clamp(16px, 3vw, 32px);
  box-sizing: border-box;
  overflow-y: auto;
  background: radial-gradient(circle at 18% 24%, rgba(255, 255, 255, 0.18), transparent 28%),
    radial-gradient(circle at 82% 10%, rgba(122, 200, 255, 0.26), transparent 32%),
    linear-gradient(135deg, #0f172a, #1e1b4b 40%, #0f172a);
  isolation: isolate;
}

.confession-container::before {
  content: "";
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.06), transparent 55%);
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.7;
  z-index: 0;
}
</style>
