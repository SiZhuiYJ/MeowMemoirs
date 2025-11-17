<script setup lang="ts">
// 定义参数的类型
interface ITimeRangeProps {
    IndexKey?: number;
    timeRange?: string; // 时间范围
}

const props = withDefaults(defineProps<ITimeRangeProps>(), {
    IndexKey: -1,
    timeRange: "00:00-23:59",
});

const emits = defineEmits<{
    // 编辑
    (e: "editTime", time: { IndexKey: number; timeRange: string; }): void;
    // 删除
    (e: "deleteTime", time: { IndexKey: number; timeRange: string; }): void;
    // 取消
    (e: "cancel"): void;
}>();
import { ref, onMounted } from 'vue';
import dayjs from 'dayjs';
const showTimePicker = ref<boolean>(false);
const newTimeRange = ref<[string, string]>(["00:00", "23:59"]);

const editTimeRange = () => {
    console.log("编辑时间范围:", newTimeRange.value.join('-'));
    emits("editTime", { timeRange: newTimeRange.value.join('-'), IndexKey: props.IndexKey });
    showTimePicker.value = false;
}

const deleteTimeRange = () => {
    console.log("删除时间范围:", newTimeRange.value.join('-'));
    emits("deleteTime", { timeRange: newTimeRange.value.join('-'), IndexKey: props.IndexKey });
}

const cancelEdit = () => {
    emits("cancel");
    showTimePicker.value = false;
}

const toggleTimePicker = () => {
    showTimePicker.value = !showTimePicker.value;
}

const parseTime = (timeStr: string): Date => {
    const parsed = dayjs(timeStr, 'HH:mm', true); // 严格模式解析
    if (!parsed.isValid()) {
        console.error(`无效时间格式: ${timeStr}`);
        return new Date(); // 返回默认值避免崩溃
    }
    return parsed.toDate();
};
const edit = editTimeRange;
const cancel = cancelEdit;
const deleteTime = deleteTimeRange;
onMounted(() => {
    const [start, end] = props.timeRange.split('-');
    newTimeRange.value = [
        dayjs(parseTime(start)).format('HH:mm'),
        dayjs(parseTime(end)).format('HH:mm')
    ];
    console.log("IndexKey", props.IndexKey);
    if (props.IndexKey < 0) {
        toggleTimePicker();
    }
});
/** 暴露给父组件方法 */
defineExpose({
    edit,
    cancel,
    deleteTime,
});
</script>
<template>
    <template v-if="!showTimePicker">
        <div class="time">{{ props.timeRange }}
        </div> <el-button type="primary" @click="toggleTimePicker">
            编辑
        </el-button>
        <el-button type="danger" @click="deleteTimeRange">
            删除
        </el-button>
    </template>
    <template v-else>
        <el-time-picker v-model="newTimeRange" is-range arrow-control range-separator="至" start-placeholder="开始"
            end-placeholder="结束" format="HH:mm" value-format="HH:mm" style="width:100%;" />
        <el-button type="primary" @click="editTimeRange">
            确定
        </el-button>
        <el-button type="text" @click="cancelEdit">
            取消
        </el-button>
    </template>
</template>
<style scoped lang="scss">
.time {
    padding-right: 3px;
    width: 100%;
}
</style>
