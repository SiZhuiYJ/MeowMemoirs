<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import MeowSelect from "@/components/MeowSelect/index.vue";
import { useBlogStore } from "@/stores";
const blogStore = useBlogStore();
const { addBlogTag, getTagList } = useBlogStore();
// import {
//   meowNoticeSuccess,
//   meowNoticeError,
//   meowMsgWarning,
//   meowMsgBox,
//   meowMsgInfo,
//   meowMsgError,
// } from "@/utils/message";
import type { options } from "@/libs/api/files/type";
import type { blogPost } from "@/libs/api/blogPost/type";
// 博客数据
const blogParams = ref<blogPost>({
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
// 获取博客标签Tag转换为options
const blogTags = computed<options[]>(() => {
  return blogStore.blogTags.map((item) => {
    return {
      label: item.tagName,
      value: item.tagId.toString(),
    };
  });
});
// 是否显示搜索表单[默认显示]
const showSearch = ref<boolean>(true); // 默认显示搜索条件// 选择数组

const multiple = computed(
  () =>
    blogParams.value.content.length > 0 &&
    blogParams.value.coverContent.length > 0 &&
    blogParams.value.title.length > 0 &&
    blogParams.value.tags.length > 0
);
/** 重置搜索参数 */
const resetBlogParams = () => {};

/** 重置 */
const handleResetBlog = () => {
  resetBlogParams();
};
const handleBlogSave = () => {};

const addTag = (tag: string) => {
  addBlogTag({
    TagName: tag,
    TagColor: "#409eff",
    TagIcon: "icon-tag",
    TagDescription: "记录甜蜜无间的过往~",
  });
};
/** 保存 */
const handleContentSave = (text: string, html: string) => {
  console.log("text", text);
  console.log("html", html);
};
/** 上传图片 */
function handleUploadImage(event: Event, insertImage: Function, files: FileList) {
  console.log(event);
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  console.log(files);

  // 此处只做示例
  insertImage({
    url:
      "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg",
    desc: "七龙珠",
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
});
</script>

<template>
  <!-- 内容 -->
  <div class="main-content">
    <MeowCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="标题" prop="title">
          <el-input
            placeholder="请输入标题"
            v-model="blogParams.title"
            style="width: 200px"
            clearable
            @keyup.enter.native="handleBlogSave"
          ></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="tags">
          <MeowSelect
            v-model="blogParams.tags"
            :options="blogTags"
            multiple
            addable
            filterable
            collapseTags
            collapse-tags-tooltip
            placeholder="请选择图片类型"
            @add="addTag"
            @change="handleBlogSave"
          />
        </el-form-item>
        <el-form-item label="副标题" prop="coverContent">
          <el-input
            placeholder="请输入副标题"
            v-model="blogParams.coverContent"
            style="width: 200px"
            type="textarea"
            clearable
            @keyup.enter.native="handleBlogSave"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 表格头部按钮 -->
      <el-row :gutter="10">
        <el-col :span="1.5" v-auth="['system:role:delete']">
          <el-button
            type="danger"
            icon="delete"
            plain
            @click="handleResetBlog()"
            :disabled="multiple"
          >
            清空
          </el-button>
        </el-col>
        <!-- 保存 -->
        <el-col :span="1.5" v-auth="['system:role:add']">
          <el-button type="primary" icon="save" plain @click="handleBlogSave()">
            保存
          </el-button>
        </el-col>
        <Toolbar v-model:showSearch="showSearch" @refreshTable="handleBlogSave"></Toolbar>
      </el-row>

      <div class="h-20px" style="height: 20px"></div>
      <!-- 编辑区 -->
      <v-md-editor
        v-model="blogParams.content"
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code emoji tip todo-list | save"
        :disabled-menus="[]"
        @upload-image="handleUploadImage"
        @save="handleContentSave"
        @image-click="handleImageClick"
        height="100%"
      ></v-md-editor>
    </MeowCard>
  </div>
</template>

<style lang="scss" scoped></style>
