
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { ScheduleDto, Course, CourseTime } from "@/features/schedule/types";
interface ScheduleList {
    schedule: ScheduleDto[]
}
interface ScheduleData {
    schedule: ScheduleDto
}
interface CourseList {
    course: Course[]
}
interface CourseData {
    course: Course
}
interface CourseTimeList {
    time: CourseTime[]
}
interface CourseTimeData {
    time: CourseTime
}
export const ScheduleApi = {

    Schedule: {
        // 获取课表列表
        PostList() {
            return http.post<ResponseData<ScheduleList>>(`/Schedule/PostList`);
        },
        // 获取课表详情
        PostByID(id: number) {
            return http.post<ResponseData<ScheduleData>>(`/Schedule/PostByScheduleID/${id}`);
        },
        // 添加或更新课表
        PostEdit(data: ScheduleDto) {
            return http.post<ResponseData<ScheduleData>>(`/Schedule/PostEdit`, data);
        },
        // 删除课表
        PostDelete(id: number) {
            return http.post<ResponseData<null>>(`/Schedule/Delete/${id}`);
        },
        // 删除多个课表
        PostBatchDelete(ids: number[]) {
            return http.post<ResponseData<null>>(`/Schedule/BatchDelete`, { ids });
        }
    },
    Course: {
        // 获取课程列表
        PostListByScheduleID(id: number) {
            return http.post<ResponseData<CourseList>>(`/Schedule/Course/PostByScheduleID/${id}`);
        },
        // 获取课程详情
        PostByID(id: number) {
            return http.post<ResponseData<CourseData>>(`/Schedule/Course/PostByCourseID/${id}`);
        },
        // 添加或更新课程
        PostEdit(data: Course) {
            return http.post<ResponseData<CourseData>>(`/Schedule/Course/PostEdit`, data);
        },
        // 删除课表
        PostDelete(id: number) {
            return http.post<ResponseData<null>>(`/Schedule/Course/Delete/${id}`);
        },
        // 删除多个课表
        PostBatchDelete(ids: number[]) {
            return http.post<ResponseData<null>>(`/Schedule/Course/BatchDelete`, { ids });
        }
    },
    CourseTime: {
        // 获取课程时间段列表
        PostListByCourseID(id: number) {
            return http.post<ResponseData<CourseTimeList>>(`/Schedule/Time/PostByCourseID/${id}`);
        },
        // 获取课程时间段详情
        PostByID(id: number) {
            return http.post<ResponseData<CourseTimeData>>(`/Schedule/Time/PostByID/${id}`);
        },
        // 添加或更新课程时间段
        PostEdit(data: CourseTime) {
            return http.post<ResponseData<CourseTimeData>>(`/Schedule/Time/PostEdit`, data);
        },
        // 删除课表
        PostDelete(id: number) {
            return http.post<ResponseData<null>>(`/Schedule/Time/Delete/${id}`);
        },
        // 删除多个课表
        PostBatchDelete(ids: number[]) {
            return http.post<ResponseData<null>>(`/Schedule/Time/BatchDelete`, { ids });
        }
    }
};

