<script setup lang="ts">
// import { meowMsgError } from '@/utils/message'
import { onMounted, nextTick, computed } from 'vue'
import { setCursor } from '@/utils/cursor'
import { useTheme } from "@/utils/theme.ts";
import { useGlobalStore } from "@/stores";
const { globalStore } = useGlobalStore();

const dimension = computed(() => globalStore.dimension);
const { initThemeConfig } = useTheme();
setCursor()
onMounted(() => {
    // 初始化主题配置
    handleThemeConfig();
    // 自动检测更新
    // handleAutoUpdate();
    // 开发环境打印项目名称
    console.log('%c admin %c Herrscher_of_Human',
        "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #6169FF; font-weight: bold;",
        "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #ff0000; font-weight: bold;")
    console.log('%c name %c weather',
        "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #6169FF; font-weight: bold;",
        "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #ff0000; font-weight: bold;")
    console.log('%c key %c 3d349cedfb25241944fe21e4c6928367',
        "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #6169FF; font-weight: bold;",
        "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #ff0000; font-weight: bold;")
    console.log('%c 密钥 %c 1848228ed988e26941c42415a1e5813a',
        "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #6169FF; font-weight: bold;",
        "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #ff0000; font-weight: bold;")
    console.log(
        `%c MeowMemoirs %c V1.0.0 `,
        "padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #6169FF; font-weight: bold;",
        "padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;"
    );
});

/** 初始化主题配置 */
const handleThemeConfig = () => {
    nextTick(() => {
        initThemeConfig();
    });
};
</script>

<template>
    <el-config-provider :size="dimension">
        <router-view></router-view>
    </el-config-provider>
</template>

<style scoped lang="sass"> </style>
