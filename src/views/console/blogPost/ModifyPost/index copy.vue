<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import MeowSelect from "@/components/MeowSelect/index.vue";
import useTag from "@/components/blogPost/useTag";
const { blogTags, getTagList, addBlogTag } = useTag();
import { useEditBlog } from "@/components/blogPost/useBlogEdit";
const { currentCachedBlog, clearCachedBlog, uploadCurrentBlog } = useEditBlog();
// import {
//   meowNoticeSuccess,
//   meowNoticeError,
//   meowMsgWarning,
//   meowMsgBox,
//   meowMsgInfo,
//   meowMsgError,
// } from "@/utils/message";
import type { options } from "@/libs/api/files/type";
// 获取博客标签Tag转换为options
const TagToOptions = computed<options[]>(() => {
    return blogTags.value.map(item => {
        return {
            label: item.tagName,
            value: item.tagId.toString()
        };
    });
});
// 是否显示搜索表单[默认显示]
const showSearch = ref<boolean>(true); // 默认显示搜索条件// 选择数组

const multiple = computed(
    () =>
        useEditBlog().editBlog.content.length > 0 &&
        useEditBlog().editBlog.coverContent.length > 0 &&
        useEditBlog().editBlog.title.length > 0 &&
        useEditBlog().editBlog.tags.length > 0
);
/** 重置搜索参数 */
const resetBlogParams = () => {
    useEditBlog().editBlog = clearCachedBlog();
    console.log(useEditBlog().editBlog);
};

/** 重置 */
const handleResetBlog = () => {
    resetBlogParams();
};
// 保存到服务器
const handleBlogSave = async () => {
    currentCachedBlog(useEditBlog().editBlog);
    useEditBlog().editBlog = await uploadCurrentBlog();
};

const addTag = (tag: string) => {
    addBlogTag({
        TagName: tag,
        TagColor: "#409eff",
        TagIcon: "icon-tag",
        TagDescription: "记录甜蜜无间的过往~"
    });
};
/** 保存 */
const handleContentSave = (text: string, html: string) => {
    console.log("text", text);
    console.log("html", html);
    useEditBlog().editBlog.content = text;
    currentCachedBlog(useEditBlog().editBlog);
};
/** 上传图片 */
function handleUploadImage(
    event: Event,
    insertImage: Function,
    files: FileList
) {
    console.log(event);
    // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
    console.log(files);

    // 此处只做示例
    insertImage({
        url: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg",
        desc: "七龙珠"
        // width: 'auto',
        // height: 'auto',
    });
}
/** 点击图片 */
const handleImageClick = (images: string[], currentIndex: number) => {
    console.log(images, currentIndex);
};
onMounted(() => {
    // 获取标签列表
    getTagList();
    useEditBlog().editBlog;
});
</script>

<template>
    <!-- 内容 -->
    <div class="main-content">
        <MeowCard class="edit-content">
            <!-- 博客头 -->
            <el-form v-show="showSearch" :inline="true">
                <el-form-item label="标题" prop="title">
                    <el-input placeholder="请输入标题" v-model="useEditBlog().editBlog.title" style="width: 200px" clearable
                        @keyup.enter.native="handleBlogSave"></el-input>
                </el-form-item>
                <el-form-item label="标题" prop="tags">
                    <MeowSelect v-model="useEditBlog().editBlog.tags" :options="TagToOptions" multiple addable
                        filterable :max="10" collapseTags collapse-tags-tooltip placeholder="请选择图片类型" @add="addTag"
                        @change="() => { }" />
                </el-form-item>
                <el-form-item label="副标题" prop="coverContent">
                    <el-input placeholder="请输入副标题" v-model="useEditBlog().editBlog.coverContent" style="width: 200px"
                        type="textarea" clearable @keyup.enter.native="handleBlogSave" :rows="1" maxlength="100"
                        show-word-limit></el-input>
                </el-form-item>
            </el-form>

            <!-- 表格头部按钮 -->
            <el-row :gutter="10">
                <el-col :span="1.5" v-auth="['system:role:delete']">
                    <el-button type="danger" icon="delete" plain @click="handleResetBlog()" :disabled="!multiple">
                        清空
                    </el-button>
                </el-col>
                <!-- 保存 -->
                <el-col :span="1.5" v-auth="['system:role:add']">
                    <el-button type="primary" icon="DocumentChecked" plain @click="handleBlogSave()">
                        保存
                    </el-button>
                </el-col>
                <Toolbar v-model:showSearch="showSearch" show-title="标题" @refreshTable="handleBlogSave"></Toolbar>
            </el-row>

            <div style="height: 20px"></div>
            <!-- 编辑区 -->
            <v-md-editor v-model="useEditBlog().editBlog.content"
                left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code emoji tip todo-list | save"
                :disabled-menus="[]" @upload-image="handleUploadImage" @save="handleContentSave"
                @image-click="handleImageClick"></v-md-editor>
        </MeowCard>
    </div>
</template>

<style lang="scss" scoped>
:deep(.v-md-editor) {
    height: 100%;
    // flex: 1 1 auto; // 占满剩余空间
    min-height: 0; // 重要：防止内容撑大容器
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color));
}
</style>
