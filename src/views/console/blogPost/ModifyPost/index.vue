<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useScreenStore } from "@/utils/screen";
import MeowSelect from "@/components/MeowSelect/index.vue";

import useTag from "@/features/blogPost/useTag";
const { blogTags, getTagList, addBlogTag } = useTag();

// 局部按需引入已配置好的编辑器（配置位于 src/libs/vmd-editor.ts）
import { VMdEditor } from "@/libs/vmd-editor";

import { useEditBlog } from "@/features/blogPost/useBlogEdit";
const { currentCachedBlog, clearCachedBlog, uploadCurrentBlog } = useEditBlog();

import type { options } from "@/libs/api/files/type";

import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

// 表单引用
const blogFormRef = ref<FormInstance>();

// 博客数据 - 使用 reactive 替代 ref
const blogParams = useEditBlog().editBlog

// 表单校验规则
const formRules = reactive<FormRules<typeof blogParams>>({
    title: [
        { required: true, message: "请输入博客标题", trigger: "blur" },
        { min: 2, max: 100, message: "标题长度在 2 到 100 个字符", trigger: "blur" }
    ],
    summary: [
        { required: true, message: "请输入副标题", trigger: "blur" },
        { max: 100, message: "副标题不能超过 100 个字符", trigger: "blur" }
    ],
    tags: [
        { required: true, message: "请选择至少一个标签", trigger: "change" }
    ],
    content: [
        { required: true, message: "博客内容不能为空", trigger: "blur" },
        { min: 10, message: "博客内容至少需要 10 个字符", trigger: "blur" }
    ]
});

// 获取博客标签Tag转换为options
const TagToOptions = computed<options[]>(() => {
    return blogTags.value.map(item => ({
        label: item.tagName,
        value: item.id.toString()
    }));
});

// 是否显示搜索表单[默认显示]
const showSearch = ref<boolean>(true);

// 表单不完整
const isDDeleteFormComplete = computed(() => {
    return (
        useEditBlog().editBlog.content.length == 0 &&
        useEditBlog().editBlog.summary.length == 0 &&
        useEditBlog().editBlog.title.length == 0 &&
        useEditBlog().editBlog.tags.length == 0
    );
});

// 表单是否完整
const isFormComplete = computed(() => {
    return (
        useEditBlog().editBlog.content.length > 0 &&
        useEditBlog().editBlog.summary.length > 0 &&
        useEditBlog().editBlog.title.length > 0 &&
        useEditBlog().editBlog.tags.length > 0
    );
});

// 加载状态
const loading = ref(false);

/** 重置参数 */
const resetBlogParams = () => {
    Object.assign(useEditBlog().editBlog, clearCachedBlog());
};

/** 重置表单 */
const handleResetBlog = async () => {
    try {
        await ElMessageBox.confirm(
            "确定要清空当前编辑的内容吗？此操作不可恢复。",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
        );

        resetBlogParams();
        // 清除表单验证
        blogFormRef.value?.clearValidate();
        ElMessage.success("已清空表单内容");
    } catch (error) {
        // 用户取消操作
        console.log("用户取消清空操作");
    }
};

// 验证表单
const validateForm = async (): Promise<boolean> => {
    if (!blogFormRef.value) return false;

    try {
        await blogFormRef.value.validate();
        return true;
    } catch (error) {
        ElMessage.warning("请完善表单信息后再保存");
        return false;
    }
};

// 保存到服务器
const handleBlogSave = async () => {
    // 验证表单
    if (!(await validateForm())) {
        return;
    }

    console.log(useEditBlog().editBlog)
    loading.value = true;
    try {
        currentCachedBlog(useEditBlog().editBlog);
        const result = await uploadCurrentBlog();
        Object.assign(useEditBlog().editBlog, result);
        ElMessage.success("博客保存成功");
    } catch (error) {
        console.error("保存博客失败:", error);
        ElMessage.error("博客保存失败，请重试");
    } finally {
        loading.value = false;
    }
};

// 添加标签
const addTag = async (tag: string) => {
    if (!tag.trim()) {
        ElMessage.warning("标签名称不能为空");
        return;
    }

    try {
        await addBlogTag({
            TagName: tag,
            TagColor: "#409eff",
            TagIcon: "icon-tag",
            TagDescription: "记录甜蜜无间的过往~"
        });
        ElMessage.success(`标签 "${tag}" 添加成功`);
    } catch (error) {
        console.error("添加标签失败:", error);
        ElMessage.error("添加标签失败");
    }
};

/** 保存内容 */
const handleContentSave = (text: string, html: string) => {
    console.log("text", text);
    console.log("html", html);
    useEditBlog().editBlog.content = text;
    currentCachedBlog(useEditBlog().editBlog);

    // 触发内容验证
    blogFormRef.value?.validateField('content').catch(() => { });
};

