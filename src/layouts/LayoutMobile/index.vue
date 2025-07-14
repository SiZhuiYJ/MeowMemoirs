<script setup lang="ts">
import Refresh from "@/layouts/components/HeaderBackstage/components/Refresh/index.vue";
</script>
<template>
  <div class="common-layout">
    <el-container class="lay-content">
      <!--自定义左侧导航栏-->
      <el-container>
        <el-header class="el-header">
          <div><Refresh></Refresh></div>
        </el-header>
        <el-breadcrumb separator="/" class="bread">
          <el-breadcrumb-item :to="{ path: '/' }">
            {{ $route.fullPath }}</el-breadcrumb-item
          >
        </el-breadcrumb>
        <el-container class="main-container">
          <el-main class="main">
            <router-view></router-view>
          </el-main>
          <el-footer class="el-footer"> </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<style scoped lang="scss">
.el-header,
.el-footer {
  padding: 0;
  margin: 0;
  height: 40px;
}
.main-container {
  padding: 0;
  margin: 0;
  height: calc(100vh - 14px - 40px);
  overflow-y: auto;
  // 隐藏滚动条
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  // 滚动条轨道
  &::-webkit-scrollbar-track {
    background: transparent;
    width: 0;
    height: 0;
  }
  // 滚动条滑块
  &::-webkit-scrollbar-thumb {
    background: transparent;
    width: 0;
    height: 0;
  }
}
.main {
  padding: 3px;
  margin: 0;
  // 隐藏滚动条
  overflow: clip;
}
</style>
