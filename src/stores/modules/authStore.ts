import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserInfo } from "@/libs/api/login/user/type";
import { userApi } from "@/libs/api/login/user";
import {
  generateFlattenRoutes,
  generateRoutes,
  getShowStaticAndDynamicMenuList,
  getAllBreadcrumbList,
} from "@/routers/utils";
import { staticRouter } from "@/routers/modules/staticRouter";
import type { AppRouteRecordRaw } from "@/routers/type";

export const useAuthStore = defineStore("auth", () => {
  // 扁平化路由数据
  const menuList = ref<AppRouteRecordRaw[]>([]);
  // 递归之后的菜单数据
  const recursiveMenuList = ref<AppRouteRecordRaw[]>([]);
  // 面包屑数据
  const breadcrumbList = ref<[]>([]);
  // 用户角色
  const roleList = ref<string[]>([]);
  // 按钮权限列表
  const buttonList = ref<string[]>([]);
  // 用户信息
  const loginUser = ref<UserInfo>({
    rainbowId: "",
    userImg: "",
    userName: "",
  });
  async function listRouters() {
    const { data } = await userApi.MMPostRouter();
    menuList.value = generateFlattenRoutes(data.menuList);
    recursiveMenuList.value = generateRoutes(
      getShowStaticAndDynamicMenuList(data.menuList),
      0
    );
    breadcrumbList.value = staticRouter.concat(
      generateRoutes(data.menuList, 0)
    );
  }
  async function getLoginUserInfo() {
    const { data } = await userApi.MMPostUser();
    loginUser.value = data.userInfo;
    buttonList.value = data.buttonList;
    roleList.value = data.roleList;
  }

  const getMenuList = computed(() => menuList.value);
  const getButtonList = computed(() => buttonList.value);
  const getRoleList = computed(() => roleList.value);
  // 菜单权限列表 ==> 左侧菜单栏渲染，这里的菜单将后端数据进行递归，需要将动态路由 isHide == 0 的隐藏菜单剔除, 将静态路由 isHide == 0 的隐藏菜单剔除
  const showMenuList = computed(() => recursiveMenuList.value[0].children);
  const getBreadcrumbList = computed(() =>
    getAllBreadcrumbList(breadcrumbList.value)
  );
  return {
    menuList,
    recursiveMenuList,
    breadcrumbList,
    roleList,
    buttonList,
    loginUser,
    listRouters,
    getLoginUserInfo,
    getMenuList,
    getButtonList,
    getRoleList,
    showMenuList,
    getBreadcrumbList,
  };
});
