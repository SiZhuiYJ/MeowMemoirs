<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useMediaStore, useAuthStore } from "@/stores";
import SearchImage from "./components/SearchImage.vue";
import MediaViewer from "@/components/MediaViewer/index.vue";
import mittBus from "@/utils/mittBus";
import { MediaApi } from "@/libs/api/files/media";
const { rainbowId } = useAuthStore().authStore.loginUser;
const store = useMediaStore();

const multiple = ref<boolean>(true); // 非多个禁用
const showSearch = ref<boolean>(true); // 默认显示搜索条件
const showView = ref<boolean>(true); // 默认显示查看

const handleUpload = () => {
  console.log("handleUpload");
  mittBus.emit("handleUploadConfig");
  // store.uploadImage();
};
const handleBatchDelete = () => {
  // store.batchDelete();
};
const isMedia = (url: string) => {
  return url.split(".")[1] === "mp4";
};
onMounted(() => {
  store.initializeData();
});
</script>

<template>
  <div class="main-content">
    <div style="height: 100%; display: flex;">
      <MeowCard>
        <SearchImage
          v-show="showSearch"
          @search="store.applyFilters"
          @reset="store.applyFilters"
        />

        <!-- 操作按钮 -->
        <el-row :gutter="10">
          <!-- 上传 -->
          <el-col :span="1.5" v-auth="['system:role:add']">
            <el-button type="primary" icon="upload" plain @click="handleUpload">
              上传
            </el-button>
          </el-col>
          <el-col :span="1.5" v-auth="['system:role:delete']">
            <el-button
              type="danger"
              icon="delete"
              plain
              @click="handleBatchDelete()"
              :disabled="multiple"
            >
              删除
            </el-button>
          </el-col>
          <Toolbar
            v-model:showSearch="showSearch"
            v-model:showView="showView"
            @refreshTable="store.initializeData"
          ></Toolbar>
        </el-row>
        <div style="height: 20px">
          {{ store.currentData.length }}/{{ store.filteredData.length }}
        </div>
        <!-- <ImageTable v-show="showView" /> -->
        <MediaTable
          v-show="showView"
          :data="store.currentData"
          :tagsMap="store.metaData.tagsMap"
          @loadMore="store.loadMore()"
          @selectMedia="store.selectMedia($event)"
          @deleteMedia="store.deleteMedia($event)"
        />
        <!-- 大图模式 -->
        <!-- <ImageViewer v-show="!showView"></ImageViewer> -->
        <MediaViewer v-show="!showView" @loadMore="store.loadMore()">
          <div
            v-for="(item, index) in store.currentData"
            :key="index"
            class="waterfall-item"
          >
            <video
              v-video-observer
              id="myVideo"
              controls
              v-if="isMedia(item.url)"
              :poster="MediaApi.getVideoCover(rainbowId, item.url)"
              class="item-medias"
              preload="none"
              :src="MediaApi.getVideoUrl(rainbowId, item.url)"
            ></video>
            <img
              v-else
              v-lazy="MediaApi.getImgLargeUrl(rainbowId, item.url)"
              class="item-medias"
            />
            <div class="item-content">{{ item.name }}</div>
          </div>
        </MediaViewer>
      </MeowCard>
      <MeowCard
        v-show="showView"
        style="padding: 10px; margin-left: 5px; max-width: 200px"
      >
        <video
          id="myVideo"
          controls
          v-video-observer
          v-if="store.currentShow && isMedia(store.currentShow?.url)"
          :poster="MediaApi.getVideoCover(rainbowId, store.currentShow?.url)"
          style="width: 100%; height: 100%"
          preload="none"
          :src="MediaApi.getVideoUrl(rainbowId, store.currentShow?.url)"
        ></video
        ><el-image
          style="width: 100%; height: 100%"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          show-progress
          :initial-index="0"
          fit="scale-down"
          v-else-if="store.currentShow && !isMedia(store.currentShow?.url)"
          :src="MediaApi.getImgMediumUrl(rainbowId, store.currentShow?.url)"
          :preview-src-list="[MediaApi.getImgLargeUrl(rainbowId, store.currentShow?.url)]"
        />
      </MeowCard>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 用户自定义项样式 */
.waterfall-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 3px;

  .item-medias {
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

/* 媒体查询手机端样式 */
@media (max-width: 768px) {
  .waterfall-item {
    width: 100%;
  }

  .item-medias {
    height: auto;
    display: block;
  }
}
</style>
