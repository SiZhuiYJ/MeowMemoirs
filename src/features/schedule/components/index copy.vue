<script setup lang="ts">
import { watch, onMounted, ref } from "vue";
// Store
import { useScheduleStores } from "@/features/schedule/stores/useScheduleStores";
import { storeToRefs } from "pinia";
const { initializeData } = useScheduleStores();
const { scheduleStore } = storeToRefs(useScheduleStores());
// Schedule
import useSchedule from "@/features/schedule/composables/useSchedule";
const { schedule, getScheduleByID, WeekTable, TimeTable } = useSchedule();
// Course
import useCourse from "@/features/schedule/composables/useCourse";
const { course, getCourseByID } = useCourse();
// CourseList
import useCourseList from "@/features/schedule/composables/useCourseList";
const { courseList, getCourseListByID } = useCourseList();
// Time
import useTime from "@/features/schedule/composables/useTime";
const { time, loading, getTimeByID } = useTime();
// TimeList
import useTimeList from "@/features/schedule/composables/useTimeList";
const { timeList, getTimeListByID } = useTimeList();

import editTimeRange from "@/features/schedule/components/editTimeRange.vue";

// el-form
import { numberToChinese } from "@/utils/calendar";

// 当前课表id
const currentScheduleId = ref<number>(0);
watch(
    () => schedule.value?.id,
    (newVal) => {
        currentScheduleId.value = newVal || 0;
        console.log("当前课表id:", newVal);
    }
);
// 当前课程id
const currentCourseId = ref<number>(0);
watch(
    () => course.value?.id,
    (newVal) => {
        currentCourseId.value = newVal || 0;
        console.log("当前课程id:", newVal);
    }
);
// 当前时间id
const currentTimeId = ref<number>(0);
watch(
    () => time.value?.id,
    (newVal) => {
        currentTimeId.value = newVal || 0;
        console.log("当前时间id:", newVal);
    }
);
// 添加课表
const addSchedule = () => {
    console.log("添加课表");
};
// 添加课程
const addCourse = () => {
    console.log("添加课程");
};
// 添加时间
const addTime = () => {
    console.log("添加时间");
};
const timeSearch = ref("");

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
    async (newVal) => {
        if (newVal) {
            await getTimeListByID(newVal.id);
        }
    }
);

watch(
    () => schedule.value?.timetable,
    (newVal) => {
        if (newVal) {
            console.log("课表时间段更新:", newVal);
        }
    }
);

const shortcuts = [
    {
        text: '今天', // 今天
        value: new Date(),
    },
    {
        text: '昨天', // 昨天
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
        },
    },
    {
        text: '一周前',// 一周前
        value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
        },
    },
]

const disabledDate = (time: Date) => {
    return time.getTime() > Date.now()
}

onMounted(async () => {
    await initializeData();
    await getScheduleByID(scheduleStore.value?.[0]?.id || 0);
    await getCourseListByID(scheduleStore.value?.[0]?.id || 0);
    await getCourseByID(courseList.value?.[0]?.id || 0);
    await getTimeListByID(courseList.value?.[0]?.id || 0);
    await getTimeByID(timeList.value?.[0]?.id || 0);
});
</script>

