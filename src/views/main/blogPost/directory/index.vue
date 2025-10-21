<script setup lang="ts">
import { computed, onMounted } from "vue";
import LoadingSpinner from "./LoadingSpinner.vue";

import { useRouter } from "vue-router";
const router = useRouter();

import useApiUrl from "@/libs/useApiUrl";
const { getStaticFileUrl } = useApiUrl();

import type { blogPost, Tag } from "@/libs/api/blogPost/type";
import useTag from "@/components/blogPost/useTag"
const { blogTags, getTagList } = useTag()
import useBlogList from "@/components/blogPost/useBlogList"
const { blogList, getBlogList } = useBlogList()


interface ProcessedBlogItem extends blogPost {
    TagList: Tag[];
    formattedDate: string;
}

// 计算属性优化
const processedBlogList = computed(() => {
    return blogList.value.map(item => ({
        ...item,
        TagList: getBlogTag(item.tags),
        formattedDate: formatDate(item.createdAt)
    })) as ProcessedBlogItem[];
});

// 日期格式化
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
};

// 标签处理
const getBlogTag = (tags: string): Tag[] => {
    try {
        const ids = tags.split(",").map(id => {
            const num = Number(id.trim());
            if (isNaN(num)) throw new Error(`Invalid ID: ${id}`);
            return num;
        });
        return blogTags.value.filter(tag => ids.includes(tag.tagId));
    } catch (e) {
        console.error("Tag processing error:", e);
        return [];
    }
};

// 导航处理
const openBlog = (id: number) => {
    router.push(`/main/blogPost/article?id=${id}`);
};

onMounted(() => {
    // 初始加载
    getTagList();
    getBlogList();
})
</script>

<template>
    <div class="blog-selector">
        <div v-if="blogList.length" v-slide-in v-for="item in processedBlogList" :key="item.id" class="blog-item"
            @click="openBlog(item.id)">
            <div class="blog-content">
                <ProgressiveImage class="preview" :placeholder="getStaticFileUrl('img/home/_3-720p.webp')"
                    :origin="getStaticFileUrl('img/home/_3-4k.webp')" />

                <div class="blog-info">
                    <h3 class="blog-title">{{ item.title }}</h3>
                    <p class="blog-intro">{{ item.coverContent }}</p>

                    <div class="blog-meta">
                        <div class="blog-tags">
                            <span v-for="tag in item.TagList" :key="tag.tagId" class="blog-tag"
                                :style="{ backgroundColor: tag.tagColor }">
                                {{ tag.tagName }}
                            </span>
                        </div>

                        <div class="blog-footer">
                            <div class="author-info">
                                <img class="author-avatar" :src="getStaticFileUrl('img/user/Avatar.webp')
                                    " alt="作者头像" />
                                <span class="author-name">小叶子</span>
                            </div>
                            <time class="blog-time">发布时间:{{ item.formattedDate }}</time>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <LoadingSpinner v-else />
    </div>
</template>

<style scoped lang="scss">
.content {
    overflow-y: auto;

    .card {
        height: 200px;
        background-color: #000;
        margin: 10px;
    }
}

.content-wrapper {
    padding: 2rem 5%;
}

.blog-selector {
    overflow-y: auto;
    height: 100vh;

    /* 为webkit浏览器设置纵向和横向滚动条宽度和高度 */
    &::-webkit-scrollbar {
        display: none;
    }

    // 滚动条轨道
    &::-webkit-scrollbar-track {
        display: none;
    }

    // 滚动条滑块
    &::-webkit-scrollbar-thumb {
        display: none;
    }

    /* 悬浮在滑块上时为滑块设置背景颜色 */
    &::-webkit-scrollbar-thumb:hover {
        background: #fff222;
    }
}

.blog-item {
    background: var(--el-bg-color);
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    // transition: transform 0.2s ease;
    margin: 10px;

    &:active {
        transform: scale(0.98);
    }
}

.blog-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 1.5rem;
    padding: 1.5rem;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

.blog-cover {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 0.5rem;

    @media (max-width: 768px) {
        height: 150px;
    }
}

.blog-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.blog-title {
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    color: var(--el-text-color-primary);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.blog-intro {
    color: var(--el-text-color-regular);
    font-size: 0.95rem;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
}

.blog-tags {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin: 10px 0;
}

.blog-tag {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    color: white;
}

.blog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}

.author-name {
    font-size: 0.875rem;
    color: var(--el-text-color-secondary);
}

.blog-time {
    font-size: 0.875rem;
    color: var(--el-text-color-placeholder);
}

@media (max-width: 480px) {
    .blog-content {
        padding: 1rem;
        gap: 1rem;
    }

    .blog-footer {
        // flex-direction: column;
        // align-items: flex-start;
        gap: 0.5rem;
    }

    .blog-tags {
        gap: 0.5rem;
    }

    .blog-tag {
        padding: 0.2rem 0.5rem;
        font-size: 0.7rem;
    }
}
</style>
