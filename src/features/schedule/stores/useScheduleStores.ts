import { ScheduleApi } from "@/features/schedule/api";
import type { Schedule } from "@/features/schedule/types";
import { meowMsgError, meowMsgSuccess } from "@/utils/message";
import { ElLoading } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";


export const useScheduleStores = defineStore("schedule", () => {

    const scheduleStore = ref<Schedule[]>([]);

    async function initializeData() {
        const loading = ElLoading.service({
            lock: true,
            text: "获取课表数据中...",
            background: "rgba(0, 0, 0, 0.7)"
        });
        scheduleStore.value = [];
        try {
            const { data } = await ScheduleApi.Schedule.PostList();
            data.schedule.forEach((item) => {
                scheduleStore.value.push({
                    id: item.id,
                    userId: item.userId,
                    scheduleName: item.scheduleName,
                    startTime: item.startTime,
                    weekCount: item.weekCount,
                    timetable: JSON.parse(item.timetable) as string[],
                    remark: item.remark,
                    createTime: item.createTime,
                    updateTime: item.updateTime,
                    is_deleted: item.is_deleted,
                });
            });
            meowMsgSuccess("课表获取成功");
        } catch (error) {
            scheduleStore.value = [];
            console.log(error);
            meowMsgError("课表获取失败");
        }
        loading.close();
    }
    async function getScheduleByID(id: number) {
        if (!id) return undefined;
        if (scheduleStore.value.length === 0) await initializeData();
        return scheduleStore.value.find(item => item.id === id);
    }
    return {
        scheduleStore,
        initializeData,
        getScheduleByID
    };
});
