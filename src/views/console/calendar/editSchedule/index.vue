<script setup lang="ts">
import { watch, onMounted, ref, computed } from "vue";
// Store
import { useScheduleStores } from "@/features/schedule/stores/useScheduleStores";
import { storeToRefs } from "pinia";
const { initializeData } = useScheduleStores();
const { scheduleStore } = storeToRefs(useScheduleStores());
// Schedule
import useSchedule from "@/features/schedule/composables/useSchedule";
const { schedule, getScheduleByID } = useSchedule();
// Course
import useCourse from "@/features/schedule/composables/useCourse";
const { course, getCourseByID } = useCourse();
// CourseList
import useCourseList from "@/features/schedule/composables/useCourseList";
const { courseList, getCourseListByID } = useCourseList();
// Time
import useTime from "@/features/schedule/composables/useTime";
const { getTimeByID } = useTime(); // time
// TimeList
import useTimeList from "@/features/schedule/composables/useTimeList";
const { timeList, getTimeListByID } = useTimeList();

// 时间段管理相关
const showTimePicker = ref(false);
const newTimeRange = ref<[Date, Date]>([new Date(), new Date()]);

// 确保schedule.timetable存在
const timetable = computed(() => {
    if (!schedule.value || !schedule.value.timetable) {
        return [];
    }
    return schedule.value.timetable;
});

// 格式化时间段显示
const formatTimeRange = (timeRange: string) => {
    return timeRange;
};

// 添加时间段
const addTimeRange = () => {
    if (!schedule.value) return;

    // 确保timetable存在
    if (!schedule.value.timetable) {
        schedule.value.timetable = [];
    }

    const startTime = formatDateToTime(newTimeRange.value[0]);
    const endTime = formatDateToTime(newTimeRange.value[1]);

    // 检查时间段是否有效
    if (startTime && endTime) {
        const timeString = `${startTime}-${endTime}`;
        schedule.value.timetable.push(timeString);
        showTimePicker.value = false;

        // 重置时间选择器
        newTimeRange.value = [new Date(), new Date()];
    }
};

// 删除时间段
const removeTimeRange = (index: number) => {
    if (!schedule.value || !schedule.value.timetable) return;
    schedule.value.timetable.splice(index, 1);
};

// 将Date对象格式化为HH:mm格式
const formatDateToTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

// 将时间字符串转换为Date对象
const parseTimeToDate = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
};

// 编辑时间段
const editTimeRange = (index: number) => {
    if (!schedule.value || !schedule.value.timetable) return;

    const timeRange = schedule.value.timetable[index];
    const [startTime, endTime] = timeRange.split("-");

    newTimeRange.value = [parseTimeToDate(startTime), parseTimeToDate(endTime)];

    // 先删除原来的时间段
    schedule.value.timetable.splice(index, 1);
    showTimePicker.value = true;
};

watch(
    () => course.value,
    async newVal => {
        if (newVal) {
            await getTimeListByID(newVal.id);
        }
    }
);
onMounted(async () => {
    await initializeData();
    await getScheduleByID(scheduleStore.value?.[0]?.id || 0);
    await getCourseListByID(scheduleStore.value?.[0]?.id || 0);
    await getCourseByID(courseList.value?.[0]?.id || 0);
    await getTimeListByID(courseList.value?.[0]?.id || 0);
    await getTimeByID(timeList.value?.[0]?.Id || 0);
});
</script>

