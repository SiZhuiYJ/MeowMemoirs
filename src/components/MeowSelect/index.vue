<template>
  <el-select v-model="value" :placeholder="placeholder" :multiple="multiple" :clearable="clearable"
    :collapse-tags="collapseTags" :collapse-tags-tooltip="collapseTagsTooltip" :style="{ width: width }"
    :filterable="filterable" :max="max" @change="handleChange">
    <!-- 多选时显示全选 -->
    <template v-if="multiple" #header>
      <el-checkbox v-model="checkAll" :indeterminate="indeterminate" class="checkbox-all" @change="handleCheckAll">
        {{ checkAllText }}
      </el-checkbox>
    </template>

    <!-- 自定义选项插槽 -->
    <el-option v-for="item in filteredOptions" :key="item.value" :value="item.value" :label="item.label"
      :disabled="item.disabled">
      <slot name="option" :item="item">
        {{ item.label }}
      </slot>
    </el-option>

    <!-- 添加选项功能 -->
    <template v-if="addable" #footer>
      <div class="add-option-container">
        <template v-if="!isAdding">
          <el-button text bg size="small" @click="startAddOption">
            <el-icon>
              <Plus />
            </el-icon>
            {{ addButtonText }}
          </el-button>
        </template>
        <template v-else>
          <el-input ref="optionInputRef" v-model="newOptionName" size="small" :placeholder="addPlaceholder"
            class="option-input" @keyup.enter="confirmAdd" @keyup.esc="cancelAdd" />
          <div class="button-group">
            <el-button type="primary" size="small" @click="confirmAdd">
              {{ confirmButtonText }}
            </el-button>
            <el-button size="small" @click="cancelAdd">
              {{ cancelButtonText }}
            </el-button>
          </div>
        </template>
      </div>
    </template>
  </el-select>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import type { CheckboxValueType } from "element-plus";
interface Option {
  label: string;
  value: string | number;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number | Array<string | number>; // 支持单选和多选类型
    options: Option[];
    max?: number;
    multiple?: boolean;
    addable?: boolean;
    placeholder?: string;
    width?: string;
    checkAllText?: string;
    addButtonText?: string;
    addPlaceholder?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    clearable?: boolean;
    collapseTags?: boolean;
    collapseTagsTooltip?: boolean;
    filterable?: boolean;
    allowDuplicates?: boolean; // 是否允许重复项
  }>(),
  {
    multiple: false,
    addable: false,
    max: 3,
    placeholder: "请选择",
    width: "200px",
    checkAllText: "全选",
    addButtonText: "添加选项",
    addPlaceholder: "请输入新选项",
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    clearable: true,
    collapseTags: false,
    collapseTagsTooltip: false,
    filterable: false,
    allowDuplicates: false,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: typeof props.modelValue): void;
  (e: "change", value: typeof props.modelValue): void;
  (e: "add", value: string): void;
}>();

// 使用计算属性处理双向绑定
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// 选项处理
const filteredOptions = computed(() => {
  return props.options.filter(
    (option) => typeof option.value !== "undefined" && option.label !== undefined
  );
});

// 全选相关逻辑
const checkAll = ref(false);
const indeterminate = ref(false);

const updateCheckAllStatus = () => {
  if (!props.multiple) return;

  const selectedCount = (value.value as Array<string | number>).length;
  const totalCount = filteredOptions.value.length;

  checkAll.value = selectedCount === totalCount && totalCount > 0;
  indeterminate.value = selectedCount > 0 && selectedCount < totalCount;
};

watch(
  () => [value.value, filteredOptions.value],
  () => updateCheckAllStatus(),
  { deep: true }
);

const handleCheckAll = (checked: CheckboxValueType) => {
  if (!props.multiple) return;

  value.value = checked ? filteredOptions.value.map((opt) => opt.value) : [];
};

// 添加新选项逻辑
const isAdding = ref(false);
const newOptionName = ref("");
const optionInputRef = ref();

const startAddOption = () => {
  isAdding.value = true;
  newOptionName.value = "";
  nextTick(() => optionInputRef.value?.focus());
};

const confirmAdd = () => {
  if (!newOptionName.value.trim()) {
    ElMessage.warning("请输入选项名称");
    return;
  }

  if (
    !props.allowDuplicates &&
    filteredOptions.value.some((opt) => opt.label === newOptionName.value.trim())
  ) {
    ElMessage.warning("选项已存在");
    return;
  }

  emit("add", newOptionName.value.trim());
  cancelAdd();
};

const cancelAdd = () => {
  isAdding.value = false;
  newOptionName.value = "";
};

// 值变化处理
const handleChange = (val: typeof props.modelValue) => {
  emit("change", val);
  if (props.multiple) updateCheckAllStatus();
};

// 初始化时更新全选状态
updateCheckAllStatus();
</script>

<style scoped>
.add-option-container {
  padding: 8px;
  border-top: 1px solid #eee;
}

.option-input {
  margin-bottom: 8px;
}

.button-group {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.checkbox-all {
  width: 100%;
  border-bottom: 1px solid #eee;
}
</style>
