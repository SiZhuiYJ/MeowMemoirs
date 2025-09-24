import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { ClassApi } from "@/libs/api/class/index";
import type { Class, Event } from "@/libs/api/class/type";
import { numberToChinese } from "@/utils/calendar";
import { ElLoading } from "element-plus";
import { meowMsgError, meowMsgSuccess } from "@/utils/message";
import { getDateFormatYYYYMMDD, getWeekNumber } from "@/utils/calendar";

export const useClassStore = defineStore("class", () => {
  // 所有课程列表
  const classes = ref<Class[]>([]);
  // 起始日期
  const startDate = ref(new Date(2025, 8, 8)); //2025-9-8为开学时间
  // 双向绑定
  const weekNumber = ref(new Date());
  // 周次长度
  const weeklong = ref(18);
  // 星期列表
  const weekList = ref(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);
  // 节次列表
  const numberList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  // 作息列表
  const timeList = ref<string[]>([
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
    "21:00-21:45",
  ]);
  // 标记日期：纪念日，重要日
  const markDate = ref<Event[]>([
    {
      id: 1,
      date: "2025-09-08",
      type: "important",
      info: "上课第一天",
      color: "yellow",
    },
    {
      id: 2,
      date: "2025-10-01",
      type: "festival",
      info: "国庆节",
      color: "blue",
    },
    {
      id: 3,
      date: "2025-09-11",
      type: "countdown",
      info: "世界末日",
      color: "red",
    },
    {
      id: 4,
      date: "2025-09-08",
      type: "anniversary",
      info: "结婚纪念日",
      color: "blue",
    },
    {
      id: 5,
      date: "2004-01-29",
      type: "birthday",
      info: "小君君的生日",
      color: "red",
    },
  ])

  async function initializeData() {
    const loading = ElLoading.service({
      lock: true,
      text: "获取课表数据中...",
      background: "rgba(0, 0, 0, 0.7)",
    });
    try {
      const { data } = await ClassApi.MMPostClassesByID(1);
      data.forEach((item) => {
        classes.value.push({
          id: item.id,
          name: item.name,
          location: item.location,
          dayOfWeek: item.dayOfWeek,
          week: JSON.parse(item.week),
          number: JSON.parse(item.number),
          teacher: item.teacher,
          color: item.color,
          remark: item.remark
        })
      });
      meowMsgSuccess("课表获取成功");
    }
    catch (error) {
      classes.value = [];
      meowMsgError("课表获取失败");
    }
    loading.close();
  }
  async function AddClass(addClass: Class) {
    classes.value.push(addClass);
  }
  // 获取节次表
  function getTimeTable(): { label: string; value: number }[] {
    return numberList.value.map((item) => {
      return { label: "第" + numberToChinese(item) + "节", value: item };
    });
  }
  // 获取周次表按照weeklong生成
  function getWeekTableByWeeklong(): { label: string; value: number }[] {
    return Array.from({ length: weeklong.value }, (_, index) => {
      return { label: "第" + numberToChinese(index + 1) + "周", value: index + 1 };
    });
  }
  function setWeekNumber(time: string) {
    weekNumber.value = new Date(time);
  }
  // 获取周次某天某节课的课程
  function getClass(week: number, dayOfWeek: number, number: number): Class | undefined {
    if (dayOfWeek == 7) dayOfWeek = 0;
    return classes.value.find(
      (item) =>
        item.week.includes(week) &&
        item.dayOfWeek === dayOfWeek &&
        item.number.includes(number)
    );
  }

  // 获取当前周次
  const getCurrentWeek = computed((): number => {
    return getWeekNumber(getDateFormatYYYYMMDD(weekNumber.value), startDate.value)
  });
  return {
    classes,// 所有课程列表
    startDate,// 起始日期
    weekNumber,// 当前周数
    weekList,// 星期列表
    numberList,// 节次列表
    timeList,// 作息列表
    weeklong,// 周次长度
    getCurrentWeek,// 当前周数
    markDate,// 标记日期
    initializeData,// 初始化数据
    AddClass,// 添加课程
    setWeekNumber,// 设置周数
    getTimeTable,// 获取节次表
    getWeekTableByWeeklong,// 获取周次表
    getClass// 获取周次某天某节课的课程
  };
});
