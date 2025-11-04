import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { CourseTime } from "@/features/schedule/types";

export default function useTimeList() {
    // 所有时间段列表
    const timeList = ref<CourseTime[]>([]);
    function setTimeList(data: CourseTime[]) {
        timeList.value = data;
    }
    async function getTimeListByID(id: number): Promise<CourseTime[] | undefined> {
        console.log("获取课程时间id", id)
        if (!id) return undefined;
        if (timeList.value?.[0]?.courseId !== id) {
            const { data } = await ScheduleApi.MMPostTimeListByCourseID(id)
            setTimeList(data.courseTime);
        }
        console.log("获取课程时间列表", timeList.value)
        return timeList.value;
    }
    return {
        timeList,
        setTimeList,
        getTimeListByID
    };
}
