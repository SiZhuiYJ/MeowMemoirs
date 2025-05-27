<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useImageStore } from "@/stores";
import SearchImage from "./components/SearchImage.vue";
import ImageTable from "./components/ImageTable.vue";
import uploadImage from "./components/uploadImage.vue";
import mittBus from "@/utils/mittBus";

const store = useImageStore();

const multiple = ref<boolean>(true); // 非多个禁用
const showSearch = ref<boolean>(true); // 默认显示搜索条件

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
          @refreshTable="store.initializeData"
        ></Toolbar>
      </el-row>
      <div style="height: 20px">
        {{ store.currentData.length }}/{{ store.filteredData.length }}
      </div>
      <ImageTable />
      <uploadImage />
    </Card>
  </div>
</template>
