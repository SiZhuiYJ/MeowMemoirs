<template>
  <el-table
    v-loading="loading"
    border
    :data="imageList"
    empty-text="暂时没有数据哟🌻"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column
      label="序号"
      prop="imageId"
      width="60px"
      align="center"
      type="index"
    ></el-table-column>
    <el-table-column label="图片" prop="path" width="65px" align="center">
      <template #default="scope">
        <img
          v-lazy="getGalleryImgUrl(scope.row.url)"
          style="height: 40px; width: 40px; object-fit: cover"
        />
      </template>
    </el-table-column>
    <el-table-column
      label="图片名称"
      prop="name"
      width="160px"
      align="center"
      :show-overflow-tooltip="true"
    ></el-table-column>
    <el-table-column
      label="标签"
      prop="tags"
      width="180px"
      align="center"
      :show-overflow-tooltip="true"
    >
      <template #default="{ row }">
        <el-tag v-for="tag in row.tags" :key="tag" class="tag-item" type="primary">
          {{ imageType[tag] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column
      label="大小"
      prop="size"
      width="120px"
      align="center"
      :show-overflow-tooltip="true"
    >
      <template #default="{ row }">
        {{ formatFileSize(row.size) }}
      </template>
    </el-table-column>
    <el-table-column
      label="类型"
      prop="type"
      width="60px"
      align="center"
      :show-overflow-tooltip="true"
    ></el-table-column>
    <el-table-column
      label="拍照时间"
      prop="createTime"
      width="180px"
      align="center"
      :show-overflow-tooltip="true"
    ></el-table-column>
    <el-table-column
      label="上传时间"
      prop="uploadTime"
      width="180px"
      align="center"
      :show-overflow-tooltip="true"
    ></el-table-column>
    <el-table-column
      label="拍照地点"
      prop="createAddress"
      width="180px"
      align="center"
      :show-overflow-tooltip="true"
    >
    </el-table-column>
    <el-table-column
      label="设备名称"
      prop="deviceName"
      width="150px"
      align="center"
      :show-overflow-tooltip="true"
    ></el-table-column>
    <el-table-column label="操作" align="center" width="120" fixed="right">
      <template #default="{ row }">
        <el-tooltip content="删除🌻" placement="top">
          <el-button
            type="danger"
            icon="Delete"
            circle
            plain
            @click="handleDelete(row)"
            v-auth="['system:role:delete']"
          ></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
/**
 * 转换文件大小
 * @param size 文件大小
 * @returns 转换后的文件大小
 */
export const formatFileSize = (size: number) => {
  if (size < 1024) {
    return size + "B";
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + "MB";
  }
};
</script>
<style scoped lang="scss"></style>
