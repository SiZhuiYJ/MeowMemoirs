<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Refresh from "@/layouts/components/Header/components/Refresh/index.vue";
import MobileDrawer from "@/components/MobileDrawer/Index.vue";
import ColumnSubMenu from "@/layouts/components/Menu/ColumnSubMenu.vue";
import Logo from "@/layouts/components/Logo/index.vue";
import { useGlobalStore } from "@/stores";
import { useRoute } from "vue-router";
import { layoutRouter } from "@/routers/modules/staticRouter";
import Toolbar from "../components/Header/components/Toolbar/index.vue";
import GlobalIcon from "@/components/GlobalIcon/index.vue";
const route = useRoute();
const globalStore = useGlobalStore();
const { setHeader } = useGlobalStore();
const menuAnimate = ref("animate__animated animate__fadeInLeft");
const menuList = computed(() => layoutRouter[1].children);
const activeMenu = computed(
    () => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string
);
const isHeader = ref(route.meta.isHeader === "1");

const toggleIsHeader = () => {
    setHeader(globalStore.isHeader);
};

watch(
    () => route.path,
    () => {
        isHeader.value = route.meta.isHeader === "1";
        setHeader(isHeader.value);
    }
);
const mobileDrawer = ref(false);
</script>
<template>
    <el-container class="lay-content">
        <el-header class="el-header" :style="{ top: globalStore.isHeader ? '-30px' : '0px' }">
            <div class="common-header">
                <Refresh style="width: 20px; height: 20px" class="refresh"></Refresh>

                <el-breadcrumb separator="/" class="bread">
                    <el-breadcrumb-item :to="{ path: '/' }" class="bread-item">
                        {{ $route.fullPath }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <div class="menu-btn" @click="mobileDrawer = true">
                    <div class="menu-icon"></div>
                </div>
            </div>
            <div class="drop-btn" @click="toggleIsHeader()">
                <GlobalIcon name="ArrowUp" class="drop-icon" :style="{
                    transform: !useGlobalStore().isHeader ? 'rotate(0)' : 'rotate(180deg)',
                }" size="16">
                </GlobalIcon>
            </div>
        </el-header>
        <el-main class="main">
            <!-- <div class="main-scroll" ref="mainScroll"> -->
            <router-view></router-view>
            <!-- </div> -->
        </el-main>
    </el-container>
    <!-- 右侧侧抽屉菜单 -->
    <MobileDrawer style="width: 220px" v-model="mobileDrawer" placement="right">
        <div class="transition-all mobile-drawer">
            <Logo layout="mobile"></Logo>
            <el-scrollbar class="layout-scrollbar">
                <!-- :unique-opened="true" 子菜单不能同时展开 -->
                <el-menu :default-active="activeMenu" :collapse-transition="false"
                    :uniqueOpened="globalStore.uniqueOpened" :router="false" :class="menuAnimate">
                    <ColumnSubMenu :menuList="menuList"></ColumnSubMenu>
                </el-menu>
            </el-scrollbar>
            <Toolbar class="common-footer"></Toolbar>
        </div>
    </MobileDrawer>
</template>
<style scoped lang="scss">
.lay-content {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.mobile-drawer {
    position: absolute;
    width: 100%;
    height: calc(100vh - 88px);

    .common-footer {
        position: relative;
        bottom: 0;
        height: 44px;
    }
}

.el-header {
    position: fixed;
    top: 0;
    left: 0;
    padding: 0;
    margin: 0;
    width: 100%;
    z-index: 20;
    height: auto;
    transition: all 0.3s;
    background: rgba(255, 255, 255, 0);
    backdrop-filter: blur(2px);

    .common-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 5px;
        height: 20px;

        .refresh {
            transition: all 0.3s;

            &:hover {
                transform: rotate(360deg);
            }
        }

        .menu-btn {
            width: 20px;
            height: 20px;
            cursor: pointer;
            // 边框
            border: 2px solid var(--el-text-color-regular);
            border-radius: 5px;
            position: relative;
            background-color: transparent;
            transition: all 0.3s;
            padding: 0;

            &:hover {
                border: 1px solid var(--el-text-color-regular);
                padding: 1px;

                .menu-icon {
                    height: 4px;

                    &::before {
                        height: 1px;
                        margin-top: -4px;
                    }

                    &::after {
                        height: 1px;
                        margin-top: 7px;
                    }
                }
            }

            .menu-icon {
                width: 60%;
                /* 设置宽度为60%*/
                height: 2px;
                /* 设置高度为2像素*/
                position: absolute;
                /* 设置定位为绝对定位*/
                background-color: var(--el-text-color-regular);
                /* 设置背景颜色为白色*/
                top: 50%;
                /* 设置顶部距离为父元素的50%*/
                left: 20%;
                /* 设置左侧距离为父元素的20%*/
                transform: translateY(-50%);
                /* 使用transform属性将元素垂直居中*/
                animation: to-hamburger 0.3s forwards ease-in-out;
                transition: all 0.3s;

                /* 设置动画效果 */
                /* 定义名为content的类中的btn类中的span元素的before和after伪元素*/
                &::before,
                &::after {
                    content: "";
                    /* 设置内容为空*/
                    width: 100%;
                    /* 设置宽度为100%*/
                    height: 2px;
                    /* 设置高度为2像素*/
                    position: absolute;
                    /* 设置定位为绝对定位*/
                    background-color: var(--el-text-color-regular);
                    /* 设置背景颜色为白色*/
                    transition-duration: 0.3s;
                    /* 设置过渡动画持续时间为0.3秒*/
                    transform: rotate(0deg);
                    /* 设置旋转角度为0度*/
                    right: 0;
                    /* 设置右侧距离为0 */
                }

                /* 定义名为content的类中的btn类中的span元素的before伪元素*/
                &::before {
                    margin-top: -5px;
                    /* 设置上外边距为-7像素 */
                }

                /* 定义名为content的类中的btn类中的span元素的after伪元素*/
                &::after {
                    margin-top: 5px;
                    /* 设置上外边距为7像素 */
                }
            }
        }
    }

    .drop-btn {
        position: absolute;
        // right: calc(50% - 8px);
        bottom: -10px;
        width: 100%;
        height: 10px;
        padding: 0px;
        // background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%,rgba(255, 255, 255, 0) 100%);
        backdrop-filter: blur(2px);
        display: flex;
        justify-content: center;
        pointer-events: none;
        border-top: 1px solid rgba(255, 255, 255, 0.2);

        .drop-icon {
            pointer-events: auto;
            transition: all 0.3s;
            cursor: pointer;
            transform: rotate(0);
            border-radius: 50%;
        }
    }
}

.bread {
    padding: 2px;
    border: 2px solid var(--el-text-color-regular);
    border-radius: 5px;

    &:deep(.bread-item) {
        width: 100%;

        span {
            width: 150px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}

.main {
    padding: 0;
    margin: 0;
    width: 100%;
    overflow: clip;
}

.dark .main {
    background-color: rgb(33, 33, 33);
}

.el-footer {
    background: #f5f5f5;
}
</style>
