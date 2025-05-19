<script setup lang="ts">
import commonHeader from '@/layouts/components/HeaderBackstage/index.vue'
import { useGlobalStore, useAuthStore } from "@/stores"
import type { AppRouteRecordRaw } from '@/routers/type'
const { globalStore } = useGlobalStore()
import { SVG_PREFIX } from "@/config/index.ts";
import Logo from "@/layouts/components/Logo/index.vue";
import Main from "@/layouts/components/Main/index.vue";
import ColumnSubMenu from "@/layouts/components/Menu/ColumnSubMenu.vue";
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SvgIcons from '@/components/SvgIcons/index.vue'

const route = useRoute();
const router = useRouter();
const { showMenuList } = useAuthStore();

console.log("双栏布局左侧动态路由", showMenuList);

// 动态绑定左侧菜单animate动画
const menuAnimate = ref("animate__animated animate__fadeInLeft");

/** 隐藏静态路由中isHide == '1'的数据 */
const menuList = computed(() => showMenuList.filter((item: AppRouteRecordRaw) => item.meta.isHide == "1"));
// const menuHoverCollapse = ref(settings.columnMenuHoverCollapse);

const columnActive = ref("");
const subMenuList = ref<AppRouteRecordRaw[]>();

watch(
    () => [menuList, route],
    () => {
        // 当前菜单没有数据直接 return
        if (!menuList.value.length) return;
        columnActive.value = route.path;
        const menuItem: AppRouteRecordRaw[] = menuList.value.filter((item: AppRouteRecordRaw) => {
            // 刷新浏览器，一级路由就会变成点击的二级路由，所以需要加上`/${route.path.split("/")[1]}` 进行获取，否则就没有默认选择的颜色。
            return route.path === item.path || route.path.split('/').slice(0, 3).join('/') === item.path;
            // return route.path === item.path || `/${route.path.split("/")[2]}` === item.path;
        });
        // 若获取的路由没有子菜单，则赋值为空。
        // if (!menuItem[0].children?.length) return (subMenuList.value = []);
        if (!menuItem[0]?.children || !menuItem[0].children?.length) return (subMenuList.value = []);
        // 若有子菜单则赋值给子菜单变量。
        subMenuList.value = menuItem[0].children;
        console.log('二级菜单', subMenuList.value)
    },
    {
        deep: true,
        immediate: true
    }
);

/** 点击加载子菜单数据 */
const handleSubMenu = (item: any) => {
    columnActive.value = item.path;
    if (item.children?.length) {
        // 该一级菜单，若是有子菜单，就会给第二个分栏菜单赋值。
        // router.push(item.path); // 加这个，点击最左侧菜单会重定向第一个子菜单。
        subMenuList.value = item.children;
        return;
    }
    // 若是没有子菜单，则给子菜单变量赋值为空，并且跳转路由。例如：首页。
    subMenuList.value = [];
    router.push(item.path);
};
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
</script>
<template>
    <!-- 分栏布局 -->
    <el-container class="layout-container">
        <div class="layout-column">
            <el-scrollbar>
                <div v-for="item in menuList" :key="item.path" class="left-column"
                    :class="{ 'is-active': columnActive === item.path || columnActive.split('/').slice(0, 3).join('/') === item.path }"
                    @click="handleSubMenu(item)" :title="columnActive + '+' + item.path">
                    <el-icon v-if="item.meta.icon && item.meta.icon.indexOf(SVG_PREFIX) == -1">
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <!-- 本地SVG -->
                    <el-icon v-if="item.meta.icon && item.meta.icon.indexOf(SVG_PREFIX) == 0">
                        <svg-icons :icon-class="item.meta.icon" />
                    </el-icon>
                    <el-tooltip :content="item.meta?.title" :show-after="2000" placement="top">
                        <span class="title">{{ item.meta?.title }}</span>
                    </el-tooltip>
                </div>
            </el-scrollbar>
        </div>
        <el-aside class="layout-aside"
            :style="{ width: !globalStore.isCollapse ? globalStore.menuWidth + 'px' : '56px' }"
            v-if="subMenuList?.length != 0">
            <Logo :isCollapse="globalStore.isCollapse" :layout="globalStore.layout"></Logo>
            <el-scrollbar class="layout-scrollbar">
                <!-- :unique-opened="true" 子菜单不能同时展开 -->
                <el-menu :default-active="activeMenu" :collapse="globalStore.isCollapse" :collapse-transition="false"
                    :uniqueOpened="globalStore.uniqueOpened" :router="false" :class="menuAnimate">
                    <ColumnSubMenu :menuList="subMenuList"></ColumnSubMenu>
                </el-menu>
            </el-scrollbar>
        </el-aside>
        <el-container>
            <el-header class="layout-header">
                <common-header></common-header>
            </el-header>
            <!-- 路由页面 -->
            <Main></Main>
        </el-container>
    </el-container>
</template>
<style scoped lang="scss">
/** 第一列菜单样式 */
.layout-column {
    display: flex;
    flex-direction: column;
    height: 100%;
    user-select: none;
    background-color: var(--el-menu-bg-color); // 用来做色弱模式
    box-shadow: var(--column-menu-box-shadow); // 双栏最左侧右边框阴影

    .left-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 50px;
        margin: 3px 6px 3px 4px;
        color: var(--el-menu-text-color);
        // cursor: pointer;
        border-radius: 4px;
        // border: 1px solid var(--el-border-color);
        border: 1px solid transparent;

        &:hover {
            // color: var(--el-color-primary);
            color: var(--el-menu-hover-text-color);
            // background: var(--el-color-primary-light-9);
            background: var(--el-menu-hover-bg-color);
            // border: 2px dashed var(--el-color-primary);
            border: 1px solid var(--el-menu-border-left-color);
            border-radius: 4px;
        }

        &.is-active {
            // color: var(--el-color-primary);
            color: var(--el-menu-hover-text-color);
            // background: var(--el-color-primary-light-8);
            background: var(--el-menu-active-bg-color);
            // border: 2px dashed var(--el-color-primary);
            border: 1px solid var(--el-menu-border-left-color);
            border-radius: 4px;
        }

        .el-icon {
            font-size: 18px;
        }

        .title {
            margin-top: 8px;
            font-size: 12px;
            font-weight: var(--aside-menu-font-weight);
            line-height: 14px;
            text-align: center;
            letter-spacing: 2px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
    }
}

.layout-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    .layout-aside {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: .15s;
        z-index: 10; // 左侧菜单层级
        padding-right: 6px; // 左侧布局右边距[用于悬浮和选择更明显]
        padding-left: 6px; // 左侧布局左边距[用于悬浮和选择更明显]
        background-color: var(--el-menu-bg-color);
        border-right: none;
        box-shadow: 2px 0 12px #1d23290d; // 双栏左侧布局菜单右边框阴影
    }

    .layout-header {
        height: 40px;
        background-color: var(--el-header-bg-color);
        border-bottom: 1px solid #d1d1da;
    }

    .layout-main {
        box-sizing: border-box;
        padding: 0;
        overflow-x: hidden;
        background-color: var(--el-bg-color);
    }
}

.layout-scrollbar {
    width: 100%;
    height: calc(100vh - 44px);
}

// .el-menu--collapse {
//     width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding));
// }

/** 去除菜单右侧边框 */
.el-menu {
    border-right: none;
}
</style>
<style lang="scss">
/** 菜单悬浮折叠宽度 */
.el-menu--collapse {
    width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding)) !important;
}
</style>