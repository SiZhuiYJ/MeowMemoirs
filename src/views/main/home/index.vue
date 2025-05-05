<script setup lang="ts">
import { useUserStore } from '@/stores'
import router from '@/routers'
const outLogin=()=>{
    useUserStore().setToken(null);
}
const login=()=>{router.push('/login')
}

</script>
<template>
<button @click="outLogin">退出登录</button>
<button @click="login">登录</button>
</template>
<style scoped lang="scss"></style>