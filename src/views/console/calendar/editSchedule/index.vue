<script setup lang="ts">
import { ref, onMounted } from "vue";
import useSchedule from "@/features/schedule/composables/useSchedule";
const { initializeData, getScheduleByID } = useSchedule();
import type { Schedule } from "@/features/schedule/types";
const scheduleItem = ref<Schedule | undefined>(undefined);
onMounted(async () => {
    await initializeData();
    scheduleItem.value = getScheduleByID(1);
    console.log("编辑课表页面获取的课表信息", scheduleItem.value);
});

</script>
<template>
    <el-row :gutter="5">
        <el-col :xs="24" :sm="8" :md="6" :lg="6" :xl="6">
            <el-card class="card-main" shadow="hover">
                <div class="schedule-item" v-if="scheduleItem">
                    <div class="schedule-title">{{ scheduleItem.scheduleName }}</div>
                    <div class="schedule-weekCount">{{ scheduleItem.weekCount }}</div>
                    <div class="schedule-startTime">{{ scheduleItem.startTime }}</div>
                    <div class="schedule-updateTime">{{ scheduleItem.updateTime }}</div>
                    <div class="schedule-createTime">{{ scheduleItem.createTime }}</div>
                    <div class="schedule-remark">{{ scheduleItem.remark }}</div>
                </div>
            </el-card>
        </el-col>
        <el-col :xs="24" :sm="16" :md="18" :lg="18" :xl="18">
            <el-card class="card-main" shadow="hover">
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
    @media (max-width: 768px) {
        padding-bottom: 6px;
    }
}
</style>
