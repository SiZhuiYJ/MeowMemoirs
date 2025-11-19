import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { CourseTime } from "@/features/schedule/types";

export default function useTimeList() {
    // 所有时间段列表
    const timeList = ref<CourseTime[]>([]);

    function setTimeList(data: CourseTime[]) {
        // 后端可能把 weekList / sectionList 以字符串形式返回（如 "[1,2]"），确保转换为数组
        timeList.value = data.map(item => {
            const copy = { ...item } as CourseTime;
            try {
                if (copy.weekList && typeof (copy.weekList as any) === 'string') {
                    copy.weekList = JSON.parse(copy.weekList as unknown as string).map((n: any) => Number(n));
                }
            } catch (e) {
                // 如果解析失败，保留原值（可能已经是数组）
            }
            try {
                if (copy.sectionList && typeof (copy.sectionList as any) === 'string') {
                    copy.sectionList = JSON.parse(copy.sectionList as unknown as string).map((n: any) => Number(n));
                }
            } catch (e) {
                // ignore
            }
            return copy;
        });
    }
    async function getTimeListByID(id: number): Promise<CourseTime[] | undefined> {
        if (!id) return undefined;
        if (timeList.value?.[0]?.courseId !== id) {
            const { data } = await ScheduleApi.CourseTime.PostListByCourseID(id)
            setTimeList(data.time);
        }
        return timeList.value;
    }
    return {
        timeList,
        setTimeList,
        getTimeListByID
    };
}
