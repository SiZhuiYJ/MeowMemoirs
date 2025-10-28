import { ref } from "vue";
import { ClassApi } from "@/libs/api/class/index";
import type { Class } from "@/libs/api/class/type";
import { ElLoading } from "element-plus";
import { meowMsgError, meowMsgSuccess } from "@/utils/message";

export default function useClass() {
    // 所有课程列表
    const classes = ref<Class[]>([]);

    async function initializeData() {
        const loading = ElLoading.service({
            lock: true,
            text: "获取课表数据中...",
            background: "rgba(0, 0, 0, 0.7)"
        });
        try {
            const { data } = await ClassApi.MMPostClassesByID(1);
            data.forEach(item => {
                classes.value.push({
                    id: item.id,
                    name: item.className,
                    location: item.location,
                    dayOfWeek: item.dayOfWeek,
                    week: JSON.parse(item.weekList),
                    number: JSON.parse(item.sessionList),
                    teacher: item.teacher,
                    color: item.color,
                    remark: item.remark
                });
            });
            meowMsgSuccess("课表获取成功");
        } catch (error) {
            classes.value = [];
            console.log(error);
            meowMsgError("课表获取失败");
        }
        console.log(classes.value)
        loading.close();
    }
    async function AddClass(addClass: Class) {
        classes.value.push(addClass);
    }
    function getClassById(id: number): Class | undefined {
        return classes.value.find(course => course.id === id);
    }
    // 获取周次某天某节课的课程
    function getClass(
        week: number,
        dayOfWeek: number,
        number: number
    ): Class | undefined {
        return classes.value.find(
            item =>
                item.week.includes(week) &&
                item.dayOfWeek === dayOfWeek &&
                item.number.includes(number)
        );
    }
    return {
        classes, // 所有课程列表
        initializeData, // 初始化数据
        AddClass, // 添加课程
        getClassById,// 
        getClass // 获取周次某天某节课的课程
    };
}
