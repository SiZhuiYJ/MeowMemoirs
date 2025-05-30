import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collectImageData, isArrayIncluded } from "@/utils/files";
import type { ImageTable, options } from "@/utils/files";

import { imageApi } from "@/libs/api/files/image";
import type { image } from "@/libs/api/files/image/type";

interface metaType {
  tags: options[];
  tagsMap: { [key: string]: string };
  type: options[];
  createAddress: options[];
  deviceName: options[];
}
interface searchType {
  imageName: string;
  type: string;
  tags: number[];
  createAddress: string;
  deviceName: string;
  dateCreate: string[];
  dateUpload: string[];
}

export const useImageStore = defineStore("image", () => {
  const allData = ref<ImageTable[]>([]);
  const filteredData = ref<ImageTable[]>([]);
  const currentPage = ref(1);
  const pageSize = ref(20);
  const loading = ref(false);
  // 当前展示
  const currentShow = ref<ImageTable>();

  // 搜索相关状态
  const searchParams = ref<searchType>({
    imageName: "",
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
      const apiImg = await imageApi.MMPostImagedataList();
      console.log("data", apiImg.data);
      allData.value = apiImg.data.images.map((item: image) => ({
        imageId: item.imageId,
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
      const apiTag = await imageApi.MMPostImageTagList();
      const initialTags: options[] = [];
      const imageType: { [key: string]: string } = {};
      apiTag.data.tags.forEach((tag) => {
        initialTags.push({ label: tag.tagName, value: tag.tagId });
        imageType[tag.tagId] = tag.tagName;
      });

      const { type, createAddress, deviceName } = collectImageData(
        allData.value
      );
      metaData.value = {
        type: type.map((v) => ({ label: v, value: v })),
        createAddress: createAddress.map((v) => ({ label: v, value: v })),
        deviceName: deviceName.map((v) => ({ label: v, value: v })),
        tags: initialTags,
        tagsMap: imageType,
      };
      applyFilters();
    } finally {
      loading.value = false;
    }
  };

  // 应用过滤条件
  const applyFilters = () => {
    filteredData.value = allData.value.filter(
      (item) =>
        item.name
          .toLowerCase()
          .includes(searchParams.value.imageName.toLowerCase()) &&
        (searchParams.value.type.length === 0 ||
          searchParams.value.type.includes(item.type)) &&
        (searchParams.value.tags.length === 0 ||
          isArrayIncluded(item.tags, searchParams.value.tags)) &&
        (searchParams.value.createAddress.length === 0 ||
          searchParams.value.createAddress.includes(
            item.createAddress.address
          )) &&
        (searchParams.value.deviceName.length === 0 ||
          searchParams.value.deviceName.includes(item.deviceName)) &&
        (!searchParams.value.dateCreate ||
          searchParams.value.dateCreate.length === 0 ||
          (item.createTime >= searchParams.value.dateCreate[0] &&
            item.createTime <= searchParams.value.dateCreate[1])) &&
        (!searchParams.value.dateUpload ||
          searchParams.value.dateUpload.length === 0 ||
          (item.uploadTime >= searchParams.value.dateUpload[0] &&
            item.uploadTime <= searchParams.value.dateUpload[1]))
    );
    currentPage.value = 1;
  };

  // 选中图片
  const selectImage = (item: ImageTable) => {
    if (item.imageId === currentShow.value?.imageId) return;
    currentShow.value = item;
  };

  // 添加图片标签
  const addTag = (tag: string) => {
    console.log(tag);
    // const index = allData.value.findIndex((item) => item.imageId === imageId);
    // if (index !== -1) {
    //   allData.value[index].tags.push(tag);
    // }
  };
  // 上传图片
  const uploadImage = () => {};
  // 删除图片
  const deleteImage = (row: ImageTable) => {
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
    selectImage,
    addTag,
    uploadImage,
    deleteImage,
    loadMore,
  };
});
