<script setup lang="ts">
import { ref } from "vue";
// 课程类
interface Class {
  id: number; // 课程id
  name: string; // 课程名
  location: string; // 地点
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 周几
  week: number[]; // 周数
  number: number[]; // 节次
  teacher: string; // 教师
  color: string; // 颜色
  remark?: string; // 备注
}
// 起始日期
const startDate = ref(new Date(2025, 9, 8));
// 所有课程列表
const classList = ref<Class[]>([
  {
    id: 1,
    name: "中国近现代史纲要",
    location: "成都校区 E405",
    dayOfWeek: 1,
    week: [1, 2, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16],
    number: [9, 10],
    teacher: "王雪山",
    color: "#FF0000",
    remark: `中国近现代史纲要/AB21400002/(9-9节)1-4周,9-16周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0
      中国近现代史纲要/AB21400002/(10-10节)1-4周,9-16周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0`,
  },
  {
    id: 2,
    name: "形势与政策1",
    location: "成都校区 E405",
    dayOfWeek: 1,
    week: [6, 7],
    number: [9, 10],
    teacher: "王雪山",
    color: "#FF0001",
    remark: `形势与政策1/AB21400005/(9-9节)6-7周/成都校区 E405/王雪山/(2025-2026-1)-AB21400005-08/8/0.5
    形势与政策1/AB21400005/(10-10节)6-7周/成都校区 E405/王雪山/(2025-2026-1)-AB21400005-08/8/0.5`,
  },
  {
    id: 3,
    name: "婴幼儿回应性照料",
    location: "成都校区 C107（音乐综合实训室）",
    dayOfWeek: 2,
    week: [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    number: [3, 4],
    teacher: "周红",
    color: "#FF0002",
    remark: `婴幼儿回应性照料/BB10403020/(3-3节)1-4周,6-17周/成都校区 C107（音乐综合实训室）/周红/(2025-2026-1)-BB10403020-13/34/2
      婴幼儿回应性照料/BB10403020/(4-4节)1-4周,6-17周/成都校区 C107（音乐综合实训室）/周红/(2025-2026-1)-BB10403020-13/34/2`,
  },
  {
    id: 4,
    name: "教育见习I",
    location: "成都校区 外出",
    dayOfWeek: 3,
    week: [8],
    number: [1, 2, 3, 4, 5, 6, 7, 8],
    teacher: "唐金金",
    color: "#FF0004",
    remark: `教育见习I/CB21500008/(1-1节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(2-2节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(3-3节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(4-4节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(5-5节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(6-6节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(7-7节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(8-8节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    `,
  },
  {
    id: 5,
    name: "教育见习I",
    location: "成都校区 外出",
    dayOfWeek: 4,
    week: [8],
    number: [1, 2, 3, 4, 5, 6, 7, 8],
    teacher: "唐金金",
    color: "#FF0004",
    remark: `教育见习I/CB21500008/(1-1节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(2-2节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(3-3节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(4-4节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(5-5节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(6-6节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(7-7节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(8-8节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    `,
  },
  {
    id: 6,
    name: "教育见习I",
    location: "成都校区 外出",
    dayOfWeek: 5,
    week: [8],
    number: [1, 2, 3, 4, 5, 6, 7, 8],
    teacher: "唐金金",
    color: "#FF0004",
    remark: `教育见习I/CB21500008/(1-1节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(2-2节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(3-3节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(4-4节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(5-5节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(6-6节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(7-7节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    教育见习I/CB21500008/(8-8节)8周/成都校区 外出/唐金金/(2025-2026-1)-CB21500008-06/17/1
    `,
  },
  {
    id: 7,
    name: "幼儿园课程设计与实施",
    location: "成都校区 B104",
    dayOfWeek: 3,
    week: [1, 2, 3, 6, 9, 10, 11, 12, 13, 14, 15, 16],
    number: [3, 4],
    teacher: "唐金金",
    color: "#FF0000",
    remark: `幼儿园课程设计与实施/BB10403017/(3-3节)1-3周,6周,9-17周/成都校区 B104/唐金金/(2025-2026-1)-BB10403017-06/34/2
      幼儿园课程设计与实施/BB10403017/(4-4节)1-3周,6周,9-17周/成都校区 B104/唐金金/(2025-2026-1)-BB10403017-06/34/2`,
  },
  {
    id: 8,
    name: "幼儿园教育活动设计与实施",
    location: "成都校区 D107",
    dayOfWeek: 3,
    week: [1, 2, 3, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16],
    number: [5, 6],
    teacher: "徐冬梅",
    color: "#FF0000",
    remark: `幼儿园教育活动设计与实施/BB10403003/(5-5节)1-3周,6-7周,9-17周/成都校区 D107/徐冬梅/(2025-2026-1)-BB10403003-16/34/2
      幼儿园教育活动设计与实施/BB10403003/(6-6节)1-3周,6-7周,9-17周/成都校区 D107/徐冬梅/(2025-2026-1)-BB10403003-16/34/2`,
  },
  {
    id: 9,
    name: "形势与政策1",
    location: "成都校区 E405",
    dayOfWeek: 3,
    week: [6, 7],
    number: [9, 10],
    teacher: "王雪山",
    color: "#FF0000",
    remark: `形势与政策1/AB21400005/(9-9节)6-7周/成都校区 E405/王雪山/(2025-2026-1)-AB21400005-08/8/0.5
    形势与政策1/AB21400005/(10-10节)6-7周/成都校区 E405/王雪山/(2025-2026-1)-AB21400005-08/8/0.5`,
  },
  {
    id: 10,
    name: "奥尔夫音乐教学法Ⅰ",
    location: "成都校区 F506（舞台排练实训室）",
    dayOfWeek: 4,
    week: [1, 2, 3, 5, 6, 7],
    number: [5, 6, 7, 8],
    teacher: "张莹",
    color: "#FF0000",
    remark: `奥尔夫音乐教学法Ⅰ/BB30403018/(5-5节)1-3周,5-7周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0
    奥尔夫音乐教学法Ⅰ/BB30403018/(6-6节)1-3周,5-7周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0
    奥尔夫音乐教学法Ⅰ/BB30403018/(7-7节)1-3周,5-7周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0
    奥尔夫音乐教学法Ⅰ/BB30403018/(8-8节)1-3周,5-7周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0`,
  },
  {
    id: 11,
    name: "教师职业道德与教育政策法规",
    location: "成都校区 B102",
    dayOfWeek: 5,
    week: [1, 2, 3, 5, 7, 9, 10, 11, 12, 13, 14, 15, 16],
    number: [5, 6],
    teacher: "杨薛琳",
    color: "#FF0000",
    remark: `教师职业道德与教育政策法规/BB10403016/(5-5节)1-3周,5-7周,9-17周/成都校区 B102/杨薛琳/(2025-2026-1)-BB10403016-06/34/2.0
    教师职业道德与教育政策法规/BB10403016/(6-6节)1-3周,5-7周,9-17周/成都校区 B102/杨薛琳/(2025-2026-1)-BB10403016-06/34/2.0`,
  },
  {
    id: 12,
    name: "幼儿中医推拿Ⅰ",
    location: "成都校区 C107（音乐综合实训室）",
    dayOfWeek: 5,
    week: [1, 2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16],
    number: [7, 8],
    teacher: "李姝涵",
    color: "#FF0000",
    remark: `幼儿中医推拿Ⅰ/BB30403021/(7-7节)1-3周,5-7周,9-17周/成都校区 C107（音乐综合实训室）/李姝涵/(2025-2026-1)-BB30403021-13/34/2
    幼儿中医推拿Ⅰ/BB30403021/(8-8节)1-3周,5-7周,9-17周/成都校区 C107（音乐综合实训室）/李姝涵/(2025-2026-1)-BB30403021-13/34/2`,
  },
  {
    id: 13,
    name: "奥尔夫音乐教学法Ⅰ",
    location: "成都校区 F506（舞台排练实训室）",
    dayOfWeek: 6,
    week: [5],
    number: [5, 6, 7, 8],
    teacher: "张莹",
    color: "#FF0000",
    remark: `奥尔夫音乐教学法Ⅰ/BB30403018/(5-5节)5周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0
    奥尔夫音乐教学法Ⅰ/BB30403018/(6-6节)5周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0
    奥尔夫音乐教学法Ⅰ/BB30403018/(7-7节)5周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0
    奥尔夫音乐教学法Ⅰ/BB30403018/(8-8节)5周/成都校区 F506（舞台排练实训室）/张莹/(2025-2026-1)-BB30403018-14/34/2.0`,
  },
  {
    id: 14,
    name: "幼儿园课程设计与实施",
    location: "成都校区 B104",
    dayOfWeek: 0,
    week: [3],
    number: [3, 4],
    teacher: "唐金金",
    color: "#FF0000",
    remark: `幼儿园课程设计与实施/BB10403017/(3-3节)3周/成都校区 B104/唐金金/(2025-2026-1)-BB10403017-06/34/2
    幼儿园课程设计与实施/BB10403017/(4-4节)3周/成都校区 B104/唐金金/(2025-2026-1)-BB10403017-06/34/2`,
  },
  {
    id: 15,
    name: "幼儿园教育活动设计与实施",
    location: "成都校区 D107",
    dayOfWeek: 0,
    week: [3],
    number: [5, 6],
    teacher: "徐冬梅",
    color: "#FF0000",
    remark: `幼儿园教育活动设计与实施/BB10403003/(5-5节)3周/成都校区 D107/徐冬梅/(2025-2026-1)-BB10403003-16/34/2
    幼儿园教育活动设计与实施/BB10403003/(6-6节)3周/成都校区 D107/徐冬梅/(2025-2026-1)-BB10403003-16/34/2`,
  },
  {
    id: 16,
    name: "中国近现代史纲要",
    location: "成都校区 E405",
    dayOfWeek: 0,
    week: [3],
    number: [9, 10],
    teacher: "王雪山",
    color: "#FF0000",
    remark: `中国近现代史纲要/AB21400002/(9-9节)3周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0
    中国近现代史纲要/AB21400002/(10-10节)3周/成都校区 E405/王雪山/(2025-2026-1)-AB21400002-10/48/3.0`,
  },
]);
// today.value = new Date();
// 当前周次
const currentWeek = ref(1);
// 周次长度
const weeklong = ref(30);
// 星期列表
const weekList = ref(["周一", "周二", "周三", "周四", "周五", "周六", "周日"]);
// 节次列表
const numberList = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
// 获取周次某天某节课的课程
function getClass(week: number, dayOfWeek: number, number: number): Class | undefined {
  if (dayOfWeek == 7) dayOfWeek = 0;
  return classList.value.find(
    (item) =>
      item.week.includes(week) &&
      item.dayOfWeek === dayOfWeek &&
      item.number.includes(number)
  );
}
// 获取今日是startDate的第几周
function getWeekNumber(time: string): number {
  const inputDate = new Date(time);

  // 获取日期的时间戳（毫秒数）
  const startMs = startDate.value.getTime();
  const inputMs = inputDate.getTime();

  // 计算日期差值（天）
  const dayDiff = Math.floor((inputMs - startMs) / (1000 * 60 * 60 * 24));

  // 计算周数（向上取整）
  const weekNumber = Math.ceil((dayDiff + 1) / 7);

  return weekNumber;
}

// 更改周次
function changeWeekNumber(weekNumber: number) {
  currentWeek.value = weekNumber;
}
// 数字转中文数字（如‘11’转为十一）
function numberToChinese(number: number): string {
  const chineseNumbers = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
  ];
  if (number <= 10) {
    return chineseNumbers[number];
  }
  if (number < 20) {
    return "十" + chineseNumbers[number - 10];
  }
  if (number <= 100) {
    return (
      chineseNumbers[Math.floor(number / 10)] +
      "十" +
      (number % 10 == 0 ? "" : chineseNumbers[number % 10])
    );
  }
  return chineseNumbers[Math.floor(number / 100)] + "百" + numberToChinese(number % 100);
}
import MeowDialog from "@/components/MeowDialog/index.vue";
// 添加 OR 修改对话框Ref
const DialogRef = ref();
/** 打开Dialog操作 */
const title = ref("课程详情");

