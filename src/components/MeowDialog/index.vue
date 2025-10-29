<template>
  <!-- append-to-body 点击空白处不关闭弹窗 -->
  <el-dialog :model-value="visible" :title="title" :width="width" :center="center"
    :close-on-click-modal="closeOnClickModal" append-to-body draggable :destroy-on-close="destroyOnClose"
    :before-close="Close" :fullscreen="fullscreen" :loading="loading" :footerHidden="footerHidden" :overflow="true">
    <slot name="header"></slot>
    <div style="overflow-y: auto; overflow-x: initial"
      :style="fullscreen ? { height: 'auto' } : { height: height + 'px' }">
      <!-- 具名插槽 -->
      <slot name="content"></slot>
    </div>
    <template #footer v-if="!footerHidden">
      <span class="dialog-footer">
        <el-button type="primary" loading-icon="Eleme" :loading="confirmLoading" v-throttle="Confirm">{{ confirmText
        }}</el-button>
        <el-button type="danger" @click="Cancel">{{ cancelText }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<!-- 此弹窗封装将使用 defineExpose，通过ref进行使用 -->
<script setup lang="ts">
import { ref, toRefs } from "vue";
// @ts-ignore
import { meowMsgWarning, meowMsgBox } from "@/utils/message.ts";

// 定义参数的类型
interface IDialogProps {
  title?: string; // 弹窗标题
  visible?: boolean; // 弹窗是否可见
  width?: number; // 弹窗宽度
  center?: boolean; // 弹窗是否居中
  height?: number; // 弹窗高度
  confirmText?: string; // 确认按钮的文案
  cancelText?: string; // 取消按钮的文案
  destroyOnClose?: boolean; // 是否销毁
  fullscreen?: boolean; // 是否全屏
  loading?: boolean; // 是否显示加载中
  footerHidden?: boolean; // 是否隐藏确认和取消按钮部分
  closeOnClickModal?: boolean; // 是否点击模态框背景关闭
}

// 子组件接收父组件的值
// withDefaults：设置默认值  defineProps：接收父组件的参数
// @ts-ignore
const props = withDefaults(defineProps<IDialogProps>(), {
  title: "朕很中意你Dialog",
  height: 300,
  width: 650,
  center: true,
  visible: false,
  confirmText: "确定",
  cancelText: "取消",
  destroyOnClose: false,
  fullscreen: false,
  loading: false,
  footerHidden: false,
  closeOnClickModal: false,
});

// 开关变量
const visible = ref(false);

// 确定按钮Loading，此处必须用toRefs，否则将失去响应式
const { loading } = toRefs(props);
const confirmLoading = ref(loading);

/** 打开对话框 */
const Open = () => {
  visible.value = true;
};

/** 取消对话框 */
const Close = () => {
  if (!props.closeOnClickModal)
    meowMsgBox("您确认进行关闭么？")
      .then(() => {
        visible.value = false;
        meowMsgWarning("已关闭🌻");
      })
      .catch(() => {
        // 用户点击了取消按钮或关闭对话框
        // 执行取消操作或不做任何操作
        meowMsgWarning("已取消🌻");
      });
  else {
    visible.value = false;
  }
};

/** 确认提交后关闭对话框 */
const QuickClose = () => {
  visible.value = false;
};

// 当前组件获取父组件传递的事件方法
const emits = defineEmits(["confirm", "cancel"]);

/** 对话框确定事件 */
const Confirm = () => {
  emits("confirm");
};

/** 对话框的取消事件 */
const Cancel = () => {
  emits("cancel");
};

/** 暴露给父组件方法 */
defineExpose({
  Open,
  Close,
  QuickClose,
});
</script>

<style lang="scss">
.el-dialog {
  max-width: 100vw;
}
</style>
