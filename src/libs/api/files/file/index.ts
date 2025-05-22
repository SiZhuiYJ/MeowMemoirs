// @/libs/api/files/index.ts
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { item } from "@/libs/api/gallery/type";
interface items {
  items: item[];
  rootPath: string;
}
export const fileApi = {
  // 获取文件列表
  MMPostFileList() {
    return http.post<ResponseData<items>>("/files/file/dataList");
  },
  // 获取文件标签列表
  MMPostFileTagList() {
    return http.post<ResponseData<string[]>>("/files/file/tagList");
  },
};
