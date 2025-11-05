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
        if (!id) return undefined;
        if (schedule.value?.id !== id) {
            const { data } = await ScheduleApi.MMPostScheduleByID(id)
            console.log(data.schedule);
            setSchedule({
                id: data.schedule.id,
                userId: data.schedule.userId,
                scheduleName: data.schedule.scheduleName,
                startTime: data.schedule.startTime,
                weekCount: data.schedule.weekCount,
                timetable: JSON.parse(data.schedule.timetable) as string[],
                remark: data.schedule.remark,
                createTime: data.schedule.createTime,
                updateTime: data.schedule.updateTime,
                is_deleted: data.schedule.is_deleted,
            });
        }
        return schedule.value;
    }
    return {
        schedule,
        setSchedule,
        getScheduleByID
    };
}
