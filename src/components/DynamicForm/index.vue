<!-- DynamicForm.vue -->
<template>
  <el-form :model="formData" label-width="120px">
    <el-form-item
      v-for="(config, key) in fieldConfigs"
      :key="key"
      :label="config.label"
      :prop="key"
      :rules="{
        required: config.required,
        message: `${config.label}不能为空`,
        trigger: 'blur',
      }"
    >
      <!-- 文本输入 -->
      <el-input
        v-if="config.type === 'input'"
        v-model="formData[key]"
        :placeholder="config.placeholder"
      />

      <!-- 颜色选择 -->
      <el-color-picker
        v-else-if="config.type === 'color'"
        v-model="formData[key]"
        show-alpha
      />

      <!-- 文本区域 -->
      <el-input
        v-else-if="config.type === 'textarea'"
        v-model="formData[key]"
        type="textarea"
        :placeholder="config.placeholder"
      />

      <!-- 图标选择 (需要先安装@element-plus/icons-vue) -->
      <el-select
        v-else-if="config.type === 'icon-select'"
        v-model="formData[key]"
        placeholder="请选择图标"
        clearable
      >
        <el-option
          v-for="icon in icons"
          :key="icon.name"
          :value="icon.name"
          :label="icon.name"
        >
          <span
            style="display: inline-flex; align-items: center"
            :title="icon.toString()"
          >
            <el-icon><component :is="icon.name" /></el-icon>
            <span style="margin-left: 8px">{{ icon.name }}</span>
          </span>
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import * as icons from "@element-plus/icons-vue";
import type { FieldConfig } from "./type";
const props = defineProps<{
  modelValue: Record<string, any>;
  fieldConfigs: Record<string, FieldConfig>;
}>();

const emit = defineEmits(["update:modelValue"]);

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
