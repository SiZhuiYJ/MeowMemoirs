<script setup lang="ts">
import { layoutRouter } from "@/routers/modules/staticRouter";
import { useRoute, useRouter } from "vue-router";
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
const route = useRoute();
const router = useRouter();
import { ref } from "vue";
const columnActive = ref(route.path);
const handleSubMenu = (path: string) => {
  columnActive.value = path;
  router.push(path);
};
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
      class="el-menu-popper-demo"
      mode="horizontal"
      :popper-offset="16"
      style="max-width: 600px; height: 40px; border-bottom: none; background: none"
      :ellipsis="false"
    >
      <el-menu-item
        v-for="item in layoutRouter[1].children"
        :key="item.path"
        :index="item.path"
        :class="{
          'is-active': columnActive === item.path,
        }"
        style="border-bottom: none !important; color: var(--el-header-text-color)"
        :icon="item.meta?.icon"
        @click="handleSubMenu(item.path)"
        >{{ item.meta?.title }}</el-menu-item
      >
    </el-menu>
    <Top :scrollHeight="scrollHeight" @click="handBackToTop()" />
    <Toolbar
      :style="{
        background: scrollHeight > 50 ? 'var(--el-header-bg-color)' : 'transparent',
        boxShadow: '-10px 0px 10px 0px' + (scrollHeight > 50 ? '#fff' : '#ffffff00'),
      }"
      style="transition: all 0.3s ease"
    ></Toolbar>
  </div>
</template>
<style scoped lang="scss">
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
.is-active {
  border-top: 2px solid var(--el-menu-active-color);
  color: var(--el-menu-active-color) !important;
}
</style>
