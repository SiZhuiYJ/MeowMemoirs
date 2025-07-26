<script setup lang="ts"></script>
<template>
  <div class="confession-container">
    <router-view></router-view>
  </div>
</template>
<style scoped lang="scss">
.confession-container {
  width: 100vw;
  height: 100vh;
  background-color: #f1d5da;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
