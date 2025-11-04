import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { Course } from "@/features/schedule/types";

export default function useCourseList() {
    // 所有课程列表
    const courseList = ref<Course[]>([]);
    function setCourseList(data: Course[]) {
        courseList.value = data;
    }
    async function getCourseListByID(id: number): Promise<Course[] | undefined> {
        console.log("获取课程表id", id)
        if (!id) return undefined;
        if (courseList.value?.[0]?.scheduleId !== id) {
            const { data } = await ScheduleApi.MMPostCourseListByScheduleID(id)
            setCourseList(data.course);
        }
        console.log("获取课程列表", courseList.value)
        return courseList.value;
    }
    return {
        courseList,
        setCourseList,
        getCourseListByID
    };
}
