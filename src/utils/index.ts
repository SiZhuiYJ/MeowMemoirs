/**
 * 把日期范围构造成 beginTime AND endTime
 * @param params 传递对象参数
 * @param dateRange 日期数组
 * @param propName1 自定义名称1
 * @param propName1 自定义名称2
 * @returns
 */
export function DatePicker(
  searchParams: object,
  dateRange: any,
  propName1?: string,
  propName2?: string
) {
  searchParams =
    typeof searchParams === "object" &&
    searchParams !== null &&
    !Array.isArray(searchParams)
      ? searchParams
      : {};
  dateRange = Array.isArray(dateRange) ? dateRange : [];
  if (
    propName1 != null &&
    propName1 != "" &&
    propName2 != null &&
    propName2 != ""
  ) {
    // 创建一个空的对象
    const dataParams: any = {};
    dataParams[propName1] = dateRange[0];
    dataParams[propName2] = dateRange[1];
    return Object.assign({}, searchParams, dataParams);
  } else {
    const dataParams = {
      beginTime: dateRange[0],
      endTime: dateRange[1],
    };
    return Object.assign({}, searchParams, dataParams);
  }
}

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
