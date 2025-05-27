<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { formatFileSize } from "@/utils/files";
import { useImageStore } from "@/stores";
import type { ImageTable } from "@/utils/files";
import useApiUrl from "@/libs/useApiUrl/index";
const { getGalleryImgUrl } = useApiUrl();

const store = useImageStore();
// const { startObserver, stopObserver } = useVirtualScroll();

const tableElement = ref<Element | null | undefined>();
const handleScroll = () => {
  // const table = document
  //   .querySelector(".el-table__body-wrapper")
  //   ?.querySelector(".el-scrollbar__wrap");
  if (tableElement.value) {
    const { scrollTop, scrollHeight, clientHeight } = tableElement.value;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      store.loadMore();
    }
  }
};

const ids = ref<number[]>([]); // 选择数组
const single = ref<boolean>(true); // 非单个禁用
const multiple = ref<boolean>(true); // 非多个禁用
const loading = ref<boolean>(false);
/** 是否多选 */
const handleSelectionChange = (selection: ImageTable[]) => {
  console.log(selection);

  ids.value = selection.map((item: ImageTable) => item.imageId);
  console.log("ids", ids.value);
  single.value = selection.length != 1; // 单选
  multiple.value = !selection.length; // 多选
};
onMounted(() => {
  const table = document
    .querySelector(".el-table__body-wrapper")
    ?.querySelector(".el-scrollbar__wrap");
  if (table) {
    tableElement.value = table;
    tableElement.value.addEventListener("scroll", handleScroll);
  }
  // startObserver(handleScroll);
});

onUnmounted(() => {
  tableElement.value?.removeEventListener("scroll", handleScroll);
  // stopObserver();
});
</script>

<template>
  <!-- :data="store.filteredData" -->
  <el-table
    v-loading="loading"
    border
    :data="store.currentData"
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
          {{ store.metaData.tagsMap[tag] }}
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
            @click="store.deleteImage(row)"
            v-auth="['system:role:delete']"
          ></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
<style scoped lang="scss">
p {
  margin: 10px;
  padding: 0;
}
.tag-item + .tag-item {
  margin-left: 5px;
}
</style>
