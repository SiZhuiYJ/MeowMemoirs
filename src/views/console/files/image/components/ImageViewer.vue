<script setup lang="ts">
import { onMounted, onBeforeUnmount, useTemplateRef } from "vue";

import WaterfallFlow from "@/components/WaterfallFlow/index.vue";

import { useImageStore, useAuthStore } from "@/stores";
import { imageApi } from "@/libs/api/files/image";
const { authStore } = useAuthStore();
const store = useImageStore();

const listElement = useTemplateRef("list");

const handleScroll = () => {
  // 判断是否滚动到底部
  if (
    listElement.value!.scrollTop + listElement.value!.clientHeight >=
    listElement.value!.scrollHeight - 50
  ) {
    store.loadMore();
  }
};

onMounted(async () => {
  store.loadMore();
  listElement.value!.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  listElement.value!.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div id="list" ref="list">
    <WaterfallFlow :columnWidth="200" :gap="6">
      <div v-for="(item, index) in store.currentData" :key="index" class="waterfall-item">
        <img
          v-lazy="imageApi.getImgLargeUrl(authStore.loginUser.rainbowId, item.url)"
          class="item-image"
        />
        <div class="item-content">{{ item.name }}</div>
      </div>
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

/* 用户自定义项样式 */
.waterfall-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 3px;

  .item-image {
    width: 100%;
    height: auto;
    display: block;
  }

  .item-content {
    padding: 6px;
    color: #000;
    font-size: 13px;
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

  .item-image {
    height: auto;
    display: block;
  }
}
</style>
