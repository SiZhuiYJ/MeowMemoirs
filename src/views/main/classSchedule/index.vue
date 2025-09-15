<script setup lang="ts">
import { onMounted, ref } from "vue";
import { meowMsgError, meowMsgSuccess } from "@/utils/message";
import Folding from "@/layouts/components/Header/components/LoadListener/Folding/index.vue";
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
const startDate = ref(new Date(2025, 8, 8)); //2025-9-8为开学时间
// 选着的日期
const currentDate = ref(new Date());
// 所有课程列表
const classList = ref<Class[]>([]);
// 当前周次
const currentWeek = ref(1);
// 周次长度
const weeklong = ref(30);
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
  currentDate.value = inputDate;
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

//获取当前日期格式为yyyy-mm-dd
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

import MeowDialog from "@/components/MeowDialog/index.vue";
import { ElLoading } from "element-plus";
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
// 获取课表数据
async function getScheduleData() {
  const loading = ElLoading.service({
    lock: true,
    text: "获取课表数据中...",
    background: "rgba(0, 0, 0, 0.7)",
  });
  setTimeout(() => {}, 2000);
  const baseUrl = import.meta.env.BASE_URL;

  // 使用 fetch 加载 JSON 文件
  const response = await fetch(`${baseUrl}class.json`);

  if (!response.ok) {
    meowMsgError("课表获取失败");
    throw new Error(`获取失败: ${response.statusText}`);
  }
  const classJson: Class[] = await response.json();
  classList.value = classJson;
  meowMsgSuccess("课表获取成功");
  loading.close();
}
const folding = ref();
// 加载完成调用
onMounted(async () => {
  getScheduleData();
  changeWeekNumber(getWeekNumber(getCurrentDate()));
  if (window.innerWidth > 768) folding.value.toggleDetails();
});
</script>
<template>
  <!-- 课程控制器 -->
  <div class="confession-class-controller">
    <!-- 当前周数 -->
    <Folding ref="folding">
      <div class="current-week">当前周数：</div>
      <template #toggle>
        <div class="current-week">第{{ numberToChinese(currentWeek) }}周</div>
      </template>
      <template #container>
        <el-calendar>
          <template #date-cell="{ data }">
            <div
              class="date-cell"
              :class="[
                data.isSelected ? 'is-selected' : '',
                data.day === '2025-09-08' ? 'is-today' : '',
              ]"
              @click="changeWeekNumber(getWeekNumber(data.day))"
            >
              {{ data.day.split("-")[2] }}
              {{ data.isSelected ? "✔️" : "" }}<br />
              {{ data.day === getCurrentDate() ? "今" : "" }}
              {{ data.day === "2025-09-08" ? "⭐" : "" }}
            </div>
          </template>
        </el-calendar></template
      >
    </Folding>
  </div>
  <div class="confession-class">
    <div class="confession-class-grid">
      <div class="confession-time-item" key="-1">
        <div class="time-header">节次</div>
        <div class="time-slot" v-for="number in numberList" :key="number">
          <span class="time-slot-number">{{ numberToChinese(number) }}节</span>
          <span class="time-slot-time">{{ "{" + timeList[number] + "}" }}</span>
        </div>
      </div>
      <div
        class="confession-class-item"
        v-for="(item, index) in weekList"
        :class="[currentDate.getDay() === (index + 1) % 7 ? 'class-activate' : '']"
        :key="index + 1"
        :title="index + ':' + currentDate.getDay() + ':' + (index % 7)"
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
              <el-text class="course-name" line-clamp="1">
                {{ getClass(currentWeek, index + 1, number)?.name }}
              </el-text>
              <el-text class="course-details" line-clamp="2">
                {{ getClass(currentWeek, index + 1, number)?.location }} /
                {{ getClass(currentWeek, index + 1, number)?.teacher }}
              </el-text>
            </div>
          </template>
          <template v-else>
            <div class="empty-slot">无</div>
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
  padding: 40px 0 0;
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
      .time-slot {
        background: var(--el-color-primary-light-4);
        padding: 5px;
        font-weight: 500;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #f8fafd;
        font-style: italic;
        .time-slot-number {
          font-size: 16px;
        }
        .time-slot-time {
          font-size: 10px;
        }
      }
      .time-header,
      .day-header {
        background: var(--el-color-primary);
        color: white;
        padding: 15px;
        text-align: center;
        font-weight: 500;
      }
      .course-slot {
        height: 50px;
        padding: 5px;
        background: white;
        position: relative;
      }
    }
    .class-activate {
      .course-slot {
        background: var(--el-color-primary-light-7);
      }
    }
  }
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
  .course-slot {
    padding: 2px;
    .course-item {
      padding: 2px;
      height: 48px;
    }
  }
  .time-slot {
    .time-slot-number {
      font-size: 10px;
    }
    .time-slot-time {
      font-size: 5px;
    }
  }
  .course-name {
    font-size: 9px;
    margin-bottom: 1px;
  }
  .course-details {
    font-size: 6px;
  }
  .confession-class {
    padding: 0;
  }
}
// 日历
.current-week {
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.date-cell {
  height: calc(100% - 4px);
  padding: 2px;
}
.is-today {
  background-color: var(--el-color-primary);
}
</style>
