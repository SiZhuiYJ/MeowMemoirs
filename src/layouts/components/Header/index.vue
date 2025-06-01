<script setup lang="ts">
import { STATIC_URL } from "@/config/index.ts";
import { layoutRouter } from "@/routers/modules/staticRouter";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { ref } from "vue";
const columnActive = ref(route.path);
const handleSubMenu = (path: string) => {
  columnActive.value = path;
  router.push(path);
};
const toSystem = () => {
  router.push(STATIC_URL);
};
</script>
<template>
  <div class="common-header">
    <div class="logo">logo</div>
    <el-menu
      class="el-menu-popper-demo"
      mode="horizontal"
      :popper-offset="16"
      style="max-width: 600px; height: 40px"
      :ellipsis="false"
    >
      <el-menu-item
        v-for="item in layoutRouter[1].children"
        :key="item.path"
        :index="item.path"
        :class="{
          'is-active': columnActive === item.path,
        }"
        style="border-bottom: none !important"
        :icon="item.meta?.icon"
        @click="handleSubMenu(item.path)"
        >{{ item.meta?.title }}</el-menu-item
      >
    </el-menu>
    <div @click="toSystem"></div>
  </div>
</template>
<style scoped lang="scss">
.common-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  background-color: var(--el-header-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);

  div {
    // cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }

    width: 120px;
    height: 30px;
    background-color: var(--el-color-primary);
  }
}
.is-active {
  border-top: 2px solid var(--el-menu-active-color);
  color: var(--el-menu-active-color) !important;
}
</style>
