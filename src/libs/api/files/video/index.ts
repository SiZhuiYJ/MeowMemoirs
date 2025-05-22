// @/libs/api/files/index.ts
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { item } from "@/libs/api/gallery/type";
interface items {
  items: item[];
  rootPath: string;
}
export const videoApi = {
  // 获取视频列表
  MMPostVideoList() {
    return http.post<ResponseData<items>>("/files/video/dataList");
  },
  // 获取视频标签列表
  MMPostVideoTagList() {
    return http.post<ResponseData<string[]>>("/files/video/tagList");
  },
};
