<script setup lang="ts">
// import { meowMsgError } from '@/utils/message'
import { ref, onMounted, nextTick, computed, onUnmounted } from "vue";
import { setCursor } from "@/utils/cursor";
import { useTheme } from "@/utils/theme.ts";
import { useGlobalStore } from "@/stores";
const globalStore = useGlobalStore();

const dimension = computed(() => globalStore.dimension);
const { initThemeConfig } = useTheme();
setCursor();
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
// 标题数组
const titles = [
  "(ฅ^•ﻌ•^ฅ)✧ 欢迎回来喵！",
  "(ฅ•ω•ฅ)ﾉ♨ 去哪里了喵？",
  "(=｀ω´=)~zzZ 休息一下喵~",
];
// 需要监听的事件
const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];

// 状态管理
const isActive = ref(true);
const idleTimer = ref<number | null>(null);

// 设置标题的辅助函数
const setTitle = (index: number) => {
  document.title = titles[index];
};

// 重置无操作计时器
const resetIdleTimer = () => {
  if (idleTimer.value) {
    clearTimeout(idleTimer.value);
  }
  idleTimer.value = window.setTimeout(() => {
    setTitle(2); // 无操作超过5分钟
  }, 1 * 60 * 1000); // 5分钟
};

// 页面可见性变化处理
const handleVisibilityChange = () => {
  isActive.value = !document.hidden;
  if (isActive.value) {
    setTitle(0);
    resetIdleTimer(); // 用户返回页面时重置计时器
  } else {
    setTitle(1);
    if (idleTimer.value) {
      clearTimeout(idleTimer.value); // 离开页面时清除计时器
    }
  }
};

// 用户操作事件监听
const setupEventListeners = () => {
  events.forEach((event) => {
    window.addEventListener(event, () => {
      if (isActive.value) {
        setTitle(0); // 用户操作时恢复欢迎标题
        resetIdleTimer(); // 重置无操作计时器
      }
    });
  });
};

onMounted(() => {
  // 初始化主题配置
  handleThemeConfig();

  // 自动检测更新
  // handleAutoUpdate();

  // 添加点击效果
  document.addEventListener("click", flowerOnClick);

  setTitle(0); // 初始设置欢迎标题

  // 设置页面可见性监听
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // 设置用户操作监听
  setupEventListeners();

  // 初始化无操作计时器
  resetIdleTimer();
});

onUnmounted(() => {
  // 移除点击效果
  document.removeEventListener("click", flowerOnClick);

  // 清理工作
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  if (idleTimer.value) {
    clearTimeout(idleTimer.value);
  }

  // 移除所有用户操作监听器

  events.forEach((event) => {
    window.removeEventListener(event, resetIdleTimer);
  });
});
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
    //content: "\1F338";
    content: "🐾";
  }
}

@keyframes -snowflake-animate {
  0% {
    // transform: translateY(0) rotate(0deg);
    transform: translateY(0);
    opacity: 0.6;
  }

  60% {
    opacity: 1;
  }

  100% {
    // transform: translateY(10vh) rotate(90deg) rotateY(30deg);
    transform: translateY(9vh);
    opacity: 0;
  }
}
</style>
