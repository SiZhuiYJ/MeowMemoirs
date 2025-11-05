
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
    // 获取课表列表
    MMPostScheduleList() {
        return http.post<ResponseData<ScheduleList>>(`/Schedule/PostList`);
    },
    // 获取课表详情
    MMPostScheduleByID(id: number) {
        return http.post<ResponseData<ScheduleData>>(`/Schedule/PostByScheduleID/${id}`);
    },
    // 获取课程列表
    MMPostCourseListByScheduleID(id: number) {
        return http.post<ResponseData<CourseList>>(`/Schedule/Course/PostListByScheduleID/${id}`);
    },
    // 获取课程详情
    MMPostCourseByID(id: number) {
        return http.post<ResponseData<CourseData>>(`/Schedule/Course/PostByCourseID/${id}`);
    },
    // 获取课程时间段列表
    MMPostTimeListByCourseID(id: number) {
        return http.post<ResponseData<CourseTimeList>>(`/Schedule/Time/PostByCourseID/${id}`);
    },
    // 获取课程时间段详情
    MMPostTimeByID(id: number) {
        return http.post<ResponseData<CourseTimeData>>(`/Schedule/Time/PostByID/${id}`);
    },
};

