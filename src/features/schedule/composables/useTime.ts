import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { CourseTime } from "@/features/schedule/types";

export default function useTime() {
    // 所有时间段列表
    const time = ref<CourseTime>();

    const loading = ref(false);

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
        resetTime()
        if (!id) {
            loading.value = false;
            return undefined;
        }
        if (time.value?.id !== id) {
            const { data } = await ScheduleApi.CourseTime.PostByID(id)
            setTime(data.time);
        }
        loading.value = false;
        return time.value;
    }

    // 重置
    function resetTime() {
        time.value = {
            id: 0,
            courseId: 0,
            location: "",
            teacher: "",
            weekList: [],
            sectionList: [],
            dayOfWeek: 0,
            createTime: "",
            updateTime: "",
            isDeleted: 0,
        };
        loading.value = true;
    }
    // 编辑
    function editTime(data: CourseTime) {
        time.value = { ...time.value, ...data };
        console.log("Time edited:", time.value);
    }
    resetTime();
    return {
        time,
        loading,
        setTime,
        getTimeByID,
        resetTime,
        editTime,
    };
}
