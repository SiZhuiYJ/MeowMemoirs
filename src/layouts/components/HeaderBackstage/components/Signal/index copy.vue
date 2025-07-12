<script setup lang="ts">
import { ref, watch } from "vue";
const columnColor = ["red", "red", "red", "yellow", "yellow", "#86DC46"];
const columnHeight = [0, 20, 40, 60, 80, 100];
const column = ref([0, 20, 40, 60, 80, 100]);
const props = defineProps({
  size: {
    type: Number,
    default: 20,
  },
  Level: {
    type: Number,
    default: 0,
  },
  Loading: {
    type: Boolean,
    default: false,
  },
});
watch(
  () => props.Loading,
  (newValue) => {
    console.log(newValue);
  }
);
watch(
  () => props.Level,
  (newValue) => {
    console.log(newValue);
  }
);
</script>
<template>
  <div
    class="signal"
    :style="{ width: size + 'px', height: size + 'px' }"
    :class="{ loading: Loading }"
  >
    <div class="column">
      <div
        class="column-d"
        :class="{ 'column-last': !Loading }"
        :style="{ backgroundColor: !Loading && Level > 0 ? columnColor[Level] : '' }"
      ></div>
    </div>
    <div class="column">
      <div
        class="column-d"
        :class="{ 'column-last': !Loading }"
        :style="{ backgroundColor: !Loading && Level > 1 ? columnColor[Level] : '' }"
      ></div>
    </div>
    <div class="column">
      <div
        class="column-d"
        :class="{ 'column-last': !Loading }"
        :style="{ backgroundColor: !Loading && Level > 2 ? columnColor[Level] : '' }"
      ></div>
    </div>
    <div class="column">
      <div
        class="column-d"
        :class="{ 'column-last': !Loading }"
        :style="{ backgroundColor: !Loading && Level > 3 ? columnColor[Level] : '' }"
      ></div>
    </div>
    <div class="column">
      <div
        class="column-d"
        :class="{ 'column-last': !Loading }"
        :style="{ backgroundColor: !Loading && Level > 4 ? columnColor[Level] : '' }"
      ></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.loading {
  .column {
    // 无限循环
    animation: column-height-loading linear infinite;
    animation-duration: 1s;
    .column-last {
      height: 100%;
    }
  }
  .column:nth-child(1) {
    animation-delay: 0s;
  }
  .column:nth-child(2) {
    animation-delay: 0.2s;
  }
  .column:nth-child(3) {
    animation-delay: 0.4s;
  }
  .column:nth-child(4) {
    animation-delay: 0.6s;
  }
  .column:nth-child(5) {
    animation-delay: 0.8s;
  }
}
@keyframes column-height-loading {
  0% {
    height: 20%;
  }
  50% {
    height: 100%;
  }
  100% {
    height: 20%;
  }
}
.signal {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  .column {
    width: 20%;
    padding: 0;
    margin: 0;
    background: rgb(227 227 227);
    box-shadow: 0 0 0 0.1px #000;
    display: flex;
    align-items: flex-end;

    .column-d {
      width: 100%;
      height: 100%;
    }
    .column-last {
      animation: column-height linear forwards;
      animation-delay: 0s;
    }
  }

  .column:nth-child(1) {
    height: 20%;
    .column-last {
      animation-duration: 0.2s;
    }
  }
  .column:nth-child(2) {
    height: 40%;
    .column-last {
      animation-duration: 0.4s;
    }
  }
  .column:nth-child(3) {
    height: 60%;
    .column-last {
      animation-duration: 0.6s;
    }
  }
  .column:nth-child(4) {
    height: 80%;
    .column-last {
      animation-duration: 0.8s;
    }
  }
  .column:nth-child(5) {
    height: 100%;
    .column-last {
      animation-duration: 1s;
    }
  }
}
// column-height的高度动画
@keyframes column-height {
  0% {
    height: 0;
  }
  100% {
    height: 100%;
  }
}
</style>
