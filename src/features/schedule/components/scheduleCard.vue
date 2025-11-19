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


// 当前课表id
const currentScheduleId = ref<number>(0);
watch(
    () => schedule.value?.id,
    (newVal) => {
        currentScheduleId.value = newVal || 0;
        console.log("当前课表id:", newVal);
    }
);
// 添加课表
const addSchedule = () => {
    console.log("添加课表");
};



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
});
</script>

<template>
    <el-card class="card-main" shadow="hover">
        <template #header>
            <!-- 课表列表 -->
            <el-select v-model="currentScheduleId" placeholder="Select">
                <el-option v-for="schedule in scheduleStore" :key="schedule.id" :label="schedule.scheduleName"
                    :value="schedule.id" @click="getScheduleByID(schedule.id)" />
                <template #header>课表列表</template>
                <template #footer>
                    <el-button text bg @click="addSchedule"> 添加课表 </el-button>
                </template>
            </el-select>
        </template>
        <template v-if="schedule">
            <el-form :model="schedule" label-width="auto" style="max-width: 600px" v-loading="!useSchedule().loading">
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
