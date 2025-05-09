<template>
    <div :class="['breadcrumb-box', 'mask-image']">
        <el-breadcrumb :separator-icon="ArrowRight">
            <transition-group name="breadcrumb">
                <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
                    <div class="el-breadcrumb__inner is-link" :class="{ 'item-no-icon': !item.meta.icon }"
                        @click="handleBreadcrumb(item, index)">
                        <global-icon :name="item.meta.icon" size="16px" v-if="item.meta.icon" class="breadcrumb-icon" />
                        <span class="breadcrumb-title">{{ item.meta?.title }}</span>
                    </div>
                </el-breadcrumb-item>
            </transition-group>
        </el-breadcrumb>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { HOME_URL, STATIC_URL } from "@/config/index.ts";
import { useRoute, useRouter } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
import { useAuthStore } from "@/stores";
import GlobalIcon from '@/components/GlobalIcon/Index.vue'
const route = useRoute();
const router = useRouter();

const breadcrumbList = computed(() => {
    let breadcrumbData = useAuthStore().getBreadcrumbList[route.matched[route.matched.length - 1].path] ?? [];
    // 子页面放置静态路由里面, activeMenu存在值的时候
    return breadcrumbData;
});

/** 点击面包屑 */
const handleBreadcrumb = (item: any, index: number) => {
    if (breadcrumbList.value[0]?.path === STATIC_URL || breadcrumbList.value[1]?.path === STATIC_URL) {
        router.push(HOME_URL);
        return;
    }
    if (index !== breadcrumbList.value.length - 1) router.push(item.path);
};
console.log('breadcrumbList', breadcrumbList.value);
</script>

<style scoped lang="scss">
/** breadcrumb-transform 面包屑动画 */
.breadcrumb-enter-active {
    transition: all 0.2s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(10px);
}

.breadcrumb-box {
    display: flex;
    align-items: center;
    padding-top: 2px;
    margin-left: 10px;
    overflow: hidden;
    user-select: none;

    .el-breadcrumb {
        line-height: 15px;
        white-space: nowrap;

        .el-breadcrumb__item {
            position: relative;
            display: inline-block;
            float: none;

            .breadcrumb-title {
                font-weight: 400;
            }

            .item-no-icon {
                transform: translateY(-3px);
            }

            .el-breadcrumb__inner {
                display: inline-flex;
                line-height: 16px;

                &.is-link {
                    color: var(--el-header-text-color);

                    &:hover {
                        color: var(--el-color-primary);
                    }
                }

                .breadcrumb-icon {
                    margin-right: 6px;
                    font-size: 16px;
                }

                // .breadcrumb-title {
                //   margin-top: 2px;
                // }
            }

            &:last-child .el-breadcrumb__inner,
            &:last-child .el-breadcrumb__inner:hover {
                color: var(--el-header-text-color-regular);
            }

            :deep(.el-breadcrumb__separator) {
                transform: translateY(-1px);
            }
        }
    }
}

/** 右侧向左侧移动，面包屑模糊 */
.mask-image {
    padding-right: 50px;
    mask-image: linear-gradient(90deg, #000000 0%, #000000 calc(100% - 50px), transparent);
}
</style>