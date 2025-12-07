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
  background-color: #f1d5da;
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