<template>
    <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    <div
                        v-for="schedule in scheduleStore"
                        :key="schedule.id"
                        @click="
                            getScheduleByID(schedule.id),
                                getCourseListByID(schedule.id)
                        "
                    >
                        {{ schedule.scheduleName }}
                    </div>
                </template>
                <template v-if="schedule">
                    <el-form
                        :model="schedule"
                        label-width="auto"
                        style="max-width: 600px"
                    >
                        <el-form-item label="课表名称">
                            <el-input v-model="schedule.scheduleName" />
                        </el-form-item>
                        <el-form-item label="开课时间">
                            <el-date-picker
                                v-model="schedule.startTime"
                                type="datetime"
                                placeholder="开课时间"
                                disabled
                            />
                        </el-form-item>
                        <el-form-item label="课程颜色">
                            <el-input-number
                                v-model="schedule.weekCount"
                                :min="1"
                                :max="100"
                            />
                        </el-form-item>
                        <el-form-item label="作息安排">
                            <div class="time-list">
                                <div
                                    v-for="(time, index) in timetable"
                                    :key="index"
                                    class="time-item"
                                >
                                    <!--<el-time-picker-->
                                    <!--       v-model="time.split('-')"-->
                                    <!--       is-range-->
                                    <!--       arrow-control-->
                                    <!--       range-separator="至"-->
                                    <!--       start-placeholder="开始"-->
                                    <!--       end-placeholder="结束"-->
                                    <!--       format="HH:mm"-->
                                    <!--       value-format="HH:mm"-->
                                    <!--       style="width:100px;"-->
                                    <!--   />-->
                                       <el-button
                                           type="primary"
                                           @click="addTimeRange"
                                           >
                                       	添加{{time.split('-')}}
                                       </el-button>
                                       <el-button
                                           type="text"
                                           @click="showTimePicker = false"
                                           >取消
                                       </el-button>
                                    <!--<div class="time-content">-->
                                    <!--    {{ time }}-->
                                    <!--</div>-->
                                    <!--<div class="time-actions">-->
                                    <!--    <el-button-->
                                    <!--        type="primary"-->
                                    <!--        size="small"-->
                                    <!--        @click="editTimeRange(index)"-->
                                    <!--    >-->
                                    <!--        编辑-->
                                    <!--    </el-button>-->
                                    <!--    <el-button-->
                                    <!--        type="danger"-->
                                    <!--        size="small"-->
                                    <!--        @click="removeTimeRange(index)"-->
                                    <!--    >-->
                                    <!--        删除-->
                                    <!--    </el-button>-->
                                    <!--</div>-->
                                </div>
                            </div>

                            <!-- 添加时间段区域 -->
                            <div class="add-time-section">
                                <el-button
                                    v-if="!showTimePicker"
                                    type="primary"
                                    @click="showTimePicker = true"
                                >
                                    + 添加时间段
                                </el-button>

                                <div
                                    v-if="showTimePicker"
                                    class="time-picker-container"
                                >
                                    <el-time-picker
                                        v-model="newTimeRange"
                                        is-range
                                        arrow-control
                                        range-separator="至"
                                        start-placeholder="开始"
                                        end-placeholder="结束"
                                        format="HH:mm"
                                        value-format="HH:mm"
                                    />
                                    <el-button
                                        type="primary"
                                        @click="addTimeRange"
                                        >添加
                                    </el-button>
                                    <el-button
                                        type="text"
                                        @click="showTimePicker = false"
                                        >取消
                                    </el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="课表备注">
                            <el-input
                                v-model="schedule.remark"
                                type="textarea"
                            />
                        </el-form-item>
                        <el-form-item label="发布时间">
                            <el-date-picker
                                v-model="schedule.createTime"
                                type="datetime"
                                placeholder="发布时间"
                                disabled
                            />
                        </el-form-item>
                        <el-form-item label="更新时间">
                            <el-date-picker
                                v-model="schedule.updateTime"
                                type="datetime"
                                placeholder="更新时间"
                                disabled
                            />
                        </el-form-item>
                    </el-form>
                </template>
                <template v-else>
                    <div>No course selected</div>
                </template>
            </el-card>
        </el-col>
        <!-- 其他列保持不变 -->
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
                <template #header> 课程列表 </template>
                <div
                    v-for="course in courseList"
                    :key="course.id"
                    @click="getCourseByID(course.id)"
                    class="course-item"
                >
                    {{ course.courseName }}
                </div>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="d-2">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    {{ course?.id }}/{{ course?.scheduleId }}
                </template>
                <template v-if="course">
                    <el-form
                        :model="course"
                        label-width="auto"
                        style="max-width: 600px"
                    >
                        <el-form-item label="课程名称">
                            <el-input v-model="course.courseName" />
                        </el-form-item>
                        <el-form-item label="课程颜色">
                            <el-color-picker v-model="course.color" />
                        </el-form-item>
                        <el-form-item label="课程备注">
                            <el-input v-model="course.remark" type="textarea" />
                        </el-form-item>
                        <el-form-item label="发布时间">
                            <el-date-picker
                                v-model="course.createTime"
                                type="datetime"
                                placeholder="发布时间"
                                disabled
                            />
                        </el-form-item>
                        <el-form-item label="更新时间">
                            <el-date-picker
                                v-model="course.updateTime"
                                type="datetime"
                                placeholder="更新时间"
                                disabled
                            />
                        </el-form-item>
                    </el-form>
                </template>
                <template v-else>
                    <div>No course selected</div>
                </template>
            </el-card>
        </el-col>
        <el-col
            :xs="24"
            :sm="12"
            :md="12"
            :lg="6"
            :xl="6"
            style="padding-bottom: 0px"
        >
            <el-card class="card-main" shadow="hover">
                <template #header> 课程时间段列表 </template>
                <div
                    v-for="time in timeList"
                    :key="time.Id"
                    @click="getTimeByID(time.Id)"
                >
                    {{ time ? JSON.stringify(time) : "No time selected" }}
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<style scoped lang="scss">
.card-main {
    border-radius: 0.375rem;
    height: calc(100vh - 132px);
}

.el-col {
    @media (max-width: 1200px) {
        padding-bottom: 6px;
    }
}

.d-2 {
    @media (min-width: 768px) and (max-width: 1200px) {
        padding-bottom: 0px;
    }
}

.course-item {
    display: flex;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.3s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #f8f9fa;
    }
}

/* 时间段列表样式 */
.time-list {
    margin-bottom: 10px;
}

.time-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
}

.time-content {
    flex: 1;
}

.time-actions {
    display: flex;
    gap: 5px;
}

/* 添加时间段区域样式 */
.add-time-section {
    // margin-top: 10px;
}

.time-picker-container {
    padding: 0px;
    background-color: #f9f9f9;
    width: 240px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
