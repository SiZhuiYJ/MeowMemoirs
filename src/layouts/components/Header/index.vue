<script setup lang="ts">
import router from "@/routers";
import { STATIC_URL } from "@/config/index.ts";
const toSystem = () => {
    router.push(STATIC_URL)
}
</script>
<template>
    <div class="common-header">
        <div class="logo">logo</div>
        <div @click="toSystem"></div>
    </div>
</template>
<style scoped lang="scss">
.common-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    background-color: var(--background-color);
    padding: 0 20px;

    div {
        // cursor: pointer;

        &:hover {
            color: var(--el-color-primary);
        }

        width: 120px;
        height: 30px;
        background-color: var(--el-color-primary);
    }
}
</style>