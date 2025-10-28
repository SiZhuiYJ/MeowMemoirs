<script setup lang="ts">
import { ref } from "vue";
import type { Class } from "@/libs/api/class/type";
import MeowDialog from "@/components/MeowDialog/index.vue";
import { numberToChinese } from "@/utils/calendar";
import useWeekData from "@/components/Curriculum/useWeekData";
const { getWeekTableByWeeklong } = useWeekData();
import useRoutine from "@/components/Curriculum/useRoutine";
const { getTimeTable } = useRoutine();
const props = withDefaults(
    defineProps<{
        title?: string; // 弹窗标题
        classDetail: Class;
        disabled?: boolean;
        confirmLoading?: boolean;
        footerHidden?: boolean;
    }>(),
    {
        title: () => "课表",
        classDetail: () => ({
            id: 0,
            name: "",
            location: "",
            dayOfWeek: 1,
            week: [],
            number: [],
            teacher: "",
            color: "",
            remark: ""
        }),
        disabled: () => true, // 禁用,
        confirmLoading: () => false,
        footerHidden: () => true
    }
);
// 添加 OR 修改对话框Ref
const DialogRef = ref();
/** 打开 */
const handleOpen = () => {
    DialogRef.value.Open();
};

/** 确定  */
const handleConfirm = (): Class => {
    console.log("确定", props.classDetail);
    return props.classDetail;
};

/** 取消 */
const handleCancel = () => {
    DialogRef.value.Close();
};
defineExpose({
    handleOpen,
    handleConfirm,
    handleCancel
});
</script>
<template>
    <MeowDialog ref="DialogRef" :title="title" @Confirm="handleConfirm" @Cancel="handleCancel" :loading="confirmLoading"
        :footer-hidden="footerHidden" :draggable="true" :close-on-click-modal="true" :height="500">
        <template #content>
            <div class="class-details">
                <div class="class-details-item">
                    <span class="detail-label">课程名称:{{ classDetail.name }}</span>
                    <div class="detail-value">
                        <el-input :disabled="disabled" v-model="classDetail.name" placeholder="名称"
                            suffix-icon="CollectionTag" />
                    </div>
                </div>
                <div class="class-details-item">
                    <span class="detail-label">课程地点:{{ classDetail.location }}</span>
                    <div class="detail-value">
                        <el-input :disabled="disabled" v-model="classDetail.location" placeholder="地点"
                            suffix-icon="AddLocation" />
                    </div>
                </div>
                <div class="class-details-item">
                    <span class="detail-label">授课老师:{{ classDetail.teacher }}</span>
                    <div class="detail-value">
                        <el-input :disabled="disabled" v-model="classDetail.teacher" placeholder="老师"
                            suffix-icon="User" />
                    </div>
                </div>
                <div class="class-details-item">
                    <span class="detail-label">课程周几:{{ classDetail.dayOfWeek }}</span>
                    <div class="detail-value">
                        <el-radio-group v-model="classDetail.dayOfWeek">
                            <el-radio-button :disabled="disabled" v-for="value in 7" :label="value == 7 ? '日' : numberToChinese(value)
                                " :value="value" :key="value" />
                        </el-radio-group>
                    </div>
                </div>
                <div class="class-details-item">
                    <span class="detail-label">课程周次:{{ classDetail.week }}</span>
                    <div class="detail-value">
                        <el-select-v2 :disabled="disabled" v-model="classDetail.week"
                            :options="getWeekTableByWeeklong()" placeholder="多选" style="width: 315px" multiple
                            collapse-tags collapse-tags-tooltip :max-collapse-tags="3" />
                    </div>
                </div>
                <div class="class-details-item">
                    <span class="detail-label">课程节次:{{ classDetail.number }}</span>
                    <div class="detail-value">
                        <el-select-v2 :disabled="disabled" v-model="classDetail.number" :options="getTimeTable()"
                            placeholder="多选" style="width: 315px" multiple collapse-tags collapse-tags-tooltip
                            :max-collapse-tags="3" />
                    </div>
                </div>
                <div class="class-details-item">
                    <span class="detail-label">课程颜色:{{ classDetail.color }}</span>
                    <div class="detail-value">
                        <span class="color-picker">
                            <el-color-picker :disabled="disabled" v-model="classDetail.color" />
                            <p :style="{
                                backgroundColor: classDetail?.color
                            }">
                                {{ classDetail?.color }}
                            </p>
                        </span>
                    </div>
                </div>
                <div class="class-details-item">
                    <span class="detail-label">课程备注:<!--{{ classDetail.remark }}--></span>
                    <div class="detail-value">
                        <el-input :disabled="disabled" v-model="classDetail.remark" style="width: 315px"
                            :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="备注" />
                    </div>
                </div>
            </div>
        </template>
    </MeowDialog>
</template>
<style scoped lang="scss">
// 详情框样式
.class-details {
    display: flex;
    flex-direction: column;
    align-items: center;
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
            width: 320px;
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

            .color-picker {
                display: flex;
                justify-content: space-between;
                width: 100%;

                p {
                    width: 60px;
                    border-radius: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
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
        padding: 6px;

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
</style>
