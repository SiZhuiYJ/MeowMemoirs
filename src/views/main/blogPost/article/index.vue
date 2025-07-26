<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { BlogPostApi } from "@/libs/api/blogPost";
const props = defineProps<{
  articleId: string;
}>();
// 文章内容获取
const content = ref("");
onMounted(() => {});
</script>
<template></template>
<style scoped lang="scss"></style>
