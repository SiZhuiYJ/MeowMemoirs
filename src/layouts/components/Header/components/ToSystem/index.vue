<template>
  <div @click="toSystem" class="toolbar" style="color: var(--el-header-text-color)">
    <el-tooltip content="控制台">
      <el-icon class="to-system" style="font-size: 20px">
        <Monitor />
      </el-icon>
    </el-tooltip>
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

<style lang="scss" scoped>
.to-system {
  border-radius: 5px;
  padding: 3px;
  &:hover {
    border: 1px solid var(--el-color-primary-light-7);
    box-shadow: 0 0 4px 2px var(--el-color-primary-light-7);
  }
}
</style>
