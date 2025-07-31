<template>
  <div
    class="toolbar"
    style="color: var(--el-header-text-color); width: 32px; border-radius: 50%"
  >
    <el-tooltip :content="!globalStore.isDark ? '明亮模式' : '暗夜模式'">
      <div class="mode-hover">
        <ModeSwitching />
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores";
import ModeSwitching from "./ModeSwitching/index.vue";

const globalStore = useGlobalStore();

defineProps({
  size: {
    type: Number,
    default: 21,
  },
});
</script>

<style lang="scss" scoped>
.mode-hover {
  height: 24px;
  width: 24px;
  padding: 2px;
  border-radius: 50%;
  &:hover {
    border: 1px solid var(--el-color-primary-light-7);
    box-shadow: 0 0 4px 2px var(--el-color-primary-light-7);
  }
}
</style>
<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

::view-transition-old(root) {
  z-index: 9999;
}

::view-transition-new(root) {
  z-index: 1;
}

.dark::view-transition-old(root) {
  z-index: 1;
}

.dark::view-transition-new(root) {
  z-index: 9999;
}
</style>
