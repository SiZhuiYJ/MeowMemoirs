import { ref } from "vue";
// import { ClassApi } from "@/libs/api/class/index";
import { ElLoading } from "element-plus";
import { meowMsgError, meowMsgSuccess } from "@/utils/message";
import { numberToChinese } from "@/utils/calendar";
export default function useWeekData() {
    // 周次长度
    const weeklong = ref(18);
    // 星期列表
    const weekList = ref([
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
        "周日"
    ]);

    async function initializeData() {
        const loading = ElLoading.service({
            lock: true,
            text: "获取课表数据中...",
            background: "rgba(0, 0, 0, 0.7)"
        });
        try {
            // const { data } = await ClassApi.PostClassesByID(1);
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
            console.log(error);
            meowMsgError("课表获取失败");
        }
        console.log(weeklong.value)
        loading.close();
    }

    // 获取周次表按照weeklong生成
    function getWeekTableByWeeklong(): { label: string; value: number }[] {
        return Array.from({ length: weeklong.value }, (_, index) => {
            return {
                label: "第" + numberToChinese(index + 1) + "周",
                value: index + 1
            };
        });
    }
    async function setWeeklong(newWeeklong: number) {
        weeklong.value = newWeeklong;
    }
    return {
        weekList, // 星期列表
        weeklong, // 周次长度
        initializeData, // 初始化数据
        setWeeklong, // 修改总周数
        getWeekTableByWeeklong,// 获取周次表按照weeklong生成
    };
};
