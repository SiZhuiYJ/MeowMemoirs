<script setup lang="ts">
import { computed, type Component } from "vue";
import { useScreenStore } from "@/utils/screen";
const { isMobile } = useScreenStore();
import { useGlobalStore } from "@/stores";
import LayoutMobile from '@/layouts/LayoutMobile/index.vue'
import DefaultLayout from "@/layouts/DefaultLayout/index.vue";
const layout = computed(() => useGlobalStore().globalStore.layout);
// type LayoutType = "vertical" | "columns" | "classic" | "horizontal" | 'optimum' | string;
type LayoutType = "my" | string;
const LayoutComponent: Record<LayoutType, Component> = {
    my: DefaultLayout,
    // vertical: LayoutVertical,
    // columns: LayoutColumns,
    // classic: LayoutClassic,
    // horizontal: LayoutHorizontal,
    // optimum: LayoutOptimum
};
</script>
<template>
    <component :is="LayoutComponent[layout]" v-if="!isMobile" />
    <component :is="LayoutMobile" v-if="isMobile" />
</template>
<style scoped lang="sass"></style>