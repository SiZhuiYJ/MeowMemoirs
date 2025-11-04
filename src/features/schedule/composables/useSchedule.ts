import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { Schedule } from "@/features/schedule/types";

export default function useSchedule() {
    // 所有课表列表
    const schedule = ref<Schedule>();

    function setSchedule(data: Schedule) {
        schedule.value = data;
    }

    async function getScheduleByID(id: number): Promise<Schedule | undefined> {
        console.log("获取课表id", id)
        if (!id) return undefined;
        if (schedule.value?.id !== id) {
            const { data } = await ScheduleApi.MMPostScheduleByID(id)
            setSchedule(data.schedule);
        }
        console.log("获取课表详情", schedule.value)
        return schedule.value;
    }
    return {
        schedule,
        setSchedule,
        getScheduleByID
    };
}
