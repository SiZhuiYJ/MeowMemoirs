<script lang="ts" setup>
import { onMounted, ref } from "vue";
import type { blogPost } from "@/libs/api/blogPost/type";

import { useBlogStore } from "@/stores";
const { selectBlog } = useBlogStore();

const blogData = ref<blogPost>();
const blogContent = ref<string>();

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
// 文章id
const articleId = ref<string>(route.query.id as string);
// 文章内容获取
onMounted(async () => {
  if (!articleId.value) {
    router.push("/main/blogPost");
    return;
  }
  blogData.value = await selectBlog(Number(articleId.value));
  console.log(blogData.value);
  blogContent.value = blogData.value.content;
  console.log(blogContent.value);
});
</script>
<template>
  <div class="article">
    <div v-if="blogContent" class="article-context">
      <v-md-preview :text="blogContent"></v-md-preview>
    </div>
  </div>
</template>
<style scoped lang="scss">
.article {
  width: 100vw;
  display: flex;
  justify-content: center;
  .article-context {
    padding: 20px;
    // width: 1000px;
    width: calc(100vw - 40px);
    background-color: #fff;
  }
}
@media screen and (max-width: 500px) {
  .article {
    .article-context {
      padding: 0;
      width: 100vw;
    }
  }
}
</style>