// 确定按钮是否显示Loading
const confirmLoading = ref(false);

/** 确定  */
const handleConfirm = () => {};

/** 取消 */
const handleCancel = () => {
  DialogRef.value.Close();
};
//课程详情
const classDetail = ref<Class>();
// 显示课程详情
function showClassDetail(id: number) {
  classDetail.value = classList.value.find((item) => item.id === id);
  DialogRef.value.Open();
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
console.log(getWeekNumber("2025-09-20"));
</script>
<template>
  <!-- 课程控制器 -->
  <div class="confession-class-controller">
    <!-- 当前周数 -->
    <div class="current-week">当前周数：{{ currentWeek }}</div>
    <el-calendar>
      <template #date-cell="{ data }">
        <p
          class="date-cell"
          :class="data.isSelected ? 'is-selected' : ''"
          @click="changeWeekNumber(getWeekNumber(data.day))"
        >
          {{ data.day.split("-")[2] }}
          {{ data.isSelected ? "✔️" : "" }}
        </p>
      </template>
    </el-calendar>
  </div>
  <div class="confession-class">
    <div class="confession-class-grid">
      <div class="confession-time-item" key="-1">
        <div class="time-header">节次</div>
        <div class="time-slot" v-for="number in numberList" :key="number">
          第{{ numberToChinese(number) }}节
        </div>
      </div>
      <div
        class="confession-class-item"
        v-for="(item, index) in weekList"
        :key="index + 1"
      >
        <div class="day-header">{{ item }}</div>
        <div v-for="number in numberList" :key="number" class="course-slot">
          <template v-if="getClass(currentWeek, index + 1, number)">
            <div
              class="course-item"
              :style="{
                borderLeftColor: getClass(currentWeek, index + 1, number)?.color,
              }"
              @click="showClassDetail(getClass(currentWeek, index+1, number)!.id)"
            >
              <div class="course-name">
                {{ getClass(currentWeek, index + 1, number)?.name }}
              </div>
              <div class="course-details">
                {{ getClass(currentWeek, index + 1, number)?.location }} /
                {{ getClass(currentWeek, index + 1, number)?.teacher }}
              </div>
            </div>
          </template>
          <template v-else>
            <div class="empty-slot">无课程</div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <MeowDialog
    ref="DialogRef"
    :title="title"
    @Confirm="handleConfirm"
    @Cancel="handleCancel"
    :loading="confirmLoading"
    :footer-hidden="true"
    :draggable="true"
    :close-on-click-modal="true"
    :height="500"
  >
    <template #content>
      <div class="class-details">
        <div class="class-details-item">
          <span class="detail-label">课程名称:</span>
          <div class="detail-value">
            <el-input
              v-model="classDetail!.name"
              placeholder="名称"
              suffix-icon="CollectionTag"
            />
          </div>
        </div>
        <div class="class-details-item">
          <span class="detail-label">课程地点:</span>
          <div class="detail-value">
            <el-input
              v-model="classDetail!.location"
              placeholder="地点"
              suffix-icon="AddLocation"
            />
          </div>
        </div>
        <div class="class-details-item">
          <span class="detail-label">授课老师:</span>
          <div class="detail-value">
            <el-input
              v-model="classDetail!.teacher"
              placeholder="老师"
              suffix-icon="User"
            />
          </div>
        </div>
        <div class="class-details-item">
          <span class="detail-label">课程周几:</span>
          <div class="detail-value">
            <el-radio-group v-model="classDetail!.dayOfWeek">
              <el-radio-button
                v-for="value in 7"
                :label="value == 1 ? '日' : numberToChinese(value - 1)"
                :value="value - 1"
                :key="value"
              />
            </el-radio-group>
          </div>
        </div>
        <div class="class-details-item">
          <span class="detail-label">课程周次:</span>
          <div class="detail-value">
            <el-select-v2
              v-model="classDetail!.week"
              :options="getWeekTableByWeeklong()"
              placeholder="多选"
              style="width: 315px"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="3"
            />
          </div>
        </div>
        <div class="class-details-item">
          <span class="detail-label">课程节次:</span>
          <div class="detail-value">
            <el-select-v2
              v-model="classDetail!.number"
              :options="getTimeTable()"
              placeholder="多选"
              style="width: 315px"
              multiple
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="3"
            />
          </div>
        </div>
        <div class="class-details-item">
          <span class="detail-label">课程颜色:</span>
          <div class="detail-value"><el-color-picker v-model="classDetail!.color" /></div>
          {{ classDetail?.color }}
        </div>
        <div class="class-details-item">
          <span class="detail-label">课程备注:</span>
          <div class="detail-value">
            <el-input
              v-model="classDetail!.remark"
              style="width: 315px"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="备注"
            />
          </div>
        </div>
      </div>
    </template>
  </MeowDialog>
