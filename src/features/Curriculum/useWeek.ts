import { ref, computed } from "vue";
import { getDateFormatYYYYMMDD, getWeekNumber } from "@/utils/calendar";

export default function useWeek() {
    // 起始日期
    const startDate = ref(new Date(2025, 8, 8)); //2025-9-8为开学时间
    // 双向绑定 --当前日期
    const weekNumber = ref(new Date());

    async function setStartDate(newDate: Date) {
        startDate.value = newDate
    }
    // 设置当前周数
    function setWeekNumber(time: string) {
        weekNumber.value = new Date(time);
    }

    // 获取当前周次
    const getCurrentWeek = computed((): number => {
        return getWeekNumber(getDateFormatYYYYMMDD(weekNumber.value), startDate.value);
    });
    return {
        startDate, // 起始日期
        weekNumber, // 当前周数
        getCurrentWeek, // 当前周数
        setStartDate,// 设置第一周 
        setWeekNumber, // 设置周数
    };
};
