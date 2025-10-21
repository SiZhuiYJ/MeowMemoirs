<template>
  <!-- 头像 -->
  <el-image class="user-avatar" :src="avatar">
    <template #error>
      <el-image class="user-avatar" :src="errorAvatar"></el-image>
    </template>
  </el-image>
  <el-dropdown class="m-l-10px" :hide-on-click="false" @command="handleCommand">
    <div class="dropdown">
      <div class="avatar-name">
        {{ useAuthStore().loginUser.userName }}
        ({{ useAuthStore().roleList[0] }})
      </div>
      <el-icon><arrow-down /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="Mine">个人中心</el-dropdown-item>
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SessionStorage, LocalStorage } from "@/utils/storage.ts";
import { useAuthStore } from "@/stores";
import { LOGIN_URL } from "@/config";
import { useRouter } from "vue-router";
import PenaltySet from "@/libs/useApiUrl";
const { getUserImgUrl } = PenaltySet();
const router = useRouter();

// 退出登录
const handleLayout = () => {
  SessionStorage.clear();
  // 如果不想要保存上次登录设置的全局颜色、布局等，则将下方第一行清空全部代码打开。
  // LocalStorage.clear();
  LocalStorage.remove("user");
  LocalStorage.remove("keepAlive");
  LocalStorage.remove("tabs");
  // 退出登录。必须使用replace把页面缓存刷掉。
  window.location.replace(LOGIN_URL);
};
// 用户头像
const avatar = ref(
  getUserImgUrl({
    RainbowID: useAuthStore().loginUser.rainbowId,
    imageName: useAuthStore().loginUser.userImg,
  })
);
const errorAvatar = getUserImgUrl({ RainbowID: "indigenous", imageName: "Erorr.jpg," });
// 下拉折叠
const handleCommand = (command: string | number) => {
  switch (command) {
    case "Mine":
      router.push("/console/system/user");
      break;
    case "logout":
      handleLayout();
      break;
  }
};
</script>

<style lang="scss" scoped>
// dropdown字体颜色
.dropdown {
  color: var(--el-color-primary);
  white-space: nowrap;
  /* 不换行 */
  cursor: pointer;
  outline: none; // 去除伪元素
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

.avatar-name {
  white-space: nowrap;
  max-width: 113px;
  text-align: right;
  font-size: 14px;
  margin-right: 6px;
  line-height: 1;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
</style>
