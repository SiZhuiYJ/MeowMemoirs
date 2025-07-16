<script setup lang="ts">
import commonHeader from "@/layouts/components/Header/index.vue";
import { useTemplateRef } from "vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
const mainScrollRef = useTemplateRef<HTMLDivElement>("mainScrollRef");
const scrollHeight = ref(0);

const handleScroll = () => {
  if (!mainScrollRef.value) return;
  scrollHeight.value = mainScrollRef.value?.scrollTop || 0;
};
// 返回顶部
const backToTop = () => {
  if (!mainScrollRef.value) return;
  mainScrollRef.value.scrollTo({
    top: 0,
    behavior: "smooth", // 平滑滚动
  });
};
onMounted(() => {
  if (mainScrollRef.value) {
    mainScrollRef.value.addEventListener("scroll", handleScroll);
  }
});

onBeforeUnmount(() => {
  if (mainScrollRef.value) {
    mainScrollRef.value.removeEventListener("scroll", handleScroll);
  }
});
</script>
<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-header class="header" height="40px">
        <common-header
          :scrollHeight="scrollHeight"
          @backToTop="backToTop()"
        ></common-header>
      </el-header>
      <el-main class="main">
        <div class="main-scroll" ref="mainScrollRef">
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
    transition: all 0.3s;
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
