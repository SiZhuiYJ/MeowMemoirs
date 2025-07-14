<template>
  <div class="header-left">
    <img
      class="logo"
      :src="globalStore.isDark ? logoUrlDark : logoUrl"
      alt=""
      srcset=""
    />
    <div class="logo-text">
      Meow
      <span :style="{ color: globalStore.isDark ? '#000' : '#fff' }">Memoirs</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoUrl from "@/assets/image/catsdiary.webp";
import logoUrlDark from "@/assets/image/catsdiary-dark.webp";
import { useGlobalStore } from "@/stores";

const globalStore = useGlobalStore();
</script>

<style lang="scss" scoped>
.header-left {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--el-header-text-color-regular);
  border-radius: 5px;
  padding-right: 3px;
  .logo {
    height: 26px;
    width: 50px;
    padding: 0 2px;
    object-fit: cover;
  }
  .logo-text {
    display: flex;
    align-items: center;
    color: var(--el-header-text-color-regular);
    font-weight: bold;
    font-size: 20px;
    span {
      padding: 3px 1.5px;
      background-color: var(--el-color-primary);
      border-radius: 5px;
    }
  }

  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
