<template>
  <!-- 刷新 -->
  <div class="toolbar" @click="handleRefresh">
    <el-tooltip content="刷新缓存">
      <el-icon class="icon" :size="20" style="color: var(--el-header-text-color-regular)">
        <RefreshRight />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { meowMsgSuccess } from "@/utils/message";
import { HOME_URL } from "@/config";
import { koiSessionStorage, koiLocalStorage } from "@/utils/storage.ts";

/** 刷新路由 */
const handleRefresh = () => {
  koiSessionStorage.clear();
  koiLocalStorage.clear();
  meowMsgSuccess("刷新本地缓存成功🌻");
  // 必须使用这个把页面缓存刷掉
  window.location.replace(HOME_URL);
};
</script>

<style lang="scss" scoped></style>
