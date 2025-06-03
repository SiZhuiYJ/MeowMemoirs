<script setup lang="ts">
// import { meowMsgError } from '@/utils/message'
import { onMounted, nextTick, computed, onUnmounted } from "vue";
import { setCursor } from "@/utils/cursor";
import { useTheme } from "@/utils/theme.ts";
import { useGlobalStore } from "@/stores";
const { globalStore } = useGlobalStore();

const dimension = computed(() => globalStore.dimension);
const { initThemeConfig } = useTheme();
setCursor();
onMounted(() => {
  // 初始化主题配置
  handleThemeConfig();
  // 自动检测更新
  // handleAutoUpdate();
  // 开发环境打印项目名称
  console.log(
    "%c admin %c Herrscher_of_Human",
    "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #6169FF; font-weight: bold;",
    "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #ff0000; font-weight: bold;"
  );
  console.log(
    "%c name %c weather",
    "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #6169FF; font-weight: bold;",
    "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #ff0000; font-weight: bold;"
  );
  console.log(
    "%c key %c 3d349cedfb25241944fe21e4c6928367",
    "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #6169FF; font-weight: bold;",
    "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #ff0000; font-weight: bold;"
  );
  console.log(
    "%c 密钥 %c 1848228ed988e26941c42415a1e5813a",
    "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #6169FF; font-weight: bold;",
    "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #ff0000; font-weight: bold;"
  );
  console.log(
    `%c MeowMemoirs %c V1.0.0 `,
    "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #6169FF; font-weight: bold;",
    "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;"
  );
  document.addEventListener("click", flowerOnClick);
  onUnmounted(() => {
    document.removeEventListener("click", flowerOnClick);
  });
});
/** 初始化主题配置 */
const handleThemeConfig = () => {
  nextTick(() => {
    initThemeConfig();
  });
};
// 动画
function flowerOnClick(event: { pageX: number; pageY: number }) {
  let v = document.createElement("div");
  const maxH = document.body.scrollHeight,
    h = maxH / 10 + 10;
  const maxW = document.body.scrollWidth,
    w = 20;
  v.setAttribute("class", "virtual-container");
  v.style.left = event.pageX - 8 + "px";
  v.style.top = event.pageY - 8 + "px";
  v.style.width = event.pageX + 20 + 8 > maxW ? maxW - event.pageX + 8 + "px" : w + "px";
  v.style.height = event.pageY + h + 8 > maxH ? maxH - event.pageY + 8 + "px" : h + "px";
  let e = document.createElement("div");
  e.setAttribute("class", "click-star");
  v.appendChild(e);
  document.body.appendChild(v);
  setTimeout(() => document.body.removeChild(v), 1000);
}
</script>

<template>
  <el-config-provider :size="dimension">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped lang="scss">
@media (max-width: 600px) {
  .click-star {
    font-size: medium; // 调整字体大小以适应手机屏幕
  }
}
</style>
<style lang="scss">
.virtual-container {
  position: absolute;
  pointer-events: none;
  z-index: 999;
  overflow: hidden;
}

.click-star {
  position: absolute;
  font-size: large;
  color: #efd7d9;
  animation: -snowflake-animate 1s linear forwards;
  z-index: 999;
  &::before {
    content: "\1F338";
  }
}

@keyframes -snowflake-animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }

  60% {
    opacity: 1;
  }

  100% {
    transform: translateY(10vh) rotate(90deg) rotateY(30deg);
    opacity: 0;
  }
}
</style>
