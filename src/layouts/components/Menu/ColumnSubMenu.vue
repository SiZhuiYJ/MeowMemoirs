<template>
  <!-- 有下级，用el-sub-menu，无下级用el-menu-item -->
  <template v-for="item in menuList" :key="item.path">
    <!-- 非叶子节点 -->
    <el-sub-menu v-if="item.children?.length" :index="item.path">
      <template #title>
        <GlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></GlobalIcon>
        <el-tooltip :content="item.meta?.title" :show-after="2000" placement="right">
          <span class="menu-ellipsis" v-text="item.meta?.title"></span>
        </el-tooltip>
      </template>
      <ColumnSubMenu :menuList="item.children" />
    </el-sub-menu>
    <!-- 叶子节点[功能节点] -->
    <el-menu-item
      v-else-if="item.meta.isHide != '0'"
      :index="item.path"
      @click="handleMenuRouter(item)"
    >
      <GlobalIcon v-if="item.meta.icon" :name="item.meta.icon" size="18"></GlobalIcon>
      <template #title>
        <el-tooltip :content="item.meta?.title" :show-after="2000" placement="right">
          <span class="menu-ellipsis" v-text="item.meta?.title"></span>
        </el-tooltip>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import GlobalIcon from "@/components/GlobalIcon/index.vue";
import ColumnSubMenu from "@/layouts/components/Menu/ColumnSubMenu.vue";
import { meowMsgWarning } from "@/utils/message";
import { useRouter } from "vue-router";
const router = useRouter();

// 获取父组件传递过来的数据
defineProps(["menuList"]);

/** 打开标签页 或 外部链接 */
const handleMenuRouter = (value: any) => {
  if (value.meta?.isLink) {
    if (/^https?:\/\//.test(value.meta?.isLink)) {
      return window.open(value.meta.isLink, "_blank");
    } else {
      meowMsgWarning("非正确链接地址，禁止跳转");
      return;
    }
  }
  console.log("path", value.path);
  router.push(value.path);
};
</script>

<style lang="scss" scoped>
/** 菜单标题过长使用省略号 */
.menu-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}

.el-menu-item {
  height: var(--aside-menu-height) !important;
  margin-bottom: var(--aside-menu-margin-bottom);
  font-weight: var(--aside-menu-font-weight);
  --el-menu-item-height: var(--aside-menu-height);
  // color: #000000;
  user-select: none;
  border-left: 2px solid transparent;

  // @apply dark:c-#E5E3FA;
  color: var(--el-menu-text-color);

  i {
    transform: translate(var(--aside-menu-font-icon-translate)); // 图标偏移
  }

  span {
    transform: translate(var(--aside-menu-font-icon-translate)); // 文字偏移
  }

  // 设置鼠标悬停时el-menu-item的样式
  &:hover {
    color: var(--el-menu-hover-text-color);
    background: var(--el-menu-hover-bg-color);

    // 实现鼠标悬停时icon变色
    i {
      // color: var(--el-color-primary);
      color: var(--el-menu-hover-text-color);
    }
  }
}
.is-active {
  color: var(--el-menu-active-text-color);
  background: linear-gradient(
    to right,
    var(--el-color-primary-light-9) 0,
    transparent 100%
  );
  border-left: 2px solid var(--el-menu-border-left-color) !important;
}
:deep(.el-sub-menu__title) {
  height: var(--aside-menu-height);
  padding-right: 0; // 去除collapse缩小多余的边框
  margin-bottom: var(--aside-menu-margin-bottom);
  font-weight: var(--aside-menu-font-weight);
  // color: #000000;

  /* 设置用户禁止选择 */
  user-select: none;
  border-radius: var(--aside-menu-border-left);

  // @apply dark:c-#E5E3FA;
  color: var(--el-menu-text-color);

  i {
    transform: translate(var(--aside-menu-font-icon-translate)); // 图标偏移
  }

  span {
    transform: translate(var(--aside-menu-font-icon-translate)); // 文字偏移
  }

  &:hover {
    // color: var(--el-color-primary);
    color: var(--el-menu-hover-text-color);
    // background: var(--el-color-primary-light-8);
    background: var(--el-menu-hover-bg-color);
  }

  &:active {
    // color: var(--el-color-primary);
    color: var(--el-menu-active-text-color);
    // background: var(--el-color-primary-light-8);
    background: var(--el-menu-active-bg-color);
  }
}
.el-sub-menu {
  border-left: 2px solid transparent;
}
</style>

<style lang="scss">
/** 子级菜单字体高亮，父级菜单也高亮 */
.el-sub-menu.is-active > .el-sub-menu__title {
  color: var(--el-menu-active-text-color) !important;
}

/** icon图标也跟着变 */
.el-sub-menu.is-active > .el-sub-menu__title i {
  color: var(--el-menu-active-text-color) !important;
}
</style>
