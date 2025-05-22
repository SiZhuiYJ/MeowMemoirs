<script setup lang="ts">
import { nextTick, ref } from "vue";
import { useTheme } from "@/utils/theme.ts";
import { storeToRefs } from "pinia";
import mittBus from "@/utils/mittBus";
import { useGlobalStore } from "@/stores";
import Drawer from "@/components/Drawer/Index.vue";

import { meowMsgWarning } from "@/utils/message";

// ["vertical", "columns", "classic", "optimum", "horizontal"]
const layouts = ["columns"];
interface ColorItem {
  color: string;
  name: string;
}

const colorList: ColorItem[] = [
  { color: "#e3c0df", name: "淡粉紫色" },
  { color: "#2992FF", name: "睛蓝色" },
  { color: "#1E71EE", name: "墨蓝色" },
  { color: "#6169FF", name: "紫罗兰" },
  { color: "#8076C3", name: "槿紫色" },
  { color: "#1BA784", name: "竹绿色" },
  { color: "#316C72", name: "蓝绿色" },
  { color: "#BE967F", name: "海鸥棕" },
  { color: "#D85916", name: "铁棕色" },
  { color: "#CF4813", name: "落霞红" },
  { color: "#CD6227", name: "火砖红" },
  { color: "#381924", name: "檀紫" },
  { color: "#2E317C", name: "满天星紫" },
];

const { changeThemeColor, changeGreyOrWeak, setAsideTheme, setHeaderTheme } = useTheme();
const { globalStore } = storeToRefs(useGlobalStore());

const DrawerRef = ref();
/** 打开主题配置 */
const handleThemeConfig = () => {
  nextTick(() => {
    DrawerRef.value.Open();
  });
};

/** 布局切换 */
const setLayout = (value: string) => {
  // layouts数组内是否包含value
  if (layouts.includes(value)) {
    useGlobalStore().setGlobal("layout", value);
    setAsideTheme();
    return;
  } else {
    meowMsgWarning("当前布局未实现，试试其他的布局吧~");
  }
};

/** 打开主题配置对话框，on 接收事件 */
mittBus.on("handleThemeConfig", () => {
  handleThemeConfig();
});
</script>