<template>
    <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    <!-- 课表列表 -->
                    <el-select v-model="currentScheduleId" placeholder="Select">
                        <el-option v-for="schedule in scheduleStore" :key="schedule.id" :label="schedule.scheduleName"
                            :value="schedule.id"
                            @click="getScheduleByID(schedule.id), getCourseListByID(schedule.id)" />
                        <template #header>课表列表</template>
                        <template #footer>
                            <el-button text bg @click="addSchedule"> 添加课表 </el-button>
                        </template>
                    </el-select>
                </template>
                <template v-if="schedule">
                    <el-form :model="schedule" label-width="auto" style="max-width: 600px"
                        v-loading="!useSchedule().loading">
                        <el-form-item label="课表名称">
                            <el-input v-model="schedule.scheduleName" />
                        </el-form-item>
                        <el-form-item label="开课时间">
                            <el-date-picker v-model="schedule.startTime" type="date" placeholder="开课时间"
                                :disabled-date="disabledDate" :shortcuts="shortcuts" />
                        </el-form-item>
                        <el-form-item label="课程周期">
                            <el-input-number v-model="schedule.weekCount" :min="1" :max="100" />
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
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    <!-- 课表作息  -->
                    <el-input v-model="timeSearch" placeholder="时间段" clearable prefix-icon="Clock" />
                </template>
                <template v-if="schedule">
                    <el-scrollbar v-loading="!useSchedule().loading">
                        <div v-for="(time, index) in schedule.timetable" :key="index" class="time-item">
                            <editTimeRange :timeRange="time" :IndexKey="index" @deleteTime="removeTime"
                                @editTime="editTime" />
                        </div>
                        <div class="time-item">
                            <el-button type="primary" @click="showTimePicker = true" v-if="!showTimePicker">
                                添加
                            </el-button>
                            <editTimeRange v-if="showTimePicker" @editTime="editTime"
                                @cancel="showTimePicker = false" />
                        </div>
                    </el-scrollbar>
                </template>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="d-2">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    <el-select v-model="currentCourseId" placeholder="Select">
                        <el-option v-for="courseItem in courseList" :key="courseItem.id" :label="courseItem.courseName"
                            :value="courseItem.id" @click="getCourseByID(courseItem.id)">
                            <span style="float: left;">
                                {{ courseItem.courseName }}
                            </span>
                            <span
                                style="float: right;border-right: 4px solid #fff;font-size: 13px; height: 90%;margin:2px 0;display: flex;align-items: center;"
                                :style="{ borderRightColor: courseItem.color }">
                                {{ courseItem.color }}
                            </span>
                        </el-option>
                        <template #header>课程列表</template>
                        <template #footer>
                            <el-button text bg @click="addCourse"> 添加课程 </el-button>
                        </template>
                    </el-select>
                </template>
                <template v-if="course">
                    <el-form :model="course" label-width="auto" style="max-width: 600px"
                        v-loading="!useCourse().loading">
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
            </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" style="padding-bottom: 0px">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    <el-select v-model="currentTimeId" placeholder="Select">
                        <el-option v-for="timeItem in timeList" :key="timeItem.id" :label="timeItem.location"
                            :value="timeItem.id" @click="getTimeByID(timeItem.id)">
                            <span style="float: left">{{ timeItem.location }}</span>
                            <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">
                                {{ timeItem.teacher }}
                            </span>
                        </el-option>
                        <template #header>课程时间</template>
                        <template #footer>
                            <el-button text bg @click="addTime"> 添加时间段 </el-button>
                        </template>
                    </el-select>
                </template>
                <template v-if="time">
                    <el-form :model="time" label-width="auto" style="max-width: 600px" v-loading="loading">
                        <el-form-item label="课程地址" prop="location">
                            <el-input v-model="time.location" />
                        </el-form-item>

                        <el-form-item label="课程教师" prop="teacher">
                            <el-input v-model="time.teacher" />
                        </el-form-item>

                        <el-form-item label="课程周几" prop="dayOfWeek">
                            <el-radio-group v-model="time.dayOfWeek">
                                <el-radio-button v-for="value in 7" :key="value" :label="value">
                                    {{ value === 7 ? '日' : numberToChinese(value) }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="课程周次" prop="weekList">
                            <el-select-v2 v-model="time.weekList" multiple :options="WeekTable" placeholder="请选择课程周次"
                                style="width: 100%" collapse-tags collapse-tags-tooltip :max-collapse-tags="3" />
                        </el-form-item>

                        <el-form-item label="课程节次" prop="sectionList">
                            <el-select-v2 v-model="time.sectionList" multiple :options="TimeTable" placeholder="请选择课程节次"
                                style="width: 100%" collapse-tags collapse-tags-tooltip :max-collapse-tags="3" />
                        </el-form-item>

                        <el-form-item label="课程备注" prop="remark">
                            <el-input v-model="time.remark" type="textarea" />
                        </el-form-item>

                        <el-form-item label="发布时间" prop="createTime">
                            <el-date-picker v-model="time.createTime" type="datetime" placeholder="发布时间" disabled />
                        </el-form-item>

                        <el-form-item label="更新时间" prop="updateTime">
                            <el-date-picker v-model="time.updateTime" type="datetime" placeholder="更新时间" disabled />{{
                                loading }}
                        </el-form-item>
                    </el-form>
                </template>
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
