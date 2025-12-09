import { ref } from "vue";
import { ScheduleApi } from "@/features/schedule/api";
import type { Schedule } from "@/features/schedule/types";
import { numberToChinese } from "@/utils/calendar";

export default function useSchedule() {
    // 所有课表列表
    const schedule = ref<Schedule>();

    const loading = ref(false);

    const WeekTable = ref<{ label: string; value: number }[]>([]);
    const TimeTable = ref<{ label: string; value: number }[]>([]);

    function setSchedule(data: Schedule) {
        schedule.value = data;
    }

    async function getScheduleByID(id: number): Promise<Schedule | undefined> {
        resetSchedule();
        if (!id) {
            loading.value = false;
            return undefined;
        }
        if (schedule.value?.id !== id) {
            const { data } = await ScheduleApi.Schedule.PostByID(id)
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
        loading.value = false;
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

    // 重置
    function resetSchedule() {
        schedule.value = {
            id: 0,
            userId: 0,
            scheduleName: "",
            startTime: "",
            weekCount: 0,
            timetable: [],
            remark: "",
            createTime: "",
            updateTime: "",
            is_deleted: 0,
        };
        WeekTable.value = [];
        TimeTable.value = [];
        return;
    }

    // 编辑
    function editSchedule(data: Schedule) {
        schedule.value = { ...schedule.value, ...data };
        console.log("Schedule edited:", schedule.value);
    }
    resetSchedule();
    return {
        schedule,
        loading,
        WeekTable,
        TimeTable,
        setSchedule,
        getScheduleByID,
        resetSchedule,
        editSchedule,
    };
}
