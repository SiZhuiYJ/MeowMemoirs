<script setup lang="ts">
import { meowMsgError } from '@/utils/message'
import { onMounted } from 'vue'
onMounted(() => {
    meowMsgError('请先登录')
    
    console.log('Herrscher_of_Human')
})
</script>

<template>
    <router-view></router-view>
</template>

<style scoped lang="sass"> </style>
