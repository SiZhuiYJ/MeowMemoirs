import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { CourseTime } from "@/features/schedule/types";

export default function useTime() {
    // 所有时间段列表
    const time = ref<CourseTime>();
    function setTime(data: CourseTime) {
        time.value = data;
    }
    async function getTimeByID(id: number): Promise<CourseTime | undefined> {
        console.log("获取课程时间id", id)
        if (!id) return undefined;
        if (time.value?.courseId !== id) {
            const { data } = await ScheduleApi.MMPostTimeByID(id)
            setTime(data.courseTime);
        }
        console.log("获取课程时间详情", time.value)
        return time.value;
    }
    return {
        time,
        setTime,
        getTimeByID
    };
}
