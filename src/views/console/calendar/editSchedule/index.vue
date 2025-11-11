<script setup lang="ts">
import { watch, onMounted, ref } from "vue";
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

import editTimeRange from "@/features/schedule/components/editTimeRange.vue"




// 当前课表id
const currentScheduleId = ref<number>(0);
watch(() => schedule.value?.id, (newVal) => {
    currentScheduleId.value = newVal || 0;
    console.log("当前课表id:", newVal);
});
// 添加课表
const addSchedule = () => {
    console.log("添加课表");
}

// 添加时间段
const showTimePicker = ref<boolean>(false);

const editTime = (time: { timeRange: string; IndexKey: number }) => {
    console.log("编辑时间段:", time);
    if (!schedule.value || !schedule.value.timetable) return;
    if (time.IndexKey === undefined) return;
    if (time.IndexKey < 0) {
        // 添加新时间段
        schedule.value.timetable.push(time.timeRange);
    } else {
        schedule.value.timetable[time.IndexKey] = time.timeRange;
    }
    showTimePicker.value = false;
};
const removeTime = (time: { timeRange: string; IndexKey: number }) => {
    console.log("删除时间段:", time);
    if (!schedule.value || !schedule.value.timetable) return;
    if (time.IndexKey === undefined) return;

    schedule.value.timetable.splice(time.IndexKey, 1);
};



watch(
    () => course.value,
    async newVal => {
        if (newVal) {
            await getTimeListByID(newVal.id);
        }
    }
);

import type { CollapseModelValue } from 'element-plus'
const activeNames = ref(['1'])
const handleChange = (val: CollapseModelValue) => {
    console.log(val)
};
watch(
    () => schedule.value?.timetable,
    newVal => {
        if (newVal) {
            console.log("课表时间段更新:", newVal);
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
                    <el-select v-model="currentScheduleId" placeholder="Select">
                        <el-option v-for="schedule in scheduleStore" :key="schedule.id" :label="schedule.scheduleName"
                            :value="schedule.id"
                            @click="getScheduleByID(schedule.id), getCourseListByID(schedule.id)" />
                        <template #footer>
                            <el-button text bg @click="addSchedule">
                                添加课表
                            </el-button>
                        </template>
                    </el-select>
                </template>
                <template v-if="schedule">
                    <el-form :model="schedule" label-width="auto" style="max-width: 600px">
                        <el-form-item label="课表名称">
                            <el-input v-model="schedule.scheduleName" />
                        </el-form-item>
                        <el-form-item label="开课时间">
                            <el-date-picker v-model="schedule.startTime" type="datetime" placeholder="开课时间" disabled />
                        </el-form-item>
                        <el-form-item label="课程颜色">
                            <el-input-number v-model="schedule.weekCount" :min="1" :max="100" />
                        </el-form-item>
                        <el-form-item label="作息安排">
                            <div class="time-list">
                                <el-scrollbar height="200px">
                                    <div v-for="(time, index) in schedule.timetable" :key="index" class="time-item">
                                        <editTimeRange :timeRange="time" :IndexKey="index" @deleteTime="removeTime"
                                            @editTime="editTime" />
                                    </div>
                                    <div class="time-item">
                                        <el-button type="primary" @click="showTimePicker = true" v-if="!showTimePicker">
                                            添加
                                        </el-button>
                                        <editTimeRange v-if="showTimePicker" @editTime="editTime" />
                                    </div>
                                </el-scrollbar>
                            </div>
                        </el-form-item>
                        <el-form-item label="课表备注">
                            <el-input v-model="schedule.remark" type="textarea" />
                        </el-form-item>
                        <el-form-item label="发布时间">
                            <el-date-picker v-model="schedule.createTime" type="datetime" placeholder="发布时间" disabled />
                        </el-form-item>
                        <el-form-item label="更新时间">
                            <el-date-picker v-model="schedule.updateTime" type="datetime" placeholder="更新时间" disabled />
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
                <div v-for="courseItem in courseList" :key="courseItem.id" @click="getCourseByID(courseItem.id)"
                    class="course-item" :class="{ 'is-course': courseItem.id === course?.id }">
                    {{ courseItem.courseName }}
                </div>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="d-2">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    课程详情 {{ course?.scheduleId }} {{ course?.id }}
                </template>
                <template v-if="course">
                    <el-form :model="course" label-width="auto" style="max-width: 600px">
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
                            <el-date-picker v-model="course.createTime" type="datetime" placeholder="发布时间" disabled />
                        </el-form-item>
                        <el-form-item label="更新时间">
                            <el-date-picker v-model="course.updateTime" type="datetime" placeholder="更新时间" disabled />
                        </el-form-item>
                    </el-form>
                </template>
                <template v-else>
                    <div>No course selected</div>
                </template>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" style="padding-bottom: 0px">
            <el-card class="card-main" shadow="hover">
                <template #header> 课程时间段列表 </template>
                <el-collapse v-model="activeNames" @change="handleChange" style="width: 90%;">
                    <el-collapse-item v-for="time in timeList" :key="time.Id"
                        :title="`${time.location} ${time.teacher}`" :name="time.Id">
                        {{ time ? JSON.stringify(time) : "No time selected" }}
                    </el-collapse-item>
                </el-collapse>
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

.time-picker-container {
    padding: 0px;
    background-color: #f9f9f9;
    width: 240px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.is-course {
    border-bottom: 1px solid #000;
}

:deep(.el-card__body) {
    // 内容不得超出卡片范围
    overflow: hidden;
}
</style>
