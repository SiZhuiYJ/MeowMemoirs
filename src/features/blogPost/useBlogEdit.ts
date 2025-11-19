import { ref } from 'vue';
import type { UploadBlog, EditBlog } from "@/libs/api/blogPost/type";
import { defineStore } from 'pinia';
import { CACHE_PREFIX } from "@/config";
import { BlogPostApi } from "@/libs/api/blogPost";
export const useEditBlog = defineStore("editBlog", () => {
    const data: EditBlog = {
        id: 0,
        title: "",
        content: "",
        summary: "",
        tags: [],
    }
    // 缓存当前编辑的博客文章
    const editBlog = ref<EditBlog>({
        id: 0,
        title: "",
        content: "",
        summary: "",
        tags: [],
    });
    // 临时缓存当前博客
    const currentCachedBlog = (blog: EditBlog): EditBlog => {
        editBlog.value = blog;
        return editBlog.value;
    };
    // 清除缓存的博客
    const clearCachedBlog = (): EditBlog => {
        editBlog.value = data;
        return editBlog.value;
    };
    // 上传当前编辑博客
    const uploadCurrentBlog = async () => {
        const editBlogData: UploadBlog = {
            id: editBlog.value.id,
            title: editBlog.value.title,
            summary: editBlog.value.summary,
            content: editBlog.value.content,
            tags: JSON.stringify(editBlog.value.tags)
        };
        const { data } = await BlogPostApi.PostBlogPostEdit(editBlogData, editBlog.value.id === 0 ? "add" : "update");
        editBlog.value = {
            id: data.blog.id,
            title: data.blog.title,
            content: data.blog.content,
            summary: data.blog.summary,
            tags: JSON.parse(data.blog.tags) as string[],
        };
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