<template>
    <div class="header-box">
        <div class="header-left">
            <!-- 左侧菜单展开和折叠图标 -->
            <Collapse></Collapse>
            <!-- 面包屑 -->
            <BreadCrumb></BreadCrumb>
        </div>
        <!-- 工具栏 -->
        <Toolbar></Toolbar>
    </div>
</template>

<script setup lang="ts">
import Collapse from "./components/Collapse/index.vue";
import BreadCrumb from "./components/BreadCrumb/index.vue";
import Toolbar from "./components/Toolbar/index.vue";
</script>

<style lang="scss" scoped>
.header-box {
    display: flex;
    justify-content: space-between;
    height: 40px; // $aside-header-height

    .header-left {
        display: flex;
        align-items: center;
        overflow: hidden;
        white-space: nowrap;
    }
}
</style>