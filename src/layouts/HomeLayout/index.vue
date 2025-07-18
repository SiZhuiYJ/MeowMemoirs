<script setup lang="ts">
import commonHeader from "@/layouts/components/Header/index.vue";
import { ref } from "vue";
import { useWindowEventListener } from "@/hooks/useEventListener";
const scrollHeight = ref(0);

const handleScroll = () => {
  scrollHeight.value = window.scrollY;
};
// 返回顶部
const backToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // 平滑滚动
  });
};
useWindowEventListener("scroll", handleScroll);
</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header" height="40px">
        <common-header
          :scrollHeight="scrollHeight"
          @backToTop="backToTop()"
        ></common-header>
      </el-header>
      <main class="main">
        <div class="main-scroll">
          <router-view></router-view>
        </div>
      </main>
    </el-container>
  </div>
</template>
<style scoped lang="scss">
.header {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  padding: 0 !important;
  width: 100%;
}
.main {
  width: 100vw;

  .main-scroll {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.dark .main {
  background-color: rgb(33, 33, 33);
}
</style>
