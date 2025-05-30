// @/libs/api/files/index.ts
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { image, tag } from "./type";
interface images {
  images: image[];
}
interface Tags {
  tags: tag[];
}
let rootUrl = import.meta.env.VITE_SERVER;
export const imageApi = {
  // 获取图片列表
  MMPostImagedataList() {
    return http.post<ResponseData<images>>("/files/image/dataList");
  },
  // 获取图片标签列表
  MMPostImageTagList() {
    return http.post<ResponseData<Tags>>("/files/image/tagList");
  },
  getImgLargeUrl(RainbowID: string, name: string) {
    return new URL(
      `/MeowMemoirs/Files/MediaFile/${RainbowID}/${name.split(".")[0]}`,
      rootUrl
    ).href;
  },
  getImgMediumUrl(RainbowID: string, name: string) {
    return new URL(
      `/MeowMemoirs/Files/MediaFile/${RainbowID}/${
        name.split(".")[0]
      }?width=200`,
      rootUrl
    ).href;
  },
  getImgSmallUrl(RainbowID: string, name: string) {
    return new URL(
      `/MeowMemoirs/Files/MediaFile/${RainbowID}/${
        name.split(".")[0]
      }?width=200`,
      rootUrl
    ).href;
  },
  getImgOriginalUrl(RainbowID: string, name: string) {
    return new URL(
      `/MeowMemoirs/Files/MediaFile/${RainbowID}/"${
        name.split(".")[0]
      }"?width=200&type=${name.split(".")[1]}`,
      rootUrl
    ).href;
  },
};
