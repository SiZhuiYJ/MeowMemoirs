<template>
  <!-- 全屏 -->
  <div class="toolbar" @click="toggle">
    <el-tooltip :content="globalStore.isFullScreen === false ? '全屏' : '退出全屏'">
      <el-icon class="icon" :size="18" style="color: var(--el-header-text-color-regular)">
        <FullScreen v-if="!globalStore.isFullScreen" />
        <CloseBold v-else />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";
import { watch } from "vue";
import { useGlobalStore } from "@/stores";

const globalStore = useGlobalStore();
// @vueuse/core 处理是否全屏
const { isFullscreen, toggle } = useFullscreen();

watch(isFullscreen, () => {
  if (isFullscreen.value) {
    useGlobalStore().setGlobal("isFullScreen", true);
  } else {
    useGlobalStore().setGlobal("isFullScreen", false);
  }
});
</script>

<style lang="scss" scoped></style>
