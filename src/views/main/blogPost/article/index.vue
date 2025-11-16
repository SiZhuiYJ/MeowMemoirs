<script lang="ts" setup>
import { onMounted, ref } from "vue";
// 局部按需引入已配置好的编辑器（配置位于 src/libs/vmd-editor.ts）
import { VMdPreview } from "@/libs/vmd-editor";

import useCurrentBlog from "@/features/blogPost/useBlogCurrent"
const { currentBlog, selectBlog } = useCurrentBlog()
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
  blogContent.value = (await selectBlog(Number(articleId.value))).content;
});
</script>
<template>
  <div class="article">
    <div v-if="currentBlog" class="article-context">
      <v-md-preview :text="currentBlog.content"></v-md-preview>
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
