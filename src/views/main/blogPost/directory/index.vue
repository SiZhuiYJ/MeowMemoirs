<script setup lang="ts">
import { onMounted } from "vue";
import { useBlogStore } from "@/stores";
const { selectBlog, getBlogList, blogList } = useBlogStore();

// 初始加载
onMounted(() => {
  getBlogList();
});
</script>

<template>
  <div class="content-wrapper">
    <div class="file-selector">
      <div
        v-for="(item, index) in blogList"
        :key="index"
        @click="selectBlog(item.id)"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
