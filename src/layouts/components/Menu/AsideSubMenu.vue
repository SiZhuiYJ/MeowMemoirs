<script setup lang="ts">
import AsideSubMenu from "@/layouts/components/Menu/AsideSubMenu.vue";
import { useRouter } from "vue-router";
const router = useRouter();
defineProps(["menuList", "menuType"]);

const handleSubMenu = (path: string) => {
  router.push(path);
};
</script>
<template>
  <template v-for="item in menuList" :key="item.path">
    <el-sub-menu v-if="item.children?.length" :index="item.path" class="sub-item">
      <template #title>
        <GlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></GlobalIcon>
        {{ item.meta?.title }}
      </template>
      <AsideSubMenu :menuList="item.children" menuType="sub" />
    </el-sub-menu>
    <el-menu-item
      v-else-if="item.meta.isHide == '1'"
      :index="item.path"
      class="item"
      :class="{ 'menuType-sub': menuType == 'sub' }"
      :icon="item.meta?.icon"
      :style="{ borderTop: menuType == 'sub' ? 'none' : '' }"
      @click="handleSubMenu(item.path)"
    >
      <GlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></GlobalIcon>
      {{ item.meta?.title }}
    </el-menu-item>
  </template>
</template>
<style scoped lang="scss">
.item {
  border-bottom: none !important;
  border-top: 2px solid transparent;
  // color: var(--el-header-text-color);
}
.sub-item {
  border-top: 2px solid transparent;
  // --el-menu-text-color: var(--el-header-text-color) !important;
}
.is-active {
  border-top: 2px solid var(--el-menu-active-color);
  color: var(--el-menu-active-color) !important;
  //    背景变化从上到下
  background: linear-gradient(
    to bottom,
    var(--el-color-primary-light-9) 0,
    transparent 100%
  );
  div {
    border-bottom: none;
  }
}
.menuType-sub {
  border-left: 2px solid transparent;
}
.menuType-sub.is-active {
  border-left: 2px solid var(--el-menu-active-color) !important;
  background: linear-gradient(
    to right,
    var(--el-color-primary-light-9) 0,
    transparent 100%
  );
  div {
    border-bottom: none;
  }
}
</style>
<style lang="scss">
.is-active {
  div {
    border-bottom: none !important;
  }
}
</style>
