<template>
  <div
    class="main-content"
    style="height: 100%; display: flex; flex: 1 1 0%; flex-direction: row"
  >
    <Card style="max-width: 40px; padding: 10px">
      <el-button @click="handleDialog()">
        <el-icon><View /></el-icon>
      </el-button>
      <el-button @click="handleDialog()"
        ><el-icon><Upload /></el-icon>
      </el-button>
      <Dialog
        ref="DialogRef"
        :title="title"
        @Confirm="handleConfirm"
        @Cancel="handleCancel"
        :loading="confirmLoading"
      >
        <template #content>
          <el-upload class="upload-demo" drag action="" multiple>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
            <template #tip>
              <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
            </template>
          </el-upload>
        </template>
      </Dialog>
    </Card>
    <Card style="margin-left: 5px">
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
import Dialog from "@/components/Dialog/index.vue";
// 添加 OR 修改对话框Ref
const DialogRef = ref();
// const formRef = ref();
const title = ref("");
/** 打开Dialog */
const handleDialog = () => {
  // 标题
  title.value = "二次封装Dialog模版";
  DialogRef.value.Open();
};
// 确定按钮是否显示Loading
const confirmLoading = ref(false);

/** 确定  */
const handleConfirm = () => {
  // if (!formRef.value) return;
  confirmLoading.value = true;
};
/** 取消 */
const handleCancel = () => {
  DialogRef.value.Close();
};

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
