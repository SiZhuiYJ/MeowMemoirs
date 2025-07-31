<script setup lang="ts">
import { useScreenStore } from "@/utils/screen";
const { isMobile } = useScreenStore();
import HomeMobile from "@/layouts/Frontend/HomeMobile/index.vue";
import HomeLayout from "@/layouts/Frontend/HomeLayout/index.vue";
</script>
<template>
  <component :is="HomeLayout" v-if="!isMobile" />
  <component :is="HomeMobile" v-if="isMobile" />
</template>
<style scoped lang="sass"></style>
