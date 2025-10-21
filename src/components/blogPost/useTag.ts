import { ref } from 'vue';
import type {
    AddTag,
    Tag,
} from "@/libs/api/blogPost/type";
import { BlogPostApi } from "@/libs/api/blogPost";
export default function useBlogTags() {
    // 所有博客标签
    const blogTags = ref<Tag[]>([]);
    // 获取所有博客标签
    const getTagList = async () => {
        const { data } = await BlogPostApi.MMPostBlogGetTags();
        blogTags.value = data.tags;
        console.log(blogTags.value);
    };

    // 添加博客标签
    const addBlogTag = async (blogTag: AddTag) => {
        const { data } = await BlogPostApi.MMPostBlogAddTag(blogTag);
        console.log(blogTag, data);
        return data.tagId; // 返回新添加标签的ID
    };

    return {
        blogTags,
        getTagList,
        addBlogTag,
    };

}