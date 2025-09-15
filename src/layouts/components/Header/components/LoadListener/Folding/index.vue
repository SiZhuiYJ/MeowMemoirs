<script setup lang="ts">
import { ref } from "vue";

const showDetails = ref(false);
const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};
defineExpose({
  toggleDetails,
});
</script>

<template>
  <div class="fold-summary" @click="toggleDetails">
    <slot></slot>
    <span class="value">
      <slot name="toggle"></slot>

      <el-icon class="toggle-icon" :size="16">
        <CaretTop v-if="showDetails" />
        <CaretBottom v-else />
      </el-icon>
    </span>
  </div>

  <transition name="fade">
    <div v-if="showDetails" class="fold-container">
      <slot name="container"></slot>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.fold-summary {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
.fold-container {
  padding: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.value {
  color: #ffcc00;
  font-family: "Roboto Mono", monospace;
  display: flex;
  align-items: center;
}

.toggle-icon {
  margin-left: auto;
  font-size: 12px;
  display: flex;
  align-items: center;
}
.fold-container {
  padding: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
