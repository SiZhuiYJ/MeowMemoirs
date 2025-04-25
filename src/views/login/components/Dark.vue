<script setup lang="ts">
import { useTheme } from "@/utils/theme";
import useGlobalStore from "@/stores/modules/global";

const globalStore = useGlobalStore();
const { switchDark } = useTheme();

defineProps({
  size: {
    type: Number,
    default: 22
  }
});

/** 暗黑主题和明亮主题切换 */
const handleSwitchDark = async (event: MouseEvent) => {
  const x = event.clientX;
  const y = event.clientY;
  // 画圆
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // @ts-ignore
  if (document.startViewTransition == undefined) {
    /** 明亮和暗黑模式核心逻辑 */
    // 定义图标切换变量(true-月亮，false-太阳)
    globalStore.setGlobalState("isDark", !globalStore.isDark);
    switchDark();
    /** 明亮和暗黑模式核心逻辑 */
  } else {
    // @ts-ignore
    const transition = document.startViewTransition(() => {
      /** 明亮和暗黑模式核心逻辑 */
      // 定义图标切换变量(true-月亮，false-太阳)
      globalStore.setGlobalState("isDark", !globalStore.isDark);
      switchDark();
      /** 明亮和暗黑模式核心逻辑 */
    });
    await transition.ready;
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: globalStore.isDark ? clipPath : [...clipPath].reverse()
      },
      {
        duration: 300,
        easing: "ease-in",
        pseudoElement: globalStore.isDark ? "::view-transition-new(root)" : "::view-transition-old(root)"
      }
    );
  }
};
</script>

<template>
  <div>
    <!-- 明亮模式 -->
    <el-tooltip :content="'明亮模式'" v-if="!globalStore.isDark">
      <SvgIcon name="menu-sun" :size="20" class="icon-wrapper light" @click="handleSwitchDark"></SvgIcon>
    </el-tooltip>
    <!-- 暗黑模式 -->
    <el-tooltip :content="'暗黑模式'" v-if="globalStore.isDark">
      <SvgIcon name="menu-moon" :size="20" class="icon-wrapper dark" @click="handleSwitchDark"></SvgIcon>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.icon-wrapper {
  border-radius: 9999px;
  padding: 6px;
  margin-right: 10px;
  border: none;
  outline: none;

  &.light {
    background-color: rgba(50, 50, 50, 0.06);
  }

  &.dark {
    background-color: rgba(255, 255, 255, 0.06);
  }
}
</style>
<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

::view-transition-old(root) {
  z-index: 9999;
}

::view-transition-new(root) {
  z-index: 1;
}

.dark::view-transition-old(root) {
  z-index: 1;
}

.dark::view-transition-new(root) {
  z-index: 9999;
}
</style>
