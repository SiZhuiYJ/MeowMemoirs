<script setup lang="ts">
import logoUrl from "@/assets/image/catsdiary.webp";


// 接收父组件传递的参数
const props = defineProps({
  isCollapse: {
    require: false, // true显示，false隐藏
    type: Boolean
  },
  layout: {
    require: "vertical", // 布局模式 (纵向：vertical | 分栏：columns | 经典：classic | 上左：optimum | 横向：horizontal )
    type: String
  }
});

const title = import.meta.env.VITE_WEB_TITLE;
</script>

<template>
  <div class="logo">
    <div class="rounded-full" style="width: 40px; height: 40px "
      v-if="props.layout !== 'classic' && props.layout !== 'horizontal'">
      <!-- style="background-color: var(--el-header-text-color-regular);" -->
      <el-image :src="logoUrl" fit="cover" class="logo-image rounded-full" >
        <template #error>
          <el-icon class="logo-icon rounded-full" :size="34">
            <CircleCloseFilled />
          </el-icon>
        </template>
      </el-image>
    </div>
    <el-tooltip :content="title" :show-after="2000" placement="right"
      v-if="props.layout !== 'classic' && props.layout !== 'horizontal'">
      <div class="logo-text" style="margin-left:10px;font-size: 18px" v-text="title" v-show="!props.isCollapse"></div>
    </el-tooltip>
    <el-tooltip :content="title" :show-after="2000" placement="right" v-else>
      <div class="logo-text" style="width:155px; margin-left: 10px; margin-right: 10px;font-size: 18px" v-text="title"
        v-show="!props.isCollapse"></div>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  padding-left: 2px;
  height: var(--aside-header-height);
  line-height: var(--aside-header-height);
}

.rounded-full {
  border-radius:10px;
}

.logo-image {
  width: 100%;
  height: 100%;
}

.logo-icon {
  width: 100%;
  height: 100%;
  color: var(--el-color-primary);
}

.logo-text {
  font-weight: bold;
  letter-spacing: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: linear-gradient(270deg, rgba(198, 141, 255, .9019607843) 8.92%, #5685ff 46.17%, var(--el-color-primary) 92.17%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
</style>
