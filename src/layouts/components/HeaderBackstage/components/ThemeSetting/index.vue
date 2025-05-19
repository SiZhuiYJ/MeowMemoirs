<template>
  <!-- 设置 -->
  <div
    class="toolbar"
    @click="handleThemeDialog"
    style="color: var(--el-header-text-color-regular)"
  >
    <el-tooltip content="设置">
      <el-icon class="icon" :size="20">
        <Setting />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import mittBus from "@/utils/mittBus";

/** 打开主题配置 */
const handleThemeDialog = () => {
  mittBus.emit("handleThemeConfig");
};
</script>

<style lang="scss" scoped></style>
