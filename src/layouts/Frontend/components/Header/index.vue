<script setup lang="ts">
import AsideSubMenu from "@/layouts/components/Menu/AsideSubMenu.vue";
import { layoutRouter } from "@/routers/modules/staticRouter";
import { useRoute } from "vue-router";
import { computed } from "vue";
const route = useRoute();
import { useGlobalStore } from "@/stores";
const globalStore = useGlobalStore();
import Toolbar from "./components/Toolbar/index.vue";
import Logo from "./components/Logo/index.vue";
import Top from "./components/Top/index.vue";
defineProps<{
  scrollHeight: number;
}>();
const emit = defineEmits<{
  (e: "backToTop"): void;
}>();
const handBackToTop = () => {
  emit("backToTop");
};
const columnActive = computed(() => route.path);
</script>
<template>
  <div
    class="common-header"
    :class="{ scrolled: scrollHeight > 50 }"
    :style="{
      background: scrollHeight > 50 ? 'var(--el-header-bg-color)' : 'transparent',
      '--el-header-text-color':
        scrollHeight > 50 ? (globalStore.isDark ? '#fff' : '#000') : '#fff',
    }"
  >
    <Logo></Logo>
    <el-menu
      class="el-menu-popper"
      :default-active="columnActive"
      mode="horizontal"
      :popper-offset="16"
      ellipsis
    >
      <AsideSubMenu :menuList="layoutRouter[1].children" menuType="main" />
    </el-menu>
    <Top :scrollHeight="scrollHeight" @click="handBackToTop()" />
    <Toolbar
      :style="{
        background: scrollHeight > 50 ? 'var(--el-header-bg-color)' : 'transparent',
        boxShadow:
          '-10px 0px 10px 0px' +
          (scrollHeight > 50 ? 'var(--el-header-bg-color)' : 'transparent'),
      }"
      style="transition: all 0.3s ease"
    ></Toolbar>
  </div>
</template>
<style scoped lang="scss">
.el-menu-popper {
  max-width: calc(100vw - 500px);
  height: 40px;
  border-bottom: none;
  background: none;
  overflow-y: hidden;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 4px;
  }

  // 滚动条轨道
  &::-webkit-scrollbar-track {
    display: none;
  }

  // 滚动条滑块
  &::-webkit-scrollbar-thumb {
    height: 4px;
    background: var(--el-color-primary);
  }
}
.common-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 5px;
  position: sticky;
  top: 0;
  z-index: 1000;
  width: calc(100% - 30px);
  border-radius: 10px;
  margin: 10px;
  transition: all 0.5s ease;
  color: var(--el-header-text-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: #000;
  backdrop-filter: blur(1px);

  &.scrolled {
    margin: 0;
    border-radius: 0;
    width: calc(100% - 10px);
    backdrop-filter: blur(0);
  }
}
</style>
