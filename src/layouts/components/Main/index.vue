<script setup lang="ts">
import { ref, watch, provide, onBeforeUnmount, nextTick } from "vue";
import Maximize from "@/layouts/components/Main/components/Maximize.vue";
import { useDebounceFn } from "@vueuse/core";
import Tabs from "@/layouts/components/Tabs/index.vue";
import commonFooter from "@/layouts/components/Footer/index.vue";
import { useKeepAliveStore, useGlobalStore } from "@/stores";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
const route = useRoute();

const { globalStore } = storeToRefs(useGlobalStore());

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
  () => globalStore.value.maximize,
  () => {
    const app = document.getElementById("app") as HTMLElement;
    if (globalStore.value.maximize) app.classList.add("main-maximize");
    else app.classList.remove("main-maximize");
    // 浏览器没有实际变化的情况下，触发一次浏览器尺寸变化的逻辑。保证全屏切换的时候，表格阔以进行自适应。
    const event = new Event("resize");
    window.dispatchEvent(event);
  },
  { deep: true, immediate: true }
);

const screenWidth = ref(0);
const showTabs = ref(true);

/** 监听窗口大小变化，折叠侧边栏 */
const listeningWindow = useDebounceFn(() => {
  screenWidth.value = document.body.clientWidth;
  if (!globalStore.value.isCollapse && screenWidth.value < 1200)
    useGlobalStore().setGlobal("isCollapse", true);
  if (globalStore.value.isCollapse && screenWidth.value > 1200)
    useGlobalStore().setGlobal("isCollapse", false);
  if (screenWidth.value < 520) {
    showTabs.value = false;
  } else {
    showTabs.value = true;
  }
}, 100);

window.addEventListener("resize", listeningWindow, false);

onBeforeUnmount(() => {
  window.removeEventListener("resize", listeningWindow);
});
</script>

<template>
  <Maximize v-show="globalStore.maximize" />
  <Tabs v-if="showTabs"></Tabs>
  <el-main class="layout layout-main">
    <router-view v-slot="{ Component, route }">
      <transition :name="globalStore.transition" mode="out-in" appear>
        <keep-alive :max="16" :include="useKeepAliveStore().keepAliveStore.keepAliveName">
          <component :is="Component" :key="route.fullPath" v-if="isRouterShow" />
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
  <common-footer class="layout"></common-footer>
</template>

<style lang="scss" scoped>
@use "../../../styles/transition.scss";

.layout {
  display: flex;
  flex-direction: column;
  padding: 5px 6px;
  overflow-x: hidden;
  background-color: var(--el-bg-color);
}
.layout-main {
  flex: 1;
}
</style>
