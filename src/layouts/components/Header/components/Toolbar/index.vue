<template>
  <div class="header-right">
    <!-- 飞行模式 -->
    <FlightMode></FlightMode>
    <!-- 明亮/暗黑模式图标 -->
    <Dark></Dark>
    <!-- 控制台 -->
    <ToSystem></ToSystem>
    <!-- 网络 -->
    <loadlistener></loadlistener>
  </div>
</template>

<script setup lang="ts">
import Dark from "@/layouts/components/Header/components/Dark/index.vue";
import ToSystem from "@/layouts/components/Header/components/ToSystem/index.vue";
import FlightMode from "@/layouts/components/Header/components/FlightMode/index.vue";
import loadlistener from "@/layouts/components/HeaderBackstage/components/LoadListener/index.vue";
</script>

<style lang="scss" scoped>
.header-right {
  display: flex;
  align-items: center;
  justify-content: center;
  // 间隔
  gap: 6px;
  height: 100%;
  z-index: 10;
  height: 100%;
}
</style>
<style lang="scss">
.toolbar {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
