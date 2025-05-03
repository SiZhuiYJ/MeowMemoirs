<script setup lang="ts">
import { useUserStore } from '@/stores'
const outLogin=()=>{
    useUserStore().setToken(null);
}
</script>
<template>
<button @click="outLogin">退出登录</button>
</template>
<style scoped lang="scss"></style>