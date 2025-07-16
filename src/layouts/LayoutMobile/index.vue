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
          <el-breadcrumb-item :to="{ path: '/' }" class="bread-item">
            {{ $route.fullPath }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-container class="main-container">
          <el-main class="main">
            <div class="main-scroll" ref="mainScroll">
              <router-view></router-view>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<style scoped lang="scss">
.main-container {
  padding: 0;
  margin: 0;
  height: calc(100vh - 14px - 32px);
}
.el-header {
  padding: 0;
  margin: 0;
  height: 32px;
}

.main {
  padding: 0;
  margin: 0;
  width: 100%;
  height: calc(100vh - 46px);

  overflow: clip;
  position: absolute;
  .main-scroll {
    width: 100%;
    height: 100%;
    // height: calc(100vh - 50px);
    overflow-x: hidden;
    overflow-y: auto; // 隐藏滚动条
    display: flex;
    align-items: center;
    justify-content: center;
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
}
.el-footer {
  background: #f5f5f5;
}
</style>
<style lang="scss">
.bread-item {
  width: 100%;
  span {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
