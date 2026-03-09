<script setup lang="ts">
import { ref, onMounted, nextTick, computed, onUnmounted, watch } from "vue";
// import { setCursor } from "@/utils/cursor";
import { useTheme } from "@/utils/theme.ts";

import { useGlobalStore, useAccessStore } from "@/stores";
import { useScreenStore } from "@/utils/screen";
import zhCn from "element-plus/es/locale/lang/zh-cn";

// 初始化日历语言
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");

import { ConsoleMonitorWidget } from "@/features/console-monitor";

// 判断是否是开发环境
const isDev = import.meta.env.DEV

/**
 * 管理员账户信息
 * {
 *   "type": "RainbowId",
 *   "identifier": "admin_rainbow",
 *   "password": "Admin@123456"
 * }
 */

// 获取全局状态存储实例
const globalStore = useGlobalStore();
const { setGlobal } = useGlobalStore();

// 初始化访问数据
const { initializeData } = useAccessStore();

// 计算属性：获取当前设备维度设置（用于Element Plus组件尺寸）
const dimension = computed(() => globalStore.dimension);

// 初始化主题配置hook
const { initThemeConfig } = useTheme();

/**
 * 初始化主题配置
 * 在下一个DOM更新周期后执行主题初始化
 */
const handleThemeConfig = () => {
    nextTick(() => {
        initThemeConfig();
    });
};

/**
 * 初始化鼠标样式
 * 在下一个DOM更新周期后设置自定义鼠标样式（移动端除外）
 */
// const handleCursor = () => {
//     nextTick(() => {
//         if (!useScreenStore().isMobile.value) setCursor();
//     });
// };

/**
 * 点击动画效果函数
 * 在用户点击页面时创建花瓣飘落效果
 * @param event 点击事件对象
 */
function flowerOnClick(event: { pageX: number; pageY: number }) {
    // 创建虚拟容器元素
    let v = document.createElement("div");

    // 计算最大高度和宽度
    const maxH = document.body.scrollHeight,
        h = maxH / 10 + 10;
    const maxW = document.body.scrollWidth,
        w = 20;

    // 设置容器样式和位置
    v.setAttribute("class", "virtual-container");
    v.style.left = event.pageX - 8 + "px";
    v.style.top = event.pageY - 8 + "px";
    v.style.width =
        event.pageX + 20 + 8 > maxW ? maxW - event.pageX + 8 + "px" : w + "px";
    v.style.height =
        event.pageY + h + 8 > maxH ? maxH - event.pageY + 8 + "px" : h + "px";

    // 创建花瓣元素
    let e = document.createElement("div");
    e.setAttribute("class", "click-star");
    v.appendChild(e);

    // 添加到页面并设置自动移除
    document.body.appendChild(v);
    setTimeout(() => document.body.removeChild(v), 1000);
}

// 页面标题数组
const titles = [
    "(ฅ^•ﻌ•^ฅ)✧ 欢迎回来喵！", // 活跃状态标题
    "(ฅ•ω•ฅ)ﾉ♨ 去哪里了喵？", // 离开页面标题
    "(=｀ω´=)~zzZ 休息一下喵~" // 空闲状态标题
];

// 需要监听的用户活动事件
const events = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];

// 用户活跃状态管理
const isActive = ref(true);
const idleTimer = ref<number | null>(null);

/**
 * 设置页面标题
 * @param index 标题索引
 */
const setTitle = (index: number) => {
    document.title = titles[index];
};

/**
 * 重置空闲计时器
 * 用户活动时重置计时器，超过指定时间后标记为空闲状态
 */
const resetIdleTimer = () => {
    // 清除现有计时器
    if (idleTimer.value) {
        clearTimeout(idleTimer.value);
    }

    // 设置新的空闲计时器（1分钟后触发）
    idleTimer.value = window.setTimeout(
        () => {
            setTitle(2); // 设置为空闲状态标题
        },
        1 * 60 * 1000 // 1分钟空闲时间
    );
};

