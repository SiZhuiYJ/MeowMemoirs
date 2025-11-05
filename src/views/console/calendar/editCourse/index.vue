<script setup lang="ts">
import { watch, onMounted, ref } from "vue";
// Store
import { useScheduleStores } from "@/features/schedule/stores/useScheduleStores";
import { storeToRefs } from 'pinia';
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
const { getTimeByID } = useTime();// time
// TimeList
import useTimeList from "@/features/schedule/composables/useTimeList";
const { timeList, getTimeListByID } = useTimeList();

// 作息安排：后端数据保持为 string[]（例如 "08:00 - 09:00"），前端用 timeRanges: [ [start,end], ... ] 双向同步
type TimePair = [string, string];
const timeRanges = ref<TimePair[]>([]);

function parseRange(s?: string): TimePair {
    if (!s) return ['08:00', '09:00'];
    // 提取 HH:mm 格式的时间字符串
    const matches = s.match(/\d{1,2}:\d{2}/g);
    if (matches && matches.length >= 2) return [matches[0], matches[1]];
    return ['08:00', '09:00'];
}

function formatRange(pair: TimePair) {
    return `${pair[0]} - ${pair[1]}`;
}

function syncFromSchedule() {
    const arr = schedule.value?.timetable || [];
    timeRanges.value = (arr as string[]).map(parseRange);
}

// 当 frontend 的 timeRanges 改变时，同步回 schedule.timetable（string[]）
watch(timeRanges, (nv) => {
    if (!schedule.value) return;
    schedule.value.timetable = nv.map(formatRange);
}, { deep: true });

// 当 schedule.timetable 改变（可能来自外部加载），同步到 timeRanges
watch(() => schedule.value?.timetable, () => {
    syncFromSchedule();
}, { immediate: true });

function addTimeRange() {
    timeRanges.value.push(['08:00', '09:00']);
}

function removeTimeRange(index: number) {
    timeRanges.value.splice(index, 1);
}

watch(
    () => course.value,
    async (newVal) => {
        if (newVal) {
            await getTimeListByID(newVal.id);
        }
    });
onMounted(async () => {
    await initializeData();
    await getScheduleByID(scheduleStore.value?.[0]?.id || 0);
    await getCourseListByID(scheduleStore.value?.[0]?.id || 0);
    await getCourseByID(courseList.value?.[0]?.id || 0);
    await getTimeListByID(courseList.value?.[0]?.id || 0);
    await getTimeByID(timeList.value?.[0]?.Id || 0);
    // 初次加载后，schedule.timetable watcher 的 immediate 会触发 syncFromSchedule
});
</script>
<template>
    <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">

                <template #header>
                    <div v-for="schedule in scheduleStore" :key="schedule.id"
                        @click="getScheduleByID(schedule.id), getCourseListByID(schedule.id)">{{
                            schedule.scheduleName }}</div>
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
                            <div v-for="(range, index) in timeRanges" :key="index"
                                style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                                <el-time-picker v-model="timeRanges[index]" is-range arrow-control range-separator="至"
                                    start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm"
                                    :title="range && range[0] && range[1] ? `${range[0]} - ${range[1]}` : ''" />
                                <el-button type="danger" size="mini" @click="removeTimeRange(index)">删除</el-button>
                            </div>
                            <el-button type="primary" size="mini" @click="addTimeRange">添加时间段</el-button>
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
                        <!-- <el-form-item>
                            <el-button type="primary" @click="onSubmit">Create</el-button>
                            <el-button>Cancel</el-button>
                        </el-form-item> -->
                    </el-form>
                </template>
                <template v-else>
                    <div>No course selected</div>
                </template>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    课程列表
                </template>
                <div v-for="course in courseList" :key="course.id" @click="getCourseByID(course.id)"
                    class="course-item">{{
                        course.courseName }}
                </div>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="d-2">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    {{ course?.id }}/{{ course?.scheduleId }}
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
                        <!-- <el-form-item>
                            <el-button type="primary" @click="onSubmit">Create</el-button>
                            <el-button>Cancel</el-button>
                        </el-form-item> -->
                    </el-form>
                </template>
                <template v-else>
                    <div>No course selected</div>
                </template>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" style="padding-bottom: 0px;">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    课程时间段列表
                </template>
                <div v-for="time in timeList" :key="time.Id" @click="getTimeByID(time.Id)">{{
                    time ? JSON.stringify(time) : 'No time selected' }}
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
</style>
