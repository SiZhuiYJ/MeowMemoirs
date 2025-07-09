<template>
  <div class="header-right">
    <!-- 明亮/暗黑模式图标 -->
    <Dark></Dark>
    <!-- 控制台 -->
    <ToSystem></ToSystem>
  </div>
</template>

<script setup lang="ts">
import Dark from "@/layouts/components/Header/components/Dark/index.vue";
import ToSystem from "@/layouts/components/Header/components/ToSystem/index.vue";
</script>

<style lang="scss" scoped>
.header-right {
  display: flex;
  align-items: center;
  justify-content: center;
  // 间隔
  gap: 6px;
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

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
}
</style>
