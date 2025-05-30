<template>
  <!-- 使用方式：<KoiToolbar v-model:showSearch="showSearch" @refreshTable="handleTableData"></KoiToolbar> -->
  <div class="content-toolbar">
    <el-row>
      <el-tooltip :content="showSearch ? '隐藏搜索' : '显示搜索'" placement="top">
        <el-button circle icon="search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip :content="showView ? '详情' : '大图'" placement="top">
        <el-button circle @click="toggleView()">
          <el-icon :size="20">
            <svg-icon
              icon-class="view-list"
              size="20px"
              v-if="showView"
              style="color: var(--el-header-text-color-regular)"
            />
            <svg-icon
              icon-class="view-old"
              size="20px"
              v-if="!showView"
              style="color: var(--el-header-text-color-regular)"
            /> </el-icon
        ></el-button>
      </el-tooltip>
      <el-tooltip content="刷新" placement="top">
        <el-button circle icon="refresh" @click="handleRefresh()" />
      </el-tooltip>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import svgIcon from "@/components/SvgIcons/index.vue";
const props = defineProps(["showSearch", "showView"]);
const emits = defineEmits(["update:showSearch", "update:showView", "refreshTable"]);

/** 点击子组件，调用父组件方法 */
const toggleSearch = () => {
  // 同步修改父子组件的值，但是父组件需要使用v-model:showSearch="showSearch"
  // @ts-ignore
  emits("update:showSearch", !props.showSearch);
};
/** 点击子组件，调用父组件方法 */
const toggleView = () => {
  // 同步修改父子组件的值，但是父组件需要使用v-model:showSearch="showSearch"
  // @ts-ignore
  emits("update:showView", !props.showView);
};

/** 点击子组件，调用父组件方法 */
const handleRefresh = () => {
  emits("refreshTable");
};
</script>

<style lang="scss" scoped>
.content-toolbar {
  margin-left: auto;
}
</style>
