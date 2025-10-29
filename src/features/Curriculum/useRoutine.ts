import { ref } from "vue";
// import { ClassApi } from "@/libs/api/class/index";
import { ElLoading } from "element-plus";
import { meowMsgError, meowMsgSuccess } from "@/utils/message";
import { numberToChinese } from "@/utils/calendar";
export default function useRoutine() {
    // 作息列表
    const routineList = ref<string[]>([
        "8:25-9:10",
        "9:15-10:00",
        "10:10-10:55",
        "11:00-11:45",
        "14:00-14:45",
        "14:50-15:35",
        "15:45-16:30",
        "16:35-17:20",
        "18:30-19:15",
        "19:20-20:05",
        "20:10-20:55",
        "21:00-21:45"
    ]);
    async function initializeData() {
        const loading = ElLoading.service({
            lock: true,
            text: "获取课表数据中...",
            background: "rgba(0, 0, 0, 0.7)"
        });
        try {
            // const { data } = await ClassApi.MMPostClassesByID(1);
            // data.forEach(item => {
            // classes.value.push({
            //     id: item.id,
            //     name: item.className,
            //     location: item.location,
            //     dayOfWeek: item.dayOfWeek,
            //     week: JSON.parse(item.weekList),
            //     number: JSON.parse(item.sessionList),
            //     teacher: item.teacher,
            //     color: item.color,
            //     remark: item.remark
            // });
            // });
            meowMsgSuccess("课表获取成功");
        } catch (error) {
            routineList.value = [];
            console.log(error);
            meowMsgError("课表获取失败");
        }
        console.log(routineList.value)
        loading.close();
    }
    // 获取节次表
    function getTimeTable(): { label: string; value: number }[] {
        return routineList.value.map((_, index) => {
            return { label: "第" + numberToChinese(index + 1) + "节", value: index + 1 };
        });
    }
    async function addRoutine(addValue: string, index: number) {
        // 在routineList.value列表索引为index-1的位置插入addValue
        if (index >= 0 && index < routineList.value.length) {
            routineList.value.splice(index - 1, 0, addValue);
            meowMsgSuccess("插入作息成功");
        }
        else if (index === routineList.value.length) {
            routineList.value.push(addValue);
            meowMsgSuccess("添加作息成功");
        }
        else {
            meowMsgError("添加失败");
        }
    }

    return {
        routineList, // 作息列表
        initializeData, // 初始化数据
        addRoutine, // 添加课程
        getTimeTable,// 获取节次表
    };
};
