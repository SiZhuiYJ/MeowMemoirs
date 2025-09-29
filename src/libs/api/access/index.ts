// @/libs/api/class/index.ts
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { IPLocation } from "./type";

export const LocationApi = {
    // 获取课程列表
    MMGetQueryLocation() {
        return http.get<ResponseData<IPLocation>>("/Access/myip");
    },
    MMGetQueryLocationByIP(ip: string) {
        return http.get<ResponseData<IPLocation>>(`/Access/query?ip=${ip}`);
    }
};