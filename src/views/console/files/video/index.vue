<script setup lang="ts">
import Select from "@/components/Select/index.vue";
import { ref } from "vue";
const dataList = ref([
  {
    label: "选项1",
    value: "1",
  },
  {
    label: "选项2",
    value: "2",
  },
  {
    label: "选项3",
    value: "3",
  },
]);
const value = ref<string | number | Array<string | number>>([]);
const add = (data: string) => {
  console.log(data);

  dataList.value.push({ label: data, value: data });
};
const change = (val: string | number | Array<string | number>) => {
  console.log(val);
  value.value = val;
};
</script>
<template>
  <div class="main-content">
    <Card>
      <Select
        v-model="value"
        :options="dataList"
        multiple
        addable
        collapseTags
        collapse-tags-tooltip
        placeholder="请选择标签"
        @add="add"
        @change="change"
      >
        <template #option="{ item }">
          <span style="color: #666">{{ item.label }}</span>
          <el-icon style="margin-left: 8px"><Star /></el-icon>
        </template>
      </Select>
      <div>
        {{ value }}
      </div>
    </Card>
  </div>
</template>
<style scoped lang="scss"></style>