/**
 * 处理页面可见性变化
 * 当用户切换标签页时更新标题和计时器状态
 */
const handleVisibilityChange = () => {
    // 更新活跃状态
    isActive.value = !document.hidden;

    if (isActive.value) {
        // 返回页面时设置欢迎标题并重置计时器
        setTitle(0);
        resetIdleTimer();
    } else {
        // 离开页面时设置离开标题并清除计时器
        setTitle(1);
        if (idleTimer.value) {
            clearTimeout(idleTimer.value);
        }
    }
};

/**
 * 设置用户活动事件监听器
 * 监听各种用户交互事件以保持活跃状态
 */
const setupEventListeners = () => {
    events.forEach(event => {
        window.addEventListener(event, () => {
            if (isActive.value) {
                setTitle(0); // 用户操作时恢复欢迎标题
                resetIdleTimer(); // 重置空闲计时器
            }
        });
    });
};

// 监听屏幕尺寸变化，自动调整组件尺寸
watch(
    () => useScreenStore().isMobile.value,
    size => {
        // 移动端使用小尺寸，桌面端使用默认尺寸
        if (size) setGlobal("dimension", "small");
        else setGlobal("dimension", "default");
    }
);

/**
 * 组件挂载后的初始化操作
 */
onMounted(async () => {
    // 初始化主题配置
    handleThemeConfig();

    // 添加点击动画效果监听器
    document.addEventListener("click", flowerOnClick);

    // 设置初始页面标题
    setTitle(0);

    // 设置页面可见性变化监听器
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 设置用户活动监听器
    setupEventListeners();

    // 初始化空闲计时器
    resetIdleTimer();

    // 初始化鼠标样式（使用requestIdleCallback避免阻塞关键资源加载）
    // if ("requestIdleCallback" in window) {
    //     requestIdleCallback(() => {
    //         handleCursor();
    //     });
    // } else {
    //     // 兼容不支持requestIdleCallback的浏览器
    //     setTimeout(() => handleCursor(), 2000);
    // }

    // 初始化访问数据
    await initializeData();
});

/**
 * 组件卸载前的清理工作
 */
onUnmounted(() => {
    // 移除点击效果监听器
    document.removeEventListener("click", flowerOnClick);

    // 清理页面可见性监听器
    document.removeEventListener("visibilitychange", handleVisibilityChange);

    // 清除空闲计时器
    if (idleTimer.value) {
        clearTimeout(idleTimer.value);
    }

    // 移除所有用户活动监听器
    events.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
    });
});
</script>

<template>
    <!-- Element Plus全局配置组件 -->
    <el-config-provider :size="dimension" :locale="zhCn">
        <!-- 路由视图容器 -->
        <router-view></router-view>
    </el-config-provider>
    <!-- 控制台监控小部件  -->
    <ConsoleMonitorWidget v-if="isDev" />
</template>

<style scoped lang="scss">
// 移动端媒体查询
@media (max-width: 600px) {
    .click-star {
        font-size: medium; // 调整字体大小以适应手机屏幕
    }
}
</style>

<style lang="scss">
// 虚拟容器样式（用于点击动画）
.virtual-container {
    position: absolute;
    pointer-events: none;
    z-index: 999;
    overflow: hidden;
}

// 点击星标样式（花瓣效果）
.click-star {
    position: absolute;
    font-size: large;
    color: #efd7d9;
    animation: -snowflake-animate 1s linear forwards;
    z-index: 999;

    &::before {
        // 使用猫爪符号作为点击效果
        content: "🐾";
    }
}

// 点击动画关键帧
@keyframes -snowflake-animate {
    0% {
        // 初始状态：透明度0.6，位于点击位置
        transform: translateY(0);
        opacity: 0.6;
    }

    60% {
        // 中间状态：完全不透明
        opacity: 1;
    }

    100% {
        // 结束状态：向上移动并逐渐消失
        transform: translateY(9vh);
        opacity: 0;
    }
}
</style>
