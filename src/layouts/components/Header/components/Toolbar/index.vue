<template>
  <div class="header-right">
    <!-- 路由缓存刷新 -->
    <Refresh></Refresh>
    <!-- 明亮/暗黑模式图标 -->
    <Dark></Dark>
    <!-- 全屏图标 -->
    <FullScreen></FullScreen>
    <!-- 主题配置 -->
    <ThemeSetting></ThemeSetting>
    <!-- 头像 AND 下拉折叠 -->
    <User></User>
    <!-- 网络 -->
    <loadlistener></loadlistener>
  </div>
</template>

<script setup lang="ts">
import User from "@/layouts/components/Header/components/User/index.vue";
import FullScreen from "@/layouts/components/Header/components/FullScreen/index.vue";
import Dark from "@/layouts/components/Header/components/Dark/index.vue";
import ThemeSetting from "@/layouts/components/Header/components/ThemeSetting/index.vue";
import Refresh from "@/layouts/components/Header/components/Refresh/index.vue";
import loadlistener from "@/layouts/components/Header/components/LoadListener/index.vue";
</script>

<style lang="scss" scoped>
.header-right {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
<style lang="scss">
.toolbar {
  width: 32px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
}
</style>
