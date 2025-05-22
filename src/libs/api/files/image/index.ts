// @/libs/api/files/index.ts
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { item } from "@/libs/api/gallery/type";
interface items {
  items: item[];
  rootPath: string;
}
export const imageApi = {
  // 获取图片列表
  MMPostImagedataList() {
    return http.post<ResponseData<items>>("/files/image/dataList");
  },
  // 获取图片标签列表
  MMPostImageTagList() {
    return http.post<ResponseData<string[]>>("/files/image/tagList");
  },
};
