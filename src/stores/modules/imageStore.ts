import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { collectImageData, isArrayIncluded } from "@/utils/index";
import type { ImageTable, options } from "@/utils/index";
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
  tags: string[];
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
      // const res = await fetchImages()
      allData.value = /* res.data */ [];
      const initialTags: options[] = [
        { label: "做爱", value: "1001" },
        { label: "旅游", value: "1002" },
        { label: "吃饭", value: "1003" },
        { label: "做饭", value: "1004" },
        { label: "内设", value: "1005" },
      ];
      const imageType={}
      const { type, createAddress, deviceName } = collectImageData(
        allData.value
      );
      metaData.value = {
        type: type.map((v) => ({ label: v, value: v })),
        createAddress: createAddress.map((v) => ({ label: v, value: v })),
        deviceName: deviceName.map((v) => ({ label: v, value: v })),
        tags: initialTags,
        tagsMap: Object.fromEntries(type.map((t) => [t, t])),
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
          searchParams.value.createAddress.includes(item.createAddress[2])) &&
        (searchParams.value.deviceName.length === 0 ||
          searchParams.value.deviceName.includes(item.deviceName)) &&
        (!searchParams.value.dateCreate ||
          (item.createTime >= searchParams.value.dateCreate[0] &&
            item.createTime <= searchParams.value.dateCreate[1])) &&
        (!searchParams.value.dateUpload ||
          (item.uploadTime >= searchParams.value.dateUpload[0] &&
            item.uploadTime <= searchParams.value.dateUpload[1]))
    );

    currentPage.value = 1;
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
    initializeData,
    applyFilters,
    loadMore,
  };
});
