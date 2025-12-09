<script setup lang="ts">
import { computed } from "vue";
const COLUMN_COLORS = ["red", "red", "red", "#ffcc00", "#ffcc00", "#86DC46"];
const COLUMN_HEIGHTS = [20, 40, 60, 80, 100];
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
const columns = computed(() => {
  const list = Array.from({ length: 5 }, (_, i) => ({
    height: `${COLUMN_HEIGHTS[i]}%`,
    animationDuration: `${(200 * (i + 1)) / 1000}s`,
    shouldColor: !props.Loading && props.Level > i,
    color: COLUMN_COLORS[props.Level],
    delay: `${(200 * i) / 1000}s`,
  }));
  return list;
});
</script>
<template>
  <div
    class="signal"
    :style="{ width: size + 'px', height: size + 'px' }"
    :class="{ loading: Loading }"
  >
    <div
      v-for="(col, index) in columns"
      :key="index"
      class="column"
      :style="{
        height: Loading ? '20%' : col.height,
        animationDelay: Loading ? col.delay : '0s',
      }"
    >
      <div
        class="column-d"
        :class="{ 'column-last': !Loading }"
        :style="{
          backgroundColor: col.shouldColor ? col.color : '',
          animationDuration: col.animationDuration,
        }"
      ></div>
    </div>
    <!-- 失败X图标 -->
    <div class="column-x" v-if="!Loading && Level == 0"></div>
  </div>
</template>
<style lang="scss" scoped>
.loading {
  .column {
    animation: column-height-loading linear infinite;
    animation-duration: 1s;
    .column-last {
      height: 100%;
    }
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
  position: absolute;
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
  .column-x {
    position: absolute;
    width: 100%;
    height: 100%;
    &::after,
    &::before {
      content: "";
      position: absolute;
      left: 0;
      width: 2px;
      background-color: red;
    }
    &::after {
      height: 4px;
      top: 0;
    }
    &::before {
      top: 6px;
      height: 2px;
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
