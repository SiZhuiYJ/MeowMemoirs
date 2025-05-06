<script setup lang="ts">
</script>
<template>
    <div class="common-layout">
        <el-container class="lay-content">
            <!--自定义左侧导航栏-->
            <el-container>
                <el-header class="el-header">
                    <common-header />
                </el-header>
                <el-breadcrumb separator="/" class="bread">
                    <el-breadcrumb-item :to="{ path: '/' }"> {{ $route.fullPath }}</el-breadcrumb-item>
                    <DeviceInformation />
                </el-breadcrumb>
                <el-main class="right-main">
                    <router-view></router-view>
                </el-main>
                <el-footer class="el-footer">
                    <common-footer />
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>
<style scoped lang="scss"></style>