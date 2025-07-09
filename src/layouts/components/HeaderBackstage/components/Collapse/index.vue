<template>
  <div class="collapse-icon" @click="changeCollapseIcon">
    <el-icon :size="20">
      <svg-icon
        icon-class="menu-left"
        size="20px"
        v-if="globalStore.isCollapse"
        style="color: var(--el-header-text-color-regular)"
      />
      <svg-icon
        icon-class="menu-right"
        size="20px"
        v-if="!globalStore.isCollapse"
        style="color: var(--el-header-text-color-regular)"
      />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores";
import SvgIcon from "@/components/SvgIcons/index.vue";
const globalStore = useGlobalStore();

/** 切换图标 */
const changeCollapseIcon = () => {
  // 定义图标切换变量(true-折叠，false-展开)
  globalStore.isCollapse = useGlobalStore().setCollapse(globalStore.isCollapse);
};
</script>

<style lang="scss" scoped>
//hover:bg-[rgba(0,0,0,0.06)] icon w-36px h-36px rounded-md flex flex-justify-center flex-items-center
.collapse-icon {
  // 基础尺寸
  width: 36px;
  height: 36px;

  // 圆角配置（Tailwind 默认 rounded-md = 4px）
  border-radius: 4px;

  // flex 布局配置
  display: flex;
  justify-content: center;
  align-items: center;

  // 悬停效果
  &:hover {
    // 使用 rgba 透明度实现 hover 背景色变化
    background-color: rgba(0, 0, 0, 0.06);

    // 可选：添加过渡动画
    // transition: background-color 0.2s ease-in-out;
  }

  // 可选：active 点击效果
  // &:active {
  //   background-color: rgba(0, 0, 0, 0.1);
  // }
}
</style>
