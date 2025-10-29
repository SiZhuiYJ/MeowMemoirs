import { ref } from 'vue';
import type {
    blogPost,
} from "@/libs/api/blogPost/type";
import { BlogPostApi } from "@/libs/api/blogPost";
export default function useBlogList() {
    // 所有博客列表
    const blogList = ref<blogPost[]>([]);

    // 获取博客列表
    const getBlogList = async () => {
        const { data } = await BlogPostApi.MMPostBlogGetList();
        blogList.value = data.blogs;
        console.log(blogList.value);
    };
    return {
        blogList,
        getBlogList,
    };
}