<template>
  <!-- 主题配置 -->
  <Drawer ref="DrawerRef" title="主题配置" :footerHidden="true">
    <template #content>
      <el-row>
        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
          <el-divider class="flex" style="display: flex" content-position="center">
            <div class="theme-container">
              <el-icon :size="18"><Connection /></el-icon>
              <div class="theme-name">主题颜色</div>
            </div>
          </el-divider>
        </el-col>
      </el-row>

      <!-- 可使用 column-gap 解决 flex-justify-between 问题 -->
      <div class="color-container">
        <div class="color-card" v-for="(item, index) in colorList" :key="index">
          <div
            class="color-item"
            @click="changeThemeColor(item.color)"
            :style="{
              'border-color': globalStore.themeColor === item.color ? item.color : '',
            }"
          >
            <div class="color-plate" :style="{ 'background-color': item.color }"></div>
          </div>
          <div class="color-name">{{ item.name }}</div>
        </div>
      </div>

      <el-row>
        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
          <el-divider class="flex" content-position="center">
            <div class="theme-container">
              <el-icon :size="18"><Notification /></el-icon>
              <div class="theme-name">布局样式</div>
            </div>
          </el-divider>
        </el-col>
      </el-row>

      <div class="layout-box">
        <el-tooltip content="纵向" placement="top" :show-after="200">
          <div
            :class="[
              'layout-item layout-vertical',
              { 'is-active': globalStore.layout == 'vertical' },
            ]"
            @click="setLayout('vertical')"
          >
            <div class="layout-dark"></div>
            <div class="layout-container">
              <div class="layout-light"></div>
              <div class="layout-content"></div>
            </div>
            <el-icon v-if="globalStore.layout == 'vertical'">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="分栏" placement="top" :show-after="200">
          <div
            :class="[
              'layout-item layout-columns',
              { 'is-active': globalStore.layout == 'columns' },
            ]"
            @click="setLayout('columns')"
          >
            <div class="layout-dark"></div>
            <div class="layout-light"></div>
            <div class="layout-content"></div>
            <el-icon v-if="globalStore.layout == 'columns'">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="经典" placement="top" :show-after="200">
          <div
            :class="[
              'layout-item layout-classic',
              { 'is-active': globalStore.layout == 'classic' },
            ]"
            @click="setLayout('classic')"
          >
            <div class="layout-dark"></div>
            <div class="layout-container">
              <div class="layout-light"></div>
              <div class="layout-content"></div>
            </div>
            <el-icon v-if="globalStore.layout == 'classic'">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="混合" placement="top" :show-after="200">
          <div
            :class="[
              'layout-item layout-optimum',
              { 'is-active': globalStore.layout == 'optimum' },
            ]"
            @click="setLayout('optimum')"
          >
            <div class="layout-dark"></div>
            <div class="layout-container">
              <div class="layout-light"></div>
              <div class="layout-content"></div>
            </div>
            <el-icon v-if="globalStore.layout == 'optimum'">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-tooltip>
        <el-tooltip content="横向" placement="top" :show-after="200">
          <div
            :class="[
              'layout-item layout-horizontal',
              { 'is-active': globalStore.layout == 'horizontal' },
            ]"
            @click="setLayout('horizontal')"
          >
            <div class="layout-dark"></div>
            <div class="layout-content"></div>
            <el-icon v-if="globalStore.layout == 'horizontal'">
              <CircleCheckFilled />
            </el-icon>
          </div>
        </el-tooltip>
      </div>

      <el-row>
        <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
          <el-divider class="flex" content-position="center">
            <div class="theme-container">
              <el-icon :size="18"><ChatLineRound /></el-icon>
              <div class="theme-name">界面配置</div>
            </div>
          </el-divider>
        </el-col>
      </el-row>

      <el-form
        label-width="auto"
        label-position="left"
        style="padding-top: 8px; padding-left: 3px"
      >
        <el-row>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item>
              <div style="display: flex; align-items: center">
                <span style="margin-right: 2px; color: var(--el-text-color-regular)">
                  路由动画
                </span>
                <el-tooltip placement="bottom" content="路由加载动画模式">
                  <el-icon style="margin-right: 20px; color: var(--el-text-color-regular)"
                    ><QuestionFilled
                  /></el-icon>
                </el-tooltip>
              </div>
              <el-select
                placeholder="请选择路由动画"
                v-model="globalStore.transition"
                clearable
                style="width: 200px"
              >
                <el-option label="默认" value="fade-default" />
                <el-option label="淡入淡出" value="fade" />
                <el-option label="滑动" value="fade-slide" />
                <el-option label="渐变" value="zoom-fade" />
                <el-option label="底部滑出" value="fade-bottom" />
                <el-option label="缩放消退" value="fade-scale" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="菜单宽度">
              <el-input-number
                style="width: 200px"
                :min="200"
                :max="260"
                :step="2"
                v-model="globalStore.menuWidth"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item>
              <div style="display: flex; align-items: center">
                <span style="margin-right: 2px; color: var(--el-text-color-regular)">
                  菜单手风琴
                </span>
                <el-tooltip
                  placement="bottom"
                  content="左侧菜单是否展开单个子菜单[启用-单个/关闭-多个]"
                >
                  <el-icon
                    style="margin-right: 10px; color: var(--el-text-color-regular)"
                  >
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
              <el-switch
                active-text="启用"
                inactive-text="停用"
                :active-value="true"
                :inactive-value="false"
                :inline-prompt="true"
                v-model="globalStore.uniqueOpened"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="侧边栏反转色">
              <el-switch
                active-text="启用"
                inactive-text="停用"
                :active-value="true"
                :inactive-value="false"
                :inline-prompt="true"
                v-model="globalStore.asideInverted"
                @change="setAsideTheme"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="头部反转色">
              <el-switch
                active-text="启用"
                inactive-text="停用"
                :active-value="true"
                :inactive-value="false"
                :inline-prompt="true"
                v-model="globalStore.headerInverted"
                @change="setHeaderTheme"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="灰色模式">
              <el-switch
                active-text="启用"
                inactive-text="停用"
                :active-value="true"
                :inactive-value="false"
                :inline-prompt="true"
                v-model="globalStore.isGrey"
                @change="changeGreyOrWeak('grey', !!$event)"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="色弱模式">
              <el-switch
                active-text="启用"
                inactive-text="停用"
                :active-value="true"
                :inactive-value="false"
                :inline-prompt="true"
                v-model="globalStore.isWeak"
                @change="changeGreyOrWeak('weak', !!$event)"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="{ span: 24 }" :xs="{ span: 24 }">
            <el-form-item label="折叠菜单">
              <el-form-item>
                <el-switch
                  v-model="globalStore.isCollapse"
                  active-text="展开"
                  inactive-text="折叠"
                  :active-value="true"
                  :inactive-value="false"
                  :inline-prompt="true"
                >
                </el-switch>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </Drawer>
