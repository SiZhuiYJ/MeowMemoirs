<script setup lang="ts">
import { ref, watch, provide, onBeforeUnmount, nextTick, onMounted } from "vue";
import Maximize from "@/layouts/components/Main/components/Maximize.vue";
import { useDebounceFn } from "@vueuse/core";
import Tabs from "@/layouts/components/Tabs/index.vue";
import commonFooter from "@/layouts/components/Footer/index.vue";
import { useKeepAliveStore, useGlobalStore } from "@/stores";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
const route = useRoute();

const { maximize, isCollapse, transition } = storeToRefs(useGlobalStore());

// Main/index.vue
// 刷新当前路由页面缓存方法
const isRouterShow = ref(true);

const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val);
provide("refresh", refreshCurrentPage);
watch(
  () => route.fullPath,
  () => {
    isRouterShow.value = false; // 先隐藏组件
    nextTick(() => {
      isRouterShow.value = true; // 再显示组件，确保组件重新渲染
    });
  }
);

/** 监听当前页面是否最大化，动态添加 class */
watch(
  () => maximize,
  () => {
    const app = document.getElementById("app") as HTMLElement;
    if (maximize) app.classList.add("main-maximize");
    else app.classList.remove("main-maximize");
    // 浏览器没有实际变化的情况下，触发一次浏览器尺寸变化的逻辑。保证全屏切换的时候，表格阔以进行自适应。
    const event = new Event("resize");
    window.dispatchEvent(event);
  },
  { deep: true, immediate: true }
);

const screenWidth = ref(0);
const showTabs = ref(true);

/**
 * 监听窗口大小变化，折叠侧边栏
 * 使用 visualViewport.width 或 window.innerWidth 以避免某些移动端在滚动时因为地址栏收起/展开触发的高度变化
 * 导致 clientWidth 计算异常，从而误触发 showTabs 切换。
 */
const getViewportWidth = () => {
  // visualViewport 在部分浏览器中更精确，回退到 innerWidth
  // 保证在滚动导致地址栏收起/展开时不会误判宽度
  // @ts-ignore
  return (window.visualViewport && window.visualViewport.width) || window.innerWidth || document.documentElement.clientWidth;
};

const listeningWindow = useDebounceFn(() => {
  screenWidth.value = getViewportWidth();
  if (!isCollapse && screenWidth.value < 1200)
    useGlobalStore().setGlobal("isCollapse", true);
  if (isCollapse && screenWidth.value > 1200)
    useGlobalStore().setGlobal("isCollapse", false);
  // 仅根据宽度判断是否显示 tabs（避免滚动/高度变化影响）
  showTabs.value = screenWidth.value >= 520;
}, 100);

// 立即执行一次初始化，避免首次没有 resize 事件时状态不正确
onMounted(() => {
  listeningWindow();
});

window.addEventListener("resize", listeningWindow, false);

onBeforeUnmount(() => {
  window.removeEventListener("resize", listeningWindow);
});
</script>

<template>
  <Maximize v-show="maximize" />
  <Tabs></Tabs><!--  v-if="showTabs" -->
  <el-scrollbar>
    <el-main class="layout layout-main">
      <router-view v-slot="{ Component, route }">
        <transition :name="transition" mode="out-in" appear>
          <keep-alive :max="16" :include="useKeepAliveStore().keepAliveStore.keepAliveName">
            <component :is="Component" :key="route.fullPath" v-if="isRouterShow" />
          </keep-alive>
        </transition>
      </router-view>
    </el-main>
  </el-scrollbar>
  <common-footer class="layout"></common-footer>
</template>

<style lang="scss" scoped>
@use "../../../styles/transition.scss";

.layout-main {
  flex: 1;
  padding: 5px 6px;
  overflow-x: hidden;
  background-color: #f6f9fe;
}

.dark .layout-main {
  --un-bg-opacity: 1;
  background-color: rgb(0 0 0 / var(--un-bg-opacity));
}
</style>
