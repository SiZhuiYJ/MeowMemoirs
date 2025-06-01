<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef } from "vue";
import WaterfallFlow from "@/components/WaterfallFlow/index.vue";
const emits = defineEmits(["loadMore"]);

const listElement = useTemplateRef("list");

const handleScroll = () => {
  // 判断是否滚动到底部
  if (
    listElement.value!.scrollTop + listElement.value!.clientHeight >=
    listElement.value!.scrollHeight - 50
  ) {
    emits("loadMore");
  }
};

onMounted(async () => {
  emits("loadMore");
  listElement.value!.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  listElement.value!.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div id="list" ref="list">
    <WaterfallFlow :columnWidth="200" :gap="6">
      <slot></slot>
    </WaterfallFlow>
  </div>
</template>

<style scoped lang="scss">
#list {
  height: 100%;
  width: 100%;
  // 背景颜色为粉红色渐变到紫色
  // background: linear-gradient(to right, #ffc3a0, #ffafbd);
  background-image: linear-gradient(
    to bottom right,
    #91defe,
    #99c0f9,
    #bdb6ec,
    #d7b3e3,
    #efb3d5,
    #f9bccc
  );
  overflow-y: auto;
  /* 超出部分出现垂直滚动条 */
  overflow-x: hidden;
  // position: absolute;

  /* 隐藏水平滚动条 */
  &::-webkit-scrollbar {
    width: 0px;
  }

  .list-header {
    padding: 0 0 5px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: sticky;
    margin: 0 10px;
    bottom: 10px;
  }
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #666;
}

/* 媒体查询手机端样式 */
@media (max-width: 768px) {
  .waterfall-item {
    width: 100%;
  }
}
</style>