</template>

<style lang="scss" scoped>
/** 图标颜色 */
.icon {
  &:hover {
    color: var(--el-color-primary);
    // cursor: pointer;
  }
}

/** 布局配置 */
.layout-box {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  column-gap: 36px;
  padding: 15px 7px 0;
  .layout-item {
    position: relative;
    box-sizing: border-box;
    width: 100px;
    height: 70px;
    padding: 6px;
    // cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--el-border-color-dark);
    transition: all 0.2s;
    .layout-dark {
      background-color: var(--el-color-primary);
      border-radius: 3px;
    }
    .layout-light {
      background-color: var(--el-color-primary-light-5);
      border-radius: 3px;
    }
    .layout-content {
      background-color: var(--el-color-primary-light-8);
      border: 1px dashed var(--el-color-primary);
      border-radius: 3px;
    }
    .el-icon {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: var(--el-color-primary);
      transition: all 0.2s;
    }
    &:hover {
      box-shadow: 0 0 5px 1px var(--el-text-color-secondary);
    }
  }
  .is-active {
    box-shadow: 0 0 0 2px var(--el-color-primary) !important;
  }
  .layout-vertical {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .layout-dark {
      width: 20%;
    }
    .layout-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 73%;
      .layout-light {
        height: 20%;
      }
      .layout-content {
        height: 69%;
      }
    }
  }
  .layout-columns {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .layout-dark {
      width: 14%;
    }
    .layout-light {
      width: 17%;
    }
    .layout-content {
      width: 55%;
    }
  }
  .layout-classic {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 20px;
    .layout-dark {
      height: 22%;
    }
    .layout-container {
      display: flex;
      justify-content: space-between;
      height: 70%;
      .layout-light {
        width: 20%;
      }
      .layout-content {
        width: 70%;
      }
    }
  }
  .layout-optimum {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    .layout-dark {
      width: 20%;
    }
    .layout-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 73%;
      .layout-light {
        height: 16%;
      }
      .layout-content {
        height: 72%;
      }
    }
  }
  .layout-horizontal {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 15px;
    .layout-dark {
      height: 20%;
    }
    .layout-content {
      height: 67%;
    }
  }
}
.theme-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .theme-name {
    font-size: 14px;
    margin-left: 4px;
  }
}
.color-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.color-item {
  border-radius: 0.375rem;
  border-width: 1px;
  border-style: dashed;
  border-color: var(--el-border-color-darker);
  --un-shadow: var(--el-box-shadow-lighter);
  box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);
}
.color-card {
  display: flex;
  flex-direction: column;
}
.color-plate {
  border-radius: 0.375rem;
  width: 20px;
  height: 20px;
  --un-bg-opacity: 1;
  margin-left: 36px;
  margin-right: 36px;
  margin-top: 12px;
  margin-bottom: 12px;
}
.color-name {
  font-size: 12px;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