</template>
<style scoped lang="scss">
.confession-class-controller {
  //   width: 40vw;
  min-width: 300px;
  max-width: 500px;
}
.confession-class {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  width: 100%;
  padding: 40px 0 0;
  .confession-class-grid {
    // display: flex;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 1px;
    background-color: #eef2f7;
    .confession-time-item,
    .confession-class-item {
      display: flex;
      gap: 1px;
      background-color: #eef2f7;
      flex-direction: column;
    }
  }
}

.time-slot {
  background: #f8fafd;
  padding: 5px;
  color: #7a8599;
  font-weight: 500;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdc3c7;
  font-style: italic;
}
.course-slot {
  height: 50px;
  padding: 5px;
  background: white;
  position: relative;
}
.course-item {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  border-radius: 4px;
  padding: 5px;
  font-size: 0.9rem;
  height: 40px;
  overflow: hidden;
}
.course-name {
  font-weight: 600;
  margin-bottom: 2px;
  color: #1565c0;
}
.course-details {
  font-size: 0.8rem;
  color: #546e7a;
}
.empty-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bdc3c7;
  font-style: italic;
  height: 100%;
}
.course-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
.time-header,
.day-header {
  background: #4e54c8;
  color: white;
  padding: 15px;
  text-align: center;
  font-weight: 500;
}

// 详情框样式
.class-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;

  .class-details-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;

    .detail-label {
      flex-shrink: 0;
      width: 80px;
      text-align: right;
      font-weight: 600;
      color: #333;
      margin-top: 8px;
    }

    .detail-value {
      width: 315px;
      flex-shrink: 0;

      // 调整Element UI组件样式
      .el-input,
      .el-select-v2,
      .el-color-picker {
        width: 100%;
      }

      .el-checkbox-button,
      .el-radio-button {
        margin-bottom: 5px;
      }

      .el-textarea__inner {
        min-height: 60px;
        resize: vertical;
      }
    }

    // 隐藏测试用的文本显示（根据需求决定是否保留）
    &:not(:has(.detail-value)) {
      &::after {
        content: attr(data-value);
        color: #666;
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }

  // 响应式调整
  @media (max-width: 768px) {
    .class-details-item {
      flex-direction: column;
      gap: 8px;

      .detail-label {
        text-align: left;
        width: 100%;
        margin-top: 0;
      }
    }
  }
}
@media (max-width: 768px) {
  .course-name {
    font-size: 10px;
  }
}
// 日历
.date-cell {
  height: 100%;
}
</style>
