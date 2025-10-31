<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import type { Class } from "@/libs/api/class/type";
import MeowDialog from "@/components/MeowDialog/index.vue";
import { numberToChinese } from "@/utils/calendar";
import useWeekData from "@/features/Curriculum/useWeekData";
const { getWeekTableByWeeklong } = useWeekData();
import useRoutine from "@/features/Curriculum/useRoutine";
const { getTimeTable } = useRoutine();
import type { FormInstance, FormRules } from "element-plus";

const props = withDefaults(
    defineProps<{
        title?: string; // 弹窗标题
        classDetail: Class; // 课程表内容
        disabled?: boolean; // 禁用
        confirmLoading?: boolean; // 加载状态
        footerHidden?: boolean; // 底部按钮
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
        disabled: () => true,
        confirmLoading: () => false,
        footerHidden: () => true
    }
);

// 表单引用
const formRef = ref<FormInstance>();

// 创建表单数据模型
const formData = reactive<Class>({
    id: 0,
    name: "",
    location: "",
    dayOfWeek: 1,
    week: [],
    number: [],
    teacher: "",
    color: "",
    remark: ""
});

// 监听 props.classDetail 变化，更新表单数据
watch(() => props.classDetail, (newVal) => {
    Object.assign(formData, newVal);
}, { immediate: true, deep: true });

// 表单验证规则
const formRules: FormRules = {
    name: [
        { required: true, message: '请输入课程名称', trigger: 'blur' },
        { min: 1, max: 50, message: '课程名称长度在 1 到 50 个字符', trigger: 'blur' }
    ],
    location: [
        { required: true, message: '请输入课程地点', trigger: 'blur' }
    ],
    teacher: [
        { required: true, message: '请输入授课老师', trigger: 'blur' }
    ],
    dayOfWeek: [
        { required: true, message: '请选择上课日期', trigger: 'change' }
    ],
    week: [
        { required: true, message: '请选择课程周次', trigger: 'change' }
    ],
    number: [
        { required: true, message: '请选择课程节次', trigger: 'change' }
    ]
};

// 计算颜色预览文本
const colorPreviewText = computed(() => {
    return formData.color || '未选择颜色';
});

// 添加 OR 修改对话框Ref
const DialogRef = ref();

/** 打开 */
const handleOpen = () => {
    DialogRef.value.Open();
};

/** 确定 */
const handleConfirm = async (): Promise<Class | null> => {
    try {
        if (!formRef.value) return null;

        const valid = await formRef.value.validate();
        if (valid) {
            console.log("表单数据", formData);
            // 返回表单数据而不是 props.classDetail
            return { ...formData };
        }
        return null;
    } catch (error) {
        console.error("表单验证失败", error);
        return null;
    }
};

/** 取消 */
const handleCancel = () => {
    console.log("取消", formData);
    DialogRef.value.Close();
};

/** 重置表单 */
const resetForm = () => {
    formRef.value?.resetFields();
};

/** 清除验证 */
const clearValidate = () => {
    formRef.value?.clearValidate();
};

defineExpose({
    handleOpen,
    resetForm,
    clearValidate
});

// 定义事件
const emit = defineEmits<{
    confirm: [data: Class | null];
    cancel: [];
}>();

// 修改确定和取消方法，触发事件
const handleConfirmWithEmit = async () => {
    const result = await handleConfirm();
    emit('confirm', result);
};

const handleCancelWithEmit = () => {
    handleCancel();
    emit('cancel');
};
</script>

<template>
    <MeowDialog ref="DialogRef" :title="title" @confirm="handleConfirmWithEmit" @cancel="handleCancelWithEmit"
        :loading="confirmLoading" :footer-hidden="footerHidden" :draggable="true" :close-on-click-modal="true"
        :height="500">
        <template #content>
            <el-form ref="formRef" :model="formData" :rules="formRules" :disabled="disabled" label-width="90px"
                class="class-form">

                <el-form-item label="课程名称:" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入课程名称" suffix-icon="CollectionTag" />
                </el-form-item>

                <el-form-item label="课程地点:" prop="location">
                    <el-input v-model="formData.location" placeholder="请输入上课地点" suffix-icon="AddLocation" />
                </el-form-item>

                <el-form-item label="授课老师:" prop="teacher">
                    <el-input v-model="formData.teacher" placeholder="请输入老师姓名" suffix-icon="User" />
                </el-form-item>

                <el-form-item label="课程周几:" prop="dayOfWeek">
                    <el-radio-group v-model="formData.dayOfWeek">
                        <el-radio-button v-for="value in 7" :key="value" :label="value" :disabled="disabled">
                            {{ value === 7 ? '日' : numberToChinese(value) }}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="课程周次:" prop="week">
                    <el-select-v2 v-model="formData.week" :options="getWeekTableByWeeklong()" placeholder="请选择课程周次"
                        style="width: 100%" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3" />
                </el-form-item>

                <el-form-item label="课程节次:" prop="number">
                    <el-select-v2 v-model="formData.number" :options="getTimeTable()" placeholder="请选择课程节次"
                        style="width: 100%" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="3" />
                </el-form-item>

                <el-form-item label="课程颜色:">
                    <div class="color-picker-wrapper">
                        <el-color-picker v-model="formData.color" :disabled="disabled" />
                        <div class="color-preview" :style="{ backgroundColor: formData.color }">
                            {{ colorPreviewText }}
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="课程备注:">
                    <el-input v-model="formData.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
                        placeholder="请输入课程备注信息" />
                </el-form-item>

            </el-form>
        </template>
    </MeowDialog>
</template>

<style scoped lang="scss">
.class-form {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;

    .el-form-item {
        margin-bottom: 20px;

        :deep(.el-form-item__label) {
            font-weight: 600;
            color: #333;
            text-align: right;
        }

        :deep(.el-form-item__content) {

            .el-input,
            .el-select-v2,
            .el-textarea {
                width: 100%;
            }

            .el-radio-group {
                .el-radio-button {
                    margin-bottom: 5px;
                }
            }
        }

        .color-picker-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;

            .color-preview {
                min-width: 80px;
                height: 24px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                padding: 0;
                background-color: #f5f5f5;
                color: #666;
                transition: all 0.3s ease;

                &:not([style*="background-color"]) {
                    background-color: #f5f5f5 !important;
                    color: #666;
                }
            }
        }
    }

    // 响应式调整
    @media (max-width: 768px) {
        padding: 12px;

        .el-form-item {
            margin-bottom: 16px;

            :deep(.el-form-item__label) {
                text-align: left;
            }

            :deep(.el-form-item__content) {
                margin-left: 0 !important;
            }

            :deep(.el-radio-group) {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                width: 100%;

                .el-radio-button {
                    .el-radio-button__inner {
                        padding: 5px 7px;
                        width: 100%;
                    }
                }
            }

        }
    }
}
</style>