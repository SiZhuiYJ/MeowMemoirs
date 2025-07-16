<template>
  <div class="TopMao" :class="{ TopMaoShow: scrollHeight > 500 }">
    <img src="/img/header/scroll.webp" alt="" srcset="" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  scrollHeight: number;
}>();
</script>

<style lang="scss" scoped>
@keyframes topMaoShake {
  0% {
    transform: translateY(-900px);
  }
  50% {
    transition: translateY(-890px);
  }
  100% {
    transform: translateY(-900px);
  }
}
.TopMao {
  width: 70px;
  height: calc(100vh - 100px);
  position: absolute;
  top: -999px;
  right: 15px;
  // 背景按照最长的边
  z-index: -1;
  cursor: pointer;
  display: flex;
  align-items: flex-end;
  transition: all 0.5s ease-in-out;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  // @media only screen and (max-width: 1200px) {
  //   display: none;
  // }
  // @media only screen and (max-height: 900px) {
  //   display: none;
  // }
}
.TopMaoShow {
  top: 0;
}
</style>
