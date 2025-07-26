import { defineStore } from "pinia";
import { ref } from "vue";
import type { blogPost, operation } from "@/libs/api/blogPost/type";
import { BlogPostApi } from "@/libs/api/blogPost";

export const useBlogStore = defineStore("blog", () => {
  // 扁平化路由数据
  const blogList = ref<blogPost[]>([]);

  const getBlogList = async () => {
    const { data } = await BlogPostApi.MMPostBlogGetList();
    blogList.value = data.blogs;
    console.log(blogList.value);
  };
  const selectBlog = async (id: number) => {
    const { data } = await BlogPostApi.MMPostBlogPostDetail(id);
    return data;
  };
  const uploadBlog = async (blog: blogPost, operation: operation) => {
    const { data } = await BlogPostApi.MMPostBlogPostUpload(blog, operation);
    return data;
  };
  return {
    blogList,
    getBlogList,
    selectBlog,
    uploadBlog,
  };
});
