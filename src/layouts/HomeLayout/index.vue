<script setup lang="ts">
import commonHeader from "@/layouts/components/Header/index.vue";
</script>
<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-header class="header" height="40px">
        <common-header></common-header>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<style scoped lang="scss">
.header {
  color: var(--foreground-color);
  background-color: var(--el-header-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  padding: 0 10px !important;
}
.main {
  flex: 1;
  background-color: rgb(246, 249, 254);
  height: 100%;
  padding: 0 !important;
  overflow: hidden;
}
.dark .main {
  background-color: rgb(33, 33, 33);
}
</style>
