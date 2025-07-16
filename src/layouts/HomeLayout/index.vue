<script setup lang="ts">
import commonHeader from "@/layouts/components/Header/index.vue";
import { useTemplateRef } from "vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
const mainScroll = useTemplateRef<HTMLElement>("mainScroll");
const scrollHeight = ref(0);

const handleScroll = () => {
  if (!mainScroll.value) return;
  scrollHeight.value = mainScroll.value?.scrollTop || 0;
  console.log(mainScroll.value);
  console.log(scrollHeight.value);
};
onMounted(() => {
  if (mainScroll.value) {
    mainScroll.value.addEventListener("scroll", handleScroll);
  }
});

onBeforeUnmount(() => {
  if (mainScroll.value) {
    mainScroll.value.removeEventListener("scroll", handleScroll);
  }
});
</script>
<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-header class="header" height="40px">
        <common-header :scrollHeight="scrollHeight"></common-header>
      </el-header>
      <el-main class="main">
        <div class="main-scroll" ref="mainScroll">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<style scoped lang="scss">
.header {
  position: absolute;
  padding: 0 !important;
  width: 100%;
}
.main {
  flex: 1;
  background-color: rgb(246, 249, 254);
  width: 100%;
  height: 100%;
  padding: 0 !important;
  .main-scroll {
    width: 100%;
    height: 100%;
    // height: calc(100vh - 50px);
    overflow-x: hidden;
    overflow-y: auto; // 隐藏滚动条
    display: flex;
    align-items: center;
    justify-content: center;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    // 滚动条轨道
    &::-webkit-scrollbar-track {
      background: transparent;
      width: 0;
      height: 0;
    }
    // 滚动条滑块
    &::-webkit-scrollbar-thumb {
      background: transparent;
      width: 0;
      height: 0;
    }
  }
}
.dark .main {
  background-color: rgb(33, 33, 33);
}
</style>
