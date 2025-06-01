import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collectData } from "@/utils/files";
import type {
  MediaTable,
  options,
  searchType,
  Media,
} from "@/libs/api/files/type";
import { MediaFilters } from "@/utils/files";

import { MediaApi } from "@/libs/api/files/media";

interface metaType {
  tags: options[];
  tagsMap: { [key: string]: string };
  type: options[];
  createAddress: options[];
  deviceName: options[];
}

export const useMediaStore = defineStore("media", () => {
  const allData = ref<MediaTable[]>([]);
  const filteredData = ref<MediaTable[]>([]);
  const currentPage = ref(1);
  const pageSize = ref(20);
  const loading = ref(false);
  // 当前展示
  const currentShow = ref<MediaTable>();

  // 搜索相关状态
  const searchParams = ref<searchType>({
    name: "",
    type: "",
    tags: [],
    createAddress: "",
    deviceName: "",
    dateCreate: [],
    dateUpload: [],
  });

  // 元数据
  const metaData = ref<metaType>({
    type: [],
    createAddress: [],
    deviceName: [],
    tags: [],
    tagsMap: {} as Record<string, string>,
  });

  // 计算当前显示数据
  const currentData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredData.value.slice(0, end);
  });

  // 初始化数据
  const initializeData = async () => {
    try {
      loading.value = true;
      // 这里替换实际的API调用
      const { data } = await MediaApi.MMPostMediaList();
      console.log("data", data);
      allData.value = data.medias.map((item: Media) => ({
        id: item.mediaId,
        url: item.url,
        tags: item.tags.split(",").map((tag) => parseInt(tag, 10)),
        size: item.size,
        createTime: item.createTime,
        uploadTime: item.uploadTime,
        createAddress: {
          longitude: item.Longitude,
          latitude: item.Latitude,
          address: item.createAddress,
        },
        deviceName: item.deviceName,
        name: item.url.split("/").pop()?.split(".")[0] || "",
        type: item.url.split(".").pop() || "",
      }));
      currentShow.value = allData.value[0];
      const apiTag = await MediaApi.MMPostImageTagList();
      const initialTags: options[] = [];
      const MediaType: { [key: string]: string } = {};
      apiTag.data.tags.forEach((tag) => {
        initialTags.push({ label: tag.tagName, value: tag.tagId });
        MediaType[tag.tagId] = tag.tagName;
      });

      const { type, createAddress, deviceName } = collectData(allData.value);
      metaData.value = {
        type: type.map((v) => ({ label: v, value: v })),
        createAddress: createAddress.map((v) => ({ label: v, value: v })),
        deviceName: deviceName.map((v) => ({ label: v, value: v })),
        tags: initialTags,
        tagsMap: MediaType,
      };
      console.log( "metaData", metaData.value)
      console.log( "allData", allData.value)

      applyFilters();
    } finally {
      loading.value = false;
    }
  };

  // 应用过滤条件
  const applyFilters = () => {
    filteredData.value = MediaFilters(allData.value, searchParams.value);
    currentPage.value = 1;
  };

  // 选中图片
  const selectMedia = (item: MediaTable) => {
    if (item.id === currentShow.value?.id) return;
    currentShow.value = item;
  };

  // 添加图片标签
  const addTag = (tag: string) => {
    console.log(tag);
    // const index = allData.value.findIndex((item) => item.MediaId === MediaId);
    // if (index !== -1) {
    //   allData.value[index].tags.push(tag);
    // }
  };
  // 上传图片
  const uploadMedia = () => {};
  // 删除图片
  const deleteMedia = (row: MediaTable) => {
    console.log(row);
  };
  // 加载更多数据
  const loadMore = () => {
    if (currentPage.value * pageSize.value < filteredData.value.length) {
      currentPage.value += 1;
    }
  };

  return {
    allData,
    filteredData,
    currentData,
    metaData,
    searchParams,
    loading,
    currentShow,
    initializeData,
    applyFilters,
    selectMedia,
    addTag,
    uploadMedia,
    deleteMedia,
    loadMore,
  };
});
