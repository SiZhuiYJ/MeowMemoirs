import type { MediaTable, searchType } from "@/libs/api/files/type";
/**
 * 判断两个数组是否包含相同的元素
 * @param a 数组A
 * @param b 数组B
 * @returns 返回一个布尔值，表示两个数组是否包含相同的元素
 */
export function isArrayIncluded<T>(a: T[], b: T[]): boolean {
  return b.every((item) => a.includes(item));
}

/**
 * 转换文件大小
 * @param size 文件大小
 * @returns 转换后的文件大小
 */
// 文件大小格式化过滤器
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
/**
 * 给一个数组转换返回各项出现的值的新对象
 * @param images 需要转换的数组
 * @returns 转换后的对象
 */
export function collectData(images: MediaTable[]): {
  type: string[];
  createAddress: string[];
  deviceName: string[];
} {
  // 使用Set进行自动去重
  // const tagsSet = new Set<string>();
  const typeSet = new Set<string>();
  const createAddressSet = new Set<string>();
  const deviceNameSet = new Set<string>();

  // 遍历所有图片数据
  for (const image of images) {
    // 收集标签（处理数组字段）
    // image.tags.forEach((tag) => tagsSet.add(tag));

    // 收集类型（处理单值字段）
    typeSet.add(image.type);

    // 收集拍摄地点（处理数组字段）
    createAddressSet.add(image.createAddress.address);

    // 收集设备名称（处理单值字段）
    deviceNameSet.add(image.deviceName);
  }

  // 转换Set为数组并返回结果
  return {
    // tags: Array.from(tagsSet),
    type: Array.from(typeSet),
    createAddress: Array.from(createAddressSet),
    deviceName: Array.from(deviceNameSet),
  };
}

export function MediaFilters(
  item: MediaTable[],
  search: searchType
): MediaTable[] {
  return item.filter(
    (item) =>
      item.name.toLowerCase().includes(search.name.toLowerCase()) &&
      (search.type.length === 0 || search.type.includes(item.type)) &&
      (search.tags.length === 0 || isArrayIncluded(item.tags, search.tags)) &&
      (search.createAddress.length === 0 ||
        search.createAddress.includes(item.createAddress.address)) &&
      (search.deviceName.length === 0 ||
        search.deviceName.includes(item.deviceName)) &&
      (!search.dateCreate ||
        search.dateCreate.length === 0 ||
        (item.createTime >= search.dateCreate[0] &&
          item.createTime <= search.dateCreate[1])) &&
      (!search.dateUpload ||
        search.dateUpload.length === 0 ||
        (item.uploadTime >= search.dateUpload[0] &&
          item.uploadTime <= search.dateUpload[1]))
  );
}
