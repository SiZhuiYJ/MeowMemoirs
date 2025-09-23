// @/libs/api/class/index.ts
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { ClassDto } from "@/libs/api/class/type";

export const ClassApi = {
    // 获取课程列表
    MMPostClassList() {
        return http.post<ResponseData<ClassDto[]>>("/Classes/PostClassesList");
    },
    MMPostClassesByID(userID: number) {
        return http.post<ResponseData<ClassDto[]>>(`/Classes/PostClassesListByID?userId=${userID}`);
    }
};

