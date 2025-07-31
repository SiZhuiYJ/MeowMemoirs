<script setup lang="ts">
import { computed, ref } from "vue";
import Refresh from "@/layouts/components/Header/components/Refresh/index.vue";
import MobileDrawer from "@/components/MobileDrawer/Index.vue";
import ColumnSubMenu from "@/layouts/components/Menu/ColumnSubMenu.vue";
import Logo from "@/layouts/components/Logo/index.vue";
import Main from "@/layouts/components/Main/index.vue";
import { useGlobalStore, useAuthStore } from "@/stores";
import { useRoute } from "vue-router";
import type { AppRouteRecordRaw } from "@/routers/type";
import Toolbar from "@/layouts/components/Header/components/Toolbar/index.vue";
const route = useRoute();
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const menuAnimate = ref("animate__animated animate__fadeInLeft");
const activeMenu = computed(
  () => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string
);

const menuList = computed(() =>
  authStore.recursiveMenuList[0].children.filter(
    (item: AppRouteRecordRaw) => item.meta.isHide == "1"
  )
);
const mobileDrawer = ref(false);
</script>
<template>
  <el-container class="layout-container">
    <el-header class="el-header">
      <div class="common-header">
        <Refresh style="width: 20px; height: 20px"></Refresh>
        <el-breadcrumb separator="/" class="bread">
          <el-breadcrumb-item :to="{ path: '/' }" class="bread-item">
            {{ $route.fullPath }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="menu-btn">
          <button @click="mobileDrawer = true">
            <div class="menu-icon"></div>
          </button>
        </div>
      </div>
    </el-header>
    <Main></Main>
  </el-container>
  <!-- 左侧抽屉菜单 -->
  <MobileDrawer style="width: 220px" v-model="mobileDrawer" placement="right">
    <div class="transition-all mobile-drawer">
      <Logo layout="mobile"></Logo>
      <el-scrollbar class="layout-scrollbar">
        <!-- :unique-opened="true" 子菜单不能同时展开 -->
        <el-menu
          :default-active="activeMenu"
          :collapse-transition="false"
          :uniqueOpened="globalStore.uniqueOpened"
          :router="false"
          :class="menuAnimate"
        >
          <ColumnSubMenu :menuList="menuList"></ColumnSubMenu>
        </el-menu>
      </el-scrollbar>
      <Toolbar class="common-footer"></Toolbar>
    </div>
  </MobileDrawer>
</template>
<style scoped lang="scss">
.mobile-drawer {
  position: absolute;
  width: 100%;
  height: calc(100vh - 88px);
  .common-footer {
    // 靠位底部
    position: relative;
    bottom: 0;
    height: 44px;
  }
}
.layout-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .el-header {
    height: 30px;
    background-color: var(--el-header-bg-color);
    border-bottom: 1px solid var(--el-border-color-light);
    --el-header-padding: 0 !important;
    .common-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 5px;
      height: 20px;
      .menu-btn {
        width: 20px;
        height: 20px;
        cursor: pointer;
        // 边框
        border: 2px solid var(--el-text-color-regular);
        border-radius: 5px;
        position: relative;
        button {
          width: 100%;
          height: 100%;
          background-color: transparent;
          border: 0;
          .menu-icon {
            width: 60%;
            /* 设置宽度为60%*/
            height: 2px;
            /* 设置高度为2像素*/
            position: absolute;
            /* 设置定位为绝对定位*/
            background-color: var(--el-text-color-regular);
            /* 设置背景颜色为白色*/
            top: 50%;
            /* 设置顶部距离为父元素的50%*/
            left: 20%;
            /* 设置左侧距离为父元素的20%*/
            transform: translateY(-50%);
            /* 使用transform属性将元素垂直居中*/
            animation: to-hamburger 0.3s forwards ease-in-out;
            /* 设置动画效果 */
            /* 定义名为content的类中的btn类中的span元素的before和after伪元素*/
            &::before,
            &::after {
              content: "";
              /* 设置内容为空*/
              width: 100%;
              /* 设置宽度为100%*/
              height: 2px;
              /* 设置高度为2像素*/
              position: absolute;
              /* 设置定位为绝对定位*/
              background-color: var(--el-text-color-regular);
              /* 设置背景颜色为白色*/
              transition-duration: 0.3s;
              /* 设置过渡动画持续时间为0.3秒*/
              transform: rotate(0deg);
              /* 设置旋转角度为0度*/
              right: 0;
              /* 设置右侧距离为0 */
            }

            /* 定义名为content的类中的btn类中的span元素的before伪元素*/
            &::before {
              margin-top: -5px;
              /* 设置上外边距为-7像素 */
            }

            /* 定义名为content的类中的btn类中的span元素的after伪元素*/
            &::after {
              margin-top: 5px;
              /* 设置上外边距为7像素 */
            }
          }
        }
      }
    }
  }
}

.bread {
  padding: 2px;
  border: 2px solid var(--el-text-color-regular);
  border-radius: 5px;
}
.main {
  padding: 0;
  margin: 0;
  width: 100%;

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
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
