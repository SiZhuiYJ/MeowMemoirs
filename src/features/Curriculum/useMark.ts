import { ref } from "vue";
// import { ClassApi } from "@/libs/api/class/index";
import type { Event } from "@/libs/api/class/type";
import { ElLoading } from "element-plus";
import { meowMsgError, meowMsgSuccess } from "@/utils/message";

export default function useMark() {
    // 标记日期：纪念日，重要日
    const markDate = ref<Event[]>([
        {
            id: 1,
            date: "2025-09-08",
            type: "important",
            info: "上课第一天",
            color: "yellow"
        },
        {
            id: 2,
            date: "2025-10-01",
            type: "festival",
            info: "国庆节",
            color: "blue"
        },
        {
            id: 3,
            date: "2025-09-11",
            type: "countdown",
            info: "世界末日",
            color: "red"
        },
        {
            id: 4,
            date: "2025-09-08",
            type: "anniversary",
            info: "结婚纪念日",
            color: "blue"
        },
        {
            id: 5,
            date: "2004-01-29",
            type: "birthday",
            info: "小君君的生日",
            color: "red"
        }
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
            markDate.value = [];
            console.log(error);
            meowMsgError("课表获取失败");
        }
        console.log("标记日期", markDate.value)
        loading.close();
    }
    async function addMark(addClass: Event) {
        markDate.value.push(addClass);
    }
    return {
        markDate, // 标记日期
        initializeData, // 初始化数据
        addMark, // 添加课程
    };
};
