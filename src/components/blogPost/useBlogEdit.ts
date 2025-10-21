import { ref } from 'vue';
import type { blogPost } from "@/libs/api/blogPost/type";
import { defineStore } from 'pinia';
import { CACHE_PREFIX } from "@/config";
import { BlogPostApi } from "@/libs/api/blogPost";
export const useEditBlog = defineStore("editBlog", () => {
    const data: blogPost = {
        id: 0,
        title: "",
        content: "",
        authorId: 0,
        author: "",
        createdAt: "",
        updatedAt: "",
        coverContent: "",
        tags: "",
    }
    // 缓存当前编辑的博客文章
    const editBlog = ref<blogPost>({
        id: 0,
        title: "",
        content: "",
        authorId: 0,
        author: "",
        createdAt: "",
        updatedAt: "",
        coverContent: "",
        tags: "",
    });
    // 临时缓存当前博客
    const currentCachedBlog = (blog: blogPost): blogPost => {
        editBlog.value = blog;
        return editBlog.value;
    };
    // 清除缓存的博客
    const clearCachedBlog = (): blogPost => {
        editBlog.value = data;
        return editBlog.value;
    };
    // 上传当前编辑博客
    const uploadCurrentBlog = async () => {
        const { data } = await BlogPostApi.MMPostBlogPostEdit(editBlog.value, editBlog.value.id === 0 ? "add" : "update");
        editBlog.value = data.blog;
        return editBlog.value;
    }
    return {
        editBlog,
        currentCachedBlog,
        clearCachedBlog,
        uploadCurrentBlog
    };
},
    {
        persist: {
            // enabled: true, // true 表示开启持久化保存，默认localStorage
            key: CACHE_PREFIX + "editBlog", // 默认会以 store 的 id 作为 key
            storage: localStorage,
        }
    }
);