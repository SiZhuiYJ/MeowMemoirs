import { ScheduleApi } from "@/features/auth/api";
import type { Schedule } from "@/features/auth/types";
import { meowMsgError, meowMsgSuccess } from "@/utils/message";
import { ElLoading } from "element-plus";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useScheduleStores = defineStore("schedule", () => {
    const scheduleStore = ref<Schedule[]>([]);

    async function initializeData() {
        const loading = ElLoading.service({
            lock: true,
            text: "获取课表数据中...",
            background: "rgba(0, 0, 0, 0.7)"
        });
        try {
            const { data } = await ScheduleApi.MMPostScheduleList();
            console.log("获取课表数据", data);
            scheduleStore.value = data.schedule;
            meowMsgSuccess("课表获取成功");
        } catch (error) {
            scheduleStore.value = [];
            console.log(error);
            meowMsgError("课表获取失败");
        }
        console.log("课表集合", scheduleStore.value)
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
