<!-- 黑白模式切换 -->
<script setup lang="ts">
import { useTheme } from "@/utils/theme.ts";
import { useGlobalStore } from "@/stores";
const globalStore = useGlobalStore();
const { switchDark } = useTheme();
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
    useGlobalStore().setGlobal("isDark", !globalStore.isDark);
    switchDark();
    /** 明亮和暗黑模式核心逻辑 */
  } else {
    // @ts-ignore
    const transition = document.startViewTransition(() => {
      /** 明亮和暗黑模式核心逻辑 */
      // 定义图标切换变量(true-月亮，false-太阳)
      useGlobalStore().setGlobal("isDark", !globalStore.isDark);
      switchDark();
      /** 明亮和暗黑模式核心逻辑 */
    });
    await transition.ready;
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: globalStore.isDark ? clipPath : [...clipPath].reverse(),
      },
      {
        duration: 300,
        easing: "ease-in",
        pseudoElement: globalStore.isDark
          ? "::view-transition-new(root)"
          : "::view-transition-old(root)",
      }
    );
  }
};
</script>

<template>
  <label for="themeToggle" class="themeToggle st-sunMoonThemeToggleBtn" type="checkbox">
    <input
      type="checkbox"
      id="themeToggle"
      class="themeToggleInput"
      :checked="globalStore.isDark"
      @click="handleSwitchDark"
    />
    <svg viewBox="0 0 20 20" fill="currentColor" stroke="none">
      <mask id="moon-mask">
        <rect x="0" y="0" width="20" height="20" fill="white"></rect>
        <circle cx="11" cy="3" r="8" fill="black"></circle>
      </mask>
      <circle class="sunMoon" cx="10" cy="10" r="8" mask="url(#moon-mask)"></circle>
      <g>
        <circle class="sunRay sunRay1" cx="18" cy="10" r="1.5"></circle>
        <circle class="sunRay sunRay2" cx="14" cy="16.928" r="1.5"></circle>
        <circle class="sunRay sunRay3" cx="6" cy="16.928" r="1.5"></circle>
        <circle class="sunRay sunRay4" cx="2" cy="10" r="1.5"></circle>
        <circle class="sunRay sunRay5" cx="6" cy="3.1718" r="1.5"></circle>
        <circle class="sunRay sunRay6" cx="14" cy="3.1718" r="1.5"></circle>
      </g>
    </svg>
  </label>
</template>

<style scoped>
/* 主要修改点：容器尺寸缩小到2em */
.themeToggle {
  color: #bbb;
  width: 2em; /* 从3em缩小到2em */
}

.st-sunMoonThemeToggleBtn {
  position: relative;
  cursor: pointer;
}

.st-sunMoonThemeToggleBtn .themeToggleInput {
  opacity: 0;
  width: 100%;
  aspect-ratio: 1;
}

.st-sunMoonThemeToggleBtn svg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
  transform: rotate(40deg);
}

.st-sunMoonThemeToggleBtn svg .sunMoon {
  transform-origin: center center;
  transition: inherit;
  transform: scale(1);
}

.st-sunMoonThemeToggleBtn svg .sunRay {
  transform-origin: center center;
  transform: scale(0);
}

.st-sunMoonThemeToggleBtn svg mask > circle {
  /* 按比例调整动画位移 */
  transition: transform 0.64s cubic-bezier(0.41, 0.64, 0.32, 1.575);
  transform: translate(0px, 0px);
}

.st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg {
  transform: rotate(90deg);
}

.st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg mask > circle {
  /* 按比例缩小位移量 (原16px->10.5px, -3px->-2px) */
  transform: translate(10.5px, -2px);
}

.st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg .sunMoon {
  transform: scale(0.55);
}

/* 保持太阳光线的动画效果 */
.st-sunMoonThemeToggleBtn .themeToggleInput:checked + svg .sunRay {
  animation: showRay1832 0.4s ease 0s 1 forwards;
}

@keyframes showRay1832 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
