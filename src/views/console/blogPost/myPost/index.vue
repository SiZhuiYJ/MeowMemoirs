<script setup lang="ts">
// import { ref } from "vue";
// import MeowSelect from "@/components/MeowSelect/index.vue";
// import DynamicForm from "@/components/DynamicForm/index.vue";
// import type { FieldConfig } from "@/components/DynamicForm/type";

// interface BlogParams {
//   tags: string[];
//   // 其他字段...
// }

// const blogParams = ref<BlogParams>({
//   tags: [],
// });

// const blogTags = ref([
//   { value: "tag1", label: "标签1" },
//   { value: "tag2", label: "标签2" },
// ]);

// // 根据 AddTag 类型定义字段配置
// const tagFieldConfigs: Record<string, FieldConfig> = {
//   TagColor: {
//     type: "color",
//     label: "标签颜色",
//     required: true,
//   },
//   TagDescription: {
//     type: "textarea",
//     label: "标签描述",
//     placeholder: "请输入标签描述",
//   },
//   TagIcon: {
//     type: "icon-select",
//     label: "标签图标",
//     required: true,
//   },
//   TagName: {
//     type: "input",
//     label: "标签名称",
//     required: true,
//     placeholder: "请输入标签名称",
//   },
// };
// const newTag = ref<Record<string, any>>(
//   Object.keys(tagFieldConfigs).reduce((acc, key) => {
//     acc[key] = "";
//     return acc;
//   }, {} as Record<string, any>)
// );
// const addTag = (newTag: Record<string, any>) => {
//   // 这里可以根据需要处理新标签
//   console.log("新增标签:", newTag);
//   // 添加到选项列表
//   blogTags.value.push({
//     value: newTag.TagName,
//     label: newTag.TagName,
//   });
//   // 添加到当前选中的值
//   blogParams.value.tags.push(newTag.TagName);
// };

// const handleBlogSave = (value: (string | number)[]) => {
//   console.log("标签变化:", value);
// };
</script>
<template>
  <div class="main-content">
    <!-- <MeowCard>
      <MeowSelect
        v-model="blogParams.tags"
        :options="blogTags"
        :field-configs="tagFieldConfigs"
        multiple
        addable
        filterable
        collapseTags
        collapse-tags-tooltip
        width="400px"
        :maxCollapseTags="3"
        placeholder="请选择图片类型"
        @add="addTag"
        @change="handleBlogSave"
      >
        <DynamicForm v-model="newTag" :field-configs="tagFieldConfigs" />
      </MeowSelect>
    </MeowCard> -->
  </div>
</template>
<style lang="scss" scoped></style>
