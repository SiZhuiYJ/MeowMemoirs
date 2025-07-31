import { defineStore } from "pinia";
import { ref } from "vue";
import type { blogPost, operation, Tag } from "@/libs/api/blogPost/type";
import { BlogPostApi } from "@/libs/api/blogPost";

export const useBlogStore = defineStore("blog", () => {
  // 扁平化路由数据
  const blogList = ref<blogPost[]>([]);
  // 所有博客标签
  const blogTags = ref<Tag[]>([]);
  // 缓存当前选中的博客文章
  const currentBlog = ref<blogPost>();
  // 缓存当前编辑的博客文章
  const editBlog = ref<blogPost>();

  // 获取博客列表
  const getBlogList = async () => {
    const { data } = await BlogPostApi.MMPostBlogGetList();
    blogList.value = data.blogs;
    console.log(blogList.value);
  };
  // 获取所有博客标签
  const getTagList = async () => {
    const { data } = await BlogPostApi.MMPostBlogGetTags();
    blogTags.value = data.tags;
    console.log(blogTags.value);
  };
  // 获取指定id博客
  const selectBlog = async (id: number) => {
    if (currentBlog.value && currentBlog.value.id === id) {
      return currentBlog.value; // 如果当前博客已被选中，直接返回
    }
    const { data } = await BlogPostApi.MMPostBlogPostDetail(id);
    currentBlog.value = data.blog;
    return currentBlog.value;
  };
  // 操作博客
  const uploadBlog = async (blog: blogPost, operation: operation) => {
    const { data } = await BlogPostApi.MMPostBlogPostUpload(blog, operation);
    currentBlog.value = data.blog;
    return currentBlog.value;
  };
  // 临时缓存当前博客
  const cacheCurrentBlog = (blog: blogPost) => {
    editBlog.value = blog;
  };
  return {
    blogList,
    blogTags,
    currentBlog,
    editBlog,
    getBlogList,
    getTagList,
    selectBlog,
    uploadBlog,
    cacheCurrentBlog,
  };
});
