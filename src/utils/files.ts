export interface ImageItem {
  imageId: number;
  name: string;
  path: string;
  type: string;
  size: number;
  modified: string;
}
export interface ImageTable {
  // 序号"
  imageId: number;
  // 图片"
  url: string;
  // 图片名称"
  name: string;
  // 标签"
  tags: string[];
  // 大小"
  size: number;
  // 图片类型
  type: string;
  // 拍照时间"
  createTime: string;
  // 上传时间"
  uploadTime: string;
  // 拍照地点"
  createAddress: string[];
  // 设备名称"
  deviceName: string;
}
export interface searchType {
  // tags: string[];
  type: string[];
  createAddress: string[];
  deviceName: string[];
}
export interface options {
  label: string;
  value: string;
}

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
export function collectImageData(images: ImageTable[]): searchType {
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
    image.createAddress.forEach((address) => createAddressSet.add(address));

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
