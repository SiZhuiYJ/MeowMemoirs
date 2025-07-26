<script setup lang="ts">
import Article from "./article/index.vue";
import Directory from "./directory/index.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
// 文章id
const articleId = ref<string>(route.query.id as string);
</script>
<template>
  <component :is="Article" v-if="articleId" :id="articleId" />
  <component :is="Directory" v-else />
</template>
<style scoped lang="scss"></style>
