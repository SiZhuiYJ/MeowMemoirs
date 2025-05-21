<template>
  <div class="main-content">
    <Card>
      <el-select
        v-model="value"
        placeholder="标签"
        collapse-tags
        collapse-tags-tooltip
        multiple
        style="width: 200px"
      >
        <template #header>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="indeterminate"
            class="checkbox-all"
            @change="handleCheckAll"
          >
            全选标签
          </el-checkbox>
        </template>
        <el-option
          v-for="item in cities"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
        <template #footer>
          <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
            <el-icon>
              <Plus />
            </el-icon>
            添加标签
          </el-button>
          <template v-else>
            <el-input
              v-model="optionName"
              class="option-input"
              placeholder="新的标签"
              size="small"
            />
            <el-button type="primary" size="small" @click="onConfirm"> 添加 </el-button>
            <el-button size="small" @click="clear">取消</el-button>
          </template>
        </template>
      </el-select>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { CheckboxValueType } from "element-plus";

const checkAll = ref(false);
const indeterminate = ref(false);
const value = ref<CheckboxValueType[]>([]);

watch(value, (val) => {
  if (val.length === 0) {
    checkAll.value = false;
    indeterminate.value = false;
  } else if (val.length === cities.value.length) {
    checkAll.value = true;
    indeterminate.value = false;
  } else {
    indeterminate.value = true;
  }
});

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false;
  if (val) {
    value.value = cities.value.map((_) => _.value);
  } else {
    value.value = [];
  }
};
const isAdding = ref(false);
const optionName = ref("");
const cities = ref([
  {
    value: "Beijing",
    label: "Beijing",
  },
  {
    value: "Shanghai",
    label: "Shanghai",
  },
  {
    value: "Nanjing",
    label: "Nanjing",
  },
  {
    value: "Chengdu",
    label: "Chengdu",
  },
]);

const onAddOption = () => {
  isAdding.value = true;
};

const onConfirm = () => {
  if (optionName.value) {
    cities.value.push({
      label: optionName.value,
      value: optionName.value,
    });
    clear();
  }
};

const clear = () => {
  optionName.value = "";
  isAdding.value = false;
};
</script>

<style>
.option-input {
  width: 100%;
  margin-bottom: 8px;
}
.checkbox-all {
  height: 24px;
}
</style>
