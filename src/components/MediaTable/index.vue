<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { formatFileSize } from "@/utils/files";
import type { MediaTable } from "@/libs/api/files/type";
import { MediaApi } from "@/libs/api/files/media";
import { useAuthStore } from "@/stores";
const { rainbowId } = useAuthStore().loginUser;
interface IMediaProps {
  data: MediaTable[];
  tagsMap: { [key: string]: string };
}

// 子组件接收父组件的值
// withDefaults：设置默认值  defineProps：接收父组件的参数
// @ts-ignore
const props = withDefaults(defineProps<IMediaProps>(), {
  data: () => [],
  tagsMap: () => ({}),
});
const emits = defineEmits<{
  (e: "loadMore"): void;
  (e: "selectMedia", Media: MediaTable): void;
  (e: "deleteMedia", Media: MediaTable): void;
}>();

const tableElement = ref<Element | null | undefined>();

const loading = ref<boolean>(false);

/**
 * 获取
 */
const handleCurrentChange = async (Media: MediaTable) => {
  emits("selectMedia", Media);
};
/**
 *  删除
 */
const handleDelete = async (Media: MediaTable) => {
  emits("deleteMedia", Media);
};

const handleScroll = () => {
  if (tableElement.value) {
    const { scrollTop, scrollHeight, clientHeight } = tableElement.value;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      emits("loadMore");
    }
  }
};
const getMediaUrl = (url: string) => {
  return url.split(".")[1] === "mp4"
    ? MediaApi.getVideoCover(rainbowId, url)
    : MediaApi.getImgSmallUrl(rainbowId, url);
};
onMounted(() => {
  const table = document
    .querySelector(".el-table__body-wrapper")
    ?.querySelector(".el-scrollbar__wrap");
  if (table) {
    tableElement.value = table;
    tableElement.value.addEventListener("scroll", handleScroll);
  }
});

onUnmounted(() => {
  tableElement.value?.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <el-table
    v-loading="loading"
    border
    :data="props.data"
    empty-text="暂时没有数据哟🌻"
    highlight-current-row
    @current-change="handleCurrentChange"
  >
    <el-table-column
      label="序号"
      prop="imageId"
      width="60px"
      align="center"
      type="index"
    ></el-table-column>
    <el-table-column label="图片" prop="path" width="65px" align="center">
      <template #default="{ row }">
        <img
          v-lazy="getMediaUrl(row.url)"
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
          {{ tagsMap[tag] }}
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
      label="拍照地点"
      prop="createAddress"
      width="180px"
      align="center"
      :show-overflow-tooltip="true"
    >
      <template #default="{ row }">
        {{ row.createAddress.address }}
      </template>
    </el-table-column>
    <el-table-column
      label="设备名称"
      prop="deviceName"
      width="150px"
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
<style scoped lang="scss">
p {
  margin: 10px;
  padding: 0;
}
.tag-item + .tag-item {
  margin-left: 5px;
}
</style>
