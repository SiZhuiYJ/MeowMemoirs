
import http from "@/libs/http";
import type { ResponseData } from "@/libs/http/type";
import type { Schedule, Course, CourseTime } from "@/features/schedule/types";
interface ScheduleList {
    schedule: Schedule[]
}
interface ScheduleData {
    schedule: Schedule
}
interface CourseList {
    course: Course[]
}
interface CourseData {
    course: Course
}
interface CourseTimeList {
    courseTime: CourseTime[]
}
interface CourseTimeData {
    courseTime: CourseTime
}
export const ScheduleApi = {
    // 获取课表列表
    MMPostScheduleList() {
        return http.post<ResponseData<ScheduleList>>("/Schedule/PostScheduleList");
    },
    // 获取课表详情
    MMPostScheduleByID(id: number) {
        return http.post<ResponseData<ScheduleData>>(`/Schedule/PostScheduleByID/${id}`);
    },
    // 获取课程列表
    MMPostCourseListByScheduleID(id: number) {
        return http.post<ResponseData<CourseList>>(`/Schedule/PostCourseListByScheduleID/${id}`);
    },
    // 获取课程详情
    MMPostCourseByID(id: number) {
        return http.post<ResponseData<CourseData>>(`/Schedule/PostCourseByCourseID/${id}`);
    },
    // 获取课程时间段列表
    MMPostTimeListByCourseID(id: number) {
        return http.post<ResponseData<CourseTimeList>>(`/Schedule/PostTimeByCourseID/${id}`);
    },
    // 获取课程时间段详情
    MMPostTimeByID(id: number) {
        return http.post<ResponseData<CourseTimeData>>(`/Schedule/PostTimeByID/${id}`);
    },
};

