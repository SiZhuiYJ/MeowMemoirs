import { ref } from 'vue';
import type {
    blogPost
} from "@/libs/api/blogPost/type";
import { BlogPostApi } from "@/libs/api/blogPost";
export default function useCurrentBlog() {
    // 当前选中的博客文章
    const currentBlog = ref<blogPost>();
    // 获取指定id博客
    const selectBlog = async (id: number) => {
        if (currentBlog.value && currentBlog.value.id === id) {
            return currentBlog.value; // 如果当前博客已被选中，直接返回
        }
        const { data } = await BlogPostApi.PostBlogPostDetail(id);
        currentBlog.value = data.blog;
        return currentBlog.value;
    };
    return {
        currentBlog,
        selectBlog,
    };

}