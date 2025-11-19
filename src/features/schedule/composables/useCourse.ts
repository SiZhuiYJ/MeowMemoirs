import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { Course } from "@/features/schedule/types";

export default function useCourse() {
    // 当前课程
    const course = ref<Course>();

    const loading = ref(false);

    function setCourse(data: Course) {
        course.value = data;
    }

    async function getCourseByID(id: number): Promise<Course | undefined> {
        resetCourse();
        if (!id) {
            loading.value = false;
            return undefined;
        }
        if (course.value?.id !== id) {
            const { data } = await ScheduleApi.Course.PostByID(id)
            setCourse(data.course);
        }
        loading.value = false;
        return course.value;
    }

    // 重置课程
    function resetCourse() {
        course.value = {
            id: 0,
            scheduleId: 0,
            courseName: "",
            color: "#000000",
            createTime: "",
            updateTime: "",
            isDeleted: 0,
        };
    }

    // 编辑
    function editCourse(data: Course) {
        course.value = { ...course.value, ...data };
        console.log("Course edited:", course.value);
    }
    resetCourse();
    return {
        course,
        loading,
        setCourse,
        getCourseByID,
        resetCourse,
        editCourse,
    };
}
