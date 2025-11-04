<script setup lang="ts">
import { onMounted } from "vue";
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
onMounted(async () => {
    await initializeData();
    await getScheduleByID(scheduleStore.value?.[0]?.id || 0);
    await getCourseByID(courseList.value?.[0]?.id || 0);
});
</script>
<template>
    <el-row :gutter="5">
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
                <div v-for="schedule in scheduleStore" :key="schedule.id"
                    @click="getScheduleByID(schedule.id), getCourseListByID(schedule.id)">{{
                        schedule.scheduleName }}</div>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
                <div>{{ schedule ? JSON.stringify(schedule) : 'No schedule selected' }}</div>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" class="d-2">
            <el-card class="card-main" shadow="hover">
                <div v-for="course in courseList" :key="course.id" @click="getCourseByID(course.id)">{{
                    course.courseName }}
                </div>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" style="padding-bottom: 0px;">
            <el-card class="card-main" shadow="hover">
                <div>{{ course ? JSON.stringify(course) : 'No course selected' }}</div>
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
</style>