/** 上传图片 */
function handleUploadImage(
    event: Event,
    insertImage: Function,
    files: FileList
) {
    console.log("上传图片事件:", event);
    console.log("文件列表:", files);

    // TODO: 实现实际的文件上传逻辑
    // 这里应该调用文件上传API，然后使用返回的URL

    loading.value = true;

    // 模拟上传过程
    setTimeout(() => {
        insertImage({
            url: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg",
            desc: "七龙珠"
        });
        loading.value = false;
        ElMessage.success("图片上传成功");
    }, 1000);
}

/** 点击图片 */
const handleImageClick = (images: string[], currentIndex: number) => {
    console.log("点击图片:", images, currentIndex);
    // 可以在这里实现图片预览功能
};

// 键盘快捷键
const handleKeydown = (event: KeyboardEvent) => {
    // Ctrl + S 保存
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleBlogSave();
    }
};

onMounted(() => {
    // 获取标签列表
    getTagList();

    // 添加键盘事件监听
    document.addEventListener('keydown', handleKeydown);
});

// 组件卸载时清理事件监听
import { onUnmounted } from "vue";
onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <!-- 内容 -->
    <div class="main-content">
        <MeowCard class="edit-content">
            <!-- 博客头 -->
            <el-form ref="blogFormRef" v-show="showSearch" :inline="true" :model="useEditBlog().editBlog"
                :rules="formRules" class="blog-form">
                <el-form-item label="标题" prop="title">
                    <el-input placeholder="请输入标题" v-model="useEditBlog().editBlog.title" style="width: 200px" clearable
                        show-word-limit maxlength="100" @keyup.enter="handleBlogSave" />
                </el-form-item>

                <el-form-item label="标签" prop="tags">
                    <MeowSelect v-model="useEditBlog().editBlog.tags" :options="TagToOptions" multiple addable
                        filterable :max="10" collapseTags collapse-tags-tooltip placeholder="请选择标签" @add="addTag" />
                </el-form-item>

                <el-form-item label="副标题" prop="summary">
                    <el-input placeholder="请输入副标题" v-model="useEditBlog().editBlog.summary" style="width: 200px"
                        type="textarea" clearable @keyup.enter="handleBlogSave" :rows="1" maxlength="100"
                        show-word-limit resize="none" />
                </el-form-item>
            </el-form>

            <!-- 表格头部按钮 -->
            <el-row :gutter="10" class="action-bar">
                <el-col :span="1.5">
                    <el-button type="danger" icon="delete" plain @click="handleResetBlog()"
                        :disabled="isDDeleteFormComplete">
                        清空
                    </el-button>
                </el-col>

                <!-- 保存 -->
                <el-col :span="1.5">
                    <el-button type="primary" icon="DocumentChecked" plain @click="handleBlogSave()" :loading="loading"
                        :disabled="!isFormComplete">
                        保存
                    </el-button>
                </el-col>

                <!-- 内容验证提示 -->
                <el-alert v-if="!isFormComplete && !useScreenStore().isMobile.value" title="请完善所有必填字段（标题、标签、副标题和内容）"
                    type="warning" :closable="false" show-icon />

                <Toolbar v-model:showSearch="showSearch" show-title="标题" @refreshTable="handleBlogSave" />
            </el-row>

            <div style="height: 20px"></div>

            <!-- 内容验证提示 -->
            <el-alert v-if="!isFormComplete && useScreenStore().isMobile.value" title="请完善所有必填字段（标题、标签、副标题和内容）"
                type="warning" :closable="false" show-icon style="margin-bottom: 16px;" />

            <!-- 编辑区 -->
            <div class="editor-container">
                <v-md-editor v-model="useEditBlog().editBlog.content"
                    left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code emoji tip todo-list | save"
                    :disabled-menus="[]" @upload-image="handleUploadImage" @save="handleContentSave"
                    @image-click="handleImageClick" height="100%" placeholder="开始编写您的博客内容..." />
            </div>
        </MeowCard>
    </div>
</template>

<style lang="scss" scoped>
.main-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.edit-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; // 重要：防止内容撑大容器
}

.blog-form {

    :deep(.el-form-item) {
        margin-bottom: 20px;
    }
}

.action-bar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    :deep(.el-alert) {
        flex: 1;
    }
}

.editor-container {
    flex: 1;
    min-height: 0;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color));
    border-radius: 4px;

    :deep(.v-md-editor) {


        // 编辑器内部样式优化
        .v-md-editor__main {
            flex: 1;
        }

        .v-md-editor__toolbar {
            border-bottom: 1px solid var(--el-border-color-light);
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .blog-form {
        :deep(.el-form-item) {
            display: block;
            margin-right: 0;

            .el-form-item__content {
                width: 100%;

                .el-input,
                .el-textarea {
                    width: 100% !important;
                }
            }
        }
    }

    :deep(.el-alert__title) {
        font-size: 10px;
    }

    .action-bar {
        .el-col {
            flex: 1;
            min-width: auto;
        }
    }
}
</style>