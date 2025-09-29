// @/libs/api/class/index.ts
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { IPLocation } from "./type";

export const LocationApi = {
    // 获取课程列表
    MMPostQueryLocation() {
        return http.post<ResponseData<IPLocation>>("/Access/myip");
    },
    MMPostQueryLocationByIP(ip: string) {
        return http.post<ResponseData<IPLocation>>(`/Access/query?ip==${ip}`);
    }
};