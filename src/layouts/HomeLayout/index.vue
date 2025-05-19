<script setup lang="ts">
import commonHeader from '@/layouts/components/Header/index.vue'
</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header" height="40px">
                <common-header></common-header>
            </el-header>
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>
<style scoped lang="scss">
.header {
    border-bottom: 1px solid var(--foreground-color);
    background-color: var(--background-color);
    color: var(--foreground-color);
}
</style>