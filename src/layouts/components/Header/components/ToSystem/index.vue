<template>
  <div
    @click="toSystem"
    class="toolbar"
    style="color: var(--el-header-text-color-regular); width: 60px; border-radius: 5px"
  >
    控制台
  </div>
</template>

<script setup lang="ts">
import { STATIC_URL } from "@/config/index.ts";
import { useRouter } from "vue-router";
const router = useRouter();
const toSystem = () => {
  router.push(STATIC_URL);
};
</script>

<style lang="scss" scoped></style>
