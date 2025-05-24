<script setup lang="ts">
import { useImageStore } from "@/stores";

const store = useImageStore();
const emit = defineEmits(["search", "reset"]);

const handleSearch = () => {
  store.applyFilters();
  emit("search");
};

const handleReset = () => {
  store.searchParams = {
    imageName: "",
    type: "",
    tags: [],
    createAddress: "",
    deviceName: "",
    dateCreate: [],
    dateUpload: [],
  };
  emit("reset");
};
</script>

<template>
  <el-form :inline="true">
    <!-- 各表单项 -->
    <el-form-item label="图片名称">
      <el-input
        v-model="store.searchParams.imageName"
        @keyup.enter.native="handleSearch"
      />
    </el-form-item>

    <el-form-item label="图片类型">
      <Select
        v-model="store.searchParams.type"
        :options="store.metaData.type"
        multiple
        @change="handleSearch"
      />
    </el-form-item>

    <el-form-item label="图片标签" prop="tags">
      <Select
        v-model="store.searchParams.tags"
        :options="store.metaData.tags"
        multiple
        addable
        collapseTags
        collapse-tags-tooltip
        placeholder="请选择图片类型"
        @add="store.addTag"
        @change="handleSearch"
      >
      </Select>
    </el-form-item>
    <el-form-item label="拍摄地址" prop="createAddress">
      <Select
        v-model="store.searchParams.createAddress"
        :options="store.metaData.createAddress"
        multiple
        collapseTags
        collapse-tags-tooltip
        placeholder="请选择拍摄地址"
        @change="handleSearch"
      >
      </Select>
    </el-form-item>
    <el-form-item label="拍照时间" prop="createTime">
      <el-date-picker
        v-model="store.searchParams.dateCreate"
        type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:ss"
        start-placeholder="开始日期"
        range-separator="至"
        end-placeholder="结束日期"
        :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
        @change="handleSearch"
      />
    </el-form-item>
    <el-form-item label="拍照时间" prop="uploadTime">
      <el-date-picker
        v-model="store.searchParams.dateUpload"
        type="datetimerange"
        value-format="YYYY-MM-DD HH:mm:ss"
        start-placeholder="开始日期"
        range-separator="至"
        end-placeholder="结束日期"
        :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
        @change="handleSearch"
      />
    </el-form-item>

    <el-form-item label="设备名称" prop="deviceName">
      <Select
        v-model="store.searchParams.deviceName"
        :options="store.metaData.deviceName"
        multiple
        collapseTags
        collapse-tags-tooltip
        placeholder="请选择设备名称"
        @change="handleSearch"
      >
      </Select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" icon="search" plain v-debounce="handleSearch">
        搜索
      </el-button>
      <el-button type="danger" icon="refresh" plain v-throttle="handleReset">
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>
