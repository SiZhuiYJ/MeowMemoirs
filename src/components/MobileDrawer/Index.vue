<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-40" @click="close">
      <div class="absolute inset-0 bg-gray-500 opacity-75" />
    </div>
    <div
      v-bind="$attrs"
      class="fixed z-50 overflow-y-auto bg-white transition-all duration-200 dark:bg-#141414"
      :class="[
        `duration-${duration}`,
        {
          [`h-screen w-${width}`]: placement === 'right' || placement === 'left',
          [`w-full h-${width}`]: placement === 'top' || placement === 'bottom',

          '-left-full top-0': placement === 'left' && !modelValue,
          'left-0 top-0': placement === 'left' && modelValue,

          '-right-full top-0': placement === 'right' && !modelValue,
          'right-0 top-0': placement === 'right' && modelValue,

          '-top-full left-0': placement === 'top' && !modelValue,
          'top-0 left-0 ': placement === 'top' && modelValue,

          '-bottom-full left-0': placement === 'bottom' && !modelValue,
          'bottom-0 left-0': placement === 'bottom' && modelValue,
        },
      ]"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script setup lang="ts" name="mobileDrawer">
import { onUnmounted, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    placement?: "top" | "right" | "bottom" | "left";
    width?: "sm" | "md" | "lg" | "1/2" | "1/3" | "1/4" | "full";
    duration?: "100" | "200" | "300" | "400" | "500" | "600";
  }>(),
  {
    modelValue: false,
    placement: "left",
    duration: "200",
    width: "md",
    height: "md",
  }
);

const emit = defineEmits(["update:modelValue", "close"]);

watch(
  () => props.modelValue,
  (val) => {
    val && emit("update:modelValue", val);
    document.body.style.overflow = val ? "hidden" : "auto";
  }
);

function close() {
  emit("update:modelValue", false);
  emit("close");
}

onUnmounted(() => {
  document.body.style.overflow = "auto";
});
</script>
<style scoped lang="scss">
/* 基础样式 */
.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-40 {
  z-index: 40;
}

.z-50 {
  z-index: 50;
}

.bg-gray-500 {
  background-color: #6b7280;
}

.opacity-75 {
  opacity: 0.75;
}

.overflow-y-auto {
  overflow-y: auto;
}

.bg-white {
  background-color: #ffffff;
}

.transition-all {
  transition-property: all;
}

/* 暗黑模式 */
.dark\:bg-\#141414 {
  background-color: var(--el-menu-bg-color);
  // background-color: #141414;
}

/* 过渡持续时间 */
.duration-100 {
  transition-duration: 100ms;
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-400 {
  transition-duration: 400ms;
}

.duration-500 {
  transition-duration: 500ms;
}

.duration-600 {
  transition-duration: 600ms;
}

/* 宽度和高度定义 */
.h-screen {
  height: 100vh;
}
/* 384px */
.w-sm {
  width: 24rem;
}
/* 448px */
.w-md {
  width: 28rem;
}
/* 512px */
.w-lg {
  width: 32rem;
}

.w-1\/2 {
  width: 50%;
}

.w-1\/3 {
  width: 33.333333%;
}

.w-1\/4 {
  width: 25%;
}

.w-full {
  width: 100%;
}
/* 384px */
.h-sm {
  height: 24rem;
}
/* 448px */
.h-md {
  height: 28rem;
}
/* 512px */
.h-lg {
  height: 32rem;
}

.h-1\/2 {
  height: 50%;
}

.h-1\/3 {
  height: 33.333333%;
}

.h-1\/4 {
  height: 25%;
}

.h-full {
  height: 100%;
}

/* 定位类 */
.top-0 {
  top: 0;
}

.right-0 {
  right: 0;
}

.bottom-0 {
  bottom: 0;
}

.left-0 {
  left: 0;
}

.-left-full {
  left: -100%;
}

.-right-full {
  right: -100%;
}

.-top-full {
  top: -100%;
}

.-bottom-full {
  bottom: -100%;
}
</style>
