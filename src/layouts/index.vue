<script setup lang="ts">
import { useScreenStore } from "@/utils/screen";
const { isMobile } = useScreenStore();
import LayoutMobile from "@/layouts/LayoutMobile/index.vue";
import HomeLayout from "@/layouts/HomeLayout/index.vue";
</script>
<template>
  <component :is="HomeLayout" v-if="!isMobile" />
  <component :is="LayoutMobile" v-if="isMobile" />
</template>
<style scoped lang="sass"></style>
