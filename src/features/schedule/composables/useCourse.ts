import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { Course } from "@/features/schedule/types";

export default function useCourse() {
    // 当前课程
    const course = ref<Course>();
    function setCourse(data: Course) {
        course.value = data;
    }

    async function getCourseByID(id: number): Promise<Course | undefined> {
        console.log("获取课程id", id)
        if (!id) return undefined;
        if (course.value?.id !== id) {
            const { data } = await ScheduleApi.MMPostCourseByID(id)
            setCourse(data.course);
        }
        console.log("获取课程详情", course.value)
        return course.value;
    }
    return {
        course,
        setCourse,
        getCourseByID,

    };
}
