import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { CourseTime } from "@/features/schedule/types";

export default function useTime() {
    // 所有时间段列表
    const time = ref<CourseTime>();

    function setTime(data: CourseTime) {
        // 后端可能返回 weekList / sectionList 为字符串（如 "[1,2]"），确保转换为数组
        const copy = { ...data } as CourseTime;
        try {
            if (copy.weekList && typeof (copy.weekList as any) === 'string') {
                copy.weekList = JSON.parse(copy.weekList as unknown as string).map((n: any) => Number(n));
            }
        } catch (e) {
            // ignore
        }
        try {
            if (copy.sectionList && typeof (copy.sectionList as any) === 'string') {
                copy.sectionList = JSON.parse(copy.sectionList as unknown as string).map((n: any) => Number(n));
            }
        } catch (e) {
            // ignore
        }
        time.value = copy;
    }
    async function getTimeByID(id: number): Promise<CourseTime | undefined> {
        if (!id) return undefined;
        if (time.value?.id !== id) {
            const { data } = await ScheduleApi.MMPostTimeByID(id)
            setTime(data.time);
        }
        return time.value;
    }
    return {
        time,
        setTime,
        getTimeByID
    };
}
