<script setup lang="ts">
import { watch, onMounted } from "vue";
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
    await getTimeByID(timeList.value?.[0]?.id || 0);
});
</script>
<template>
    <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
                <template #header>
                    <div v-for="schedule in scheduleStore" :key="schedule.id" @click="
                        getScheduleByID(schedule.id),
                        getCourseListByID(schedule.id)
                        ">
                        {{ schedule.scheduleName }}
                    </div>
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
                            <div v-for="time in schedule.timetable" :key="time">
                                <div>{{ time }} ｜</div>
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
                <template #header> 课程列表 </template>
                <div v-for="course in courseList" :key="course.id" @click="getCourseByID(course.id)"
                    class="course-item">
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
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" style="padding-bottom: 0px">
            <el-card class="card-main" shadow="hover">
                <template #header> 课程时间段列表 </template>
                <div v-for="time in timeList" :key="time.id" @click="getTimeByID(time.id)">
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
</style>
