<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useImageStore, useAuthStore } from "@/stores";
import SearchImage from "./components/SearchImage.vue";
import ImageTable from "./components/ImageTable.vue";
import ImageViewer from "./components/ImageViewer.vue";
import mittBus from "@/utils/mittBus";
import { imageApi } from "@/libs/api/files/image";
const { authStore } = useAuthStore();
const store = useImageStore();

const multiple = ref<boolean>(true); // 非多个禁用
const showSearch = ref<boolean>(true); // 默认显示搜索条件
const showView = ref<boolean>(true); // 默认显示查看

const handleUpload = () => {
  console.log("handleUpload");
  mittBus.emit("handleUploadConfig");
  // store.uploadImage();
};
const handleBatchDelete = () => {
  // store.batchDelete();
};
onMounted(() => {
  store.initializeData();
});
</script>

<template>
  <div class="main-content">
    <Card>
      <SearchImage
        v-show="showSearch"
        @search="store.applyFilters"
        @reset="store.applyFilters"
      />

      <!-- 操作按钮 -->
      <el-row :gutter="10">
        <!-- 上传 -->
        <el-col :span="1.5" v-auth="['system:role:add']">
          <el-button type="primary" icon="upload" plain @click="handleUpload">
            上传
          </el-button>
        </el-col>
        <el-col :span="1.5" v-auth="['system:role:delete']">
          <el-button
            type="danger"
            icon="delete"
            plain
            @click="handleBatchDelete()"
            :disabled="multiple"
          >
            删除
          </el-button>
        </el-col>
        <Toolbar
          v-model:showSearch="showSearch"
          v-model:showView="showView"
          @refreshTable="store.initializeData"
        ></Toolbar>
      </el-row>
      <div style="height: 20px">
        {{ store.currentData.length }}/{{ store.filteredData.length }}
      </div>
      <ImageTable v-show="showView" />
      <!-- 大图模式 -->
      <ImageViewer v-show="!showView"></ImageViewer>
    </Card>
    <Card v-show="showView" style="padding: 10px; margin-left: 5px; max-width: 200px">
      <el-image
        style="width: 100%; height: 100%"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        show-progress
        :initial-index="0"
        fit="scale-down"
        v-if="store.currentShow"
        :src="
          imageApi.getImgMediumUrl(authStore.loginUser.rainbowId, store.currentShow?.url)
        "
        :preview-src-list="[
          imageApi.getImgLargeUrl(authStore.loginUser.rainbowId, store.currentShow?.url),
        ]"
      />
    </Card>
  </div>
</template>

<style scoped lang="scss">
.main-content {
  height: 100%;
  display: flex;
  flex: 1 1 0%;
  flex-direction: row;
}
</style>
