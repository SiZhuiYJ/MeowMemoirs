import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { Schedule } from "@/features/schedule/types";
import { numberToChinese } from "@/utils/calendar";

export default function useSchedule() {
    // 所有课表列表
    const schedule = ref<Schedule>();

    const WeekTable = ref<{ label: string; value: number }[]>([]);
    const TimeTable = ref<{ label: string; value: number }[]>([]);

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
            WeekTable.value = getWeekTableByWeeklong();
            TimeTable.value = getTimeTable();
        }
        return schedule.value;
    }
    // 获取周次表按照weeklong生成
    function getWeekTableByWeeklong(): { label: string; value: number }[] {
        const weekCount = schedule.value?.weekCount || 0;
        const data = Array.from({ length: weekCount }, (_, index) => {
            return {
                label: "第" + numberToChinese(index + 1) + "周",
                value: index + 1
            };
        });
        console.log("周次表数据:", data);
        return data;
    }
    // 获取节次表
    function getTimeTable(): { label: string; value: number }[] {
        const timetableCount = schedule.value?.timetable.length || 0;
        const data = Array.from({ length: timetableCount }, (_, index) => {
            return { label: "第" + numberToChinese(index + 1) + "节", value: index + 1 };
        });
        console.log("节次表数据:", data);
        return data;
    }
    return {
        schedule,
        WeekTable,
        TimeTable,
        setSchedule,
        getScheduleByID,
    };
}
